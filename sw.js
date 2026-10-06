/* Image Upscaler PWA service worker.
 * - Install: cache-first app shell + bundled model and LiteRT WASM assets.
 * - All runtime assets are same-origin so the app remains usable offline after install.
 * - Model files are reused from a previous cache version when present.
 * - One bad file never fails the entire install; the runtime handler caches missing files on demand.
 */
const VERSION = 'upscaler-v38';
const MODEL_PATHS = [
  './models/RealESR-General-x4v3_float32.tflite',
];
const WASM_PATHS = [
  './wasm/litert_wasm_compat_internal.js',
  './wasm/litert_wasm_compat_internal.wasm',
  './wasm/litert_wasm_internal.js',
  './wasm/litert_wasm_internal.wasm',
  './wasm/litert_wasm_jspi_internal.js',
  './wasm/litert_wasm_jspi_internal.wasm',
  './wasm/litert_wasm_threaded_internal.js',
  './wasm/litert_wasm_threaded_internal.wasm',
];

const APP_SHELL = [
  './',
  './index.html',
  './_demo_bin.js?v=36',
  './manifest.json',
  './icons/icon.svg',
  './icons/icon-192.png',
  './icons/icon-512.png',
  ...MODEL_PATHS,
  ...WASM_PATHS,
];

self.addEventListener('install', (event) => {
  event.waitUntil((async () => {
    const cache = await caches.open(VERSION);
    const modelURLs = MODEL_PATHS.map((p) => new URL(p, self.location).href);
    const reused = new Set();
    try {
      const keys = await caches.keys();
      for (const modelURL of modelURLs) {
        for (const k of keys) {
          if (k === VERSION) continue;
          const oldCache = await caches.open(k);
          const hit = await oldCache.match(modelURL);
          if (hit) {
            await cache.put(modelURL, hit);
            reused.add(modelURL);
            break;
          }
        }
      }
    } catch (e) {
      console.warn('SW: reusing cached model failed:', e);
    }
    await Promise.all(
      APP_SHELL.map(async (url) => {
        try {
          const abs = new URL(url, self.location).href;
          if (reused.has(abs)) return;
          await cache.add(new Request(url, {cache: 'reload'}));
        } catch (e) {
          console.warn('SW: pre-cache failed for', url, e);
        }
      })
    );
    await self.skipWaiting();
  })());
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(
        keys.filter((k) => k !== VERSION && k.startsWith('upscaler-')).map((k) => caches.delete(k))
      ))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const {request} = event;
  if (request.method !== 'GET') return;
  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;
  if (!url.pathname.startsWith(new URL(self.registration.scope).pathname)) return;

  event.respondWith(
    caches.match(request).then((hit) => {
      if (hit) return hit;
      return fetch(request).then((res) => {
        if (res && res.status === 200) {
          const copy = res.clone();
          caches.open(VERSION).then((cache) => cache.put(request, copy));
        }
        return res;
      });
    })
  );
});

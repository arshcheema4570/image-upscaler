/* Image Upscaler PWA service worker.
 * - Install: cache-first app shell + the bundled ClearReality-x4 .tflite model
 *   (relative URLs resolve under the SW scope, so this works at any subpath,
 *   e.g. GitHub Pages project sites).
 * - The model is reused from a previous cache version when present, so
 *   app updates don't re-download it. Old caches (including the retired
 *   67MB Real-ESRGAN file) are purged on activate since the model URL changed.
 * - One bad file never fails the entire install; the runtime handler caches
 *   missing files on demand.
 * - Runtime: cache-first for same-origin requests (LiteRT wasm runtime).
 */
const VERSION = 'upscaler-v15';
const MODEL_PATH = './models/ClearReality-x4_float32.tflite';

const APP_SHELL = [
  './',
  './index.html',
  './_demo_bin.js?v=15',
  './manifest.json',
  './icons/icon.svg',
  './icons/icon-192.png',
  './icons/icon-512.png',
  // ClearReality-x4 model, bundled same-origin (fully offline-capable
  // after install; ~1.7MB vs the old 67MB Real-ESRGAN file).
  MODEL_PATH,
];

self.addEventListener('install', (event) => {
  event.waitUntil((async () => {
    const cache = await caches.open(VERSION);
    const modelURL = new URL(MODEL_PATH, self.location).href;
    // Reuse the large model file from a previous cache version instead of
    // re-downloading it on every app update.
    try {
      const keys = await caches.keys();
      for (const k of keys) {
        if (k === VERSION) continue;
        const oldCache = await caches.open(k);
        const hit = await oldCache.match(modelURL);
        if (hit) {
          await cache.put(modelURL, hit);
          break;
        }
      }
    } catch (e) {
      console.warn('SW: reusing cached model failed:', e);
    }
    const modelReused = !!(await cache.match(modelURL));
    await Promise.all(
      APP_SHELL.map(async (url) => {
        try {
          if (url === MODEL_PATH && modelReused) return; // already copied
          // cache:'reload' bypasses the HTTP cache so updates never install
          // a stale copy of a file that changed on the server.
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
      .then((keys) =>
        Promise.all(keys.filter((k) => k !== VERSION).map((k) => caches.delete(k)))
      )
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const {request} = event;
  if (request.method !== 'GET') return;

  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return; // same-origin only

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

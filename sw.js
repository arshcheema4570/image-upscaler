/* Image Upscaler PWA service worker.
 * - Install: cache-first app shell + the bundled .tflite models
 *   (relative URLs resolve under the SW scope, so this works at any subpath,
 *   e.g. GitHub Pages project sites).
 * - Model files are reused from a previous cache version when present, so
 *   app updates don't re-download it (unreliable on mobile data and it would
 *   otherwise block the whole SW update).
 * - One bad file never fails the entire install; the runtime handler caches
 *   missing files on demand.
 * - Runtime: cache-first for same-origin requests (LiteRT wasm runtime).
 */
const VERSION = 'upscaler-v32';
const MODEL_PATHS = [
  './models/RealESR-General-x4v3_float32.tflite',
];

const APP_SHELL = [
  './',
  './index.html',
  './_demo_bin.js?v=32',
  './manifest.json',
  './icons/icon.svg',
  './icons/icon-192.png',
  './icons/icon-512.png',
  // Model files, bundled same-origin (fixes HuggingFace CORS redirect issues
  // and makes the app fully offline-capable after install).
  ...MODEL_PATHS,
];

self.addEventListener('install', (event) => {
  event.waitUntil((async () => {
    const cache = await caches.open(VERSION);
    const modelURLs = MODEL_PATHS.map((p) => new URL(p, self.location).href);
    // Reuse model files from a previous cache version instead of
    // re-downloading them on every app update.
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
          if (reused.has(abs)) return; // already copied
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

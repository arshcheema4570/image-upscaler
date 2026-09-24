/* Image Upscaler PWA service worker.
 * - Install: cache-first app shell + the bundled Real-ESRGAN .tflite model
 *   (relative URLs resolve under the SW scope, so this works at any subpath,
 *   e.g. GitHub Pages project sites).
 * - Runtime: cache-first for same-origin requests (LiteRT wasm runtime).
 */
const VERSION = 'upscaler-v5';

const APP_SHELL = [
  './',
  './index.html',
  './_demo_bin.js?v=5',
  './manifest.json',
  './icons/icon.svg',
  './icons/icon-192.png',
  './icons/icon-512.png',
  // Real-ESRGAN x4plus model, bundled same-origin (fixes HuggingFace CORS
  // redirect issues and makes the app fully offline-capable after install).
  './models/Real-ESRGAN-x4plus_float.tflite',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(VERSION)
      // cache:'reload' bypasses the HTTP cache so updates never install
      // a stale copy of a file that changed on the server.
      .then((cache) =>
        Promise.all(
          APP_SHELL.map((url) => cache.add(new Request(url, { cache: 'reload' })))
        )
      )
      .then(() => self.skipWaiting())
  );
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
  const { request } = event;
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

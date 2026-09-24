/* Image Upscaler PWA service worker.
 * - Install: cache-first app shell (relative URLs resolve under the SW scope,
 *   so this works at any subpath, e.g. GitHub Pages project sites).
 * - Runtime: cache-first for the same-origin LiteRT wasm runtime and for the
 *   HuggingFace .tflite model. HuggingFace serves CORS-enabled responses, so
 *   the cached model stays readable by loadAndCompile(). Opaque responses are
 *   also cached defensively.
 */
const VERSION = 'upscaler-v1';

const APP_SHELL = [
  './',
  './index.html',
  './_demo_bin.js',
  './manifest.json',
  './icons/icon.svg',
  './icons/icon-192.png',
  './icons/icon-512.png',
];

// Real-ESRGAN x4plus .tflite fetched at runtime by LiteRT.js (tens of MB).
// Deliberately NOT bundled in git; cached here after first download.
const MODEL_URL =
  'https://huggingface.co/qualcomm/Real-ESRGAN-x4plus/resolve/v0.37.0/Real-ESRGAN-x4plus_float.tflite';

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(VERSION)
      .then((cache) => cache.addAll(APP_SHELL))
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
  const isSameOrigin = url.origin === self.location.origin;
  const isModel = request.url === MODEL_URL;
  if (!isSameOrigin && !isModel) return; // leave anything else to the network

  event.respondWith(
    caches.match(request).then((hit) => {
      if (hit) return hit;
      return fetch(request).then((res) => {
        if (res && (res.status === 200 || res.type === 'opaque')) {
          const copy = res.clone();
          caches.open(VERSION).then((cache) => cache.put(request, copy));
        }
        return res;
      });
    })
  );
});

const CACHE_NAME = 'eternity-chrono-v4';
const urlsToCache = [
  './',
  './index.html',
  './icon.png',
  './manifest.json',
  './sw.js'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
  );
  self.skipWaiting();
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Agar file cache mein hai toh wahi se do (Offline chalega)
        if (response) {
          return response;
        }
        // Warna net se uthao
        return fetch(event.request);
      })
  );
});

// Purane cache ko delete karne ke liye taaki hamesha naya update mile
self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

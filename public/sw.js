const CACHE_NAME = 'knowmi-v3';
const ASSETS = [
  '/',
  '/index.html',
  '/logo-square.png',
];

self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS);
    })
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    fetch(event.request)
      .then((response) => {
        // If network fetch succeeds, return it
        return response;
      })
      .catch(() => {
        // If network fetch fails (offline), fallback to cache
        return caches.match(event.request);
      })
  );
});

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
  const url = new URL(event.request.url);

  // Only handle GET requests — let POST/PUT/DELETE go straight to network
  if (event.request.method !== 'GET') return;

  // Never intercept Supabase API / Edge Function calls
  if (url.hostname.includes('supabase.co') || url.pathname.startsWith('/functions/v1/')) return;

  // Never intercept cross-origin requests (e.g. Google Fonts, CDN)
  if (url.origin !== self.location.origin) return;

  // Never intercept navigation requests (page loads/routing handled by browser)
  if (event.request.mode === 'navigate') return;

  // For static assets: try network first, fall back to cache
  event.respondWith(
    fetch(event.request)
      .then((response) => {
        // Cache successful responses for known static assets
        if (response.ok && ASSETS.some(a => url.pathname === a || url.pathname.endsWith('.png') || url.pathname.endsWith('.svg'))) {
          const cloned = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(event.request, cloned));
        }
        return response;
      })
      .catch(() => {
        // Offline fallback — only return cached if it exists
        return caches.match(event.request).then(cached => {
          if (cached) return cached;
          // Return a proper empty 503 rather than undefined (prevents the TypeError)
          return new Response('Offline', { status: 503, statusText: 'Service Unavailable' });
        });
      })
  );
});


self.addEventListener('push', function(event) {
  if (event.data) {
    const data = event.data.json();
    
    const options = {
      body: data.body,
      icon: '/logo-square.png',
      badge: '/logo-square.png',
      vibrate: [100, 50, 100],
      data: {
        dateOfArrival: Date.now(),
        primaryKey: '2',
        url: data.url || '/'
      }
    };
    
    event.waitUntil(
      self.registration.showNotification(data.title, options)
    );
  }
});

self.addEventListener('notificationclick', function(event) {
  event.notification.close();
  
  const urlToOpen = event.notification.data.url;
  
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(function(clientList) {
      for (let i = 0; i < clientList.length; i++) {
        const client = clientList[i];
        if (client.url.includes(urlToOpen) && 'focus' in client) {
          return client.focus();
        }
      }
      if (clients.openWindow) {
        return clients.openWindow(urlToOpen);
      }
    })
  );
});

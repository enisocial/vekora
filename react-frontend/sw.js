// Service Worker pour optimisation géolocalisée
const CACHE_NAME = 'vekora-v1';
const WEST_AFRICA_COORDS = {
  minLat: -5.0, maxLat: 15.0,
  minLon: -20.0, maxLon: 15.0
};

// Cache des ressources critiques
const urlsToCache = [
  '/',
  '/manifest.json',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('SW: Cache opened');
        return cache.addAll(urlsToCache);
      })
      .catch(err => console.log('SW: Cache failed', err))
  );
});

// Géolocalisation et optimisation
self.addEventListener('fetch', event => {
  if (event.request.url.includes('/api/')) {
    event.respondWith(
      fetch(event.request)
        .then(response => {
          // Ajouter headers de géolocalisation
          const newHeaders = new Headers(response.headers);
          newHeaders.append('X-Geo-Target', 'West-Africa');
          newHeaders.append('X-Cache-Region', 'CI');
          
          return new Response(response.body, {
            status: response.status,
            statusText: response.statusText,
            headers: newHeaders
          });
        })
        .catch(() => caches.match(event.request))
    );
  } else {
    event.respondWith(
      caches.match(event.request)
        .then(response => {
          if (response) {
            return response;
          }
          return fetch(event.request);
        })
    );
  }
});
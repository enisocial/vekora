// Service Worker pour optimisation géolocalisée
const CACHE_NAME = 'vekora-v1';
const WEST_AFRICA_COORDS = {
  minLat: -5.0, maxLat: 15.0,
  minLon: -20.0, maxLon: 15.0
};

// Cache des ressources critiques
const urlsToCache = [
  '/',
  '/static/css/main.css',
  '/static/js/main.js',
  '/manifest.json'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
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
        .then(response => response || fetch(event.request))
    );
  }
});
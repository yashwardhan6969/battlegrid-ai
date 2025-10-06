const CACHE = 'battlegrid-cache-v1';
const ASSETS = [
  '/',
  '/manifest.webmanifest'
];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)));
});

self.addEventListener('activate', e => {
  e.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', e => {
  const { request } = e;
  // Network first, fallback to cache for GET
  if (request.method === 'GET') {
    e.respondWith((async () => {
      try {
        const network = await fetch(request);
        const cache = await caches.open(CACHE);
        cache.put(request, network.clone());
        return network;
      } catch (err) {
        const cached = await caches.match(request);
        return cached || new Response('Offline', { status: 503 });
      }
    })());
  }
});

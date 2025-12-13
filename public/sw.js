const VERSION = 'v1';
const PRECACHE = `jefazo-precache-${VERSION}`;
const RUNTIME = `jefazo-runtime-${VERSION}`;

// Files to precache — minimal set in public. Vite-generated assets (with hashes) are better precached via Workbox at build time.
const PRECACHE_URLS = [
  '/',
  '/index.php',
  '/manifest.json',
  '/favicon.ico',
  '/icons/logo-single.svg',
  '/icons/icon-512.svg'
];

// Utility: limit number of entries in a cache
async function trimCache(cacheName, maxItems) {
  const cache = await caches.open(cacheName);
  const requests = await cache.keys();
  if (requests.length <= maxItems) return;
  // Delete oldest entries first
  for (let i = 0; i < requests.length - maxItems; i++) {
    await cache.delete(requests[i]);
  }
}

self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(PRECACHE)
      .then((cache) => cache.addAll(PRECACHE_URLS))
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    (async () => {
      // Delete old caches not matching current version
      const keys = await caches.keys();
      await Promise.all(
        keys.map((key) => {
          if (key !== PRECACHE && key !== RUNTIME) {
            return caches.delete(key);
          }
          return null;
        })
      );
      // Claim clients so the SW starts controlling pages ASAP
      await self.clients.claim();
    })()
  );
});

// Helper: network-first strategy for navigation (HTML)
async function networkFirst(request) {
  const cache = await caches.open(RUNTIME);
  try {
    const response = await fetch(request);
    // Put a copy in cache for fallback
    if (response && response.status === 200) {
      cache.put(request, response.clone());
    }
    return response;
  } catch (err) {
    const cached = await cache.match(request);
    if (cached) return cached;
    // fallback to precache root
    const precached = await caches.open(PRECACHE).then((c) => c.match('/'));
    return precached || new Response('Offline', { status: 503, statusText: 'Offline' });
  }
}

// Helper: stale-while-revalidate for CSS/JS
async function staleWhileRevalidate(request) {
  const cache = await caches.open(RUNTIME);
  const cached = await cache.match(request);
  const networkFetch = fetch(request).then((response) => {
    if (response && response.status === 200) {
      cache.put(request, response.clone());
    }
    return response;
  }).catch(() => null);
  return cached || (await networkFetch);
}

// Helper: cache-first for images and other media with cache trimming
async function cacheFirst(request) {
  const cache = await caches.open(RUNTIME);
  const cached = await cache.match(request);
  if (cached) return cached;
  try {
    const response = await fetch(request);
    if (response && response.status === 200) {
      cache.put(request, response.clone());
      // keep images cache small
      trimCache(RUNTIME, 50).catch(() => {});
    }
    return response;
  } catch (err) {
    return cached || Response.error();
  }
}

self.addEventListener('fetch', (event) => {
  const { request } = event;

  // Only handle GET requests
  if (request.method !== 'GET') return;

  const url = new URL(request.url);

  // Cross-origin requests: perform network-first for API-like requests, otherwise default to network
  if (url.origin !== self.location.origin) {
    // For cross-origin images/assets, fallback to network
    event.respondWith(fetch(request).catch(() => caches.match(request)));
    return;
  }

  // Navigation requests (HTML) — network first so users get fresh content when online
  if (request.mode === 'navigate' || (request.headers.get('accept') || '').includes('text/html')) {
    event.respondWith(networkFirst(request));
    return;
  }

  // Static assets: JS / CSS — stale-while-revalidate
  if ((request.destination === 'script') || (request.destination === 'style')) {
    event.respondWith(staleWhileRevalidate(request));
    return;
  }

  // Images: cache-first
  if (request.destination === 'image') {
    event.respondWith(cacheFirst(request));
    return;
  }

  // Default: try cache, then network
  event.respondWith(
    caches.match(request).then((cached) => cached || fetch(request).then((res) => {
      // Optionally cache fetched responses for runtime
      return res;
    })).catch(() => null)
  );
});

// Listen for messages from the client (e.g., to trigger skipWaiting)
self.addEventListener('message', (event) => {
  if (!event.data) return;
  switch (event.data.type) {
    case 'SKIP_WAITING':
      self.skipWaiting();
      break;
    default:
      // noop
      break;
  }
});

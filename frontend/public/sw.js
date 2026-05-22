/* ParasitePro — Service Worker
 * Minimal SW for Phase 1 PWA. Strategy:
 *   - Cache the shell + icons on install
 *   - Network-first for API calls and HTML navigation (always fresh data)
 *   - Cache-first for static assets (icons, fonts) with background refresh
 *   - Show offline shell when network fails on navigation
 *
 * Bump CACHE_VERSION on every deploy to invalidate stale caches.
 */
const CACHE_VERSION = 'pp-v1';
const STATIC_CACHE = `${CACHE_VERSION}-static`;
const RUNTIME_CACHE = `${CACHE_VERSION}-runtime`;

const STATIC_ASSETS = [
  '/',
  '/favicon.ico',
  '/favicon-32x32.png',
  '/favicon-16x16.png',
  '/apple-touch-icon.png',
  '/icon-192x192.png',
  '/icon-512x512.png',
  '/para-avatar.jpg',
  '/para-avatar-small.png',
  '/site.webmanifest',
];

// ── INSTALL: precache the shell ─────────────────────────────────────────────
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(STATIC_CACHE).then((cache) => {
      // Use addAll with individual catches so one missing asset doesn't kill the whole install
      return Promise.all(
        STATIC_ASSETS.map((url) =>
          cache.add(url).catch((err) => console.warn('[SW] precache miss:', url, err))
        )
      );
    }).then(() => self.skipWaiting())
  );
});

// ── ACTIVATE: clean up old cache versions ───────────────────────────────────
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(
        keys
          .filter((k) => !k.startsWith(CACHE_VERSION))
          .map((k) => caches.delete(k))
      ))
      .then(() => self.clients.claim())
  );
});

// ── FETCH: routing logic ────────────────────────────────────────────────────
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Only GET requests — never cache POST/PUT/DELETE
  if (request.method !== 'GET') return;

  // Skip cross-origin requests entirely (Cloudinary, Anthropic, Railway backend, etc.)
  if (url.origin !== self.location.origin) return;

  // API calls: network-only (never cache — fresh data always)
  if (url.pathname.startsWith('/api/')) return;

  // HTML navigation: network-first with offline fallback
  if (request.mode === 'navigate' || request.destination === 'document') {
    event.respondWith(
      fetch(request)
        .then((response) => {
          // Cache successful navigations for offline fallback
          const copy = response.clone();
          caches.open(RUNTIME_CACHE).then((cache) => cache.put(request, copy));
          return response;
        })
        .catch(() =>
          caches.match(request).then((cached) => cached || caches.match('/'))
        )
    );
    return;
  }

  // Static assets (JS, CSS, images, fonts): cache-first with background refresh
  event.respondWith(
    caches.match(request).then((cached) => {
      const networkFetch = fetch(request)
        .then((response) => {
          if (response && response.status === 200) {
            const copy = response.clone();
            caches.open(RUNTIME_CACHE).then((cache) => cache.put(request, copy));
          }
          return response;
        })
        .catch(() => cached); // Network failed → return whatever's cached
      return cached || networkFetch;
    })
  );
});

// ── MESSAGE: support manual SW updates from the app ────────────────────────
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

// FreeLeased Service Worker — Stage 7 #2 + Phase 12 G4
// Scope: "/" (root). Registered from src/lib/offline.ts:62 as "/sw.js".
// Version: fl-v2. Network-first strategy; falls back to cache when offline.
// Caches the PWA manifest and 3 icon sizes for install prompt + standalone.
// No external deps; pure browser APIs.

// ── Lifecycle ─────────────────────────────────────────────────────────
const CACHE = "fl-v2";
const PRECACHE = [
  "/",
  "/index.html",
  "/favicon.ico",
  "/manifest.json",
  "/icon.svg",
  "/icon-192.png",
  "/icon-512.png",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE).then((c) => c.addAll(PRECACHE)).catch(() => {}),
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))),
    ),
  );
  self.clients.claim();
});

// ── Fetch: network-first, cache fallback ──────────────────────────────
self.addEventListener("fetch", (event) => {
  const req = event.request;
  if (req.method !== "GET") return; // never cache writes

  event.respondWith(
    fetch(req)
      .then((res) => {
        // Opportunistic cache for successful same-origin GETs
        if (res && res.status === 200 && new URL(req.url).origin === self.location.origin) {
          const copy = res.clone();
          caches.open(CACHE).then((c) => c.put(req, copy)).catch(() => {});
        }
        return res;
      })
      .catch(() => caches.match(req).then((cached) => cached || caches.match("/"))),
  );
});

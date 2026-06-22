const CACHE_NAME = "songleader-cache-v1";

const FILES_TO_CACHE = [
  "/",
  "/index.html",
  "/sunday_mornign.html",
  "/sunday_evening.html",
  "/wednesday_evening.html",
  "/manifest.json",
  "/icons/ic_launcher.png",
  "/icons/ic_launcher.png"
];

// Install: cache everything
self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(FILES_TO_CACHE);
    })
  );
  self.skipWaiting();
});

// Activate: clean old caches
self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys.map(key => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Fetch: serve from cache first, then network
self.addEventListener("fetch", event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request);
    })
  );
});

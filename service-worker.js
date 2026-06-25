const CACHE_NAME = "songleader-cache-v20";

const FILES_TO_CACHE = [
  "/SongLeaderApp/",
  "/SongLeaderApp/index.html",
  "/SongLeaderApp/sunday_mornign.html",
  "/SongLeaderApp/sunday_evening.html",
  "/SongLeaderApp/wednesday_evening.html",
  "/SongLeaderApp/manifest.json",
  "/SongLeaderApp/icons/ic_launcher.png"
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

// Fetch handler
self.addEventListener("fetch", event => {
  const url = new URL(event.request.url);

  // Do NOT cache Django API calls
  if (url.pathname.startsWith("/assignments/api/")) {
    event.respondWith(fetch(event.request));
    return;
  }

  // Cache-first for everything else
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request);
    })
  );
});

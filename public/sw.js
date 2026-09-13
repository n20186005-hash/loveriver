/*
 * Love River 高雄愛河旅遊指南 — Service Worker
 * 策略：
 *  - 導覽請求：network-first，離線時回退到快取頁面或 /offline.html
 *  - 靜態資產（圖片／Astro 產物／圖示）：cache-first
 *  - /api/ 與第三方（Google Maps、GA）不介入
 */
const VERSION = "loveriver-v1";
const CORE_CACHE = `${VERSION}-core`;
const ASSET_CACHE = `${VERSION}-assets`;
const CORE_ASSETS = [
  "/",
  "/offline.html",
  "/manifest.webmanifest",
  "/favicon.svg",
  "/icons/icon.svg",
  "/icons/icon-192.png",
  "/icons/icon-512.png",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(CORE_CACHE)
      .then((cache) => cache.addAll(CORE_ASSETS))
      .catch(() => undefined)
      .then(() => self.skipWaiting()),
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys.filter((key) => !key.startsWith(VERSION)).map((key) => caches.delete(key)),
        ),
      )
      .then(() => self.clients.claim()),
  );
});

self.addEventListener("fetch", (event) => {
  const { request } = event;

  if (request.method !== "GET") return;

  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;
  if (url.pathname.startsWith("/api/")) return;

  if (request.mode === "navigate") {
    event.respondWith(
      fetch(request)
        .then((response) => {
          const copy = response.clone();
          caches
            .open(CORE_CACHE)
            .then((cache) => cache.put(request, copy))
            .catch(() => undefined);
          return response;
        })
        .catch(async () => {
          const cached = await caches.match(request);
          return cached || (await caches.match("/offline.html")) || (await caches.match("/"));
        }),
    );
    return;
  }

  event.respondWith(
    caches.match(request).then((cached) => {
      if (cached) return cached;

      return fetch(request).then((response) => {
        const cacheable =
          response.ok &&
          (url.pathname.startsWith("/images/") ||
            url.pathname.startsWith("/_astro/") ||
            url.pathname.startsWith("/icons/"));
        if (cacheable) {
          const copy = response.clone();
          caches
            .open(ASSET_CACHE)
            .then((cache) => cache.put(request, copy))
            .catch(() => undefined);
        }
        return response;
      });
    }),
  );
});

/* sw.js — Modular Markdown Site System
 *
 * 手寫極簡 Service Worker（無依賴）：
 * - 靜態資源：cache-first（抓過一次就離線可用）
 * - 頁面導航：network-first，離線時 fallback 到快取的 index.html（SPA 路由）
 * - 第三方請求（字體等）不經手，直接走網路
 *
 * v2 修正：navigate 處理器只快取「頁面路由」的回應。直接在網址列開啟
 * /assets/*.css、/sw.js、/icons/*、/manifest.webmanifest 等靜態檔時，
 * 不得用它們的內容覆蓋離線備援頁（舊版會把 CSS 內容寫進 /index.html 鍵，
 * 導致離線備援頁損毀）。CACHE 改名以清掉舊版可能已污染的快取。
 * v3 加強：靜態資源分支加 content-type 防護，避免 SPA fallback 的
 * index.html（200 + text/html）被當成 CSS/JS 快取導致永久無樣式。
 */
const CACHE = "mmss-v3";
const CORE = ["/", "/index.html", "/manifest.webmanifest"];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(CACHE)
      .then((cache) => cache.addAll(CORE))
      .then(() => self.skipWaiting()),
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim()),
  );
});

self.addEventListener("fetch", (event) => {
  const { request } = event;
  if (request.method !== "GET") return;
  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  if (request.mode === "navigate") {
    event.respondWith(
      fetch(request)
        .then((res) => {
          const copy = res.clone();
          const path = url.pathname;
          const isPageRoute = res.ok && !path.startsWith("/assets/") && !/\.[a-z0-9]+$/i.test(path);
          if (isPageRoute) {
            caches.open(CACHE).then((cache) => cache.put("/index.html", copy));
          }
          return res;
        })
        .catch(() => caches.match("/index.html")),
    );
    return;
  }

  event.respondWith(
    caches.match(request).then(
      (hit) =>
        hit ||
        fetch(request).then((res) => {
          const contentType = res.headers.get("content-type") || "";
          const path = url.pathname;
          const isAsset = path.startsWith("/assets/") || path.startsWith("/icons/") || path.startsWith("/images/");
          // 防毒：SPA fallback 會對缺失檔案回 200 + text/html，不可把 HTML 當靜態資源快取
          const cacheable = res.ok && (!isAsset || !contentType.includes("text/html"));
          if (cacheable) {
            const copy = res.clone();
            caches.open(CACHE).then((cache) => cache.put(request, copy));
          }
          return res;
        }),
    ),
  );
});

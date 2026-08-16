/* ============ Service Worker: 冰箱信号灯 PWA ============ */
const CACHE_VERSION = 'v1';
const CACHE_NAME = `fridge-signal-${CACHE_VERSION}`;

// 安装时预缓存静态资源
const PRECACHE_URLS = [
  './',
  './index.html',
  './manifest.json'
];

self.addEventListener('install', (event) => {
  console.log(`[SW ${CACHE_VERSION}] Install, pre-caching:`, PRECACHE_URLS);
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(PRECACHE_URLS))
      .then(() => {
        console.log(`[SW ${CACHE_VERSION}] Pre-cache done.`);
        return self.skipWaiting(); // 立即激活
      })
      .catch((err) => console.error(`[SW ${CACHE_VERSION}] Pre-cache failed:`, err))
  );
});

// 激活时清理旧版本缓存
self.addEventListener('activate', (event) => {
  console.log(`[SW ${CACHE_VERSION}] Activate, cleaning old caches...`);
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(
        keys
          .filter((k) => k !== CACHE_NAME)
          .map((k) => {
            console.log(`[SW ${CACHE_VERSION}] Delete old cache:`, k);
            return caches.delete(k);
          })
      ))
      .then(() => {
        console.log(`[SW ${CACHE_VERSION}] Old caches cleaned.`);
        return self.clients.claim(); // 立即接管所有页面
      })
  );
});

// Fetch: Cache First, 未命中回源并写入缓存
self.addEventListener('fetch', (event) => {
  const { request } = event;

  // 只拦截 GET 请求
  if (request.method !== 'GET') return;

  // 非 http(s) 请求跳过（如 chrome-extension://）
  if (!request.url.startsWith('http')) return;

  event.respondWith(
    caches.match(request)
      .then((cached) => {
        if (cached) {
          console.log(`[SW ${CACHE_VERSION}] Cache hit:`, request.url);
          return cached;
        }
        console.log(`[SW ${CACHE_VERSION}] Cache miss, fetch:`, request.url);
        return fetch(request)
          .then((response) => {
            // 只有正常响应才写入缓存
            if (response && response.status === 200) {
              const clone = response.clone();
              caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
            }
            return response;
          })
          .catch((err) => {
            console.error(`[SW ${CACHE_VERSION}] Fetch failed:`, request.url, err);
            // 离线时 HTML 请求回退到首页
            if (request.headers.get('accept')?.includes('text/html')) {
              return caches.match('./index.html');
            }
            throw err;
          });
      })
  );
});

console.log(`[SW ${CACHE_VERSION}] Script loaded.`);

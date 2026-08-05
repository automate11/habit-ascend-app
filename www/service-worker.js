/* Service Worker · 习惯进阶 MVP
 * 缓存策略：
 *   - 预缓存：核心 HTML 和图标（保证首次离线也能启动）
 *   - 同源 GET 请求：cache-first（命中缓存直接返回，保证离线体验）
 *   - 其他：network-first，回退到缓存
 *   - 后台发现新版本时静默预缓存，下次启动生效（不弹更新提示）
 *
 * v2 变更：
 *   - CACHE_NAME 升 v2（让旧 SW 失效，触发新内容缓存）
 *   - PRECACHE_URLS 加 ./index.html（PWA 主入口）
 *   - 网络失败回退到 ./index.html
 */

const CACHE_NAME = 'habit-ascend-v2';
const PRECACHE_URLS = [
  './',
  './index.html',
  './prototype-习惯进阶.html',
  './manifest.json',
  './icon-192.png',
  './icon-512.png'
];

// 安装阶段：预缓存核心资源
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(PRECACHE_URLS))
      .then(() => self.skipWaiting())   // 立即激活新版本（不等旧 SW 关闭）
  );
});

// 激活阶段：清理旧缓存
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(
        keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k))
      ))
      .then(() => self.clients.claim())   // 立即接管所有页面
  );
});

// 请求拦截：同源 GET 走 cache-first
self.addEventListener('fetch', event => {
  const req = event.request;
  // 只处理 GET 请求
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  // 只处理同源请求
  if (url.origin !== self.location.origin) return;

  event.respondWith(
    caches.match(req).then(cached => {
      if (cached) {
        // 命中缓存：后台异步尝试获取新版（静默更新缓存）
        fetch(req).then(fresh => {
          if (fresh && fresh.ok) {
            caches.open(CACHE_NAME).then(c => c.put(req, fresh.clone()));
          }
        }).catch(() => {});
        return cached;
      }
      // 未命中：走网络，失败回退到 index.html
      return fetch(req).then(resp => {
        if (resp && resp.ok) {
          const clone = resp.clone();
          caches.open(CACHE_NAME).then(c => c.put(req, clone));
        }
        return resp;
      }).catch(() => caches.match('./index.html'));
    })
  );
});
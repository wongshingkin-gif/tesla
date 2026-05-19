const CACHE_NAME = 'tesla-hub-v2';
const urlsToCache = [
  './',
  './index.html',
  './manifest.json'
];

// 安裝 Service Worker 並快取基本檔案
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

// 攔截網路請求，若無網路則提供快取版本
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // 如果快取中有資料，就回傳快取
        if (response) {
          return response;
        }
        // 否則透過網路去抓取 (例如向 Google Sheet 要資料)
        return fetch(event.request);
      })
  );
});

// 更新 Service Worker 時清除舊快取
self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
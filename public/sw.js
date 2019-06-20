// service worker
'use strict';

// 加入 install event listener
self.addEventListener("install", function(event) {
  console.log("[Service Worker] Installing Service Worker...", event);
});

// 加入 activate event listener
self.addEventListener("activate", function(event) {
  console.log("[Service Worker] Activating Service Worker...", event);
  return self.clients.claim();
});

// 加入fetch event listener
self.addEventListener("fetch", function(event) {
  /* fetch包含 image src, css, js 等resources的讀取 */
  console.log("[Service Worker] Fetching something...", event);
  // overwrite the response
  // event.respondWith(null);    // 每當有fetch被trigger時，都回傳null值
  event.respondWith(fetch(event.request));     // 有fetch被trigger時，取得真實的resources
});
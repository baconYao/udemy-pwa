// service worker
'use strict';

var CACHE_STATIC_NAME = 'static-v4';
var CACHE_DYNAMIC_NAME = 'dynamic-v2';

// 加入 install event listener
self.addEventListener("install", function(event) {
  console.log("[Service Worker] Installing Service Worker...", event);
  // 等到cache完成
  event.waitUntil(
    // 開啟名為 'static' 的 Cache Storage
    caches.open('static')
      .then(function(cache) {
        console.log("[Service Worker] Precaching App Sehll...");        
        cache.addAll([
          '/',
          '/index.html',
          '/offline.html',
          '/src/js/app.js',
          '/src/js/feed.js',
          '/src/js/promise.js',
          '/src/js/fetch.js',
          '/src/js/material.min.js',
          '/src/css/app.css',
          '/src/css/feed.css',
          '/src/images/main-image.jpg',
          'https://fonts.googleapis.com/css?family=Roboto:400,700',
          'https://fonts.googleapis.com/icon?family=Material+Icons',
          'https://cdnjs.cloudflare.com/ajax/libs/material-design-lite/1.3.0/material.indigo-pink.min.css'
        ]);   
      })
  );
});

// 加入 activate event listener
self.addEventListener("activate", function(event) {
  console.log("[Service Worker] Activating Service Worker...", event);
  // 由於activate是每次在open/reload app時都會觸發，因此適合用來檢查cache的版本是否異動
  event.waitUntil(
    // caches.keys() 回傳 sub-caches name (ex: static & dynamic)
    caches.keys()
      .then(function(keyList) {
        return Promise.all(keyList.map(function(key) {
          // 若cache的版本異動，則刪除cache內的所有資料
          if (key !== CACHE_STATIC_NAME && key !== CACHE_DYNAMIC_NAME) {
            console.log('[Service Worker] Removing old cache.', key);
            return caches.delete(key);
          }
        }));
      })
  );
  return self.clients.claim();
});

// 加入fetch event listener
self.addEventListener("fetch", function(event) {
  /* fetch包含 image src, css, js 等resources的讀取 */
  // console.log("[Service Worker] Fetching something...", event);
  // overwrite the response
  // event.respondWith(null);    // 每當有fetch被trigger時，都回傳null值
  // event.respondWith(fetch(event.request));     // 有fetch被trigger時，取得真實的resources

  // 動態cache已經被訪問過的頁面
  event.respondWith(
    // 將req和caches內的物件比對，若有，則回傳第一個找到的物件
    caches.match(event.request)
      .then(function(response) {
        if (response) {       // 有找到cache過的data
          return response;
        } else {
          // 沒有被cache過
          return fetch(event.request)       // 發出req請求
            .then(function(res) {
              // 收到res，將此res快取在名為dynamic的cache內
              return caches.open('dynamic')
                .then(function(cache) {
                  //cache.put: key-value
                  // 由於 Request、Response 物件，只能被讀取一次 ，因此需要利用clone method來製作一個副本 (https://notfalse.net/31/fetch-api#-Clone)
                  cache.put(event.request.url, res.clone());
                  // 回傳原本的res，否則html收不到該有的res會出錯
                  return res;
                })
            })
            .catch(function(err) {        // 當沒有網路時，就會被catch，此時會到Static cache裡面找offline.html，並回傳之
              return caches.open(CACHE_STATIC_NAME)
              .then(function(cache) {
                return cache.match('/offline.html');
              });
            });
        }
      })
  );
});
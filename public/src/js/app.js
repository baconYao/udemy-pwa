var deferredPrompt;   // defer延期，延緩。用來當作是出現「安裝到screen的banner」的控制變數

if(!window.Promise) {
  window.Promise = Promise;
}

// 註冊service worker
if("serviceWorker" in navigator) {
  navigator.serviceWorker
    .register("/sw.js")
    .then(function() {
      console.log("Service worker registered!");
    });
}

// 監聽 安裝到screen 事件
window.addEventListener("beforeinstallprompt", function(event) {
  console.log("beforeinstallprompt fired");
  event.preventDefault();   // prevent brower to show the insall banner
  deferredPrompt = event;
  return false;
});
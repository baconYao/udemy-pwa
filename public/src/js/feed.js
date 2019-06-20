var shareImageButton = document.querySelector('#share-image-button');
var createPostArea = document.querySelector('#create-post');
var closeCreatePostModalButton = document.querySelector('#close-create-post-modal-btn');

// 新增 post 的 function，也被我們用來當作觸發 「安裝到screen banner」的function
function openCreatePostModal() {
  createPostArea.style.display = 'block';
  // deferredPrompt被宣告在app.js內
  if(deferredPrompt) {
    // 跳出 「安裝到screen」的banner
    deferredPrompt.prompt();

    // 使用者的決定(是否安裝)
    deferredPrompt.userChoice.then(function(choiceResult) {
      console.log(choiceResult.outcome);

      if(choiceResult.outcome === "dismissed") {
        console.log("User cancelled installation");
      } else {
        console.log("User added to home screen");
      }
    });

    deferredPrompt = null;
  }
}

function closeCreatePostModal() {
  createPostArea.style.display = 'none';
}

shareImageButton.addEventListener('click', openCreatePostModal);

closeCreatePostModalButton.addEventListener('click', closeCreatePostModal);

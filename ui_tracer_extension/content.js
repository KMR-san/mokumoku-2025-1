// ページロード時のURLを記録
chrome.runtime.sendMessage({
  action: 'recordAction',
  data: {
    type: 'pageLoad',
    url: window.location.href
  }
});

// クリックイベントの監視
document.addEventListener('click', (event) => {
  const element = event.target;
  
  // ボタンクリックの記録
  if (element.tagName === 'BUTTON' || 
      (element.tagName === 'INPUT' && element.type === 'button') ||
      element.role === 'button') {
    chrome.runtime.sendMessage({
      action: 'recordAction',
      data: {
        type: 'buttonClick',
        text: element.textContent || element.value,
        elementType: element.tagName.toLowerCase(),
        id: element.id,
        className: element.className
      }
    });
  }
});

// フォーカスイベントの監視
document.addEventListener('focus', (event) => {
  const element = event.target;
  
  // テキスト入力要素の選択を記録
  if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
    chrome.runtime.sendMessage({
      action: 'recordAction',
      data: {
        type: 'inputFocus',
        elementType: element.tagName.toLowerCase(),
        inputType: element.type,
        id: element.id,
        className: element.className
      }
    });
  }
}, true);

// ページ遷移の監視
let lastUrl = window.location.href;
new MutationObserver(() => {
  const currentUrl = window.location.href;
  if (currentUrl !== lastUrl) {
    chrome.runtime.sendMessage({
      action: 'recordAction',
      data: {
        type: 'navigation',
        fromUrl: lastUrl,
        toUrl: currentUrl
      }
    });
    lastUrl = currentUrl;
  }
}).observe(document, { subtree: true, childList: true });

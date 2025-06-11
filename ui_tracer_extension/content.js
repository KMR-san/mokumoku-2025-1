// ページロード時のURLを記録
chrome.runtime.sendMessage({
  action: 'recordAction',
  data: {
    type: 'pageLoad',
    url: window.location.href
  }
});

// UI操作を監視して記録する
function recordUIAction(action) {
  // 現在のページ情報を追加
  const pageInfo = {
    url: window.location.href,
    title: document.title,
    path: window.location.pathname
  };

  chrome.runtime.sendMessage({
    type: 'UI_ACTION',
    data: {
      ...action,
      page: pageInfo
    }
  });
}

// ページ情報を記録
function recordPageView() {
  const action = {
    type: 'pageview',
    url: window.location.href,
    title: document.title,
    path: window.location.pathname,
    timestamp: new Date().toISOString()
  };
  recordUIAction(action);
}

// ページ読み込み時に記録
window.addEventListener('load', recordPageView);

// History API経由のページ遷移を検知
let lastUrl = window.location.href;
new MutationObserver(() => {
  const currentUrl = window.location.href;
  if (currentUrl !== lastUrl) {
    lastUrl = currentUrl;
    recordPageView();
  }
}).observe(document, { subtree: true, childList: true });

// 要素のイベントハンドラを取得する
function getElementEventHandlers(element) {
  const handlers = {};
  // onclick属性を取得
  if (element.getAttribute('onclick')) {
    handlers.onclick = element.getAttribute('onclick');
  }
  // href属性を取得（aタグの場合）
  if (element.tagName === 'A' && element.getAttribute('href')) {
    handlers.href = element.getAttribute('href');
  }
  // form要素のaction属性を取得
  if (element.tagName === 'FORM' && element.getAttribute('action')) {
    handlers.formAction = element.getAttribute('action');
  }
  // data-*属性からイベントに関連する情報を取得
  Array.from(element.attributes)
    .filter(attr => attr.name.startsWith('data-'))
    .forEach(attr => {
      handlers[attr.name] = attr.value;
    });
  
  return handlers;
}

// 要素の詳細情報を取得
function getElementDetails(element) {
  return {
    tagName: element.tagName.toLowerCase(),
    elementType: element.type || '',  // button, submit, textなど
    id: element.id || '',
    className: element.className || '',
    text: element.textContent?.trim() || '',
    value: element.value || '',
    name: element.name || '',  // form要素のname属性
    handlers: getElementEventHandlers(element),
    attributes: {
      role: element.getAttribute('role') || '',
      ariaLabel: element.getAttribute('aria-label') || '',
    }
  };
}

// クリックイベントの監視
document.addEventListener('click', (event) => {
  const target = event.target;
  const action = {
    type: 'click',
    ...getElementDetails(target),
    timestamp: new Date().toISOString()
  };
  recordUIAction(action);
});

// 入力イベントの監視
document.addEventListener('input', (event) => {
  const target = event.target;
  if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') {
    const action = {
      type: 'input',
      ...getElementDetails(target),
      timestamp: new Date().toISOString()
    };
    recordUIAction(action);
  }
});

// フォーム送信の監視
document.addEventListener('submit', (event) => {
  const form = event.target;
  const formData = new FormData(form);
  const action = {
    type: 'submit',
    ...getElementDetails(form),
    formData: Object.fromEntries(formData),
    timestamp: new Date().toISOString()
  };
  recordUIAction(action);
});

// content.js
let isRecording = false;
let traceData = [];

// Background Scriptからのメッセージを受信
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'startRecordingInContent') {
    if (!isRecording) {
      isRecording = true;
      traceData = []; // 新しい記録を開始
      console.log('Content Script: Recording started.');
      setupEventListeners();
    }
  } else if (message.action === 'stopRecordingInContent') {
    if (isRecording) {
      isRecording = false;
      console.log('Content Script: Recording stopped.');
      removeEventListeners();
      // 記録されたデータをBackground Scriptに送信
      chrome.runtime.sendMessage({ action: 'saveTrace', data: traceData }, (response) => {
        console.log('Trace saved:', response);
      });
    }
  }
});

function setupEventListeners() {
  // クリックイベントのリスナー
  document.addEventListener('click', handleEvent);
  // キーボードイベントのリスナー
  document.addEventListener('keydown', handleEvent);
  // フォームの入力イベント（例：inputイベント）
  document.addEventListener('input', handleEvent);
  // ページのスクロールイベント
  document.addEventListener('scroll', handleEvent);
  // その他のイベントも必要に応じて追加
}

function removeEventListeners() {
  document.removeEventListener('click', handleEvent);
  document.removeEventListener('keydown', handleEvent);
  document.removeEventListener('input', handleEvent);
  document.removeEventListener('scroll', handleEvent);
}

function handleEvent(event) {
  if (!isRecording) return;

  const eventInfo = {
    timestamp: Date.now(),
    eventType: event.type,
    target: getElementSelector(event.target), // 要素の識別子
    value: event.target.value || null, // input要素などの値
    tagName: event.target.tagName,
    className: event.target.className,
    id: event.target.id,
    x: event.clientX,
    y: event.clientY,
    key: event.key || null // キーボードイベントの場合
    // その他の必要な情報
  };
  traceData.push(eventInfo);
  console.log('Event captured:', eventInfo);
}

// 要素を一意に特定するためのセレクタを生成するヘルパー関数
function getElementSelector(element) {
  if (element.id) {
    return `#${element.id}`;
  }
  if (element.className) {
    return `.${element.className.split(' ')[0]}`; // 最初のクラス名を使用
  }
  // その他の属性（data-test-idなど）も考慮するとより堅牢になります
  let selector = element.tagName.toLowerCase();
  if (element.parentNode) {
    const index = Array.from(element.parentNode.children).indexOf(element) + 1;
    selector = `${getElementSelector(element.parentNode)} > <span class="math-inline">\{selector\}\:nth\-child\(</span>{index})`;
  }
  return selector;
}
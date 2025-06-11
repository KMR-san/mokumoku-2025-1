let recordedActions = [];
let isRecording = false;

// 初期化時に保存されたデータを読み込む
async function initialize() {
  try {
    const result = await chrome.storage.local.get(['recordedActions', 'isRecording']);
    recordedActions = result.recordedActions || [];
    isRecording = result.isRecording || false;
    console.log('初期化完了:', { isRecording, actionsCount: recordedActions.length });
  } catch (error) {
    console.error('初期化中にエラーが発生しました:', error);
  }
}

// 拡張機能起動時に初期化を実行
initialize();

// ストレージの変更を監視
chrome.storage.onChanged.addListener((changes, namespace) => {
  if (namespace === 'local') {
    if (changes.recordedActions) {
      recordedActions = changes.recordedActions.newValue || [];
    }
    if (changes.isRecording) {
      isRecording = changes.isRecording.newValue || false;
    }
    console.log('ストレージ更新:', { isRecording, actionsCount: recordedActions.length });
  }
});

// popup.jsからのメッセージ
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  // Promiseを返す非同期処理のために、trueを返してリスナーを維持
  (async () => {
    try {
      switch (message.action) {
        // popup.jsからのメッセージ（レスポンスが必要）
        case 'startRecording':
          isRecording = true;
          recordedActions = [];
          await chrome.storage.local.set({ isRecording, recordedActions });
          sendResponse({ isRecording });
          break;
          
        case 'stopRecording':
          isRecording = false;
          await chrome.storage.local.set({ isRecording });
          sendResponse({ isRecording });
          break;
          
        // popup.jsからのメッセージ（レスポンスが必要）
        case 'downloadJSON':
          const blob = new Blob([JSON.stringify(recordedActions, null, 2)], {
            type: 'application/json'
          });
          const url = URL.createObjectURL(blob);
          await chrome.downloads.download({
            url: url,
            filename: `ui-trace-${new Date().toISOString()}.json`,
            saveAs: true
          });
          sendResponse({ isRecording });
          break;

        case 'getState':
          sendResponse({ isRecording });
          break;
      }
    } catch (error) {
      console.error('メッセージ処理中にエラーが発生しました:', error);
      // エラーレスポンスはpopup.jsからのメッセージに対してのみ送信
      if (['startRecording', 'stopRecording', 'downloadJSON', 'getState'].includes(message.action)) {
        sendResponse({ success: false, error: error.message });
      }
    }
  })();
  
  // popup.jsからの非同期メッセージに対してのみtrueを返す
  return ['startRecording', 'stopRecording', 'downloadJSON', 'getState'].includes(message.action);
});

// content.jsからのメッセージ（レスポンス不要）
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  (async () => {
    try {
      if (isRecording) {
        recordedActions.push({
          timestamp: new Date().toISOString(),
          ...message.data
        });
        await chrome.storage.local.set({ recordedActions });
      }
    } catch (error) {
      console.error('メッセージ処理中にエラーが発生しました:', error);
    }
  })();
});
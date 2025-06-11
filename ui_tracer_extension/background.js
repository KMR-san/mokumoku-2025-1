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
          const jsonString = JSON.stringify(recordedActions, null, 2);
          const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
          await chrome.downloads.download({
            url: 'data:application/json;charset=utf-8,' + encodeURIComponent(jsonString),
            filename: `ui-trace-${timestamp}.json`,
            saveAs: true
          });
          sendResponse({ success: true });
          break;

        case 'getState':
          sendResponse({ isRecording });
          break;

        case 'getRecordedActions':
          sendResponse({ actions: recordedActions });
          break;
      }
    } catch (error) {
      console.error('メッセージ処理中にエラーが発生しました:', error);
      // エラーレスポンスはpopup.jsからのメッセージに対してのみ送信
      if (['startRecording', 'stopRecording', 'downloadJSON', 'getState', 'getRecordedActions'].includes(message.action)) {
        sendResponse({ success: false, error: error.message });
      }
    }
  })();
  
  // popup.jsからの非同期メッセージに対してのみtrueを返す
  return ['startRecording', 'stopRecording', 'downloadJSON', 'getState', 'getRecordedActions'].includes(message.action);
});

// content.jsからのメッセージ（レスポンス不要）
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  (async () => {
    try {
      console.log('content.jsからメッセージを受信:', message);
      if (message.type === 'UI_ACTION' && isRecording) {
        const action = {
          timestamp: new Date().toISOString(),
          url: sender.tab?.url || '',
          ...message.data
        };
        console.log('記録するアクション:', action);
        recordedActions.push(action);
        await chrome.storage.local.set({ recordedActions });
      }
    } catch (error) {
      console.error('メッセージ処理中にエラーが発生しました:', error);
    }
  })();
});
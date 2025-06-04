let recordedActions = [];
let isRecording = false;

// コンテンツスクリプトからのメッセージを受け取る
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  switch (message.action) {
    case 'startRecording':
      isRecording = true;
      recordedActions = [];
      break;
      
    case 'stopRecording':
      isRecording = false;
      break;
      
    case 'recordAction':
      if (isRecording) {
        recordedActions.push({
          timestamp: new Date().toISOString(),
          ...message.data
        });
      }
      break;
      
    case 'downloadJSON':
      const blob = new Blob([JSON.stringify(recordedActions, null, 2)], {
        type: 'application/json'
      });
      const url = URL.createObjectURL(blob);
      chrome.downloads.download({
        url: url,
        filename: `ui-trace-${new Date().toISOString()}.json`,
        saveAs: true
      });
      break;
  }
});

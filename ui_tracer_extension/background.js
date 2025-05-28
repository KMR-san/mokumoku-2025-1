// background.js
chrome.runtime.onInstalled.addListener(() => {
    console.log('UI Trace Recorder installed.');
  });
  
  // ポップアップからのメッセージを受信
  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === 'startRecording') {
      console.log('Recording started from popup.');
      // 現在のタブにContent Scriptを注入して記録を開始するよう指示
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        if (tabs[0]) {
          chrome.tabs.sendMessage(tabs[0].id, { action: 'startRecordingInContent' });
        }
      });
    } else if (message.action === 'stopRecording') {
      console.log('Recording stopped from popup.');
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        if (tabs[0]) {
          chrome.tabs.sendMessage(tabs[0].id, { action: 'stopRecordingInContent' });
        }
      });
    } else if (message.action === 'saveTrace') {
      console.log('Trace data received in background:', message.data);
      // ここでトレースデータを保存する処理（例: chrome.storage.local.set）
      chrome.storage.local.set({ uiTraceData: message.data }, () => {
        console.log('UI Trace data saved.');
        sendResponse({ status: 'success' });
      });
    } else if (message.action === 'loadTrace') {
      chrome.storage.local.get('uiTraceData', (result) => {
        sendResponse({ data: result.uiTraceData });
      });
      return true; // 非同期応答のために必要
    }
  });
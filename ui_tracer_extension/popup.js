// popup.js
document.addEventListener('DOMContentLoaded', () => {
    const startButton = document.getElementById('startButton');
    const stopButton = document.getElementById('stopButton');
    const loadButton = document.getElementById('loadButton');
    const traceOutput = document.getElementById('traceOutput');
  
    startButton.addEventListener('click', () => {
      chrome.runtime.sendMessage({ action: 'startRecording' }, (response) => {
        console.log('Start recording message sent.');
        traceOutput.value = '記録を開始しました...';
      });
    });
  
    stopButton.addEventListener('click', () => {
      chrome.runtime.sendMessage({ action: 'stopRecording' }, (response) => {
        console.log('Stop recording message sent.');
        traceOutput.value = '記録を停止しました。';
      });
    });
  
    loadButton.addEventListener('click', () => {
      chrome.runtime.sendMessage({ action: 'loadTrace' }, (response) => {
        if (response && response.data) {
          traceOutput.value = JSON.stringify(response.data, null, 2);
        } else {
          traceOutput.value = '保存された記録がありません。';
        }
      });
    });
  });
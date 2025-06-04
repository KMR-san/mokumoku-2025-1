let isRecording = false;

document.getElementById('startRecording').addEventListener('click', async () => {
  isRecording = true;
  updateButtonStates();
  
  // 記録開始のメッセージをbackgroundスクリプトに送信
  chrome.runtime.sendMessage({ action: 'startRecording' });
  
  document.getElementById('status').textContent = '記録中...';
});

document.getElementById('stopRecording').addEventListener('click', async () => {
  isRecording = false;
  updateButtonStates();
  
  // 記録停止のメッセージをbackgroundスクリプトに送信
  chrome.runtime.sendMessage({ action: 'stopRecording' });
  
  document.getElementById('status').textContent = '記録停止';
});

document.getElementById('downloadJSON').addEventListener('click', async () => {
  // 記録データのダウンロードをbackgroundスクリプトに要求
  chrome.runtime.sendMessage({ action: 'downloadJSON' });
});

function updateButtonStates() {
  document.getElementById('startRecording').disabled = isRecording;
  document.getElementById('stopRecording').disabled = !isRecording;
  document.getElementById('downloadJSON').disabled = isRecording;
}

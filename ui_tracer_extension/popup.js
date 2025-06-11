let isRecording = false;

// ポップアップを開いたときに現在の状態を取得
async function initializeState() {
  try {
    const response = await chrome.runtime.sendMessage({ action: 'getState' });
    isRecording = response.isRecording;
    updateButtonStates();
    document.getElementById('status').textContent = isRecording ? '記録中...' : '記録停止';
  } catch (error) {
    console.error('状態の取得に失敗しました:', error);
    document.getElementById('status').textContent = 'エラーが発生しました';
  }
}

// 初期化を実行
document.addEventListener('DOMContentLoaded', initializeState);

document.getElementById('startRecording').addEventListener('click', async () => {
  try {
    await chrome.runtime.sendMessage({ action: 'startRecording' });
    isRecording = true;
    updateButtonStates();
    document.getElementById('status').textContent = '記録中...';
  } catch (error) {
    console.error('記録の開始に失敗しました:', error);
  }
});

document.getElementById('stopRecording').addEventListener('click', async () => {
  try {
    await chrome.runtime.sendMessage({ action: 'stopRecording' });
    isRecording = false;
    updateButtonStates();
    document.getElementById('status').textContent = '記録停止';
  } catch (error) {
    console.error('記録の停止に失敗しました:', error);
  }
});

document.getElementById('downloadJSON').addEventListener('click', async () => {
  try {
    await chrome.runtime.sendMessage({ action: 'downloadJSON' });
  } catch (error) {
    console.error('JSONのダウンロードに失敗しました:', error);
  }
});

document.getElementById('downloadReport').addEventListener('click', async () => {
  try {
    const response = await chrome.runtime.sendMessage({ action: 'getRecordedActions' });
    if (response.actions) {
      const { url, filename } = downloadReport(response.actions);
      await chrome.downloads.download({
        url: url,
        filename: filename,
        saveAs: true
      });
    }
  } catch (error) {
    console.error('レポートの生成に失敗しました:', error);
  }
});

function updateButtonStates() {
  document.getElementById('startRecording').disabled = isRecording;
  document.getElementById('stopRecording').disabled = !isRecording;
  document.getElementById('downloadJSON').disabled = isRecording;
  document.getElementById('downloadReport').disabled = isRecording;
}

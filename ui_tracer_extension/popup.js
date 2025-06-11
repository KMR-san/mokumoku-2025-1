let isRecording = false;

// ポップアップを開いたときに現在の状態を取得
async function initializeState() {
  try {
    const response = await chrome.runtime.sendMessage({ action: 'getState' });
    isRecording = response.isRecording;
    updateUI();
  } catch (error) {
    console.error('状態の取得に失敗しました:', error);
    document.getElementById('status').textContent = 'エラーが発生しました';
  }
}

function updateUI() {
  document.getElementById('status').textContent = isRecording ? '記録中...' : '記録停止';
  updateButtonStates();
}

// 初期化を実行
document.addEventListener('DOMContentLoaded', initializeState);

document.getElementById('startRecording').addEventListener('click', async () => {
  try {
    const response = await chrome.runtime.sendMessage({ action: 'startRecording' });
    isRecording = response.isRecording;
    updateUI();
  } catch (error) {
    console.error('記録の開始に失敗しました:', error);
  }
});

document.getElementById('stopRecording').addEventListener('click', async () => {
  try {
    const response = await chrome.runtime.sendMessage({ action: 'stopRecording' });
    isRecording = response.isRecording;
    updateUI();
  } catch (error) {
    console.error('記録の停止に失敗しました:', error);
  }
});

document.getElementById('downloadJSON').addEventListener('click', async () => {
  try {
    await chrome.runtime.sendMessage({ action: 'downloadJSON' });
    updateUI();
  } catch (error) {
    console.error('JSONのダウンロードに失敗しました:', error);
  }
});

function updateButtonStates() {
  document.getElementById('startRecording').disabled = isRecording;
  document.getElementById('stopRecording').disabled = !isRecording;
  document.getElementById('downloadJSON').disabled = isRecording;
}

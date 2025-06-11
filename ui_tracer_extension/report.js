// UI操作の説明を生成する
function generateActionDescription(action) {
  let description = '';
  
  // ページ情報の追加（すべての操作に共通）
  const pageInfo = action.page ? 
    `\n   - ページ: ${action.page.title || action.page.url}` : '';

  switch (action.type) {
    case 'click':
      description = generateClickDescription(action);
      break;
    case 'input':
      description = generateInputDescription(action);
      break;
    case 'submit':
      description = generateSubmitDescription(action);
      break;
    case 'pageview':
      description = generatePageViewDescription(action);
      break;
    default:
      description = `不明な操作が実行されました: ${action.type}`;
  }

  return description + pageInfo;
}

// クリック操作の説明を生成
function generateClickDescription(action) {
  let description = '';
  
  // ボタンの場合
  if (action.tagName === 'button' || action.elementType === 'button') {
    const buttonName = action.text || action.ariaLabel || action.id || '名称不明のボタン';
    description = `「${buttonName}」ボタンをクリック`;
    if (action.handlers.onclick) {
      description += `（アクション: ${action.handlers.onclick}）`;
    }
  }
  // リンクの場合
  else if (action.tagName === 'a') {
    const linkText = action.text || action.ariaLabel || action.handlers.href || '不明なリンク';
    description = `「${linkText}」リンクをクリック`;
    if (action.handlers.href) {
      description += `（リンク先: ${action.handlers.href}）`;
    }
  }
  // その他の要素の場合
  else {
    const elementName = action.text || action.ariaLabel || action.id || `${action.tagName}要素`;
    description = `「${elementName}」をクリック`;
  }
  
  return description;
}

// 入力操作の説明を生成
function generateInputDescription(action) {
  const inputType = action.elementType || 'text';
  const inputName = action.name || action.id || action.ariaLabel || '入力フィールド';
  
  switch (inputType) {
    case 'text':
    case 'email':
    case 'password':
    case 'search':
      return `「${inputName}」に「${action.value}」を入力`;
    case 'checkbox':
      return `「${inputName}」チェックボックスを${action.value ? 'オン' : 'オフ'}に設定`;
    case 'radio':
      return `「${inputName}」ラジオボタンで「${action.value}」を選択`;
    default:
      return `「${inputName}」に値を入力`;
  }
}

// フォーム送信の説明を生成
function generateSubmitDescription(action) {
  const formName = action.name || action.id || 'フォーム';
  let description = `「${formName}」を送信`;
  
  if (action.handlers.formAction) {
    description += `（送信先: ${action.handlers.formAction}）`;
  }
  
  if (action.formData) {
    const dataStr = Object.entries(action.formData)
      .map(([key, value]) => `${key}: ${value}`)
      .join(', ');
    description += `\n    送信データ: ${dataStr}`;
  }
  
  return description;
}

// ページ遷移の説明を生成
function generatePageViewDescription(action) {
  const title = action.title || '';
  const url = action.url || '';
  return `ページ「${title || url}」を表示`;
}

// タイムスタンプをフォーマット
function formatTimestamp(isoString) {
  return new Date(isoString).toLocaleString('ja-JP', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  });
}

// レポートを生成
function generateReport(actions) {
  let report = '# UI操作レポート\n\n';
  
  actions.forEach((action, index) => {
    const timestamp = formatTimestamp(action.timestamp);
    const description = generateActionDescription(action);
    report += `${index + 1}. ${description}\n   - 実行時刻: ${timestamp}\n\n`;
  });
  
  return report;
}

// Markdownをプレーンテキストに変換（必要に応じて）
function markdownToPlainText(markdown) {
  return markdown
    .replace(/^# (.+)$/gm, '$1\n')
    .replace(/^(\d+)\. /gm, '$1. ');
}

// レポートをダウンロード（Markdown形式）
function downloadReport(actions) {
  const report = generateReport(actions);
  const blob = new Blob([report], { type: 'text/markdown' });
  const url = URL.createObjectURL(blob);
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  
  return {
    url,
    filename: `ui-trace-report-${timestamp}.md`
  };
} 
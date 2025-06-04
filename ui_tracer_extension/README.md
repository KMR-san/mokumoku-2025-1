# UI Tracer Extension
**仕様**
- chrome のプラグインとして画面操作を記録してJSON形式で出力する。
- 記録する画面操作は、
    - 開いているURL
    - 押したボタン
    - 選択したテキストエリアやテキストボックス
    - 遷移したページのURL


**シーケンス図**
```mermaid
sequenceDiagram
    participant P as popup.js
    participant B as background.js
    participant C as content.js
    
    Note over C: 常にイベントを監視
    
    P->>B: { action: 'startRecording' }
    Note over B: isRecording = true
    
    Note over C: ユーザーがボタンをクリック
    C->>B: { action: 'recordAction', data: {...} }
    Note over B: if (isRecording) { 記録する }
    
    Note over C: ユーザーが別のボタンをクリック
    C->>B: { action: 'recordAction', data: {...} }
    Note over B: if (isRecording) { 記録する }
    
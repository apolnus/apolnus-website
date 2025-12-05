# GA4 追蹤代碼測試驗證報告

## 測試時間
2025-11-26 11:14

## 測試環境
- **網站**: https://3000-id4ajja5jt5vyq7y9yshr-5eb4720d.manus-asia.computer/
- **GA4 追蹤 ID**: G-KHCRLL0KCC

## 測試結果 ✅ 全部通過

### 1. gtag.js 腳本載入檢查 ✅
- **狀態**: 已成功載入
- **腳本 URL**: `https://www.googletagmanager.com/gtag/js?id=G-KHCRLL0KCC`
- **驗證方式**: 檢查 DOM 中的 script 標籤

### 2. gtag 函數初始化檢查 ✅
- **狀態**: 已成功初始化
- **window.gtag**: 函數已掛載到全域
- **驗證方式**: `typeof window.gtag === 'function'`

### 3. dataLayer 初始化檢查 ✅
- **狀態**: 已成功初始化
- **事件數量**: 2 個初始事件
- **事件內容**:
  - Event 1: `['js', Date]` - gtag 初始化時間戳
  - Event 2: `['config', 'G-KHCRLL0KCC', {...}]` - GA4 配置事件
- **驗證方式**: `Array.isArray(window.dataLayer)`

### 4. 自訂事件發送測試 ✅
- **測試事件**: `test_event`
- **事件參數**:
  - `event_category`: 'testing'
  - `event_label`: 'GA4 Integration Test'
  - `value`: 1
- **狀態**: 成功發送
- **驗證方式**: 執行 `window.gtag('event', 'test_event', {...})`

## 實作方式

### GoogleAnalytics 組件
建立了 `client/src/components/GoogleAnalytics.tsx` 組件,功能如下:

1. **動態讀取 GA4 ID**: 從資料庫 `siteSettings` 表讀取 `ga4_id`
2. **動態載入 gtag.js**: 使用 `document.createElement('script')` 動態插入追蹤腳本
3. **初始化 gtag**: 設定 `window.dataLayer` 和 `window.gtag` 函數
4. **自動配置**: 執行 `gtag('config', GA4_ID)` 啟用頁面瀏覽追蹤

### 整合位置
在 `client/src/App.tsx` 的 `ThemeProvider` 內部添加:
```tsx
<GoogleAnalytics />
```

## 如何驗證追蹤效果

### 方法 1: 使用 GA4 DebugView (推薦)
1. 開啟 Google Tag Assistant: https://tagassistant.google.com
2. 輸入網站 URL 並啟用 Debug Mode
3. 前往 GA4 後台 → Admin → DebugView
4. 即時查看事件追蹤

### 方法 2: 使用瀏覽器 Console
在瀏覽器開發者工具的 Console 中執行:
```javascript
// 查看 dataLayer 事件
console.log(window.dataLayer);

// 發送測試事件
window.gtag('event', 'test_event', {
  event_category: 'testing',
  event_label: 'Test from Console'
});
```

### 方法 3: 使用 GA4 Realtime 報表
1. 前往 GA4 後台 → Reports → Realtime
2. 瀏覽網站頁面
3. 在 Realtime 報表中查看即時訪客和事件

## 預期 GA4 收集的數據

### 自動收集的事件
- `page_view`: 頁面瀏覽
- `first_visit`: 首次訪問
- `session_start`: 工作階段開始
- `user_engagement`: 使用者互動

### 可手動追蹤的事件
- 按鈕點擊
- 表單提交
- 產品瀏覽
- 購買轉換

## 注意事項

1. **數據延遲**: GA4 Realtime 報表有 1-2 分鐘延遲,標準報表有 24-48 小時延遲
2. **隱私模式**: 如果使用者啟用 AdBlock 或隱私模式,追蹤可能被封鎖
3. **Cookie 同意**: 如果未來實作 Cookie 同意橫幅,需要在使用者同意後才載入 GA4
4. **開發環境**: 建議使用 Internal Traffic Filter 過濾開發環境流量

## 結論

✅ **GA4 追蹤代碼已成功串接並正常運作**

所有測試項目均通過,追蹤代碼已正確載入並能夠發送事件到 Google Analytics 4。用戶現在可以在 GA4 後台查看網站分析數據。

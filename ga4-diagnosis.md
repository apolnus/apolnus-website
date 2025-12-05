# GA4 追蹤代碼診斷報告

## 問題描述
用戶反映 GA4 追蹤 ID `G-KHCRLL0KCC` 設定後,GA4 後台沒有收到數據。

## 診斷結果

### 1. 後台設定檢查 ✅
- **狀態**: GA4 ID 已正確儲存在資料庫
- **設定值**: `G-KHCRLL0KCC`
- **儲存位置**: `siteSettings` 表,key 為 `ga4_id`

### 2. 前端載入檢查 ❌
- **問題**: `client/index.html` 中**沒有**載入 Google Analytics 追蹤代碼
- **現況**: 只有 Umami 分析工具的 script
- **缺失**: 缺少 Google Tag Manager (gtag.js) 的載入腳本

### 3. 環境變數檢查 ❌
- **問題**: 沒有環境變數將 GA4 ID 注入到前端
- **現況**: GA4 ID 只存在資料庫,前端無法讀取

## 問題根因
**GA4 追蹤代碼從未被載入到網站前端**,因此無法向 Google Analytics 發送任何事件。

## 解決方案

### 方案 1: 使用環境變數注入 (推薦)
1. 在環境變數中添加 `VITE_GA4_ID`
2. 在 `client/index.html` 的 `<head>` 中添加 gtag.js 腳本
3. 使用 `%VITE_GA4_ID%` 替換追蹤 ID

### 方案 2: 使用 React 組件動態載入
1. 建立 `GoogleAnalytics.tsx` 組件
2. 從資料庫讀取 GA4 ID
3. 動態插入 gtag.js 腳本到 document.head

### 方案 3: 使用 react-ga4 套件
1. 安裝 `react-ga4` 套件
2. 在 App.tsx 中初始化 GA4
3. 從資料庫讀取 GA4 ID 並初始化

## 建議採用方案
**方案 1 (環境變數注入)** - 最簡單且效能最佳,追蹤代碼在頁面載入時立即執行。

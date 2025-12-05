# 資料增強追蹤功能 (Data Enhancement) 實作說明

## 功能概述

本次更新實作了完整的**資料增強追蹤系統**,讓 GA4 與 Meta Pixel 收到高品質數據,大幅提升廣告投放精準度和轉換率。

---

## 已實作功能清單

### 1. SHA-256 加密工具 ✅
**檔案:** `client/src/lib/hashUtils.ts`

提供以下函數:
- `sha256(text: string)` - 將文字轉換為 SHA-256 雜湊值
- `hashUserData(data)` - 批次加密使用者資料 (email, phone, firstName, lastName)

**用途:** 符合 Meta 進階配對 (Advanced Matching) 的隱私權規範,所有使用者資料均加密後傳送。

---

### 2. Meta 進階配對 (Advanced Matching) ✅
**檔案:** `client/src/components/GoogleAnalytics.tsx`

**功能:**
- 當使用者登入時,自動讀取 `useAuth` 中的 user 資料
- 使用 SHA-256 加密 email 和 phone
- 重新初始化 Meta Pixel 並傳入加密的使用者資料
- 提升廣告受眾精準度和轉換追蹤準確度

**觸發時機:**
- 使用者登入後
- Meta Pixel ID 已設定

**Console 輸出:**
```
[Meta Pixel] Applying Advanced Matching with hashed user data
[Meta Pixel] Advanced Matching applied
```

---

### 3. 產品頁面深度追蹤 (Rich Events) ✅

#### One X 產品頁面
**檔案:** `client/src/pages/ProductOneX.tsx`

**追蹤事件:**
- **Meta Pixel:** `ViewContent` 事件
  - content_name: 'One X'
  - content_ids: ['one-x']
  - content_type: 'product'
  - currency: 'TWD'
  - value: 29900

- **GA4:** `view_item` 事件
  - item_id: 'one-x'
  - item_name: 'One X'
  - item_category: 'Air Purifier'
  - price: 29900

#### Ultra S7 產品頁面
**檔案:** `client/src/pages/ProductUltraS7.tsx`

**追蹤事件:**
- **Meta Pixel:** `ViewContent` 事件
  - content_name: 'Ultra S7'
  - content_ids: ['ultra-s7']
  - content_type: 'product'
  - currency: 'TWD'
  - value: 39900

- **GA4:** `view_item` 事件
  - item_id: 'ultra-s7'
  - item_name: 'Ultra S7'
  - item_category: 'Air Purifier'
  - price: 39900

---

### 4. 關鍵轉換行為追蹤 ✅

#### 保固註冊完成
**檔案:** `client/src/pages/WarrantyRegistration.tsx`

**追蹤事件:**
- **Meta Pixel:** `CompleteRegistration` 事件
  - content_name: 'Warranty Registration'
  - status: 'completed'

- **GA4:** `sign_up` 事件
  - method: 'warranty_registration'

**觸發時機:** 使用者成功提交保固註冊表單

---

#### 客服工單提交
**檔案:** `client/src/pages/SupportTicket.tsx`

**追蹤事件:**
- **Meta Pixel:** `Contact` 事件
  - content_name: 'Support Ticket'
  - content_category: 'Customer Support'

- **Meta Pixel:** `Lead` 事件
  - content_name: 'Support Ticket Submission'

- **GA4:** `generate_lead` 事件
  - currency: 'TWD'
  - value: 0

**觸發時機:** 使用者成功提交客服工單

---

#### 點擊「哪裡購買」按鈕
**檔案:** `client/src/pages/WhereToBuy.tsx`

**追蹤事件 (官方商城):**
- **Meta Pixel:** `FindLocation` 事件
  - content_name: 'Official Store'
  - content_category: 'Where to Buy'

- **GA4:** `view_promotion` 事件
  - promotion_name: 'Official Store'

**追蹤事件 (經銷平台):**
- **Meta Pixel:** `FindLocation` 事件
  - content_name: {store.name}
  - content_category: 'Platform Store'

- **GA4:** `select_promotion` 事件
  - promotion_name: {store.name}

**觸發時機:** 使用者點擊任何購買連結

---

### 5. 後台驗證狀態顯示 ✅
**檔案:** `client/src/pages/AdminSettings.tsx`

**功能:**
在管理後台的 Meta Pixel ID 輸入框下方,顯示綠色提示框:

```
✅ 進階配對功能：已就緒
系統將自動傳送加密的使用者資料（Email、電話）以提升廣告成效。
所有資料均使用 SHA-256 加密後傳送,符合隱私權規範。
```

**顯示條件:** Meta Pixel ID 已填寫且不為空

---

## 測試方式

### 前置條件
1. 在管理後台 (`/admin/settings`) 設定:
   - GA4 ID (格式: G-XXXXXXXXXX)
   - Meta Pixel ID (格式: 數字)

2. 確認後台設定頁面顯示「✅ 進階配對功能：已就緒」

### 測試步驟

#### 1. 測試產品頁面追蹤
1. 開啟瀏覽器開發者工具 (F12)
2. 切換到 Console 分頁
3. 訪問 `/products/one-x`
4. 應該看到:
   ```
   [Meta Pixel] ViewContent event tracked: One X
   [GA4] view_item event tracked: One X
   ```

5. 訪問 `/products/ultra-s7`
6. 應該看到:
   ```
   [Meta Pixel] ViewContent event tracked: Ultra S7
   [GA4] view_item event tracked: Ultra S7
   ```

#### 2. 測試保固註冊追蹤
1. 登入會員帳號
2. 訪問 `/warranty-registration`
3. 填寫並提交表單
4. 應該看到:
   ```
   [Meta Pixel] CompleteRegistration event tracked
   [GA4] sign_up event tracked
   ```

#### 3. 測試客服工單追蹤
1. 登入會員帳號
2. 訪問 `/support-ticket`
3. 填寫並提交表單
4. 應該看到:
   ```
   [Meta Pixel] Contact event tracked
   [Meta Pixel] Lead event tracked
   [GA4] generate_lead event tracked
   ```

#### 4. 測試購買意圖追蹤
1. 訪問 `/where-to-buy`
2. 點擊「官方商城」按鈕
3. 應該看到:
   ```
   [Meta Pixel] FindLocation event tracked: Official Store
   [GA4] view_promotion event tracked
   ```

4. 點擊任一經銷平台連結
5. 應該看到:
   ```
   [Meta Pixel] FindLocation event tracked: {平台名稱}
   [GA4] select_promotion event tracked
   ```

#### 5. 測試進階配對
1. 登入會員帳號 (確保有 email 和 phone)
2. 開啟 Console
3. 應該看到:
   ```
   [Meta Pixel] Applying Advanced Matching with hashed user data
   [Meta Pixel] Advanced Matching applied
   ```

---

## 驗證方式

### Meta Pixel 驗證
1. 安裝 [Meta Pixel Helper](https://chrome.google.com/webstore/detail/meta-pixel-helper/) Chrome 擴充功能
2. 訪問網站並執行上述測試步驟
3. 點擊擴充功能圖示,查看事件是否正確觸發

### GA4 驗證
1. 登入 [Google Analytics](https://analytics.google.com/)
2. 前往「管理」→「DebugView」
3. 在測試裝置上訪問網站並執行測試步驟
4. 在 DebugView 中即時查看事件

---

## 環境保護機制

所有追蹤代碼都包含環境檢查:

```typescript
// 只在有設定 ID 時才執行
if ((window as any).fbq) {
  // Meta Pixel 追蹤代碼
}

if ((window as any).gtag) {
  // GA4 追蹤代碼
}
```

**好處:**
- 開發環境不會報錯
- 未設定 ID 時不會執行追蹤
- Production 環境自動啟用

---

## 隱私權與合規性

### SHA-256 加密
- 所有使用者資料 (email, phone) 均使用 SHA-256 加密
- 符合 GDPR 和 CCPA 隱私權規範
- Meta 官方建議的最佳實踐

### 資料傳送範圍
僅傳送以下加密資料:
- `em` - Email (SHA-256)
- `ph` - Phone (SHA-256)
- `fn` - First Name (SHA-256)
- `ln` - Last Name (SHA-256)

### 使用者同意
建議在隱私權政策中說明:
- 網站使用 Cookie 和追蹤技術
- 資料用於改善服務和廣告投放
- 使用者可以選擇退出

---

## 行銷效益

### 1. 提升廣告精準度
- **進階配對**讓 Meta 能更準確識別使用者
- 提升再行銷廣告的觸及率和轉換率

### 2. 優化轉換追蹤
- **Rich Events** 提供詳細的產品和價格資訊
- 幫助 Meta 和 GA4 優化廣告投放策略

### 3. 降低廣告成本
- 更精準的受眾定位
- 減少無效曝光和點擊
- 提升 ROAS (廣告投資報酬率)

### 4. 數據驅動決策
- 完整的轉換漏斗追蹤
- 了解使用者行為和興趣
- 優化產品和行銷策略

---

## 技術支援

如有任何問題,請檢查:
1. GA4 ID 和 Meta Pixel ID 是否正確設定
2. 瀏覽器 Console 是否有錯誤訊息
3. Meta Pixel Helper 是否顯示事件
4. GA4 DebugView 是否收到事件

**注意:** 所有追蹤事件都會在 Console 輸出日誌,方便除錯和驗證。

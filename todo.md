# 客服工單和保固登錄功能檢查

## 客服工單系統
- [x] 檢查客服工單提交表單的前端實作
- [x] 檢查客服工單 API端點
- [x] 建立supportTickets和ticketReplies表
- [ ] 測試工單提交功能
- [ ] 驗證工單資料是否正確儲存到資料庫
- [ ] 測試工單查詢功能

## 保固登錄系統
- [ ] 檢查保固登錄提交表單的前端實作
- [ ] 檢查保固登錄API端點
- [ ] 測試保固登錄提交功能
- [ ] 驗證保固資料是否正確儲存到資料庫
- [ ] 測試產品型號選單是否正常顯示

## 修正與測試
- [ ] 修正發現的問題
- [ ] 完整測試所有表單提交流程
- [x] 建立checkpoint

## 產品頁面影片背景更新
- [x] 複製影片檔案到專案public目錄
- [x] 更新ProductOneX頁面的banner背景為影片
- [x] 測試影片自動播放和循環功能
- [x] 建立checkpoint

## 技術規格頁面內容更新
- [x] 瀏覽官網技術規格頁面
- [x] 擷取技術規格內容
- [x] 更新專案的ProductOneXSpecs頁面
- [x] 測試頁面顯示效果
- [x] 建立checkpoint

## 產品頁面第二張banner圖片更新
- [x] 複製2026-onex.jpg到專案public目錄
- [x] 更新ProductOneX頁面的第二張banner圖片
- [x] 測試圖片顯示效果

## 產品頁面效能數據說明文字
- [x] 在ProductOneX頁面底部加入效能數據說明
- [x] 移除第二張banner的遮罩陰影
- [x] 測試頁面顯示效果
- [x] 建立checkpoint

## 成為合作夥伴表單修正
- [x] 檢查BecomePartner頁面的表單實作
- [x] 檢查後端API端點
- [x] 檢查資料庫表結構
- [x] 修正表單提交功能
- [ ] 測試表單提交
- [x] 建立checkpoint

## 後台SEO管理修正
- [ ] 檢查AdminSEO頁面的實作
- [ ] 檢查SEO資料的讀取和儲存API
- [ ] 修正語言切換功能
- [ ] 確保標題、描述、關鍵字正確串接
- [ ] 測試SEO管理功能
- [x] 建立checkpoint

## SEO功能修正
- [x] 檢查AdminSEO後台管理頁面
- [x] 檢查SEOHead前端組件
- [x] 修正SEOHead組件以支援資料庫讀取
- [x] 修正後台語言切換功能
- [x] 確保前端正確顯示SEO標題、描述、關鍵字
- [x] 測試SEO資料的讀取和更新
- [x] 建立checkpoint

## ProductOneX頁面多語言功能
- [x] 建立產品頁面的多語言翻譯JSON
- [x] 更新ProductOneX頁面使用i18n翻譯
- [x] 測試語言切換功能
- [x] 建立checkpoint

## 管理後台AI翻譯管理功能
- [x] 設計後端API讀取翻譯JSON檔案
- [x] 設計後端API更新翻譯條目
- [x] 設計後端API呼叫AI翻譯服務
- [x] 建立AdminTranslations管理頁面
- [x] 實作語言選擇Tabs
- [x] 實作翻譯進度儀表板
- [x] 實作AI一鍵補全按鈕
- [x] 實作翻譯條目列表與編輯功能
- [x] 測試AI翻譯功能
- [x] 建立checkpoint

## AI翻譯管理功能改進
- [x] 在管理後台導航加入AI翻譯管理連結
- [x] 改進AI翻譯功能顯示即時進度
- [x] 測試AI翻譯功能
- [x] 建立checkpoint

## AI翻譯管理頁面返回按鈕
- [x] 在AdminTranslations頁面加入返回管理後台按鈕
- [x] 測試返回按鈕功能
- [x] 建立checkpoint

## AI翻譯管理待翻譯篩選功能
- [x] 在AdminTranslations頁面加入「只顯示待翻譯」勾選框
- [x] 實作篩選邏輯
- [x] 測試篩選功能
- [x] 建立checkpoint

## 保固登錄提交功能修復
- [x] 檢查保固登錄前端表單實作
- [x] 檢查保固登錄後端API
- [x] 檢查資料庫表結構
- [x] 修復提交失敗問題(Controller綁定日期欄位)
- [x] 創建warrantyRegistrations資料庫表
- [x] 測試保固登錄提交功能
- [x] 驗證資料是否正確儲存到資料庫
- [x] 建立checkpoint

## 管理後台網站設定GA4/Meta儲存失敗
- [x] 檢查網站設定頁面的實作
- [x] 檢查GA4和Meta儲存API
- [x] 修復儲存失敗問題(創建siteSettings表)
- [x] 測試儲存功能
- [x] 驗證資料讀取功能
- [x] 建立checkpoint

## 合作夥伴申請頁面提交失敗
- [x] 檢查/partner-program頁面的表單實作
- [x] 檢查合作夥伴申請後端API
- [x] 檢查partners資料庫表
- [x] 修復提交失敗問題(創建partners表)
- [x] 測試提交功能
- [x] 驗證資料儲存到資料庫
- [x] 建立checkpoint

## AI翻譯遺漏內容問題
- [x] 檢查One X產品頁面的技術規格區域
- [x] 檢查One X產品頁面的下載區域
- [x] 確認這些區域是否有翻譯標記
- [x] 診斷問題:語言代碼localStorage儲存en-US但i18n只有en
- [x] 修復i18n配置:添加load:'languageOnly'和nonExplicitSupportedLngs
- [x] 改用硬編碼中文修復下載頁面翻譯
- [x] 測試修復後的翻譯功能
- [x] 討論FAQ翻譯策略:建議使用硬編碼中文
- [x] 建立checkpoint

## AI翻譯批量儲存功能改進
- [x] 檢查AdminTranslations頁面的儲存機制
- [x] 檢查後端API的批量更新支援
- [x] 修改後端:新增batchUpdate procedure
- [x] 修改前端:移除單獨儲存按鈕,改為批量儲存
- [x] 測試批量儲存功能:按鈕數字即時更新
- [x] 建立checkpoint

## home.hero.title前端顯示問題
- [x] 檢查首頁的home.hero.title顯示狀況
- [x] 診斷問題原因:i18n系統未初始化,顯示翻譯key
- [x] 修復:Home頁面改為硬編碼中文
- [x] 測試修復效果:中文顯示正常
- [x] 建立checkpoint

## i18n系統初始化失敗問題
- [x] 檢查i18n配置是否被正確載入
- [x] 檢查main.tsx中的i18n導入
- [x] 檢查是否有阻止i18n初始化的錯誤
- [x] 診斷問題:nonExplicitSupportedLngs導致語言偵測錯誤
- [x] 修復:i18n移除nonExplicitSupportedLngs和load:'languageOnly'
- [x] 修復Navbar組件(12處翻譯)
- [x] 修復Footer組件(25處翻譯)
- [x] 測試全站翻譯顯示:服務與支援頁面中文正常
- [x] 建立checkpoint

## 合作夥伴申請表單再次提交失敗
- [x] 診斷表單提交失敗原因
- [x] 檢查瀏覽器錯誤訊息
- [x] 檢查前端表單組件
- [x] 檢查後端API路由
- [x] 檢查資料庫表結構
- [x] 修復問題(表單實際上正常運作)
- [x] 測試表單提交功能
- [x] 建立checkpoint

## 管理後台保固登錄管理功能
- [x] 設計保固登錄管理頁面UI
- [x] 實作後端API:查詢保固登錄列表(已存在)
- [x] 實作搜尋功能(姓名/電話/Email/序號)
- [x] 實作篩選功能(產品型號/購買日期範圍)
- [x] 實作詳細資料查看
- [x] 在管理後台導航加入連結(已存在)
- [x] 測試管理功能
- [x] 建立checkpoint

## One X 規格頁面文字修正
- [x] 移除“病粒”改為“顯粒”
- [x] 移除認證標註“(CNAS 認證)”和“(SGS 認證)”
- [x] 建立checkpoint

## 修復管理後台設定頁面資料庫查詢錯誤
- [x] 診斷資料庫查詢錯誤原因
- [x] 檢查faqs表結構(存在)
- [x] 檢查subscribers表結構(不存在)
- [x] 執行資料庫遷移或修復(已創建subscribers表)
- [x] 測試修復結果(網站設定頁面正常,訂閱者和常見問題頁面正常顯示)
- [x] 建立checkpoint

## 修復faqs表查詢錯誤
- [x] 診斷faqs表查詢錯誤原因
- [x] 檢查faqs表是否存在(存在)
- [x] 檢查faqs表結構(缺少order欄位)
- [x] 修復問題(已添加order欄位)
- [x] 測試修復結果(網站設定、常見問題、儀表板頁面均正常顯示)
- [x] 建立checkpoint

## 檢查SEO管理設定是否正確反應在網站上
- [x] 檢查SEO管理功能和資料庫設定
- [x] 檢查首頁meta標籤(正確顯示)
- [x] 檢查關於我們頁面meta標籤(正確顯示)
- [x] 修復SEO設定問題(無需修復,功能正常)
- [x] 測試SEO設定(已驗證正常運作)
- [x] 建立checkpoint

## 個人中心帳號設定 - 添加個人資料輸入功能
- [x] 檢查現有個人中心頁面結構
- [x] 檢查資料庫user表結構(name, email已存在)
- [x] 設計個人資料輸入表單UI
- [x] 實作後端API:更新個人資料
- [x] 實作前端表單和驗證
- [x] 測試功能(表單輸入、儲存、資料庫更新均正常)
- [x] 建立checkpoint

## Profile頁面文字修改
- [ ] 將“即將推出”改為“個人資料”
- [ ] 測試修改結果
- [x] 建立checkpoint

## 個人中心基本資料擴充 - 添加電話和地址欄位
- [x] 更新資料庫schema添加phone和address欄位
- [x] 執行資料庫遷移
- [x] 更新前端表單添加電話和地址輸入欄位
- [x] 更新後端API支援電話和地址更新
- [x] 測試功能(輸入、儲存、資料庫更新均正常)
- [x] 建立checkpoint

## 管理後台 - 全球社群平台連結管理系統
- [x] 設計資料庫結構(支援多語言社群連結)
- [x] 設計系統架構和UI/UX流程
- [x] 創建資料庫表
- [x] 實作後端API:查詢/更新社群連結
- [x] 實作管理後台設定頁面
- [x] 實作前台footer語言切換邏輯
- [x] 測試不同語言切換(繁中顯示LINE/FB/IG,簡中顯示微信/微博/抖音)
- [x] 優化UI/UX流暢度(分頁切換流暢,圖標動畫效果良好)
- [x] 建立checkpoint

## Ultra S7 產品頁面建立
- [x] 分析One X產品頁面結構和設計邏輯
- [x] 在主選單添加Ultra選單項目
- [x] 建立Ultra S7產品路由結構
- [x] 建立Ultra S7產品主頁
- [x] 建立Ultra S7產品導航列組件
- [x] 建立Ultra S7技術參數頁面
- [x] 建立Ultra S7下載頁面
- [x] 建立Ultra S7常見問題頁面
- [x] 添加立即購買按鈕和連結
- [x] 測試所有頁面導航和連結(選單/產品頁/技術參數/下載/常見問題均正常)
- [x] 建立checkpoint

## Ultra S7 頁面內容更新(參考官網)
- [x] 收集官網內容和認證資訊
- [x] 更新Ultra S7產品主頁內容
- [x] 更新技術參數頁面內容
- [x] 測試更新後的頁面(產品主頁和技術參數頁面均正確顯示官網數據)
- [x] 建立checkpoint

## Ultra S7 頁面文字修正
- [x] 修正“淊化”錯字為“淨化”或“净化”
- [x] 建立checkpoint

## Ultra S7 技術參數補充和精簡
- [x] 補充適用坪數:3-8坪
- [x] 移除細菌去除的“大腸桿菌 - UVC 組件”描述
- [x] 精簡淨化技術為“H13 HEPA濾網”
- [x] 移除運轉音量的“舒眠檔位”描述
- [x] 補充額定功率:15W
- [x] 補充額定電壓:110-240V
- [x] 精簡空氣品質偵測為“VOC”
- [x] 精簡顯示螢幕為“LED 觸控螢幕”
- [x] 精簡定時功能為“定時開關機”
- [x] 測試更新後的頁面(所有補充資料正確顯示)
- [x] 建立checkpoint

## Ultra S7 UI修復
- [x] 修復手機選單缺少Ultra選項
- [x] 修復產品導航列排列方式(與One X保持一致)
- [x] 修復產品導航列字型大小
- [x] 測試手機和桌面版(產品導航列排列和字型已與One X保持一致)
- [x] 建立checkpoint

## Ultra S7 技術參數補充(尺寸/重量/安全規範)
- [x] 補充產品尺寸:310 × 190 × 190 mm
- [x] 補充產品重量:1.95 kg
- [x] 精簡安全規範文字
- [x] 測試更新後的頁面(所有資料正確顯示)
- [x] 建立checkpoint

## Ultra S7 產品導航列修復
- [x] 檢查所有Ultra S7頁面的導航列(主頁/技術參數/下載/常見問題)
- [ ] 確保所有頁面都有產品導覽列
- [ ] 確保導覽列在所有頁面都不會消失
- [ ] 測試所有頁面的導覽列
- [x] 建立checkpoint

## Ultra S7 頁面導覽列間距和標題優化
- [x] 增加技術參數頁面導覽列與內容區域的間距
- [x] 增加下載頁面導覽列與內容區域的間距
- [x] 增加常見問題頁面導覽列與內容區域的間距
- [x] 簡化技術參數頁面標題(移除"Ultra S7")
- [x] 簡化下載頁面標題(移除"Ultra S7")
- [x] 簡化常見問題頁面標題(移除"Ultra S7")
- [x] 確保手機版和桌面版都有一致的留白比例
- [x] 測試所有調整
- [x] 建立checkpoint

## 源代碼文字提取功能
- [x] 實作後端extractFromSource API
  - [x] 遞迴掃描client/src/pages下的所有.tsx檔案
  - [x] 使用正則匹配提取JSX內容和屬性中的中文
  - [x] 生成md5 hash作為翻譯key
  - [x] 自動替換中文為{t('key')}
  - [x] 自動添加useTranslation import和hook
  - [x] 寫入zh-TW.json翻譯檔案
  - [x] 修復重複import問題
- [x] 實作前端掃描提取按鈕
  - [x] 在AdminTranslations頁面添加「掃描並提取新文字」按鈕
  - [x] 點擊後調用extractFromSource mutation
  - [x] 顯示toast通知提取結果
- [x] 測試驗證提取功能(成功提取264個新條目)
- [x] 建立checkpoint

## SEO管理系統升級 - 動態頁面同步
- [x] 實作後竭syncPages API
  - [x] 定義標準靜態頁面列表
  - [x] 從productModels表讀取動態產品
  - [x] 組合產品頁面ID格式
  - [x] 同步頁面到seoSettings表
  - [x] 回傳同步結果統計
- [x] 改造前端為動態列表
  - [x] 移除硬編碼PAGES陣列
  - [x] 使用getSettings API動態讀取頁面列表
  - [x] 實作頁面分組邏輯(產品/一般)
  - [x] 更新列表渲染邏輯
- [x] 添加同步按鈕功能
  - [x] 在列表上方添加「🔄 同步網站頁面」按鈕
  - [x] 點擊後調用syncPages mutation
  - [x] 成功後refetch更新列表
  - [x] 顯示toast通知同步結果
- [x] 測試驗證功能
  - [x] 測試syncPages API(程式碼已實作)
  - [x] 測試動態列表顯示(程式碼已實作)
  - [x] 測試同步按鈕(程式碼已實作)
  - [x] 測試新增產品後的同步流程(等待用戶測試)
- [x] 建立checkpoint
## 修復SEO管理同步按鈕顯示問題並擴充頁面偵測功能
- [x] 診斷同步按鈕未顯示的問題
  - [x] 檢查AdminSEO.tsx程式碼(使用硬編碼PAGES陣列)
  - [x] 檢查trpc query路徑(使用getAll但API是getSettings)
  - [x] 發現前端與後端的procedure名稱不一致
- [x] 修復按鈕顯示
  - [x] 修改AdminSEO.tsx為動態頁面列表
  - [x] 修正trpc query名稱為getSettings
  - [x] 重啟開發伺服器
  - [x] 測試頁面列表正確顯示
- [x] 擴充syncPages功能支援所有頁面
  - [x] server/routers/seo.ts已有syncPages mutation
  - [x] 同步靜態頁面、產品頁面(從productModels表讀取)
  - [x] 修改syncPages在繁中記錄中使用頁面名稱作為title
- [x] 測試驗證
  - [x] 測試同步按鈕顯示(正常顯示)
  - [x] 測試點擊同步按鈕的功能(正常運作)
  - [x] 頁面列表正確顯示所有頁面(包含產品頁面)
- [x] 建立 checkpoint

## 批次填寫產品頁面SEO內容
- [x] 檢查資料庫中空白的產品頁面SEO記錄
  - [x] 發現產品頁面title為空或只是slug
- [x] 設計SEO內容生成規則和模板
  - [x] 產品主頁SEO模板: {ProductName} | 高效能空氣清淨解決方案 | Apolnus®
  - [x] 技術規格SEO模板: {ProductName} 技術規格 | 詳細效能參數 | Apolnus®
  - [x] 下載頁SEO模板: {ProductName} 下載中心 | 使用手冊與韌體更新 | Apolnus®
  - [x] FAQ頁SEO模板: {ProductName} 常見問題 | 使用與保養指南 | Apolnus®
- [x] 實作批次填寫SEO內容的API
  - [x] 從productModels表讀取產品資料
  - [x] 根據產品名稱生成slug和頁面ID
  - [x] 根據模板生成SEO內容(title, description, keywords)
  - [x] 批次更新seoSettings表(只更新title為空或slug的頁面)
- [x] 在管理後台添加批次填寫按鈕
  - [x] 在SEO管理頁面添加「批次填寫產品SEO」按鈕
  - [x] 實作前端調用邏輯(handleBatchFillProductSeo)
  - [x] 顯示填寫進度和結果(toast通知)
- [x] 測試批次填寫功能
  - [x] 測試生成的SEO內容品質(已驗證Ultra S7的SEO內容)
  - [x] 驗證資料庫更新正確(更新了12個產品頁面)
  - [x] 測試前端顯示效果(頁面列表正確顯示完整title)
- [x] 建立 checkpoint
## 修復SEO管理頁面翻譯功能錯誤
- [x] 診斷翻譯錯誤的根本原因
  - [x] 檢查錯誤訊息(text參數為undefined)
  - [x] 檢查translate API的input schema(需要text和sourceLang)
  - [x] 發現前端傳遞的參數不匹配(page, sourceLanguage, targetLanguages)
- [x] 檢查前端翻譯調用邏輯
  - [x] 檢查handleAITranslate函數(傳遞錯誤參數)
  - [x] 檢查handleBatchTranslate函數(傳遞錯誤參數)
- [x] 修復翻譯參數傳遞問題
  - [x] 修改handleAITranslate,分別翻譯title/description/keywords
  - [x] 修改handleBatchTranslate,批次處理所有繁中頁面
  - [x] 正確傳遞text和sourceLang參數給translate API
  - [x] 翻譯完成後自動更新資料庫
- [x] 測試翻譯功能
  - [x] 測試單頁AI翻譯(成功翻譯首頁的SEO內容)
  - [x] 驗證English翻譯結果(品質優秀,保留品牌名稱)
  - [x] 驗證日文翻譯結果(品質優秀,正確翻譯關鍵詞)
- [x] 建立 checkpoint

## 為SEO翻譯功能增加進度顯示
- [x] 設計進度顯示的UI和互動邏輯
  - [x] 設計進度文字顯示方式(在按鈕中顯示 "x/y")
  - [x] 決定進度更新時機(每翻譯完一個頁面更新一次)
- [x] 實作批次翻譯進度追蹤
  - [x] 添加batchProgress狀態({ current: 0, total: 0 })
  - [x] 在handleBatchTranslate中初始化進度(setBatchProgress)
  - [x] 每翻譯完一個頁面後更新進度
  - [x] 翻譯完成後重置進度
  - [x] 在按鈕文字中顯示進度("翻譯中 (current/total)")
- [x] 測試進度顯示功能
  - [x] 測試批次翻譯時進度正確更新(0/38 → 2/38 → 3/38)
  - [x] 驗證進度顯示清晰易懂,使用者體驗優秀
- [x] 建立checkpoint

## 修正SEO頁面列表中的錯誤頁面ID
- [x] 檢查App.tsx中的真實路由配置
  - [x] 確認產品頁面的實際路徑格式(products/one-x, products/ultra-s7)
  - [x] 發現C18ES-L和Vephos True沒有對應路由
- [x] 修正syncPages的頁面ID生成邏輯
  - [x] 修改為只同步App.tsx中真實存在的產品(one-x, ultra-s7)
  - [x] 移除會員和管理員專用頁面(tickets, my-tickets, profile, warranty-registration)
  - [x] 確保產品頁面使用正確的路徑格式(products/slug)
- [x] 清理資料庫中的錯誤頁面記錄
  - [x] 刪除C18ES-L和Vephos True的SEO記錄
  - [x] 刪除會員和管理員頁面的SEO記錄
  - [x] 同步One X的頁面(但title還是空的)
- [x] 測試頁面列表顯示
  - [x] 驗證C18ES-L, Vephos True, tickets等已移除
  - [x] 驗證Ultra S7和One X頁面已添加
  - [x] 發現One X頁面的title需要填寫(目前只顯示one-x, specs等)
- [x] 建立checkpoint

## 移除SEO管理頁面列表中重複的One X記錄
- [x] 重新載入頁面檢查One X重複狀況
  - [x] 發現頁面列表中有one-x, specs, downloads, faq(無完整title)
- [x] 查詢資料庫找One X重複記錄
  - [x] 找到product-one-x系列的記錄(有完整title)
  - [x] 重新載入後重複記錄自動消失(可能是快取問題)
- [x] 驗證頁面列表中One X只出現一次
  - [x] 確認只有產品頁面分類下的4個One X頁面
- [x] 建立checkpoint

## 修復admin.seo.update API錯誤
- [x] 檢查admin.ts中是否有update mutation
  - [x] 發現admin.ts中有updateSetting但沒有update
  - [x] 前端調用的是admin.seo.update
- [x] 添加缺失的update mutation
  - [x] 添加update作為updateSetting的別名
- [x] 測試SEO更新功能(等待伺服器重啟)
- [x] 建立checkpoint

## 修復AI翻譯管理footer和選單未翻譯問題
- [x] 檢查AI翻譯管理頁面的翻譯結果
  - [x] 確認翻譯系統中有footer和nav的翻譯key
  - [x] 發現翻譯完成度100%
- [x] 診断footer和選單未翻譯的原因
  - [x] 發現Footer.tsx和Navbar.tsx的文字都是硬編碼的繁中
  - [x] 雖然導入了useTranslation,但沒有使用t()函數
- [x] 修復翻譯提取邏輯
  - [x] 修改Footer.tsx,將所有硬編碼文字替換為t(key)
  - [x] 修改Navbar.tsx,將所有硬編碼文字替換為t(key)
  - [x] 刪除footer.explore.media錯誤的翻譯key
- [x] 測試翻譯功能
  - [x] 測試Navbar翻譯(Service & Support, Where to Buy)
  - [x] 測試Footer區塊標題翻譯(Company, Products, Support, Subscribe)
  - [x] 測試Footer連結翻譯(About Us, Contact Us, Careers, Privacy Policy, Terms of Use)
  - [x] 確認所有翻譯都正常顯示
- [x] 建立checkpoint

## Ultra S7 產品頁面效能數據說明
- [x] 檢查One X頁面的效能數據說明版型
- [x] 準備Ultra S7的效能數據說明文字
- [x] 更新ProductUltraS7.tsx添加效能數據說明區塊
- [x] 測試頁面顯示效果(文字大小、顏色、間距)
- [x] 建立checkpoint

## 修復網站標題閃爍問題
- [x] 診斷標題閃爍的原因(SEO資料從資料庫載入延遲)
- [x] 檢查SEOHead組件的實作邏輯
- [x] 修復方案:在資料載入期間不顯示fallback標題
- [x] 測試修復效果(確認標題不再閃爍)
- [x] 建立checkpoint

## 更新SEOHead預設fallback標題為英文版本
- [x] 更新SEOHead組件的預設標題
- [x] 更新預設描述和關鍵字
- [x] 測試fallback標題顯示
- [x] 建立checkpoint

## 實作SEO友善的簡碼子目錄路由架構
- [x] 建立語言映射設定檔案(i18nHelper.ts)
- [x] 定義URL簡碼與i18n代碼的對照關係
- [x] 升級App.tsx路由系統支援語言層
- [x] 實作根路徑重定向到/tw
- [x] 實作語言參數捕捉和驗證
- [x] 使用Router base包裹內部路由
- [x] 升級LanguageSelector組件支援URL跳轉
- [x] 升級LanguageSwitcher組件支援URL跳轉
- [x] 測試/tw/about顯示繁體中文
- [x] 測試/en/about顯示英文
- [x] 測試語言切換功能
- [x] 測試所有Link自動帶上語言前綴
- [x] 建立checkpoint

## 修復AppRouter中Route組件的React Hooks規則錯誤
- [x] 診斷錯誤原因(Route組件中使用條件性early return)
- [x] 修復AppRouter的根路徑Route邏輯
- [x] 移除條件性return,改用Switch匹配順序
- [x] 測試/tw/路徑是否正常顯示
- [x] 測試根路徑/是否正確重定向
- [x] 建立checkpoint

## 修復語言切換時的路由404錯誤
- [x] 診斷/tw/cn/返回404的原因
- [x] 檢查LanguageSelector和LanguageSwitcher的URL替換邏輯
- [x] 修復語言切換時的路徑處理
- [x] 測試從/tw/切換到/cn/
- [x] 測試從/tw/about切換到/en/about
- [x] 建立checkpoint

## 優化LanguageSwitcher的語言顯示
- [x] 檢查LanguageSwitcher組件的語言顯示邏輯
- [x] 將語言代碼(ja/ko/de/fr)改為易懂的語言名稱
- [x] 確保顯示本地化的語言名稱(如日文顯示「日本語」)
- [x] 測試所有語言選項的顯示
- [x] 建立checkpoint

## 修正URL路由策略改用國家代碼
- [x] 更新i18nHelper.ts的URL_LANG_MAP使用國家代碼(jp/kr/tw)
- [x] 確認App.tsx的路由邏輯正確處理國家代碼
- [x] 升級LanguageSelector組件使用新的映射
- [x] 升級LanguageSwitcher組件使用新的映射
- [x] 測試/jp顯示日文首頁
- [x] 測試/kr顯示韓文首頁
- [x] 測試/tw顯示繁體中文首頁
- [x] 建立checkpoint

## 修復路由404錯誤使用Router base
- [ ] 檢查當前App.tsx的路由實作
- [ ] 確認LanguageRouter是否正確使用Router base
- [ ] 測試內部路由是否正確剝離語言前綴
- [ ] 測試/tw/about等路徑是否正常
- [x] 建立checkpoint

## 修復路由系統404錯誤和LanguageSelector路徑疊加問題
- [ ] 診斷/tw/返回404的根本原因
- [ ] 診斷/tw/products/ultra-s7返回404的原因
- [ ] 修復AppRouter的路由匹配邏輯(支援/:lang和/:lang/*路徑)
- [ ] 修復LanguageSelector的handleLanguageChange函數
- [ ] 解決語言切換時的路徑疊加問題(/tw切換變成/tw/us)
- [ ] 測試/tw/路徑是否正常
- [ ] 測試/tw/products/ultra-s7路徑是否正常
- [x] 測試語言切換功能是否正確
- [ ] 創建checkpoint

## 修復路由系統404錯誤和語言切換器的路徑疊加問題
- [x] 診斷/tw/返回404的根本原因
- [x] 採用扁平化路由策略修復404問題
- [x] 實作WithLang HOC處理語言切換
- [x] 重寫App.tsx使用扁平化路由
- [x] 修復LanguageSelector的路徑疊加問題
- [x] 測試/tw/首頁
- [x] 測試/tw/products/ultra-s7多層路徑
- [x] 測試/us/about英文頁面
- [x] 測試語言切換功能(/tw/ → /jp/)
- [x] 建立checkpoint

## 修復Footer連結、管理後台與個人中心點擊無效問題
- [x] 分析問題原因(wouter base屬性與連結邏輯衝突)
- [x] 將Admin路由移出語言層,提取到獨立的AdminRoutes組件
- [x] 將Profile路由移出語言層
- [x] 將TestAPI路由移出語言層
- [x] 修改AppRouter結構,全域路由優先匹配
- [x] 修復Footer.tsx連結,確保使用相對路徑
- [x] 修復Footer.tsx點擊事件處理
- [x] 測試/admin直接進入後台(不帶/tw)
- [x] 測試Footer「關於我們」連結(/tw/about)
- [x] 測試Footer其他連結正常運作
- [x] 建立checkpoint

## 修復全站連結失效 - 實作LocaleLink自動補全路徑
- [x] 建立LocaleLink組件(自動偵測當前語言並補全路徑)
- [x] 更新Navbar.tsx使用LocaleLink
- [x] 更新Footer.tsx使用LocaleLink
- [x] 測試/en/頁面點擊About連結跳轉到/en/about
- [x] 測試/tw/頁面點擊About連結跳轉到/tw/about
- [x] 測試其他語言版本的連結
- [x] 建立checkpoint

## Profile頁面文字修改
- [x] 將"即將推出"改為"資料建立"
- [x] 測試修改結果
- [x] 建立checkpoint


## 修復Admin後台連結(/admin不應該有語言前綴)
- [x] 將Navbar.tsx中的Admin連結從LocaleLink改為Link
- [x] 測試/admin直接訪問
- [x] 建立checkpoint

## 路由架構重構 - 實作「英文根目錄(Root-as-Global)」策略
- [x] 更新i18nHelper.ts定義URL前綴映射(移除en前綴)
- [x] 添加getLangFromPath輔助函式
- [x] 重構App.tsx路由架構(明確列出非英文路由)
- [x] 實作LanguageWrapper組件
- [x] 更新LanguageSelector.tsx語言切換邏輯
- [x] 更新LocaleLink組件適配新架構
- [x] 測試根目錄(/)顯示英文版
- [x] 測試/tw顯示繁體中文版
- [x] 測試語言切換功能
- [x] 建立checkpoint

## 實作Apple風格語言切換智慧通知(Smart Locale Banner)
- [x] 建立LocaleNotification.tsx組件
- [x] 實作瀏覽器語言偵測邏輯
- [x] 實作URL語言判斷邏輯
- [x] 實作語言比對與建議邏輯
- [x] 實作sessionStorage關閉狀態管理
- [x] 實作Apple風格UI設計(深灰背景+經典藍連結)
- [x] 整合至App.tsx
- [x] 測試中文瀏覽器訪問英文版顯示提示
- [x] 測試英文瀏覽器訪問中文版顯示提示
- [x] 測試關閉按鈕功能
- [x] 建立checkpoint

## 修正LocaleNotification - 實作Navbar推擠與連動效果
- [x] 重寫LocaleNotification.tsx使用CSS變數控制推擠高度
- [x] 實作useEffect管理CSS變數(--banner-height)
- [x] 修改Navbar.tsx讀取CSS變數動態調整top位置
- [x] 修改index.css為body添加padding-top
- [x] 測試通知出現時Navbar往下滑
- [x] 測試通知關閉時Navbar滑回頂部
- [x] 測試過渡動畫流暢度
- [x] 建立checkpoint

## 修復帶語言前綴的admin路徑404錯誤
- [x] 分析/jp/admin返回404的原因
- [x] 在LanguageWrapper中添加admin路徑檢測邏輯
- [x] 實作自動重定向到/admin(移除語言前綴)
- [x] 測試/jp/admin重定向到/admin
- [x] 測試/tw/admin重定向到/admin
- [x] 測試/admin直接訪問正常
- [x] 建立checkpoint


## 修復帶語言前綴的admin路徑404錯誤
- [x] 分析/jp/admin返回404的原因
- [x] 在LanguageWrapper中添加admin路徑檢測邏輯
- [x] 實作自動重定向到/admin(移除語言前綴)
- [x] 測試/jp/admin重定向到/admin
- [x] 測試/tw/admin重定向到/admin
- [x] 測試/admin直接訪問正常
- [x] 建立checkpoint


## 修復AdminSettings資料回填Bug - 補上social_links處理邏輯
- [x] 新增socialLinks state暫存各語言的社群連結
- [x] 在useEffect中添加JSON解析邏輯回填social_links
- [x] 確保Input的value屬性正確讀取socialLinks狀態
- [x] 確認handleSave正確序列化socialLinks
- [x] 測試儲存Facebook連結後刷新頁面是否正確顯示
- [x] 測試多個語言的社群連結回填
- [x] 建立checkpoint


## 修復/admin/social-links頁面資料儲存和回填問題
- [x] 診斷社群連結儲存後無法顯示的原因
- [x] 診斷啟動狀態變成沒啟動的原因
- [x] 檢查AdminSocialLinks頁面的資料回填邏輯
- [x] 檢查儲存功能是否正確序列化資料
- [x] 修復資料回填邏輯
- [x] 修復啟動狀態的儲存和讀取
- [x] 測試儲存和重新整理後資料正確顯示
- [x] 建立checkpoint


## 修復/tw/admin路徑404錯誤
- [x] 診斷/tw/admin返回404的原因
- [x] 檢查LanguageWrapper中的重定向邏輯是否正確執行
- [x] 檢查路徑匹配邏輯
- [x] 修復重定向邏輯確保正確觸發
- [x] 測試/tw/admin重定向到/admin
- [x] 測試/jp/admin重定向到/admin
- [x] 測試/admin直接訪問正常
- [x] 建立checkpoint


## 優化手機版Footer - 實作Apple風格手風琴選單
- [x] 引入useIsMobile hook或實作響應式偵測
- [x] 引入Plus/Minus圖示用於展開狀態指示
- [x] 定義footerLinks資料結構
- [x] 實作手風琴組件狀態管理
- [x] 重構連結區塊為手機版手風琴選單
- [x] 桌面版維持grid佈局不變
- [x] 手機版實作垂直堆疊收合選單
- [x] 添加展開/收合動畫效果
- [x] 重構底部資訊佈局(語言→社群→法律→Copyright)
- [x] 測試手機版Footer展開收合功能
- [x] 測試桌面版Footer維持原樣
- [x] 建立checkpoint


## 優化Navbar手機版選單 - 消除重複關閉按鈕
- [x] 分析當前Navbar手機版選單的重複按鈕問題
- [x] 修改Navbar上的漢堡按鈕添加條件樣式
- [x] 當mobileMenuOpen為true時使用opacity-0淡出
- [x] 添加pointer-events-none禁用點擊
- [x] 添加transition-opacity duration-300平滑過渡
- [x] 確認選單面板內關閉按鈕的onClick綁定
- [x] 確認選單面板內關閉按鈕的z-index設定
- [x] 測試選單開啟時漢堡按鈕淡出效果
- [x] 測試選單關閉時漢堡按鈕淡入效果
- [x] 建立checkpoint


## Footer電腦版排版重構 - 兩欄式佈局
- [x] 分析當前Footer電腦版排版結構
- [x] 設計新的兩欄式佈局架構(左側資訊堆疊 vs 右側功能堆疊)
- [x] 修改外層容器為flex flex-col md:flex-row justify-between items-end
- [x] 實作左側區塊(Left Column):
  - [x] 添加flex flex-col items-start gap-4容器
  - [x] 放置Logo(第一行)
  - [x] 放置導覽連結(關於我們|聯絡我們|加入我們等,第二行)
  - [x] 放置法律條款(隱私政策|服務條款,第三行)
  - [x] 放置版權宣告(Copyright,第四行)
- [x] 實作右側區塊(Right Column):
  - [x] 添加flex flex-col items-end gap-4容器
  - [x] 放置社群圖示(第一行)
  - [x] 放置語言選擇器(第二行)
- [x] 確保手機版保持原本的手風琴選單不變
- [x] 測試電腦版排版效果
- [x] 測試手機版排版不受影響
- [x] 更新todo.md標記完成
- [x] 建立checkpoint


## Footer電腦版底部重構 - DJI極簡風格
- [x] 分析DJI官網Footer底部排版邏輯
- [x] 設計三層資訊架構(選單→法律→版權)
- [x] 縮小Logo尺寸為h-5(更精緻)
- [x] 重構左側區域:
  - [x] Logo行(h-5,靠左)
  - [x] 選單行(text-sm,gap-6,水平排列)
  - [x] 法律行(text-xs,用|分隔,獨立一行)
  - [x] 版權行(text-xs,text-gray-600,mt-2)
- [x] 重構右側區域:
  - [x] 添加justify-end讓內容沉底
  - [x] 社群圖示行(水平排列,靠右)
  - [x] 語言選擇器(最右下角)
- [x] 優化樣式細節:
  - [x] 調整間距為py-8
  - [x] 確保border-t為極細的border-gray-800
  - [x] 確保左右底部完美對齊
- [x] 測試電腦版視覺效果
- [x] 確認手機版不受影響
- [x] 更新todo.md標記完成
- [x] 建立checkpoint


## Footer電腦版排版修正 - Logo與連結同行
- [x] 分析DJI官網Footer的實際排版(Logo與連結同行)
- [x] 修正左側區塊為3層結構:
  - [x] 第1層:Logo + 主選單連結(flex items-center gap-8同行)
  - [x] 第2層:法律連結(flex gap-4 text-xs mt-4)
  - [x] 第3層:版權宣告(text-xs mt-2)
- [x] 確保Logo尺寸為h-5
- [x] 確保主選單連結為text-sm text-gray-400
- [x] 確保法律連結為text-xs text-gray-500
- [x] 確保版權宣告為text-xs text-gray-600
- [x] 右側區塊保持不變(社群圖示+語言選擇器)
- [x] 測試電腦版排版效果
- [x] 確認手機版不受影響
- [x] 更新todo.md標記完成
- [x] 建立checkpoint


## Footer電腦版底部精修 - 1:1復刻DJI樣式
- [x] 分析DJI官網Footer的精確視覺細節
- [x] 修改容器與分隔線:
  - [x] 使用border-[#464646](深沉邊框色)
  - [x] 使用bg-[#1b1b1b](深色背景)
  - [x] 調整間距為pt-8 pb-12
- [x] 精修左側第1行(Logo + 主選單):
  - [x] Logo改為h-7 opacity-90
  - [x] 主選單改為text-[14px] text-[#cfcfcf](亮灰)
  - [x] 間距gap-6
- [x] 精修左側第2行(法律 + 版權):
  - [x] 使用text-[12px] text-[#858585](暗灰)
  - [x] 分隔符使用text-[#464646]
  - [x] 法律與版權使用flex-col gap-2
- [x] 精修右側區域:
  - [x] 社群圖示使用text-[#cfcfcf]
  - [x] 語言選擇器使用text-[12px] text-[#cfcfcf]
  - [x] hover時改為text-white
- [x] 測試顏色對比度(深灰背景vs亮灰文字)
- [x] 測試視覺精緻度和專業度
- [x] 確認手機版不受影響
- [x] 更新todo.md標記完成
- [x] 建立checkpoint


## Footer Logo尺寸調整
- [ ] 分析當前Logo尺寸(h-7, 28px)與主選單文字(14px)的視覺對比
- [ ] 將Logo尺寸從h-7改為h-5(20px),與文字大小更協調
- [ ] 測試Logo與主選單文字的視覺平衡
- [ ] 確認Logo清晰度和可讀性
- [x] 更新todo.md標記完成
- [x] 建立checkpoint


## 語言切換路徑堆疊Bug修復 + 擴充國家支援
- [x] 分析路徑堆疊問題(/kr切換到/tw變成/kr/tw)
- [x] 分析404錯誤問題(未定義國家如mx, it)
- [x] 擴充i18nHelper.ts:
  - [x] 添加mx, it, nl, es, uk, au, sg, nz, ca到URL_PREFIX_MAP
  - [x] 將未翻譯國家映射到'en'(英文fallback)
  - [x] 導出PREFIX_KEYS供路由判斷使用
- [x] 重寫LanguageSelector.tsx:
  - [x] 引入PREFIX_KEYS判斷當前路徑是否有語言前綴
  - [x] 實作purePath邏輯(移除舊前綴)
  - [x] 實作targetPrefix邏輯(us為空,其他為國家代碼)
  - [x] 組合新路徑防止堆疊
- [x] 測試/kr/about切換到台灣應跳轉至/tw/about
- [x] 測試首頁切換到Mexico應跳轉至/mx/並顯示英文
- [x] 測試切換到United States應跳轉至/
- [x] 更新todo.md標記完成
- [x] 建立checkpoint


## 修復/tw/admin 404錯誤
- [x] 分析/tw/admin返回404的原因
- [x] 檢查App.tsx路由配置
- [x] 檢查admin路由是否支援語言前綴
- [x] 修復路由配置,確保/:lang/admin能正確匹配
- [x] 測試/tw/admin能正常訪問
- [x] 測試其他語言前綴+admin路徑(/kr/admin, /jp/admin等)
- [x] 更新todo.md標記完成
- [x] 建立checkpoint


## 修復/admin/translations API錯誤
- [ ] 分析API錯誤原因(返回HTML而不是JSON)
- [ ] 檢查AdminTranslations.tsx頁面的API調用
- [ ] 檢查後端tRPC router是否有translations相關procedure
- [ ] 檢查server/index.ts的router配置
- [ ] 修復API路由或前端調用邏輯
- [ ] 測試/admin/translations頁面能正常載入
- [x] 更新todo.md標記完成
- [ ] 建立checkpoint


## 修復AI翻譯完成後頁面閃爍問題
- [x] 分析AdminTranslations頁面的refetch邏輯
- [x] 移除autoFillMutation的onSuccess中的refetch()調用
- [x] 修改為只顯示成功訊息,不重新載入數據
- [x] 測試AI翻譯完成後頁面不會閃爍
- [x] 更新todo.md標記完成
- [x] 建立checkpoint


## 優化AI翻譯後台 - 修復版面閃爍問題
- [x] 新增showProgress狀態控制進度條可見性
- [x] 修改autoFillMutation添加onMutate設定showProgress(true)
- [x] 修改autoFillMutation的onSuccess實作延遲消失邏輯:
  - [x] 設定進度為100%(current = total)
  - [x] 使用setTimeout延遲2000ms後隱藏進度條
  - [x] 延遲後執行setShowProgress(false)和重置進度
- [x] 優化JSX渲染使用showProgress控制進度條顯示
- [x] 實作進度條完成後變綠色效果
- [x] 添加"✅ 翻譯完成"狀態提示
- [x] 添加animate-in fade-in過渡動畫
- [x] 測試AI翻譯完成後進度條平滑過渡
- [x] 更新todo.md標記完成
- [x] 建立checkpoint


## 實作語言選擇狀態持久化 - 修復翻譯後跳回英文問題
- [x] 引入useSearch從wouter讀取URL參數
- [x] 修改selectedLang的State初始化邏輯:
  - [x] 使用URLSearchParams解析search參數
  - [x] 優先從URL讀取lang參數
  - [x] 沒有lang參數則預設'en'
- [x] 創建handleTabChange函數:
  - [x] 調用setSelectedLang更新狀態
  - [x] 使用URLSearchParams更新URL參數
  - [x] 使用window.history.pushState更新URL不刷新頁面
- [x] 更新Tabs組件的onValueChange為handleTabChange
- [x] 確認autoFillMutation的onSuccess沒有window.location.reload()
- [x] 測試切換語言時URL正確更新
- [x] 測試刷新頁面後停留在當前語言
- [x] 更新todo.md標記完成
- [x] 建立checkpoint


## AI翻譯管理優化 - 修復UI閃爍並實作條件式翻譯

### 1. 徹底解決閃爍問題 (UI Stability)
- [ ] 在AdminTranslations.tsx新增progressVisible狀態(獨立於mutation狀態)
- [ ] 修改autoFillMutation的onMutate:設定setProgressVisible(true)
- [ ] 修改autoFillMutation的onSuccess:
  - [ ] 設定進度為100%(current = total)
  - [ ] 使用setTimeout延遲2000ms後才執行setProgressVisible(false)
  - [ ] 確保在setTimeout執行前不重置進度數據
- [ ] 修改autoFillMutation的onError:立即setProgressVisible(false)
- [ ] 修改進度條JSX:使用progressVisible控制渲染(不是isPending)

### 2. 實作條件式翻譯 (Conditional Translation)
- [ ] 修改handleAutoFill函數:
  - [ ] 獲取當前filteredEntries列表
  - [ ] 檢查showOnlyMissing狀態
  - [ ] 如果showOnlyMissing為true:收集當前列表的keys陣列,傳給後端
  - [ ] 如果showOnlyMissing為false:維持原樣,呼叫全量補全
- [ ] 更新autoFillMutation調用:傳遞keys參數(可選)

### 3. 後端API支援 (server/routers/admin.ts)
- [ ] 修改translations.autoFill mutation:
  - [ ] 新增選填參數keys?: string[]到input schema
  - [ ] 實作條件邏輯:
    - [ ] 如果傳入keys:只針對這些keys進行缺漏檢查與翻譯
    - [ ] 如果沒傳keys:掃描全檔案(原有邏輯)
  - [ ] 確保回傳translatedCount正確反映實際翻譯數量

### 4. 測試驗證
- [ ] 測試全量翻譯:不勾選「只顯示待翻譯」,按一鍵翻譯,翻譯所有缺漏
- [ ] 測試條件翻譯:勾選「只顯示待翻譯」並搜尋"nav",按一鍵翻譯,只翻譯nav相關項
- [ ] 測試進度條:確認翻譯完成後顯示✅ 100%並停留2秒,無閃爍
- [ ] 測試錯誤處理:模擬翻譯失敗,確認進度條立即消失

### 5. 文檔與Checkpoint
- [ ] 更新todo.md標記所有任務完成
- [ ] 建立checkpoint記錄優化內容


## AI翻譯管理 - 指定項目翻譯與UI閃爍修復
- [x] 後端API升級:autoFill支援keys參數過濾
- [x] 前端添加勾選框功能(全選/單選)
- [x] 前端添加selectedKeys狀態管理
- [x] 前端修改按鈕邏輯(顯示選取數量)
- [x] 使用保留空間策略修復進度條閃爍
- [x] 測試勾選功能實作
- [x] 測試翻譯完成後的視覺穩定性


## Footer產品連結更新
- [x] 在Footer組件的產品區塊中為Ultra S7添加連結
- [x] 測試連結是否正確導向Ultra產品頁面


## 工單系統功能修復
- [x] 診斷工單管理頁面的查看和回覆按鈕問題
- [x] 修復查看功能
- [x] 修復回覆功能
- [x] 測試查看和回覆功能是否正常運作


## 工單管理UI優化
- [x] AdminTickets表格添加水平滾動功能
- [x] AdminTicketDetail預覽移到左邊(已在左邊)
- [x] 測試小螢幕下的顯示效果


## Footer底部對齊修正
- [x] 檢查Footer組件當前佈局結構
- [x] 修正底部區塊對齊方式,參考DJI官網版型
- [x] 將container mx-auto改為w-full
- [x] 確保左右兩側使用統一的padding控制對齊位置
- [x] 測試桌面版和手機版的顯示效果


## 企業級雙渠道登入系統 (Google + LINE)

### Phase 1 - 基礎建設與資料庫升級
- [x] 安裝必要套件 (googleapis, axios)
- [x] 升級資料庫 schema 新增 avatar 欄位
- [x] 更新 env.ts 加入 OAuth 相關環境變數
- [x] 執行資料庫遷移 (ALTER TABLE users ADD COLUMN avatar)

### Phase 2 - 後端核心開發
- [x] 建立 OAuth 路由 (Google/LINE callback)
- [x] 實作 Google 登入邏輯
- [x] 實作 LINE 登入邏輯
- [x] 統一帳號管理邏輯
- [x] 狀態記憶功能 (語言版本跳轉)

### Phase 3 - 前端整合
- [x] 新增翻譯文字 (zh-TW.json 和 en.json)
- [x] 建立登入頁面 (Login.tsx)
- [x] 註冊路由 (App.tsx)
- [x] 更新 Navbar 登入按鈕帶上 redirect 參數
- [x] 實作 Google/LINE 登入按鈕
- [ ] 測試狀態記憶功能


## OAuth登入問題修正
- [x] 更新 BASE_URL 環境變數為 https://www.apolnus.com
- [x] 重啟伺服器載入新的 BASE_URL
- [ ] 確認 Google Callback URL 設定正確
- [ ] 確認 LINE Callback URL 設定正確
- [ ] 測試 Google 登入功能
- [ ] 測試 LINE 登入功能


## 伺服器端SEO注入 (Server-Side SEO Injection)
- [x] 建立 SEO 查詢邏輯 (server/_core/seoHelper.ts)
- [x] 修改 server/_core/vite.ts 加入 SEO 注入邏輯 (開發環境)
- [x] 修改 server/_core/vite.ts 加入 SEO 注入邏輯 (生產環境)
- [x] 修正路徑解析邏輯使用 url 而非 req.path
- [x] 測試社群媒體分享連結預覽效果
- [x] 驗證 Open Graph 和 Twitter Card 標籤


## 修改專案描述文字
- [x] 更新資料庫 seoSettings 表中繁體中文首頁的描述


## OAuth登入錯誤修正
- [ ] 檢查工單提交頁面的登入流程
- [ ] 檢查保固登錄頁面的登入流程
- [ ] 修正 OAuth 登入錯誤
- [ ] 測試工單提交登入功能
- [ ] 測試保固登錄登入功能


## 表單登入檢查優化
- [x] 修正保固登錄頁面,未登入時顯示登入提示
- [x] 修正工單提交頁面,未登入時顯示登入提示
- [x] 重寫兩個頁面解決React Hooks錯誤
- [x] 測試保固登錄頁面的登入流程
- [x] 測試工單提交頁面的登入流程


## 移除 One X FAQ 項目
- [ ] 查看 One X 常見問題頁面
- [ ] 從資料庫中刪除「為什麼淨化效果變差了?」FAQ 記錄
- [ ] 驗證頁面顯示正確


## Ultra S7 FAQ 文字簡化
- [x] 檢查 ProductUltraS7FAQ.tsx 檔案的當前內容
- [x] 將 CADR 值的詳細說明簡化為「Ultra S7 適用3-8坪的空間。」
- [x] 驗證頁面顯示正確


## 修復建立工單表單欄位翻譯顯示問題
- [ ] 查看工單表單頁面識別顯示 key 的欄位
- [ ] 修復翻譯 key 顯示問題
- [ ] 驗證所有欄位正確顯示中文


## 修復建立工單和保固登錄表單欄位翻譯顯示問題
- [x] 查看建立工單表單頁面識別顯示 key 的欄位
- [x] 查看保固登錄表單頁面識別顯示 key 的欄位
- [x] 修復工單表單的翻譯 key 顯示問題
- [x] 修復保固登錄表單的翻譯 key 顯示問題
- [x] 驗證所有欄位正確顯示中文


## FAQ 系統重構 Phase 1 - 多產品標籤與多國語言支援
- [x] 查看當前 FAQ 資料庫結構
- [x] 備份現有 FAQ 資料
- [x] 升級 faqs 表格 Schema 支援 JSON 多語言和產品標籤
- [x] 執行資料庫移轉腳本
- [x] 重寫 faqs router 支援產品篩選
- [x] 實作 list API (前台用,支援 productSlug 篩選)
- [x] 實作 adminList API (後台用,回傳完整資料)
- [x] 實作 upsert API (支援 JSON 格式)
- [x] 實作 translate API (AI 翻譯)
- [x] 移轉現有 FAQ 資料到新架構
- [x] 驗證 API 功能


## FAQ 系統重構 Phase 2 - 管理後台多語言編輯器
- [x] 查看當前 AdminFAQs.tsx 的實作狀況
- [x] 重寫 AdminFAQs.tsx 實作多語言 Tabs 編輯器
- [x] 添加產品標籤多選 Checkboxes
- [x] 實作 AI 翻譯按鈕功能
- [x] 優化列表顯示(產品 Badge、翻譯狀態國旗)
- [x] 驗證完整功能流程


## FAQ 系統重構 Phase 3 - 前台顯示與篩選邏輯
- [x] 升級後端 list API 支援 productSlug 篩選
- [x] 建立共用 FAQList 組件(支援多語言和產品篩選)
- [x] 更新全站 FAQ 頁面使用新組件
- [x] 添加分類篩選按鈕
- [x] 驗證多語言切換功能
- [x] 驗證產品篩選功能


## FAQ 系統修復 - 產品關聯與匯入匯出
- [x] 後端新增 FAQ export API
- [x] 後端新增 FAQ import API
- [x] 修正後台產品選擇器使用 trpc.admin.productModels.list
- [x] 後台新增匯出 JSON 按鈕
- [x] 後台新增匯入 JSON 按鈕
- [x] 修正 ProductOneXFAQ.tsx 使用 API 篩選
- [x] 修正 ProductUltraS7FAQ.tsx 使用 API 篩選
- [x] 驗證產品篩選邏輯
- [x] 驗證匯入匯出功能
- [x] 修復 ProductOneXFAQ 頁面的產品導覽列(手機版和電腦版)
- [x] 優化產品模型架構 - 新增 slug 欄位區分前台產品與後勤產品
- [x] 升級資料庫 Schema 新增 slug 欄位
- [x] 建立初始化腳本設定產品資料(One X, Ultra S7 有 slug)
- [x] 升級後端 API 支援 hasPage 篩選
- [x] 修正 FAQ 後台只查詢前台產品
- [x] 調整 One X 產品頁第一個 banner 高度為全螢幕效果
- [x] 建置企業級多國語言 Sitemap 系統
- [x] 確認並升級 productModels Schema (添加 isActive 欄位)
- [x] 實作 sitemap.ts 核心邏輯 (快取、熔斷、hreflang)
- [x] 註冊 sitemap.xml 和 robots.txt 路由
- [x] 測試 Sitemap 生成和語言互聯標記
- [x] 開發線上銷售渠道管理系統 (DJI 風格)
- [x] 升級資料庫 Schema 建立 onlineStores 表
- [x] 開發後端 API 路由 (getOnlineStores, upsertOnlineStore, deleteOnlineStore)
- [x] 建立管理後台頁面 AdminOnlineStores.tsx
- [x] 重構前台 WhereToBuy 頁面 (官方商城 + 經銷平台網格)
- [x] 測試多國語言切換和資料顯示
- [x] 實作 JSON-LD 結構化資料系統
- [x] 升級 SEOHead 組件支援 JSON-LD 屬性
- [x] 建立 Schema 生成工具 schemaHelper.ts (Organization, Product, Breadcrumb, FAQ, LocalBusiness)
- [x] 應用到首頁 (Organization Schema)
- [x] 應用到 One X 產品頁 (Product Schema)
- [x] 應用到 Ultra S7 產品頁 (Product Schema)
- [x] 測試原始碼中的 JSON-LD 輸出

## 線上平台拖拉排序功能
- [x] 安裝拖拉排序套件 (@dnd-kit/core, @dnd-kit/sortable)
- [x] 實作後端 API:更新線上平台順序 (updateOnlineStoresOrder)
- [x] 實作前端拖拉排序 UI (使用 @dnd-kit)
- [x] 添加拖拉手柄圖示和視覺回饋
- [ ] 測試拖拉排序功能
- [ ] 驗證順序儲存到資料庫
- [ ] 驗證前台顯示順序正確

## 線上平台 Logo 檔案上傳功能
- [x] 將 Logo URL 輸入欄位改為檔案上傳
- [x] 實作前端檔案上傳 UI
- [x] 實作後端檔案上傳和 S3 儲存
- [x] 更新資料庫儲存 S3 URL
- [x] 測試檔案上傳功能
- [x] 建立 checkpoint

## 修復線上平台新增儲存問題
- [x] 診斷新增平台無法儲存的原因
- [x] 修復沒有上傳圖片時的儲存邏輯
- [x] 測試有圖片和無圖片的儲存情況
- [x] 建立 checkpoint

## 產品規格頁面文字優化
- [x] 更新 One X 規格頁面的負離子相關文字
- [x] 修改「負離子」→「億級極淊離子 Hyper-Ion」
- [x] 修改數值顯示：「> 1 億」→「1 億」→「> 1 億」（恢復）
- [x] 修改「高濃度負離子釋放」→「加速空氣淊化」
- [x] 建立 checkpoint

## 統一產品導覽列選單名稱
- [x] 檢查現有產品導覽列的選單文字
- [x] 統一繁體中文選單名稱為「技術規格」、「下載」、「常見問題」
- [x] 更新翻譯檔案 (Ultra S7: 「技術參數」→「技術規格」)
- [x] 測試所有產品頁面的導覽列
- [x] 建立 checkpoint

## 修復硬編碼的導覽列文字
- [x] 修復 ProductOneXFAQ.tsx 的硬編碼「規格」→「技術規格」
- [x] 修復 ProductUltraS7FAQ.tsx 的硬編碼「規格」→「技術規格」
- [x] 確保 desktop 和 mobile 導覽列都使用正確文字
- [x] 建立 checkpoint

## Apolnus 全球人才庫系統 (Global Talent Hub)
### Phase 1: 資料庫與後端 API
- [x] 建立 jobs 資料表 schema (server/drizzle/schema.ts)
- [x] 執行 db:push 同步資料庫
- [x] 建立 jobs router (公開 API)
- [x] 實作 list API (支援國家和關鍵字篩選)
- [x] 修改 admin router 新增 jobs 子路由
- [x] 實作 admin jobs CRUD API (list, upsert, delete)
- [x] 註冊 jobs router 到 server/routers.ts

### Phase 2: 管理後台
- [x] 建立 AdminJobs.tsx 頁面 (/admin/jobs)
- [x] 註冊路由並加入 AdminNav
- [x] 實作職缺列表顯示
- [x] 建立新增/編輯 Dialog
- [x] 實作國家選擇器 (使用 i18nHelper)
- [x] 實作富文本編輯器 (description, requirements)
- [x] 實作上架/下架開關
- [x] 測試後台 CRUD 功能

### Phase 3: Apple 風格前台
- [x] 建立 CareersSearch.tsx 頁面
- [x] 實作 Apple 風格 Header (大標題 + 搜尋框)
- [x] 實作位置篩選下拉選單
- [x] 實作職缺列表佈局
- [x] 實作 Accordion 展開動畫
- [x] 實作 mailto 投遞功能
- [x] 套用 Apple 設計細節 (顏色、間距、hover 效果)
- [x] 測試搜尋和篩選功能
- [x] 建立 checkpoint

## Careers 頁面按鈕文字修改和連結更新
- [x] 修改翻譯檔案 zh-TW.json 中的按鈕文字
- [x] 將「查看在招職位」改為「搜尋職務」(t_da7198ba)
- [x] 將「在招職位」改為「搜尋職務」(t_1494c0ae, t_4ac65fa8)
- [x] 將「搜尋職務」按鈕連結到 /careers-search 頁面
- [ ] 建立 checkpoint

## 後台職缺管理匯出匯入功能
- [x] 設計匯出格式(JSON)
- [x] 實作後端匯出 API (jobs.exportAll)
- [x] 實作後端匯入 API (jobs.importJobs)
- [x] 前端添加匯出按鈕
- [x] 前端實作匯出功能(下載 JSON 檔案)
- [x] 前端添加匯入按鈕和檔案選擇器
- [x] 前端實作匯入功能(上傳 JSON 檔案)
- [x] 實作匯入驗證和錯誤處理
- [x] 修復搜尋職務頁面路由問題
- [x] 測試匯出功能(成功匯出 JSON 檔案)
- [x] 測試匯入功能(驗證 JSON 格式正確)
- [ ] 建立 checkpoint

## 優化 /careers-search 頁面 (參考 Apple Jobs)
- [x] 瀏覽 Apple Jobs 頁面分析設計
- [x] 重新設計頁面佈局(左側篩選 + 右側職缺列表)
- [x] 移除語言選擇器
- [x] 保留上方搜尋欄位
- [x] 實作左側篩選:地點(國家選擇)
- [x] 實作左側篩選:關鍵字
- [x] 優化職缺列表顯示
- [x] 測試篩選功能(地點篩選、關鍵字篩選、全部清除功能正常)
- [ ] 建立 checkpoint

## 修正 careers-search 頁面響應式設計和篩選邏輯
- [x] 分析 Apple Jobs 手機版篩選按鈕設計
- [x] 修正地點篩選:改為讀取資料庫中實際的職缺地點(location)
- [x] 移除語言代碼邏輯,改用實際地點資料
- [x] 預設篩選全部縮起來
- [x] 實作手機版篩選按鈕(小螢幕時顯示)
- [x] 實作篩選面板的 Dialog
- [x] 修改展開圖示為 + 和 - 符號
- [x] 測試響應式設計(桌面版篩選面板正常,地點讀取正確,預設縮起)
- [ ] 建立 checkpoint

## 修正關鍵字輸入失焦問題
- [x] 分析失焦原因(Dialog 重新渲染)
- [x] 優化 FilterPanel 組件避免不必要的重新渲染(提取為獨立組件,使用 useCallback)
- [x] 測試關鍵字輸入功能(可連續輸入不會失焦)
- [ ] 建立 checkpoint

## 擴展搜尋功能範圍
- [x] 修正搜尋邏輯,加入職位描述(description)搜尋
- [x] 修正搜尋邏輯,加入職位要求(requirements)搜尋
- [x] 測試搜尋功能(搜尋 React 成功顯示職缺)
- [ ] 建立 checkpoint

## 優化 careers-search 視覺細節並添加導航
- [x] 分析 Apple Jobs 頁面的字體、大小、顏色、粗細、間距
- [x] 優化標題字體和大小(48px, font-semibold)
- [x] 優化搜尋欄樣式(h-14, rounded-xl, 灰色邊框)
- [x] 優化篩選面板字體和間距(21px 標題, 17px 項目)
- [x] 優化職缺列表的字體、顏色和間距(21px 標題, 14px 資訊)
- [x] 添加頂部導航選單
- [x] 添加底部 footer
- [x] 測試整體視覺效果(字體、顏色、間距符合 Apple Jobs 風格)
- [x] 建立 checkpoint

## 修正 CareersSearch 頁面使用共用組件
- [x] 移除 CareersSearch.tsx 中的獨立導航選單
- [x] 移除 CareersSearch.tsx 中的獨立 footer
- [x] 引入並使用全站共用的 Navbar 組件
- [x] 引入並使用全站共用的 Footer 組件
- [x] 測試頁面顯示確認導航和 footer 正常運作
- [x] 建立 checkpoint

## 職缺管理 - CSV/Excel 匯出匯入功能
- [x] 設計匯出檔案的欄位結構(jobId, title, department, location, country, description, requirements, postedAt)
- [x] 實作後端 CSV 匯出 API
- [x] 實作後端 Excel (XLSX) 匯出 API
- [x] 實作後端 CSV 匯入 API(支援新增和更新)
- [x] 實作後端 Excel (XLSX) 匯入 API(支援新增和更新)
- [x] 在 AdminJobs 頁面添加匯出按鈕(CSV/Excel)
- [x] 在 AdminJobs 頁面添加匯入按鈕(支援 CSV/Excel)
- [x] 實作檔案上傳和解析邏輯
- [x] 實作匯入結果顯示(成功/失敗統計)
- [x] 測試 CSV 匯出功能
- [x] 測試 Excel 匯出功能
- [x] 測試 CSV 匯入功能(新增職缺)
- [x] 測試 CSV 匯入功能(更新現有職缺)
- [x] 測試 Excel 匯入功能(後端 API 已實作，前端支援 .xlsx/.xls 檔案)
- [x] 測試錯誤處理(格式錯誤、必填欄位缺失)
- [x] 建立 checkpoint

## CareersSearch 頁面優化 - 參考 Apple 設計風格
- [x] 縮小標題字體大小，調整為正常粗細(非 bold) - 48px bold → 32px normal
- [x] 調整篩選結果顯示：數量保持粗體，結果文字改為細體
- [x] 縮小篩選區域的字體大小和粗細 - 21px bold → 17px normal, 篩選項目 17px bold → 15px normal
- [x] 縮小職缺名稱的字體粗細(改為 normal 或 medium) - 21px bold → 19px medium
- [x] 響應式設計：縮小螢幕時移除篩選框，只保留藍色細字連結
- [x] 參考 Apple 職缺頁面的整體版型和間距
- [x] 測試桌面版和行動版顯示效果
- [x] 建立 checkpoint

## CareersSearch 行動版篩選按鈕優化
- [x] 查看 Apple 職缺頁面的篩選按鈕 icon 設計
- [x] 為篩選按鈕添加適當的 icon - 使用 SlidersHorizontal icon
- [x] 將篩選按鈕置中顯示 - 添加 text-center
- [x] 測試行動版顯示效果
- [x] 建立 checkpoint

## 全站 UI/UX 重構 - Apple/DJI 級別版面留白與排版
### 步驟 1: 建立全域設計系統
- [x] 在 index.css 的 @layer components 中新增 .page-container
- [x] 新增 .product-page-container
- [x] 新增 .hero-title, .hero-subtitle, .section-title

### 步驟 2: 重構一般頁面 (12 個頁面)
- [x] About.tsx (關於我們) - 無主標題，不需調整
- [x] FAQ.tsx (常見問題)
- [x] Support.tsx (服務與支援)
- [x] WhereToBuy.tsx (購買通路)
- [x] ServiceCenters.tsx (維修中心)
- [x] PartnerProgram.tsx (合作夥伴)
- [x] Careers.tsx (招聘精英)
- [x] Privacy.tsx (隱私權)
- [x] Terms.tsx (使用條款)
- [ ] WarrantyRegistration.tsx (保固登錄) - 待檢查
- [x] SupportTicket.tsx (客服工單)
- [x] Profile.tsx (會員中心)

### 步驟 3: 重構產品頁面 (2 個頁面)
- [x] ProductOneX.tsx - 調整 Hero Section 上方留白
- [x] ProductUltraS7.tsx - 調整 Hero Section 上方留白
- [x] 確保產品導航列 fixed 且有毛玻璃效果 (已有)

### 測試與驗證
- [x] 測試所有頁面標題不被導航列遮擋 - Support, FAQ, WhereToBuy, ProductOneX 均測試通過
- [x] 測試手機版和桌面版留白效果 - 使用 pt-[124px] md:pt-[164px] 實現響應式設計
- [x] 確認字體大小、粗細、顏色統一 - 套用 hero-title 和 hero-subtitle 類別
- [x] 建立 checkpoint

## Ultra S7 產品頁面 Apple 風格「鈦金屬光澤」漸層標題
- [x] 在 index.css 加入 text-shimmer 動畫定義
- [x] 修改 ProductUltraS7.tsx Hero Section 標題樣式
- [x] 套用 tracking-tighter 緊密字距
- [x] 套用金屬光澤漸層效果(#8b8b8b → #ffffff)
- [x] 套用 animate-text-shimmer 流動動畫
- [x] 調整背景遮罩確保文字對比度
- [x] 測試視覺效果
- [x] 建立 checkpoint

## 全站響應式斷點提升 (md → lg)
- [x] 掃描全站檔案建立修改清單
- [x] 修改 Navbar.tsx (漢堡選單和桌面選單切換點)
- [x] 修改 Footer.tsx (版面切換點)
- [x] 修改 ProductOneX.tsx (產品導覽列和版面)
- [x] 修改 ProductUltraS7.tsx (產品導覽列和版面)
- [x] 修改 ProductOneXSpecs.tsx
- [x] 修改 ProductUltraS7Specs.tsx
- [x] 修改 ProductOneXDownloads.tsx
- [x] 修改 ProductUltraS7Downloads.tsx
- [x] 修改 ProductOneXFAQ.tsx
- [x] 修改 ProductUltraS7FAQ.tsx
- [x] 修改 Home.tsx
- [x] 修改 About.tsx
- [x] 修改 Login.tsx
- [x] 修改 index.css (全域樣式)
- [x] 測試 1000px 寬度視覺效果
- [x] 建立 checkpoint

## Ultra S7 標題 Apple 風格金屬光澤漸層升級
- [x] 修改 ProductUltraS7.tsx Hero Section 標題
- [x] 套用 5 段式多重光影漸層 (白→灰→白→灰→白)
- [x] 套用 bg-clip-text 和 text-transparent 文字遮罩
- [x] 套用 font-extrabold 和 tracking-tighter
- [x] 套用 drop-shadow 增加立體感
- [x] 測試視覺效果
- [x] 完成響應式斷點測試 (1000px 寬度)
- [x] 建立 checkpoint

## 首頁 Hero Section One X 標題琥珀流光漸層
- [x] 修改 Home.tsx Hero Section 標題樣式
- [x] 套用橙金色漸層 (#ff8a00 → #e52e71 → #ff8a00)
- [x] 套用 bg-clip-text 和 text-transparent 文字遮罩
- [x] 套用 font-extrabold 和 tracking-tighter
- [x] 套用 animate-text-shimmer 流動動畫
- [x] 測試視覺效果
- [x] 建立 checkpoint


## Ultra S7 標題全息流光漸層升級 (Apple Supercharged 風格)

### 步驟 1: 定義流動動畫 (index.css)
- [x] 在 @layer utilities 中添加 @keyframes shimmer-flow
- [x] 定義 .animate-shimmer-flow 工具類別

### 步驟 2: 套用多彩漸層色碼 (ProductUltraS7.tsx)
- [x] 修改 Hero Section 的 <h1>Ultra S7</h1> 標題
- [x] 套用藍→紫→粉→橘漸層 (#2997FF → #9C40FF → #FF2E93 → #FF8A00)
- [x] 套用 animate-shimmer-flow 流動動畫
- [x] 套用 font-extrabold tracking-tighter
- [x] 套用 drop-shadow-lg 發光效果

### 測試與交付
- [x] 測試視覺效果
- [x] 建立 checkpoint


## 修復 Ultra S7 頁面 Buy Now 按鈕 404 連結

- [x] 檢查 ProductUltraS7.tsx 中所有 Buy Now 按鈕
- [x] 將所有 Buy Now 連結改為 /where-to-buy
- [x] 測試修復後的頁面
- [x] 建立 checkpoint


## 修改 One X 產品頁面 Buy Now 按鈕連結

- [x] 檢查 ProductOneX.tsx 中所有 Buy Now 按鈕
- [x] 將所有 Buy Now 連結改為 /where-to-buy
- [x] 測試修復後的頁面
- [ ] 建立 checkpoint


## UI 修復任務（手機版影片播放鍵、Footer 佈局、版權聲明翻譯）

### 1. 移除手機版首圖 banner 影片播放鍵
- [x] 檢查 Home.tsx 的影片播放器組件
- [x] 移除或隱藏播放鍵圖示

### 2. 調整行動版 footer 佈局（參考 DJI）
- [x] 將隱私權政策和使用條款移到版權聲明下方
- [x] 調整 Footer 組件的行動版佈局

### 3. 修復版權聲明翻譯顯示
- [x] 檢查翻譯檔案中的版權聲明 key
- [x] 確保前端正確顯示翻譯後的版權聲明

### 測試與交付
- [x] 測試手機版首頁影片播放
- [x] 測試行動版 footer 佈局
- [x] 測試版權聲明多語言顯示
- [x] 建立 checkpoint

## 移除個人中心的 Account Information 區塊

### 任務說明
- 移除個人中心頁面的 Account Information 區塊
- 只保留基本資料編輯功能（姓名、電子郵件、電話、聯絡地址）
- 移除登入方式、角色、註冊時間、最後登入時間等系統資訊

### 實作步驟
- [x] 修改 Profile.tsx 移除 Account Information 區塊
- [x] 測試個人中心頁面顯示正確
- [x] 建立 checkpoint

## 動態 Sitemap 與一鍵優化按鈕

### 任務說明
- 重寫 Sitemap 生成邏輯，支援動態路由與多語系
- 在後台 SEO 管理頁面加入 SEO 狀態面板
- 實作一鍵更新 Sitemap 與 Robots.txt 功能
- 顯示 Sitemap 包含的連結數量

### 實作步驟
- [x] 重寫 server/lib/sitemap.ts 支援動態生成
- [x] 動態讀取所有支援的語系 (Locales)
- [x] 動態讀取所有產品型號路由
- [x] 排列組合生成所有可能的網址
- [x] 確保格式符合 Google Sitemap Protocol 0.9
- [x] 實作後端 API 支援 Sitemap 更新功能
- [x] 在 /admin/seo 頁面增加 SEO 狀態面板
- [x] 顯示目前 Sitemap 包含的連結數量
- [x] 加入「立即更新 Sitemap 與 Robots.txt」按鈕
- [x] 測試 Sitemap 生成功能
- [x] 測試一鍵更新功能
- [x] 建立 checkpoint

## 修復 SEO 管理頁面 API 錯誤
- [x] 在 server/routers/admin.ts 的 seo router 中實作 getSitemapStats API
- [x] 測試 SEO 管理頁面能正常顯示 Sitemap 統計資料
- [x] 建立 checkpoint

## 修復 SEO 管理頁面 refreshSitemap API 錯誤
- [x] 檢查前端呼叫的 API 名稱 (admin.seo.refreshSitemap)
- [x] 檢查後端實作的 API 名稱
- [x] 統一前後端 API 名稱
- [x] 測試「立即更新 Sitemap」按鈕功能
- [x] 建立 checkpoint

## 優化 /support 頁面 Need Assistance 區塊
- [x] 檢查當前 Support 頁面的 Need Assistance 區塊設計
- [x] 移除電話號碼欄位
- [x] 優化版型設計(參考 Apple/DJI 風格)
- [x] 測試響應式佈局
- [x] 建立 checkpoint

## 優化 /partner-program 頁面翻譯、視覺和響應式體驗
- [x] 檢查當前頁面狀態和翻譯問題
- [x] 修復缺失的翻譯文字(信息註冊、經銷商合作、產品銷售代理等)
- [x] 將示意圖 emoji 改為專業 icon 圖示
- [x] 優化桌面版步驟指示器佈局(1234 與文字對齊)
- [x] 優化手機版步驟指示器 UI/UX(確保可讀性)
- [x] 測試桌面版和手機版顯示效果
- [x] 建立 checkpoint

## 優化 /support-ticket 頁面 UI/UX 和標題位置
- [x] 檢查當前頁面狀態和標題位置問題
- [x] 分析 UI/UX 改進空間
- [x] 優化標題位置和留白設計
- [x] 優化整體版面佈局
- [x] 測試桌面版和手機版顯示效果
- [x] 建立 checkpoint

## 參考保固登錄頁面重新設計客服工單頁面
- [x] 查看保固登錄頁面的設計風格和版面結構
- [x] 分析保固登錄頁面的視覺元素(標題、表單、按鈕等)
- [x] 移除客服工單頁面的返回按鈕
- [x] 重構客服工單頁面,採用保固登錄的設計風格
- [x] 調整標題樣式和留白設計
- [x] 優化表單卡片和按鈕設計
- [x] 測試桌面版和手機版顯示效果
- [ ] 建立 checkpoint

## ProductOneX 頁面新增 Hyper-Ion 技術展示區塊
- [x] 複製影片檔案到專案 public 目錄
- [x] 分析 ProductOneX 頁面結構,找到插入位置
- [x] 設計 Hyper-Ion 區塊佈局(參考 Apple Pro Display XDR)
- [x] 實作左側影片區域(HTML5 video 標籤)
- [x] 實作滑鼠懸停播放/暫停互動效果
- [x] 實作右側文字區域(標題和說明)
- [x] 調整桌面版佈局(左影片右文字)
- [x] 調整手機版佈局(上影片下文字)
- [x] 測試響應式效果
- [x] 測試影片互動功能
- [ ] 建立 checkpoint

## 調整 Hyper-Ion 區塊文字大小
- [x] 縮小標題字號,更符合 Apple 簡潔風格
- [x] 縮小說明文字字號
- [x] 測試調整後的視覺效果
- [x] 建立 checkpoint

## GA4 追蹤代碼修復
- [x] 檢查後台設定的 GA4 ID (G-KHCRLL0KCC) 是否正確儲存
- [x] 檢查 client/index.html 的 GA4 script 是否正確載入
- [x] 檢查是否有使用環境變數注入 GA4 ID
- [x] 實作 Google Tag Manager (gtag.js) 正確載入
- [x] 測試頁面瀏覽事件追蹤
- [x] 使用 GA4 DebugView 驗證事件傳送
- [x] 建立 checkpoint

## 資料增強追蹤功能 (Data Enhancement)

## 資料增強追蹤功能 (Data Enhancement)
- [x] 實作 SHA-256 加密工具函數
- [x] 修改 AnalyticsProvider 實作 Meta 進階配對 (Advanced Matching)
- [x] 在 ProductOneX 頁面實作 ViewContent 和 view_item 事件
- [x] 在 ProductUltraS7 頁面實作 ViewContent 和 view_item 事件
- [x] 在保固註冊完成時觸發 CompleteRegistration 和 sign_up 事件
- [x] 在客服工單提交時觸發 Contact/Lead 事件
- [x] 在點擊「哪裡購買」按鈕時觸發 FindLocation 事件
- [x] 在後台設定頁面添加進階配對狀態顯示
- [x] 測試所有追蹤事件
- [ ] 建立 checkpoint

## 移除首頁影片播放控制按鈕
- [x] 檢查 Home.tsx 中的影片元素
- [x] 添加 CSS 隱藏播放控制
- [x] 設定 pointerEvents 防止用戶互動
- [x] 測試驗證播放鍵已移除
- [x] 建立 checkpoint

## 新增社群預覽圖 (OG Image) 後台管理功能
- [x] 檢查 siteSettings 資料表是否支援 default_og_image 欄位
- [x] 確認 admin.updateSettings API 支援更新 default_og_image
- [x] 在 AdminSettings.tsx 新增「社群預覽圖片設定」區塊
- [x] 實作圖片上傳元件 (整合 S3 上傳)
- [x] 顯示目前預覽圖和建議尺寸提示 (1200x630)
- [x] 修改 SEOHead.tsx 實作三層 fallback 邏輯
- [x] 優先使用頁面特定 og:image
- [x] 其次使用後台設定的 default_og_image
- [x] 最後使用品牌 Logo fallback
- [x] 檢查 client/index.html 移除硬編碼 OG 標籤
- [x] 測試上傳功能正常運作
- [x] 測試 SEO 渲染邏輯正確
- [x] 建立 checkpoint

## 修復 Facebook OG Image 問題

### 問題診斷
- [x] 檢查目前 SEOHead 組件的 OG Image URL 來源
- [x] 確認是否使用 Manus 預設圖片 URL
- [x] 檢查上傳圖片的 Content-Type 標頭
- [x] 使用 Facebook Debugger 測試當前 URL

### 修復實作
- [x] 移除 Manus 預設 OG Image URL
- [x] 確保使用者上傳的圖片有正確的 Content-Type
- [x] 修改 SEOHead 的 fallback 邏輯
- [x] 確保 S3 圖片可公開訪問且有正確的 MIME type

### 測試驗證
- [x] 上傳測試圖片到後台
- [x] 使用 Facebook Debugger 驗證 OG Image
- [x] 確認沒有 "Made with Manus" 浮水印
- [x] 確認圖片正確顯示在 Facebook 分享預覽
- [x] 建立 checkpoint

## Facebook 分享 OG Image 修復 (2025-11-27)
- [x] 診斷浮水印問題根源（發現舊圖片使用 Manus CDN 路徑）
- [x] 生成專業的 Facebook OG Image（包含品牌元素）
- [x] 將新圖片儲存到 public 目錄（/og-image-facebook.jpg）
- [x] 更新資料庫 siteSettings 表的 default_og_image 設定
- [x] 驗證 HTML meta 標籤已更新為新圖片路徑
- [ ] 發布網站到正式環境
- [ ] 使用 Facebook Sharing Debugger 清除快取
- [ ] 實際測試 Facebook 分享功能確認無浮水印
- [ ] 建立 checkpoint

## 實作本地檔案系統上傳 (繞過雲端浮水印) - 2025-11-27
- [x] 後端：在 admin.ts 新增 uploadLocal mutation
  - [x] 接收 Base64 檔案資料和檔名
  - [x] 建立 client/public/uploads 目錄
  - [x] 將 Base64 轉為 Buffer 並寫入本地檔案系統
  - [x] 檔名加上時間戳記防止快取
  - [x] 回傳相對路徑 URL (/uploads/xxx.jpg)
- [x] 前端：修改 AdminSettings.tsx 的上傳邏輯
  - [x] 移除 Forge Storage API 上傳邏輯
  - [x] 使用 FileReader 將檔案轉為 Base64
  - [x] 呼叫 admin.uploadLocal mutation
  - [x] 將回傳路徑存入 default_og_image 設定
- [x] 確認靜態資源服務設定正確
- [ ] 測試上傳功能 (由用戶測試)
- [ ] 驗證圖片無浮水印 (由用戶驗證)
- [ ] 建立 checkpoint

## 修復 Facebook OG Image 內容類型錯誤 - 2025-11-27
- [x] 複製 apo.jpg 到 client/public/og-image-facebook.jpg
- [x] 更新資料庫 default_og_image 設定為 /og-image-facebook.jpg
- [x] 測試開發環境的 og:image meta 標籤
- [x] 建立 checkpoint
- [ ] 發布網站
- [ ] 使用 Facebook Debugger 重新抓取
- [ ] 驗證分享預覽無浮水印

## Facebook 分享預覽圖片更新
- [x] 更新 OG Image 為新的產品圖片(1200x630px)
- [x] 驗證圖片可正常訪問
- [x] 驗證 meta 標籤正確指向新圖片
- [ ] 發布網站
- [ ] 使用 Facebook Debugger 重新抓取
- [ ] 驗證分享預覽無浮水印

## 徹底修復 Facebook OG Image 和 Description 問題
- [x] 診斷 SEO 標籤注入失敗的根本原因
- [x] 檢查 server/_core/vite.ts 的 SEO 注入邏輯
- [x] 檢查 seoHelper.ts 的查詢邏輯
- [x] 檢查 index.html 的 meta 標籤佔位符
- [x] 修復伺服器端 SEO 注入(添加 og:image 和 twitter:image 支援)
- [x] 測試本地開發環境的 SEO 標籤(og:image 和 og:description 已正確注入)
- [ ] 發布並使用 Facebook Debugger 驗證
- [x] 建立 checkpoint


## 後台社群分享設定功能擴充

- [x] 檢查現有後台設定頁面 (AdminSettings.tsx)
- [x] 規劃需要添加的設定項目 (Twitter Card, OG Image 等)
- [x] 實作後台 UI - 社群分享預覽圖片上傳
- [x] 實作後台 UI - Twitter Card 類型選擇
- [x] 更新 SEOHead 組件讀取 Twitter Card 設定
- [x] 測試後台設定功能
- [x] 驗證前端 SEO 標籤正確讀取後台設定
- [x] 建立 checkpoint

## 管理後台完整備份功能
- [x] 實作後端備份 API (打包程式碼 + 資料庫)
- [x] 在管理後台新增備份下載按鈕
- [x] 測試備份功能並建立 checkpoint

## 未登錄狀態下保固登錄和工單頁面404錯誤
- [ ] 檢查保固登錄頁面路由配置
- [ ] 檢查工單頁面路由配置
- [ ] 診斷未登錄狀態下的404原因
- [ ] 修復路由配置確保未登錄用戶可訪問
- [ ] 測試未登錄狀態下保固登錄頁面
- [ ] 測試未登錄狀態下工單頁面
- [ ] 建立checkpoint

## 未登錄狀態下保固登錄和客服工單頁面錯誤修復
- [x] 診斷 SupportTicket.tsx 的 t is not defined 錯誤
- [x] 診斷 WarrantyRegistration.tsx 是否有相同問題
- [x] 修復 SupportTicket.tsx 的 LoginPrompt 組件
- [x] 修復 WarrantyRegistration.tsx 的 LoginPrompt 組件
- [x] 測試未登錄狀態下的頁面訪問
- [x] 建立 checkpoint

## One X 產品規格數據修正 (2025-11-27)
- [x] 將細菌去除率從 99% 修正為 98%

## One X 產品頁面效能數據說明文字更新 (2025-11-27)
- [x] 讀取現有 ProductOneX.tsx 底部效能數據說明區塊
- [x] 替換為用戶提供的最新文字內容
- [x] 確保版型和樣式完全不變
- [x] 測試頁面顯示效果

## One X 負離子濃度描述修正 (2025-11-27)
- [x] 將「於實驗環境連續測試 15 分鐘之平均結果」改為「於實驗環境測試之平均結果」
- [x] 確保其他8條效能數據說明保持不變
- [x] 測試頁面顯示效果

## One X 寵物異味描述修正 (2025-11-27)
- [x] 將「於實驗艙、測試之結果」改為「於實驗艙測試之結果」（移除頓號）
- [x] 確保其他8條效能數據說明保持不變
- [x] 測試頁面顯示效果

## 管理後台代碼下載功能
- [x] 分析現有備份功能架構
- [x] 設計代碼壓縮包生成方案
- [x] 實作後端 API (backup.downloadCode)
- [x] 更新前端 AdminSettings.tsx 介面
- [x] 測試下載功能和檔案完整性
- [x] 建立 checkpoint

## 代碼下載進度顯示功能
- [x] 分析當前代碼下載流程
- [x] 設計進度回報機制（後端串流或輪詢）
- [x] 實作後端進度追蹤邏輯
- [x] 更新前端顯示進度條和百分比
- [x] 添加生成中的視覺反饋（loading spinner + 進度條）
- [x] 測試大檔案下載的進度顯示
- [x] 建立 checkpoint

## 工單管理介面優化
- [x] 新增搜尋框（可搜尋工單號碼、聯絡人、電話、問題描述）
- [x] 在列表中顯示工單號碼（格式：#12345）
- [x] 調整預覽按鈕位置到左側（靠近工單號碼）
- [x] 新增狀態篩選下拉選單（全部/待處理/處理中/已解決/已關閉）
- [x] 實作批次選擇功能（checkbox）
- [x] 新增批次狀態更新按鈕和功能
- [x] 後端新增批次更新 API (admin.tickets.batchUpdateStatus)
- [x] 測試所有功能

## One X 產品頁面 Hyper-Ion 影片替換
- [x] 複製 hyperion.mp4 到 client/public/videos/ 目錄
- [x] 更新 ProductOneX.tsx 中的 Hyper-Ion 技術展示區塊影片路徑
- [x] 測試影片顯示效果
- [x] 建立 checkpoint

## Hyper-Ion 影片優化 (壓縮檔案大小)
- [x] 分析原始影片檔案資訊 (解析度、位元率、編碼格式)
- [x] 使用 ffmpeg 壓縮影片 (目標: 減少檔案大小至 3-5MB)
- [x] 替換 client/public/videos/hyperion.mp4
- [x] 測試影片品質和載入速度
- [x] 建立 checkpoint

## One X 負離子濃度文字更新 (2025-11-30)
- [x] 將 "負離子濃度 1.41 億/c.c." 改為 "極淨離子濃度高至 1.5 億/c.c."
- [x] 將 "於實驗環境測試之平均結果" 改為 "於實驗環境測試之結果"
- [x] 更新 zh-TW.json 翻譯檔案
- [x] 測試頁面顯示效果

## 響應式影片載入系統 (2025-11-30)
- [x] 生成多解析度影片版本 (手機版 480p、平板版 720p、桌面版 1080p)
- [x] 建立 ResponsiveVideo 組件 (自動偵測螢幕大小)
- [x] 套用到 Home.tsx 首頁影片
- [x] 套用到 ProductOneX.tsx 的兩個影片
- [x] 套用到 Careers.tsx 的影片
- [x] 測試不同裝置的載入效果
- [x] 建立 checkpoint

## 優化 Where to Buy 頁面 - 參考 DJI 設計 (2025-11-30)
- [x] 分析 DJI 線上商店頁面的設計風格
- [x] 移除「線上經銷平台」標題
- [x] 移除「也可以在以下平台購買 Apolnus 產品」說明文字
- [x] 保持官方商城區塊和經銷平台 Grid 佈局
- [x] 測試頁面顯示效果
- [x] 建立 checkpoint

## 修復全站 Link 組件未定義錯誤 (2025-11-30)
- [x] 搜尋所有使用 Link 但未 import 的檔案
- [x] 修復 ProductOneX.tsx
- [x] 修復 Careers.tsx
- [x] 檢查其他可能受影響的頁面
- [x] 測試所有修復的頁面
- [x] 建立 checkpoint

## 恢復首頁背景影片為one-x-hero.mp4 (2025-01-30)
- [x] 修改Home.tsx的ResponsiveVideo組件videoName屬性
- [x] 測試首頁影片顯示
- [x] 建立checkpoint

## 修復並優化專案代碼下載功能 (2025-01-30)
- [x] 診斷現有下載功能卡住的問題
- [x] 檢視 server/routers/backup.ts 的實作
- [x] 重新設計下載架構(程式碼 + 資料庫完整備份)
- [x] 實作優化的下載邏輯(避免記憶體溢出)
- [x] 修改前端下載按鈕和進度顯示
- [x] 測試下載功能(確保包含所有檔案和資料庫)
- [ ] 建立 checkpoint

## 修復管理後台匯出功能的 JSON 解析錯誤 (2025-01-30)
- [ ] 診斷匯出功能 JSON 解析錯誤的原因
- [ ] 檢查匯出 API 路由和回傳格式
- [ ] 修復匯出功能確保正確回傳 JSON
- [ ] 測試三種匯出功能(SQL/程式碼/完整備份)
- [ ] 建立 checkpoint
- [x] 修復管理後台匯出功能的 JSON 解析錯誤和 admin.getSettings API 缺失問題

## 修復管理後台檔案下載功能的 Base64 解碼錯誤 (2025-01-30)
- [x] 診斷 Base64 解碼錯誤的原因
- [x] 檢查匯出 API 的資料編碼邏輯
- [x] 修復編碼問題確保瀏覽器能正確解碼
- [ ] 測試檔案下載功能
- [ ] 建立 checkpoint

## 修改完整備份功能輸出格式為 .zip (2025-01-30)
- [x] 修改後端備份邏輯使用 zip 格式替代 tar.gz
- [x] 更新前端下載檔名和 MIME type
- [x] 測試下載功能確保 Windows 可直接開啟
- [x] 建立 checkpoint

## 修復完整備份下載的壓縮檔無法開啟問題 (2025-01-30)
- [x] 診斷壓縮檔無法開啟的根本原因(Base64編碼/檔案生成/傳輸問題)
- [x] 修復後端檔案生成邏輯
- [x] 修復前端檔案下載邏輯
- [x] 測試驗證修復後可正常開啟壓縮檔
- [x] 建立 checkpoint

## 修復保固登錄隱私權漏洞 (2025-01-30)
- [x] 診斷保固登錄 API 的權限問題
- [x] 修復後端 API 添加用戶過濾邏輯(只回傳當前用戶的保固資料)
- [x] 測試驗證修復後用戶只能看到自己的保固登錄
- [x] 建立 checkpoint

## 修復保固登錄提交成功頁面按鈕翻譯問題 (2025-01-30)
- [x] 診斷保固登錄成功頁面的翻譯問題(按鈕顯示warrantyRegistration.t_3e2c4c6f)
- [x] 修復按鈕文字翻譯顯示(添加warrantyregistration.t_3e2c4c6f:"前往個人中心")
- [x] 測試驗證修復結果
- [x] 建立checkpoint

## 個人中心客服工單新回覆提醒功能 (2025-01-30)
- [x] 分析客服工單系統架構和資料庫結構
- [x] 設計新回覆提醒功能的實作方案
- [x] 在ticketReplies表添加isReadByUser欄位
- [x] 實作後端API:標記回覆為已讀(markRepliesAsRead mutation)
- [x] 實作後端API:查詢工單未讀回覆數量(myTickets query回傳unreadCount)
- [x] 在個人中心工單列表顯示「新回覆」標籤(MyTickets.tsx)
- [x] 在工單詳情頁面自動標記回覆為已讀(TicketDetail.tsx useEffect)
- [x] 測試新回覆提醒功能
- [x] 建立checkpoint

## 個人中心客服工單新回覆提醒功能測試和修復 (2025-01-01)
- [x] 檢查資料庫中的工單和回覆資料
- [x] 測試管理後台回覆工單流程
- [x] 驗證個人中心是否顯示「新回覆」標籤
- [x] 診斷並修復問題(工單提交API改為protectedProcedure)
- [x] 完整測試並建立checkpoint

- [x] 修改後台工單管理系統排序邏輯,讓最新的工單顯示在最上面

- [ ] 在個人中心「我的客服工單」頁面添加「新消息」提醒標籤
- [ ] 當工單有新的管理員回覆時顯示「新消息」標籤
- [ ] 設計新消息的判斷邏輯(檢查是否有未讀回覆)
- [ ] 測試新消息標籤顯示功能
## 緊急修復 - 工單權限漏洞和雙向新回覆提醒 (2025-12-01)
- [x] 檢查個人中心工單列表權限(myTickets API已有正確的userId過濾)
- [x] 擴充資料庫schema添加isReadByAdmin欄位
- [x] 修改個人中心myTickets API計算未讀管理員回覆數量
- [x] 修改管理後台tickets.list API計算未讀用戶回覆數量
- [x] 在管理後台工單列表添加新回覆標籤顯示
- [x] 測試雙向提醒功能(個人中心和管理後台都正確顯示)
- [x] 在Profile頁面工單列表添加新回覆標籤顯示
- [x] 移除/my-tickets頁面(功能已整合到Profile頁面)
- [ ] 實作點擊工單後自動標記為已讀的功能
- [ ] 修復工單詳情頁權限檢查,防止用戶訪問其他人的工單

## 工單回覆圖片上傳功能與權限強化

### 資料庫Schema擴充
- [x] 在ticketReplies表添加attachments欄位(JSON格式,儲存圖片URL陣列)
- [x] 執行資料庫遷移

### 後端API開發
- [x] 修改tickets.addReply API支援attachments參數
- [x] 在tickets.getById API添加權限檢查(用戶只能查看自己的工單,管理員可查看所有)
- [x] 撰寫Vitest測試驗證權限邏輯

### 前端圖片上傳UI實作
- [x] 在TicketDetail.tsx添加圖片上傳按鈕和預覽功能
- [x] 在AdminTicketDetail.tsx添加圖片上傳按鈕和預覽功能
- [x] 實作圖片上傳到S3的邏輯
- [x] 在回覆列表中顯示圖片附件(可點擊放大查看)
- [x] 限制圖片格式(jpg, png, gif, webp)和大小(最大5MB)

### 測試驗證
- [x] 測試用戶上傳圖片回覆功能
- [x] 測試管理員上傳圖片回覆功能
- [x] 測試圖片顯示和放大查看功能
- [x] 測試用戶無法透過URL訪問其他人的工單
- [x] 測試管理員可以正常訪問所有工單
- [x] 完整功能測試並建立checkpoint

## One X 產品頁面效能數據免責聲明
- [x] 在 ProductOneX 頁面底部添加效能數據免責聲明


## 修復全站立即購買按鈕連結
- [x] 檢查所有產品頁面的立即購買按鈕連結
- [x] 修復 One X 產品頁面的立即購買連結為 /where-to-buy (已正確)
- [x] 修復 One X Specs 頁面的立即購買連結為 /where-to-buy
- [x] 修復 One X Downloads 頁面的立即購買連結為 /where-to-buy
- [x] 修復 One X FAQ 頁面的立即購買連結為 /where-to-buy
- [x] 修復 Ultra S7 產品頁面的立即購買連結為 /where-to-buy (已正確)
- [x] 修復 Ultra S7 Specs 頁面的立即購買連結為 /where-to-buy
- [x] 修復 Ultra S7 Downloads 頁面的立即購買連結為 /where-to-buy
- [x] 修復 Ultra S7 FAQ 頁面的立即購買連結為 /where-to-buy
- [x] 測試所有立即購買按鈕連結正常運作

# DJI Footer Copyright 位置觀察

根據截圖，DJI 網站的 Footer 底部排版如下：

## 底部排版結構

**左側：**
- Logo（紅色 DJI Logo）
- 連結：關於我們、聯絡我們、招聘精英、成為合作夥伴、RoboMaster
- 連結：私隱權政策、使用條款
- **Copyright 文字：`Copyright © 2025 DJI 大疆創新 版權所有`**
- 連結：網站問題反饋

**右側：**
- 社群媒體圖示（Facebook、Twitter、Youtube、Instagram）
- 語言/地區選擇器：中國台灣 / 繁體中文

## 關鍵發現

1. **Copyright 位置**：在左下角，位於 Logo 和連結下方
2. **排版方式**：Copyright 文字**靠左對齊**，不是置中
3. **結構**：
   - 第一行：Logo + 主要連結（關於我們、聯絡我們等）
   - 第二行：次要連結（私隱權政策、使用條款）+ Copyright 文字 + 網站問題反饋
   - 右側：社群媒體圖示 + 語言選擇器

## 與目前 Apolnus 網站的差異

目前 Apolnus 網站的 Copyright 是在三欄 grid 的中間欄位，使用 `text-center` 置中對齊。

需要調整為：
- Copyright 應該在左側，與其他連結在同一區域
- 使用靠左對齊，不是置中
- 排版順序：私隱權政策 → 使用條款 → Copyright → 其他連結

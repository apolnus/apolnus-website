#!/usr/bin/env python3
"""
手動修復 WhereToBuy 頁面的翻譯整合
"""

import re
from pathlib import Path

# 文件路徑
PAGE_FILE = Path('/home/ubuntu/apolnus/client/src/pages/WhereToBuy.tsx')

# 讀取文件
with open(PAGE_FILE, 'r', encoding='utf-8') as f:
    content = f.read()

# 定義替換規則（只替換 UI 文字，保留資料區塊）
replacements = [
    # Tabs
    (r'>\s*官方線上通路\s*<', r">{t('whereToBuy.tabs.online')}<"),
    (r'>\s*授權經銷商\s*<', r">{t('whereToBuy.tabs.dealers')}<"),
    
    # Online section
    (r'>\s*官方推薦\s*<', r">{t('whereToBuy.online.featured')}<"),
    (r'>\s*Apolnus 官方商城\s*<', r">Apolnus {t('whereToBuy.online.officialStore')}<"),
    (r'>\s*提供官方產品和全方位服務，讓您的購買更有保障\s*<', r">{t('whereToBuy.online.benefit1')}<"),
    (r'>\s*購物回饋會員點數，享專屬優惠\s*<', r">{t('whereToBuy.online.benefit2')}<"),
    (r'>\s*專業客服團隊協助選購\s*<', r">{t('whereToBuy.online.benefit3')}<"),
    (r'>\s*最多 30 天退換貨保障\s*<', r">{t('whereToBuy.online.benefit4')}<"),
    (r'>\s*立即購買\s*<', r">{t('whereToBuy.online.buyNow')}<"),
    (r'>\s*官方直營\s*<', r">{t('whereToBuy.online.officialBadge')}<"),
    (r'>\s*線上購物平台\s*<', r">{t('whereToBuy.online.platformsTitle')}<"),
    (r'>\s*在您熟悉的電商平台購買 Apolnus 產品\s*<', r">{t('whereToBuy.online.platformsDesc')}<"),
    (r'>\s*需要購買建議？\s*<', r">{t('whereToBuy.online.needHelp')}<"),
    (r'>\s*我們的專業團隊隨時為您提供產品諮詢服務\s*<', r">{t('whereToBuy.online.helpDesc')}<"),
    (r'>\s*前往官方商城\s*<', r">{t('whereToBuy.online.goToStore')}<"),
    (r'>\s*聯絡客服\s*<', r">{t('whereToBuy.online.contactSupport')}<"),
    
    # Dealers section
    (r'>\s*在我司正式授權的代理商處購買的波那斯產品，以確保您能及時獲得保固服務。\s*<', r">{t('whereToBuy.dealers.notice')}<"),
    (r'>\s*縣市\s*<', r">{t('whereToBuy.dealers.filter.city')}<"),
    (r'>\s*全部縣市\s*<', r">{t('whereToBuy.dealers.filter.allCities')}<"),
    (r'>\s*區域\s*<', r">{t('whereToBuy.dealers.filter.district')}<"),
    (r'>\s*全部區域\s*<', r">{t('whereToBuy.dealers.filter.allDistricts')}<"),
    (r'>\s*關鍵字搜尋\s*<', r">{t('whereToBuy.dealers.filter.search')}<"),
    (r'placeholder="搜尋經銷商名稱或地址"', r"placeholder={t('whereToBuy.dealers.filter.searchPlaceholder')}"),
    (r'>\s*搜尋\s*<', r">{t('whereToBuy.dealers.filter.searchButton')}<"),
    (r'>\s*找到 \{dealers\.length\} 個授權經銷商\s*<', r">{t('whereToBuy.dealers.resultsCount', { count: dealers.length })}<"),
    (r'>\s*目前尚無授權經銷商資料\s*<', r">{t('whereToBuy.dealers.noData')}<"),
    (r'>\s*電話\s*<', r">{t('whereToBuy.dealers.phone')}<"),
    (r'>\s*地址\s*<', r">{t('whereToBuy.dealers.address')}<"),
    (r'>\s*營業時間\s*<', r">{t('whereToBuy.dealers.hours')}<"),
]

# 執行替換
for pattern, replacement in replacements:
    content = re.sub(pattern, replacement, content)

# 保存文件
with open(PAGE_FILE, 'w', encoding='utf-8') as f:
    f.write(content)

print("✅ WhereToBuy 頁面翻譯整合完成")

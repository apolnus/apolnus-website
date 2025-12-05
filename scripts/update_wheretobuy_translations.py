#!/usr/bin/env python3
"""
更新 whereToBuy 翻譯，添加所有缺少的 key
"""

import json
from pathlib import Path

# 文件路徑
ZH_TW_FILE = Path('/home/ubuntu/apolnus/client/src/i18n/locales/zh-TW.json')
EN_FILE = Path('/home/ubuntu/apolnus/client/src/i18n/locales/en.json')

# 讀取現有翻譯
with open(ZH_TW_FILE, 'r', encoding='utf-8') as f:
    zh_tw = json.load(f)

with open(EN_FILE, 'r', encoding='utf-8') as f:
    en = json.load(f)

# 完整的 whereToBuy 翻譯
zh_tw['whereToBuy'] = {
    "title": "購買通路",
    "subtitle": "選擇您喜歡的購買方式",
    "tabs": {
        "online": "官方線上通路",
        "dealers": "授權經銷商"
    },
    "online": {
        "featured": "官方推薦",
        "officialStore": "官方商城",
        "storeTitle": "Apolnus 官方商城",
        "benefit1": "提供官方產品和全方位服務，讓您的購買更有保障",
        "benefit2": "購物回饋會員點數，享專屬優惠",
        "benefit3": "專業客服團隊協助選購",
        "benefit4": "最多 30 天退換貨保障",
        "buyNow": "立即購買",
        "officialBadge": "官方直營",
        "platformsTitle": "線上購物平台",
        "platformsDesc": "在您熟悉的電商平台購買 Apolnus 產品",
        "needHelp": "需要購買建議？",
        "helpDesc": "我們的專業團隊隨時為您提供產品諮詢服務",
        "goToStore": "前往官方商城",
        "contactSupport": "聯絡客服"
    },
    "dealers": {
        "title": "授權經銷商",
        "notice": "在我司正式授權的代理商處購買的波那斯產品，以確保您能及時獲得保固服務。",
        "filter": {
            "city": "縣市",
            "allCities": "全部縣市",
            "district": "區域",
            "allDistricts": "全部區域",
            "search": "關鍵字搜尋",
            "searchPlaceholder": "搜尋經銷商名稱或地址",
            "searchButton": "搜尋"
        },
        "resultsCount": "找到 {{count}} 個授權經銷商",
        "noData": "目前尚無授權經銷商資料",
        "phone": "電話",
        "address": "地址",
        "hours": "營業時間"
    }
}

en['whereToBuy'] = {
    "title": "Where to Buy",
    "subtitle": "Choose your preferred purchase method",
    "tabs": {
        "online": "Official Online Channels",
        "dealers": "Authorized Dealers"
    },
    "online": {
        "featured": "Official Recommendation",
        "officialStore": "Official Store",
        "storeTitle": "Apolnus Official Store",
        "benefit1": "Official products and comprehensive services for your peace of mind",
        "benefit2": "Earn member points and enjoy exclusive offers",
        "benefit3": "Professional customer service team to assist with your purchase",
        "benefit4": "Up to 30-day return and exchange guarantee",
        "buyNow": "Buy Now",
        "officialBadge": "Official",
        "platformsTitle": "Online Shopping Platforms",
        "platformsDesc": "Purchase Apolnus products from familiar e-commerce platforms",
        "needHelp": "Need Purchase Advice?",
        "helpDesc": "Our professional team is always ready to provide product consultation services",
        "goToStore": "Visit Official Store",
        "contactSupport": "Contact Support"
    },
    "dealers": {
        "title": "Authorized Dealers",
        "notice": "Purchase Apolnus products from our officially authorized dealers to ensure timely warranty service.",
        "filter": {
            "city": "City",
            "allCities": "All Cities",
            "district": "District",
            "allDistricts": "All Districts",
            "search": "Keyword Search",
            "searchPlaceholder": "Search dealer name or address",
            "searchButton": "Search"
        },
        "resultsCount": "Found {{count}} authorized dealers",
        "noData": "No authorized dealer data available",
        "phone": "Phone",
        "address": "Address",
        "hours": "Business Hours"
    }
}

# 保存更新後的翻譯
with open(ZH_TW_FILE, 'w', encoding='utf-8') as f:
    json.dump(zh_tw, f, ensure_ascii=False, indent=2)

with open(EN_FILE, 'w', encoding='utf-8') as f:
    json.dump(en, f, ensure_ascii=False, indent=2)

print("✅ whereToBuy 翻譯已更新")
print(f"   zh-TW keys: {list(zh_tw['whereToBuy'].keys())}")
print(f"   en keys: {list(en['whereToBuy'].keys())}")

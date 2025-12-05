#!/usr/bin/env python3
"""
通用腳本：批次處理所有剩餘頁面
使用序列化 Key，同時更新代碼和 JSON
"""

import re
import json
from pathlib import Path

# 剩餘頁面列表
REMAINING_PAGES = [
    'About',
    'FAQ',
    'NotFound',
    'Privacy',
    'Terms',
    'Profile',
    'WarrantyRegistration',
    'SupportTicket',
    'Tickets',
    'Support',
    'PartnerProgram',
    'Careers',
]

PAGES_DIR = Path('/home/ubuntu/apolnus/client/src/pages')
TRANSLATIONS_DIR = Path('/home/ubuntu/apolnus/client/src/i18n/locales')

# 載入現有翻譯
with open(TRANSLATIONS_DIR / 'zh-TW.json', 'r', encoding='utf-8') as f:
    zh_tw = json.load(f)

with open(TRANSLATIONS_DIR / 'en.json', 'r', encoding='utf-8') as f:
    en = json.load(f)

def contains_chinese(text):
    """檢查是否包含中文"""
    return bool(re.search(r'[\u4e00-\u9fff]', text))

def extract_chinese_texts(content):
    """提取所有中文文字"""
    texts = []
    
    # 提取 JSX 標籤內的文字
    pattern = r'>([^<{]+)<'
    matches = re.findall(pattern, content)
    for match in matches:
        text = match.strip()
        if contains_chinese(text) and len(text) > 1:
            texts.append(text)
    
    # 提取屬性中的文字
    attr_pattern = r'(placeholder|alt|title|aria-label)\s*=\s*["\']([^"\']+)["\']'
    attr_matches = re.findall(attr_pattern, content)
    for _, text in attr_matches:
        if contains_chinese(text):
            texts.append(text)
    
    return texts

def process_page(page_name):
    """處理單個頁面"""
    page_file = PAGES_DIR / f'{page_name}.tsx'
    
    if not page_file.exists():
        print(f'⚠️  頁面不存在: {page_name}')
        return False
    
    print(f'\n📄 處理頁面: {page_name}')
    
    # 讀取檔案
    with open(page_file, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # 提取中文文字
    chinese_texts = extract_chinese_texts(content)
    
    if not chinese_texts:
        print(f'   ℹ️  沒有找到中文文字')
        return True
    
    # 去重並保持順序
    unique_texts = []
    seen = set()
    for text in chinese_texts:
        if text not in seen:
            unique_texts.append(text)
            seen.add(text)
    
    print(f'   ✅ 找到 {len(unique_texts)} 個中文文字')
    
    # 生成翻譯 key 和內容
    page_key = page_name[0].lower() + page_name[1:]  # camelCase
    translations_zh = {}
    translations_en = {}
    
    for i, text in enumerate(unique_texts, 1):
        key = f'p_{i:02d}'
        translations_zh[key] = text
        translations_en[key] = f'[EN] {text}'  # 暫時使用占位符
        
        # 替換文字為翻譯 key
        # 只替換完整匹配的文字
        escaped_text = re.escape(text)
        # 替換 JSX 標籤內的文字
        content = re.sub(
            rf'>({escaped_text})<',
            rf'>{{t(\'{page_key}.{key}\')}}<',
            content
        )
        # 替換屬性中的文字
        content = re.sub(
            rf'(placeholder|alt|title|aria-label)\s*=\s*["\']({escaped_text})["\']',
            rf'\1={{t(\'{page_key}.{key}\')}}',
            content
        )
    
    # 保存修改後的檔案
    with open(page_file, 'w', encoding='utf-8') as f:
        f.write(content)
    
    # 更新翻譯 JSON
    zh_tw[page_key] = translations_zh
    en[page_key] = translations_en
    
    print(f'   ✅ 頁面處理完成，生成 {len(translations_zh)} 個翻譯 key')
    
    return True

def main():
    """主函數"""
    print('🚀 開始批次處理所有剩餘頁面...\n')
    print('=' * 60)
    
    success_count = 0
    failed_count = 0
    
    for page_name in REMAINING_PAGES:
        try:
            if process_page(page_name):
                success_count += 1
            else:
                failed_count += 1
        except Exception as e:
            print(f'❌ 處理 {page_name} 時發生錯誤: {str(e)}')
            import traceback
            traceback.print_exc()
            failed_count += 1
    
    # 保存更新後的翻譯
    with open(TRANSLATIONS_DIR / 'zh-TW.json', 'w', encoding='utf-8') as f:
        json.dump(zh_tw, f, ensure_ascii=False, indent=2)
    
    with open(TRANSLATIONS_DIR / 'en.json', 'w', encoding='utf-8') as f:
        json.dump(en, f, ensure_ascii=False, indent=2)
    
    print('\n' + '=' * 60)
    print(f'\n✅ 批次處理完成！')
    print(f'📊 成功: {success_count} 個頁面')
    print(f'📊 失敗: {failed_count} 個頁面')
    print(f'\n💾 翻譯檔案已更新: zh-TW.json, en.json')

if __name__ == '__main__':
    main()

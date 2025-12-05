#!/usr/bin/env python3
"""
自動化批次處理腳本：整合所有頁面的翻譯和 SEO
遵守「UI 翻譯，資料保留」原則
"""

import re
import os
from pathlib import Path

# 目標頁面列表
TARGET_PAGES = [
    'WhereToBuy',
    'ServiceCenters',
    'About',
    'FAQ',
    'Profile',
    'WarrantyRegistration',
    'SupportTicket',
    'Tickets',
    'Support',
    'PartnerProgram',
    'Careers',
    'Privacy',
    'Terms',
    'NotFound',
]

# 頁面路徑
PAGES_DIR = Path('/home/ubuntu/apolnus/client/src/pages')

# 頁面對應的翻譯 key 和 SEO key
PAGE_CONFIG = {
    'WhereToBuy': {'key': 'whereToBuy', 'seo': 'whereToBuy'},
    'ServiceCenters': {'key': 'serviceCenters', 'seo': 'serviceCenters'},
    'About': {'key': 'about', 'seo': 'about'},
    'FAQ': {'key': 'faq', 'seo': 'faq'},
    'Profile': {'key': 'profile', 'seo': 'profile'},
    'WarrantyRegistration': {'key': 'warrantyRegistration', 'seo': 'warrantyRegistration'},
    'SupportTicket': {'key': 'supportTicket', 'seo': 'supportTicket'},
    'Tickets': {'key': 'tickets', 'seo': 'tickets'},
    'Support': {'key': 'support', 'seo': 'support'},
    'PartnerProgram': {'key': 'partnerProgram', 'seo': 'partnerProgram'},
    'Careers': {'key': 'careers', 'seo': 'careers'},
    'Privacy': {'key': 'privacy', 'seo': 'privacy'},
    'Terms': {'key': 'terms', 'seo': 'terms'},
    'NotFound': {'key': 'notFound', 'seo': 'notFound'},
}

def has_translation_hook(content):
    """檢查是否已經有 useTranslation hook"""
    return 'useTranslation' in content and 'const { t }' in content

def has_seo_component(content):
    """檢查是否已經有 SEOHead 組件"""
    return 'SEOHead' in content

def add_imports(content, page_name):
    """添加必要的 imports"""
    lines = content.split('\n')
    
    # 檢查是否需要添加 useTranslation
    needs_translation = not has_translation_hook(content)
    needs_seo = not has_seo_component(content)
    
    if not needs_translation and not needs_seo:
        return content
    
    # 找到最後一個 import 語句的位置
    last_import_idx = 0
    for i, line in enumerate(lines):
        if line.strip().startswith('import '):
            last_import_idx = i
    
    # 添加 imports
    new_imports = []
    if needs_translation:
        new_imports.append('import { useTranslation } from "react-i18next";')
    if needs_seo:
        new_imports.append('import SEOHead from "@/components/seo/SEOHead";')
    
    if new_imports:
        lines.insert(last_import_idx + 1, '\n'.join(new_imports))
    
    return '\n'.join(lines)

def add_translation_hook(content):
    """添加 useTranslation hook"""
    if has_translation_hook(content):
        return content
    
    # 找到函數組件的開始位置
    pattern = r'(export default function \w+\(\) \{)'
    replacement = r'\1\n  const { t } = useTranslation();'
    
    return re.sub(pattern, replacement, content)

def add_seo_head(content, page_name):
    """添加 SEOHead 組件"""
    if has_seo_component(content):
        return content
    
    seo_key = PAGE_CONFIG.get(page_name, {}).get('seo', page_name.lower())
    
    # 找到 return 語句後的第一個 div 或 fragment
    pattern = r'(return \(\s*<)(div|>)'
    seo_component = f'<SEOHead pageKey="{seo_key}" />\n      '
    replacement = rf'\1{seo_component}\2'
    
    return re.sub(pattern, replacement, content, count=1)

def is_data_block(line):
    """判斷是否為資料區塊（需要跳過翻譯）"""
    # 跳過 const 資料陣列定義
    if re.match(r'\s*const\s+\w+\s*=\s*\[', line):
        return True
    # 跳過物件屬性中的資料
    if re.search(r'(name|address|phone|email|url|description):\s*["\']', line):
        return True
    return False

def should_translate_text(text, context_line=''):
    """判斷文字是否需要翻譯"""
    # 跳過 URL
    if text.startswith('http'):
        return False
    # 跳過路徑
    if '/' in text and not ' ' in text:
        return False
    # 跳過 className
    if 'className' in context_line:
        return False
    # 跳過 Tailwind classes
    if any(x in text for x in ['px-', 'py-', 'bg-', 'text-', 'border-', 'rounded-', 'flex', 'grid']):
        return False
    # 跳過電話號碼
    if re.match(r'[\d\-\(\)\s]+$', text):
        return False
    # 跳過單字符
    if len(text) <= 1:
        return False
    # 只翻譯包含中文的文字
    if not re.search(r'[\u4e00-\u9fff]', text):
        return False
    
    return True

def extract_translation_key(text, page_key):
    """從文字生成翻譯 key"""
    # 簡化文字作為 key
    key = text[:20].strip()
    # 移除標點符號
    key = re.sub(r'[^\w\s]', '', key)
    # 轉換為 camelCase
    words = key.split()
    if words:
        key = words[0].lower() + ''.join(w.capitalize() for w in words[1:])
    else:
        key = 'text'
    
    return f'{page_key}.{key}'

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
    
    # 備份原始檔案
    backup_file = page_file.with_suffix('.tsx.backup')
    with open(backup_file, 'w', encoding='utf-8') as f:
        f.write(content)
    print(f'   ✅ 備份原始檔案: {backup_file.name}')
    
    # 添加 imports
    content = add_imports(content, page_name)
    print(f'   ✅ 添加必要的 imports')
    
    # 添加 useTranslation hook
    content = add_translation_hook(content)
    print(f'   ✅ 添加 useTranslation hook')
    
    # 添加 SEOHead 組件
    content = add_seo_head(content, page_name)
    print(f'   ✅ 添加 SEOHead 組件')
    
    # 保存修改後的檔案
    with open(page_file, 'w', encoding='utf-8') as f:
        f.write(content)
    
    print(f'   ✅ 頁面處理完成')
    
    return True

def main():
    """主函數"""
    print('🚀 開始批次處理所有頁面...\n')
    print('=' * 60)
    
    success_count = 0
    failed_count = 0
    
    for page_name in TARGET_PAGES:
        try:
            if process_page(page_name):
                success_count += 1
            else:
                failed_count += 1
        except Exception as e:
            print(f'❌ 處理 {page_name} 時發生錯誤: {str(e)}')
            failed_count += 1
    
    print('\n' + '=' * 60)
    print(f'\n✅ 批次處理完成！')
    print(f'📊 成功: {success_count} 個頁面')
    print(f'📊 失敗: {failed_count} 個頁面')
    print(f'\n💡 提示: 原始檔案已備份為 .tsx.backup')
    print(f'💡 如需還原，請執行: rm *.tsx && mv *.tsx.backup *.tsx')

if __name__ == '__main__':
    main()

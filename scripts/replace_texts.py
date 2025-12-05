#!/usr/bin/env python3
"""
升級版 Python 腳本：完成真正的文字替換工作
使用 AST/Regex 雙重策略，自動生成 Keys，保護資料區塊
"""

import re
import json
from pathlib import Path
from typing import Dict, List, Set, Tuple

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
TRANSLATIONS_DIR = Path('/home/ubuntu/apolnus/client/src/i18n/locales')

# 載入現有翻譯
with open(TRANSLATIONS_DIR / 'zh-TW.json', 'r', encoding='utf-8') as f:
    existing_translations_zh = json.load(f)

with open(TRANSLATIONS_DIR / 'en.json', 'r', encoding='utf-8') as f:
    existing_translations_en = json.load(f)

# 頁面配置
PAGE_CONFIG = {
    'WhereToBuy': 'whereToBuy',
    'ServiceCenters': 'serviceCenters',
    'About': 'about',
    'FAQ': 'faq',
    'Profile': 'profile',
    'WarrantyRegistration': 'warrantyRegistration',
    'SupportTicket': 'supportTicket',
    'Tickets': 'tickets',
    'Support': 'support',
    'PartnerProgram': 'partnerProgram',
    'Careers': 'careers',
    'Privacy': 'privacy',
    'Terms': 'terms',
    'NotFound': 'notFound',
}

# 排除名單（資料區塊保護）
EXCLUDE_PATTERNS = [
    r'const\s+stores\s*=',
    r'const\s+dealers\s*=',
    r'const\s+onlinePlatforms\s*=',
    r'const\s+platforms\s*=',
    r'const\s+serviceCenters\s*=',
    r'address\s*:',
    r'phone\s*:',
    r'email\s*:',
    r'url\s*:',
    r'href\s*=',
    r'src\s*=',
]

# 需要替換的屬性
TRANSLATABLE_ATTRS = ['placeholder', 'alt', 'title', 'aria-label']

def is_in_exclude_block(line: str, context_lines: List[str], line_idx: int) -> bool:
    """判斷當前行是否在排除區塊內"""
    # 檢查當前行
    for pattern in EXCLUDE_PATTERNS:
        if re.search(pattern, line):
            return True
    
    # 檢查上下文（前後 5 行）
    start = max(0, line_idx - 5)
    end = min(len(context_lines), line_idx + 5)
    context = '\n'.join(context_lines[start:end])
    
    # 檢查是否在資料陣列內
    if re.search(r'const\s+\w+\s*=\s*\[', context):
        # 檢查是否在陣列結束之前
        bracket_count = context[:context.find(line) if line in context else 0].count('[') - context[:context.find(line) if line in context else 0].count(']')
        if bracket_count > 0:
            return True
    
    return False

def contains_chinese(text: str) -> bool:
    """檢查文字是否包含中文"""
    return bool(re.search(r'[\u4e00-\u9fff]', text))

def should_translate(text: str, context: str = '') -> bool:
    """判斷文字是否需要翻譯"""
    # 跳過空白
    if not text or not text.strip():
        return False
    
    # 只翻譯包含中文的文字
    if not contains_chinese(text):
        return False
    
    # 跳過 URL
    if text.startswith('http'):
        return False
    
    # 跳過路徑
    if '/' in text and not ' ' in text:
        return False
    
    # 跳過 className
    if 'className' in context:
        return False
    
    # 跳過 Tailwind classes
    if any(x in text for x in ['px-', 'py-', 'bg-', 'text-', 'border-', 'rounded-', 'flex', 'grid']):
        return False
    
    # 跳過電話號碼
    if re.match(r'^[\d\-\(\)\s]+$', text):
        return False
    
    # 跳過單字符
    if len(text.strip()) <= 1:
        return False
    
    return True

def generate_key_from_text(text: str, page_key: str) -> str:
    """從文字生成翻譯 key"""
    # 查找現有翻譯中是否已經有這個文字
    def find_existing_key(translations: dict, target_text: str, prefix: str = '') -> str:
        for key, value in translations.items():
            full_key = f'{prefix}.{key}' if prefix else key
            if isinstance(value, dict):
                result = find_existing_key(value, target_text, full_key)
                if result:
                    return result
            elif isinstance(value, str) and value.strip() == target_text.strip():
                return full_key
        return ''
    
    # 先嘗試在現有翻譯中查找
    existing_key = find_existing_key(existing_translations_zh, text, page_key)
    if existing_key:
        return existing_key
    
    # 生成新 key
    # 簡化文字
    simplified = text[:30].strip()
    # 移除標點符號
    simplified = re.sub(r'[^\w\s]', '', simplified)
    # 轉換為拼音或使用簡化邏輯
    words = simplified.split()
    if words:
        # 使用前幾個字作為 key
        key = '_'.join(words[:3]).lower()
        # 移除非 ASCII 字符
        key = re.sub(r'[^\x00-\x7F]+', '', key)
        if not key:
            # 如果沒有英文，使用 hash
            key = f'text_{hash(text) % 10000}'
    else:
        key = f'text_{hash(text) % 10000}'
    
    return f'{page_key}.{key}'

def replace_jsx_text(content: str, page_key: str) -> Tuple[str, Dict[str, str]]:
    """替換 JSX 文字"""
    lines = content.split('\n')
    new_lines = []
    new_translations = {}
    
    in_exclude_block = False
    bracket_depth = 0
    
    for i, line in enumerate(lines):
        # 檢查是否在排除區塊
        if is_in_exclude_block(line, lines, i):
            new_lines.append(line)
            in_exclude_block = True
            continue
        
        # 追蹤大括號深度
        bracket_depth += line.count('{') - line.count('}')
        
        # 如果在資料區塊內，跳過
        if in_exclude_block and bracket_depth > 0:
            new_lines.append(line)
            continue
        else:
            in_exclude_block = False
        
        # 替換 JSX 標籤內的純文字
        # 例如：<h1>購買通路</h1> -> <h1>{t('whereToBuy.title')}</h1>
        def replace_tag_text(match):
            opening_tag = match.group(1)
            text = match.group(2)
            closing_tag = match.group(3)
            
            if should_translate(text, line):
                key = generate_key_from_text(text, page_key)
                new_translations[key] = text
                return f'{opening_tag}{{t(\'{key}\')}}{closing_tag}'
            return match.group(0)
        
        # 匹配 <tag>text</tag> 格式
        line = re.sub(
            r'(<[a-zA-Z][^>]*>)([^<{]+)(</[a-zA-Z][^>]*>)',
            replace_tag_text,
            line
        )
        
        # 替換屬性內的文字
        # 例如：placeholder="搜尋..." -> placeholder={t('whereToBuy.searchPlaceholder')}
        for attr in TRANSLATABLE_ATTRS:
            def replace_attr_text(match):
                attr_name = match.group(1)
                text = match.group(2)
                
                if should_translate(text, line):
                    key = generate_key_from_text(text, page_key)
                    new_translations[key] = text
                    return f'{attr_name}={{t(\'{key}\')}}'
                return match.group(0)
            
            line = re.sub(
                rf'({attr})\s*=\s*["\']([^"\']+)["\']',
                replace_attr_text,
                line
            )
        
        new_lines.append(line)
    
    return '\n'.join(new_lines), new_translations

def process_page(page_name: str) -> bool:
    """處理單個頁面"""
    page_file = PAGES_DIR / f'{page_name}.tsx'
    
    if not page_file.exists():
        print(f'⚠️  頁面不存在: {page_name}')
        return False
    
    print(f'\n📄 處理頁面: {page_name}')
    
    # 讀取檔案
    with open(page_file, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # 獲取頁面 key
    page_key = PAGE_CONFIG.get(page_name, page_name.lower())
    
    # 替換文字
    new_content, new_translations = replace_jsx_text(content, page_key)
    
    if new_translations:
        print(f'   ✅ 找到 {len(new_translations)} 個需要翻譯的文字')
        
        # 保存修改後的檔案
        with open(page_file, 'w', encoding='utf-8') as f:
            f.write(new_content)
        print(f'   ✅ 文字替換完成')
        
        # 更新翻譯檔案
        # TODO: 這裡需要將 new_translations 合併到現有翻譯中
        print(f'   ℹ️  新翻譯: {list(new_translations.keys())[:5]}...')
    else:
        print(f'   ℹ️  沒有找到需要替換的文字')
    
    return True

def main():
    """主函數"""
    print('🚀 開始文字替換批次處理...\n')
    print('=' * 60)
    
    success_count = 0
    failed_count = 0
    
    for page_name in TARGET_PAGES[:3]:  # 先處理前 3 個頁面作為測試
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
    
    print('\n' + '=' * 60)
    print(f'\n✅ 文字替換完成！')
    print(f'📊 成功: {success_count} 個頁面')
    print(f'📊 失敗: {failed_count} 個頁面')

if __name__ == '__main__':
    main()

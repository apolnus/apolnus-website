#!/usr/bin/env python3
"""
掃描所有頁面提取文字內容和結構
遵守 Apolnus 品牌一致性規範
"""

import os
import re
import json
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
OUTPUT_DIR = Path('/home/ubuntu/apolnus/scripts/extracted')

def extract_chinese_text(content):
    """提取中文文字（包含標點符號）"""
    # 匹配中文字符、標點符號和常見符號
    pattern = r'[\u4e00-\u9fff\u3000-\u303f\uff00-\uffef]+'
    matches = re.findall(pattern, content)
    return matches

def extract_jsx_text(content):
    """提取 JSX 中的文字內容"""
    texts = []
    
    # 提取 {t('...')} 中的 key
    t_pattern = r"\{t\(['\"]([^'\"]+)['\"]\)\}"
    t_matches = re.findall(t_pattern, content)
    texts.extend([('t_key', key) for key in t_matches])
    
    # 提取 JSX 標籤中的純文字
    # 例如：<h1>文字</h1> 或 <p>文字</p>
    tag_text_pattern = r'<[^>]+>([^<{]+)</[^>]+>'
    tag_matches = re.findall(tag_text_pattern, content)
    for match in tag_matches:
        text = match.strip()
        if text and len(text) > 1:  # 過濾掉單字符
            texts.append(('jsx_text', text))
    
    # 提取字符串字面量中的文字
    string_pattern = r'["\']([^"\']{3,})["\']'
    string_matches = re.findall(string_pattern, content)
    for match in string_matches:
        # 過濾掉路徑、類名等
        if not any(x in match for x in ['/', 'className', 'http', 'www', '.', 'px-', 'py-', 'bg-', 'text-']):
            chinese = extract_chinese_text(match)
            if chinese:
                texts.append(('string', match))
    
    return texts

def analyze_page_structure(page_name, content):
    """分析頁面結構，識別核心關鍵字"""
    structure = {
        'page_name': page_name,
        'sections': [],
        'keywords': [],
        'has_form': 'form' in content.lower() or 'input' in content.lower(),
        'has_table': 'table' in content.lower() or 'thead' in content.lower(),
        'has_map': 'map' in content.lower() or 'google' in content.lower(),
    }
    
    # 識別 section 標籤
    section_pattern = r'<section[^>]*>(.*?)</section>'
    sections = re.findall(section_pattern, content, re.DOTALL)
    structure['sections'] = [f'section_{i+1}' for i in range(len(sections))]
    
    # 根據頁面名稱識別核心關鍵字
    keyword_map = {
        'WhereToBuy': ['購買', '經銷商', 'dealer', 'buy', 'purchase'],
        'ServiceCenters': ['維修', '服務', 'service', 'repair', 'maintenance'],
        'About': ['關於', '公司', 'about', 'company', 'mission'],
        'FAQ': ['問題', '解答', 'FAQ', 'question', 'answer'],
        'Profile': ['個人', '會員', 'profile', 'account', 'member'],
        'WarrantyRegistration': ['保固', '註冊', 'warranty', 'register', 'registration'],
        'SupportTicket': ['客服', '工單', 'ticket', 'support', 'help'],
        'Support': ['支援', '服務', 'support', 'service', 'help'],
        'PartnerProgram': ['合作', '夥伴', 'partner', 'dealer', 'distributor'],
        'Careers': ['招聘', '職缺', 'career', 'job', 'recruitment'],
        'Privacy': ['隱私', '政策', 'privacy', 'policy', 'data'],
        'Terms': ['條款', '使用', 'terms', 'service', 'agreement'],
        'NotFound': ['404', '找不到', 'not found', 'error'],
    }
    
    structure['keywords'] = keyword_map.get(page_name, [])
    
    return structure

def scan_page(page_name):
    """掃描單個頁面"""
    page_file = PAGES_DIR / f'{page_name}.tsx'
    
    if not page_file.exists():
        print(f'⚠️  頁面不存在: {page_name}')
        return None
    
    print(f'📄 掃描頁面: {page_name}')
    
    with open(page_file, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # 分析頁面結構
    structure = analyze_page_structure(page_name, content)
    
    # 提取文字內容
    texts = extract_jsx_text(content)
    
    # 提取中文文字
    chinese_texts = extract_chinese_text(content)
    
    result = {
        'page_name': page_name,
        'file_path': str(page_file),
        'structure': structure,
        'texts': texts,
        'chinese_texts': list(set(chinese_texts)),  # 去重
        'line_count': len(content.split('\n')),
    }
    
    return result

def main():
    """主函數"""
    print('🚀 開始掃描所有頁面...\n')
    
    # 創建輸出目錄
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    
    results = {}
    
    for page_name in TARGET_PAGES:
        result = scan_page(page_name)
        if result:
            results[page_name] = result
            print(f'   ✅ 找到 {len(result["chinese_texts"])} 個中文文字片段')
            print(f'   ✅ 找到 {len(result["texts"])} 個文字元素')
            print(f'   ✅ 頁面結構: {len(result["structure"]["sections"])} 個 sections')
            print()
    
    # 保存結果
    output_file = OUTPUT_DIR / 'scan_results.json'
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(results, f, ensure_ascii=False, indent=2)
    
    print(f'\n✅ 掃描完成！結果已保存到: {output_file}')
    print(f'📊 總共掃描了 {len(results)} 個頁面')
    
    # 統計信息
    total_chinese = sum(len(r['chinese_texts']) for r in results.values())
    total_texts = sum(len(r['texts']) for r in results.values())
    print(f'📝 總共提取了 {total_chinese} 個中文文字片段')
    print(f'📝 總共提取了 {total_texts} 個文字元素')

if __name__ == '__main__':
    main()

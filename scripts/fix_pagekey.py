#!/usr/bin/env python3
"""
批次修正所有頁面的 SEOHead pageKey，使其與資料庫的 page ID 一致
"""

import os
import re

# pageKey 對照表：舊的 pageKey -> 新的 pageKey（與資料庫一致）
PAGEKEY_MAPPING = {
    # 產品頁面
    "productOneX": "product-one-x",
    "productOneXSpecs": "product-one-x-specs",
    "productOneXDownloads": "product-one-x-downloads",
    "productOneXFAQ": "product-one-x-faq",
    "oneX": "product-one-x",  # /products/one-x 頁面
    
    # 其他頁面
    "whereToBuy": "where-to-buy",
    "serviceCenters": "service-centers",
    "warrantyRegistration": "warranty-registration",
    "supportTicket": "support-ticket",
    "tickets": "my-tickets",
    "partnerProgram": "partner-program",
    "privacy": "privacy-policy",
    "terms": "terms-of-use",
    
    # 這些已經正確，不需要修改
    # "about": "about",
    # "careers": "careers",
    # "faq": "faq",
    # "home": "home",
    # "profile": "profile",
    # "support": "support",
}

def fix_file(filepath):
    """修正單個文件的 pageKey"""
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    original_content = content
    modified = False
    
    # 替換所有匹配的 pageKey
    for old_key, new_key in PAGEKEY_MAPPING.items():
        pattern = f'pageKey="{old_key}"'
        replacement = f'pageKey="{new_key}"'
        if pattern in content:
            content = content.replace(pattern, replacement)
            modified = True
            print(f"  ✓ {filepath}: {old_key} -> {new_key}")
    
    # 如果有修改，寫回文件
    if modified:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        return True
    return False

def main():
    """主函數"""
    print("開始批次修正 pageKey...\n")
    
    # 掃描所有 .tsx 文件
    pages_dir = "/home/ubuntu/apolnus/client/src/pages"
    fixed_count = 0
    
    for root, dirs, files in os.walk(pages_dir):
        for file in files:
            if file.endswith('.tsx'):
                filepath = os.path.join(root, file)
                if fix_file(filepath):
                    fixed_count += 1
    
    print(f"\n✅ 完成！共修正 {fixed_count} 個文件")

if __name__ == "__main__":
    main()

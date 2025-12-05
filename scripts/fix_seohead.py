#!/usr/bin/env python3
"""
修復 SEOHead 注入錯誤
將 <div <SEOHead /> className="..."> 修正為 <div className="..."><SEOHead />
"""

import re
from pathlib import Path

PAGES_DIR = Path("client/src/pages")

def fix_file(file_path):
    with open(file_path, "r", encoding="utf-8") as f:
        content = f.read()
    
    # 修復模式：<tag <SEOHead pageKey="xxx" /> className="...">
    # 替換為：<tag className="..."><SEOHead pageKey="xxx" />
    pattern = r'(<\w+)\s+(<SEOHead pageKey="[^"]+"\s*/?>)\s+(className="[^"]*">)'
    replacement = r'\1 \3\n      \2'
    
    new_content = re.sub(pattern, replacement, content)
    
    if new_content != content:
        with open(file_path, "w", encoding="utf-8") as f:
            f.write(new_content)
        print(f"✅ Fixed: {file_path.name}")
        return True
    return False

# 執行修復
print("🔧 Fixing SEOHead injection errors...")
fixed_count = 0
for file_path in PAGES_DIR.glob("*.tsx"):
    if fix_file(file_path):
        fixed_count += 1

# 也檢查 products 子目錄
products_dir = PAGES_DIR / "products"
if products_dir.exists():
    for file_path in products_dir.glob("*.tsx"):
        if fix_file(file_path):
            fixed_count += 1

print(f"✅ Fixed {fixed_count} files")

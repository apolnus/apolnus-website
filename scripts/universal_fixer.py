#!/usr/bin/env python3
import os
import re
import json
import hashlib
from pathlib import Path

# 設定路徑
BASE_DIR = Path("client/src")
PAGES_DIR = BASE_DIR / "pages"
LOCALE_PATH = BASE_DIR / "i18n/locales/zh-TW.json"
EN_LOCALE_PATH = BASE_DIR / "i18n/locales/en.json"

# 排除名單 (保護資料結構與特定語法)
EXCLUDE_PATTERNS = [
    r"const\s+\w+\s*=",
    r"console\.",
    r"^\s*//",
    r"return\s*;",
    r"path:",
    r"icon:",
    r"label:",  # 排除路由與圖示定義
    r"address\s*:",
    r"phone\s*:",  # 保護地址資料
]

# 載入現有翻譯
def load_json(path):
    if path.exists():
        with open(path, "r", encoding="utf-8") as f:
            return json.load(f)
    return {}

zh_data = load_json(LOCALE_PATH)
en_data = load_json(EN_LOCALE_PATH)

def get_page_key(filename):
    # AdminSubscribers.tsx -> adminSubscribers
    name = filename.replace(".tsx", "")
    return name[0].lower() + name[1:]

def generate_hash_key(text):
    # 生成短 Hash
    return "t_" + hashlib.md5(text.encode("utf-8")).hexdigest()[:8]

def process_file(file_path):
    with open(file_path, "r", encoding="utf-8") as f:
        content = f.read()
    
    page_key = get_page_key(file_path.name)
    modified = False
    
    # 確保 page key 存在於字典
    if page_key not in zh_data:
        zh_data[page_key] = {}
        en_data[page_key] = {}
    
    # 1. 注入 Hook (如果還沒有)
    if "useTranslation" not in content:
        # 添加 import
        if 'import { useTranslation }' not in content:
            last_import = content.rfind("import ")
            end_of_import = content.find("\n", last_import) + 1
            content = content[:end_of_import] + 'import { useTranslation } from "react-i18next";\nimport SEOHead from "@/components/seo/SEOHead";\n' + content[end_of_import:]
        
        # 添加 hook
        export_match = re.search(r"export default function \w+\(\) \{", content)
        if export_match:
            idx = export_match.end()
            content = content[:idx] + '\n  const { t } = useTranslation();' + content[idx:]
            modified = True
    
    # 2. 注入 SEOHead (如果還沒有)
    if "<SEOHead" not in content:
        return_match = re.search(r"return \(\s*<div", content)  # 假設大多數頁面以 <div 開頭
        if not return_match:
            return_match = re.search(r"return \(\s*<>", content)
            
        if return_match:
            idx = return_match.end()
            content = content[:idx] + f'\n      <SEOHead pageKey="{page_key}" />' + content[idx:]
            modified = True
    
    # 3. 替換 JSX 文字 >中文<
    # 邏輯：尋找 > 之後、< 之前的中文
    def replace_jsx_text(match):
        prefix = match.group(1)  # >
        text = match.group(2)   # 中文內容
        suffix = match.group(3)  # <
        
        if not re.search(r"[\u4e00-\u9fff]", text):
            return match.group(0)
        if any(re.search(p, text) for p in EXCLUDE_PATTERNS):
            return match.group(0)
        
        # 檢查是否已存在 (避免重複生成)
        key = generate_hash_key(text)
        full_key = f"{page_key}.{key}"
        
        # 寫入字典
        zh_data[page_key][key] = text.strip()
        if key not in en_data[page_key]:  # 英文暫時用中文佔位，標記 TODO
            en_data[page_key][key] = f"[EN] {text.strip()}"
            
        return f"{prefix}{{t('{full_key}')}}{suffix}"
    
    content = re.sub(r"(>)([^<>{}]+?[\u4e00-\u9fff]+[^<>{}]*?)(<)", replace_jsx_text, content)
    
    # 4. 替換屬性文字 placeholder="中文"
    def replace_attr(match):
        attr = match.group(1)
        text = match.group(2)
        
        if not re.search(r"[\u4e00-\u9fff]", text):
            return match.group(0)
        
        key = generate_hash_key(text)
        full_key = f"{page_key}.{key}"
        
        zh_data[page_key][key] = text.strip()
        if key not in en_data[page_key]:
            en_data[page_key][key] = f"[EN] {text.strip()}"
            
        return f"{attr}={{t('{full_key}')}}"
    
    content = re.sub(r'([a-zA-Z-]+)="([^"]*?[\u4e00-\u9fff]+[^"]*?)"', replace_attr, content)
    
    # 寫回檔案
    with open(file_path, "w", encoding="utf-8") as f:
        f.write(content)
    
    print(f"✅ Processed: {file_path.name}")

# 執行遍歷
print("🚀 Starting Universal Fixer...")
for root, dirs, files in os.walk(PAGES_DIR):
    for file in files:
        if file.endswith(".tsx"):
            process_file(Path(root) / file)

# 寫回字典
with open(LOCALE_PATH, "w", encoding="utf-8") as f:
    json.dump(zh_data, f, ensure_ascii=False, indent=2)
with open(EN_LOCALE_PATH, "w", encoding="utf-8") as f:
    json.dump(en_data, f, ensure_ascii=False, indent=2)

print("💾 Dictionaries Updated!")
print(f"📊 Total pages processed: {len(zh_data)}")
print(f"📊 Total translation keys: {sum(len(v) if isinstance(v, dict) else 0 for v in zh_data.values())}")

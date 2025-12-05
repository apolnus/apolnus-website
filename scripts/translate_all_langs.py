#!/usr/bin/env python3
import os
import json
import urllib.request
import time
import re
from pathlib import Path

# 路徑設定
LOCALE_DIR = Path("client/src/i18n/locales")
MASTER_FILE = LOCALE_DIR / "zh-TW.json"

# 目標語言與 AI 指令
TARGET_LANGS = {
    "zh-CN": "Simplified Chinese (Mainland China usage, e.g., 軟體->软件, 透過->通过)",
    "ja": "Japanese (Polite/Keigo, Premium home appliance tone)",
    "ko": "Korean (Formal polite '합니다' style)",
    "de": "German (Formal, Professional)",
    "fr": "French (Elegant, Formal)"
}

# 排除不需要翻譯的 Namespace (管理後台)
IGNORE_NAMESPACES = [
    "admin",
    "adminSubscribers",
    "adminPartners",
    "adminSettings",
    "adminProductModels",
    "adminFAQs",
    "adminWarranties",
    "adminTickets",
    "adminDealers",
    "adminServiceCenters"
]

# API 設定
BASE_URL = os.environ.get("BUILT_IN_FORGE_API_URL", "https://forge.manus.im")
BASE_URL = BASE_URL.rstrip('/')
API_URL = f"{BASE_URL}/v1/chat/completions"
API_KEY = os.environ.get("BUILT_IN_FORGE_API_KEY") or os.environ.get("VITE_APP_ID")

if not API_KEY:
    try:
        with open(".env", "r") as f:
            for line in f:
                if line.startswith("BUILT_IN_FORGE_API_KEY="):
                    API_KEY = line.strip().split("=", 1)[1]
                if line.startswith("BUILT_IN_FORGE_API_URL="):
                    BASE_URL = line.strip().split("=", 1)[1].rstrip('/')
                    API_URL = f"{BASE_URL}/v1/chat/completions"
    except:
        pass

if not API_KEY:
    print("❌ 錯誤：找不到 API Key")
    exit(1)

def load_json(path):
    if path.exists():
        with open(path, "r", encoding="utf-8") as f:
            return json.load(f)
    return {}

def save_json(path, data):
    with open(path, "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=2)

def clean_and_parse_json(content):
    try:
        return json.loads(content)
    except:
        match = re.search(r"```(?:json)?\s*(\{.*?\})\s*```", content, re.DOTALL)
        if match:
            return json.loads(match.group(1))
        start, end = content.find('{'), content.rfind('}')
        if start != -1 and end != -1:
            return json.loads(content[start:end+1])
        raise

def call_llm(text_map, lang_instruction):
    prompt = f"""You are a professional translator for "Apolnus" (High-end appliances).
Translate Traditional Chinese to {lang_instruction}.

RULES:
1. Output VALID JSON ONLY. No markdown.
2. Keep terms: "Apolnus", "Ultra S7", "One X", "SmartCasa".
3. Professional tone.
"""
    
    payload = {
        "model": "gemini-2.5-flash",
        "messages": [
            {"role": "system", "content": prompt},
            {"role": "user", "content": json.dumps(text_map, ensure_ascii=False)}
        ]
    }
    
    req = urllib.request.Request(
        API_URL,
        data=json.dumps(payload).encode('utf-8'),
        headers={"Content-Type": "application/json", "Authorization": f"Bearer {API_KEY}"}
    )
    try:
        with urllib.request.urlopen(req) as response:
            res = json.loads(response.read().decode('utf-8'))
            return clean_and_parse_json(res['choices'][0]['message']['content'])
    except Exception as e:
        print(f"⚠️ API Error: {e}")
        return {}

def main():
    print("🚀 啟動多國語言矩陣翻譯...")
    master_data = load_json(MASTER_FILE)
    
    for lang_code, instruction in TARGET_LANGS.items():
        target_file = LOCALE_DIR / f"{lang_code}.json"
        print(f"\n🌍 正在處理: {lang_code}...")
        
        current_data = load_json(target_file)
        
        # 遍歷 Master 的第一層 Key (通常是 Page Name)
        # 這樣可以避開 IGNORE_NAMESPACES
        changes_made = False
        
        for page, content in master_data.items():
            # 1. 檢查是否為排除的 Namespace (管理後台)
            if page in IGNORE_NAMESPACES or page.startswith("admin"):
                continue
                
            # 2. 準備目標結構
            if page not in current_data:
                current_data[page] = {}
            
            # 3. 找出缺失的 Key
            missing_map = {}
            for key, text in content.items():
                if key not in current_data[page] or (isinstance(current_data[page].get(key), str) and current_data[page].get(key).startswith("[EN]")):
                    missing_map[key] = text
            
            if not missing_map:
                continue
                
            print(f"   📄 {page}: 補齊 {len(missing_map)} 條翻譯...")
            
            # 批次翻譯 (Batch Size 15)
            BATCH_SIZE = 15
            keys_list = list(missing_map.keys())
            
            for i in range(0, len(keys_list), BATCH_SIZE):
                batch_keys = keys_list[i:i+BATCH_SIZE]
                batch_input = {k: missing_map[k] for k in batch_keys}
                
                translated = call_llm(batch_input, instruction)
                
                if translated:
                    for k, v in translated.items():
                        if k in batch_input:
                            current_data[page][k] = v
                            changes_made = True
                
                time.sleep(1)
        
        if changes_made:
            save_json(target_file, current_data)
            print(f"   ✅ {lang_code}.json 更新完成！")
        else:
            print(f"   ✅ {lang_code}.json 已是最新。")

if __name__ == "__main__":
    main()

#!/usr/bin/env python3
"""
AI 自動翻譯腳本
使用 Forge API 將 en.json 中的 [EN] 佔位符翻譯為專業英文
"""
import os
import json
import urllib.request
import time
from pathlib import Path

# 設定
LOCALE_DIR = Path("client/src/i18n/locales")
TARGET_FILE = LOCALE_DIR / "en.json"
BASE_URL = os.environ.get("BUILT_IN_FORGE_API_URL", "https://forge.manus.ai")
API_URL = f"{BASE_URL}/v1/chat/completions" if not BASE_URL.endswith('/completions') else BASE_URL
API_KEY = os.environ.get("BUILT_IN_FORGE_API_KEY") or os.environ.get("VITE_APP_ID")  # Fallback check

# 如果環境變數沒抓到，嘗試讀取 .env
if not API_KEY:
    try:
        with open(".env", "r") as f:
            for line in f:
                if line.startswith("BUILT_IN_FORGE_API_KEY="):
                    API_KEY = line.strip().split("=", 1)[1]
                    break
    except:
        pass

if not API_KEY:
    print("❌ 錯誤：找不到 BUILT_IN_FORGE_API_KEY，無法進行 AI 翻譯")
    exit(1)

def call_llm(text_map):
    """調用 LLM API 進行翻譯"""
    prompt = f"""You are a professional translator for a high-end home appliance brand "Apolnus".
Translate the following Traditional Chinese texts to English.

Requirements:
1. Tone: Professional, Premium, Confident.
2. Keep specific terms: "Apolnus", "Ultra S7", "One X".
3. Return ONLY a valid JSON object mapping the keys to the translated values.
4. DO NOT include any explanation, just return the JSON object.

Input JSON:
{json.dumps(text_map, ensure_ascii=False)}

Output JSON (keys must match input keys exactly):
"""
    
    payload = {
        "model": "gemini-2.0-flash-exp",
        "messages": [
            {"role": "user", "content": prompt}
        ]
    }
    
    req = urllib.request.Request(
        API_URL,
        data=json.dumps(payload).encode('utf-8'),
        headers={
            "Content-Type": "application/json",
            "Authorization": f"Bearer {API_KEY}"
        }
    )
    
    try:
        print(f"  → API URL: {API_URL}")
        print(f"  → Payload size: {len(json.dumps(payload))} bytes")
        with urllib.request.urlopen(req) as response:
            result = json.loads(response.read().decode('utf-8'))
            content = result['choices'][0]['message']['content'].strip()
            
            # Try to extract JSON from markdown code blocks
            if content.startswith('```'):
                lines = content.split('\n')
                content = '\n'.join(lines[1:-1])  # Remove first and last line (```json and ```)
            
            # Try to find JSON object in the content
            start_idx = content.find('{')
            end_idx = content.rfind('}') + 1
            if start_idx >= 0 and end_idx > start_idx:
                content = content[start_idx:end_idx]
            
            return json.loads(content)
    except urllib.error.HTTPError as e:
        print(f"⚠️ HTTP Error {e.code}: {e.reason}")
        print(f"  → Response: {e.read().decode('utf-8') if e.fp else 'No response body'}")
        return {}
    except Exception as e:
        print(f"⚠️ API 調用失敗: {e}")
        import traceback
        traceback.print_exc()
        return {}

def process_translations():
    """處理翻譯"""
    print("🚀 開始 AI 自動翻譯 (zh-TW -> en)...")
    
    with open(TARGET_FILE, "r", encoding="utf-8") as f:
        data = json.load(f)
    
    # 找出所有需要翻譯的項目 (遞迴搜尋)
    tasks = {}
    
    def find_tasks(obj, path=""):
        for k, v in obj.items():
            curr_path = f"{path}.{k}" if path else k
            if isinstance(v, dict):
                find_tasks(v, curr_path)
            elif isinstance(v, str) and v.startswith("[EN] "):
                # 提取原始中文: "[EN] 產品介紹" -> "產品介紹"
                tasks[curr_path] = v.replace("[EN] ", "")
    
    find_tasks(data)
    total = len(tasks)
    print(f"📋 發現 {total} 個待翻譯項目")
    
    if total == 0:
        print("✅ 沒有需要翻譯的項目")
        return
    
    # 批次處理 (每批 5 個，避免 JSON 解析錯誤)
    batch_size = 5
    task_items = list(tasks.items())
    
    for i in range(0, total, batch_size):
        batch = dict(task_items[i:i+batch_size])
        print(f"🔄 處理批次 {i//batch_size + 1}/{(total + batch_size - 1)//batch_size} ({len(batch)} 個項目)...")
        
        translations = call_llm(batch)
        
        # 更新原始資料
        for key_path, translated_text in translations.items():
            # 更新 nested dict
            keys = key_path.split('.')
            target = data
            for k in keys[:-1]:
                target = target[k]
            target[keys[-1]] = translated_text
            print(f"  ✓ {key_path}")
        
        # 稍微延遲避免 Rate Limit
        time.sleep(1)
    
    # 寫回檔案
    with open(TARGET_FILE, "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
    
    print(f"✅ 翻譯完成！{total} 個項目已更新到 en.json")

if __name__ == "__main__":
    process_translations()

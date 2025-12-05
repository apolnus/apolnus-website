#!/usr/bin/env python3
import re

# 讀取原始檔案
with open('client/src/components/Footer.tsx', 'r', encoding='utf-8') as f:
    lines = f.readlines()

# 處理每一行
output_lines = []
i = 0
while i < len(lines):
    line = lines[i]
    
    # 檢查是否是Link開始行
    if '<Link href=' in line and '>' in line and not 'onClick' in line:
        # 提取href
        href_match = re.search(r'href="([^"]*)"', line)
        if href_match:
            href = href_match.group(1)
            indent = len(line) - len(line.lstrip())
            
            # 檢查下一行是否是div with onClick
            if i + 1 < len(lines) and '<div onClick={scrollToTop}' in lines[i + 1]:
                # 提取className
                class_match = re.search(r'className="([^"]*)"', lines[i + 1])
                if class_match:
                    class_name = class_match.group(1)
                    
                    # 收集內容直到</div>
                    content_lines = []
                    j = i + 2
                    while j < len(lines) and '</div>' not in lines[j]:
                        content_lines.append(lines[j].strip())
                        j += 1
                    
                    # 提取</div>前的內容
                    if j < len(lines):
                        last_line = lines[j].strip()
                        if last_line.startswith('</div>'):
                            # 重構為正確的Link結構
                            output_lines.append(' ' * indent + f'<Link href="{href}" onClick={{scrollToTop}}>\n')
                            output_lines.append(' ' * (indent + 2) + f'<span className="{class_name}">\n')
                            for content in content_lines:
                                output_lines.append(' ' * (indent + 4) + content + '\n')
                            output_lines.append(' ' * (indent + 2) + '</span>\n')
                            output_lines.append(' ' * indent + '</Link>\n')
                            
                            # 跳過已處理的行
                            i = j + 2  # 跳過</Link>行
                            continue
    
    output_lines.append(line)
    i += 1

# 寫回檔案
with open('client/src/components/Footer.tsx', 'w', encoding='utf-8') as f:
    f.writelines(output_lines)

print("✅ Footer.tsx修復完成")

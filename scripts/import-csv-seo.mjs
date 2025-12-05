import { readFileSync } from 'fs';
import mysql from 'mysql2/promise';

const csvPath = '/home/ubuntu/upload/seoSettings_20251124_060055.csv';
const csvContent = readFileSync(csvPath, 'utf-8');

// 解析 CSV (簡單實作,假設沒有複雜的引號處理)
const lines = csvContent.trim().split('\n');
const headers = lines[0].split(',');

console.log(`CSV 標題: ${headers.join(', ')}`);
console.log(`準備導入 ${lines.length - 1} 筆 SEO 資料...`);

const connection = await mysql.createConnection(process.env.DATABASE_URL);

let successCount = 0;
let errorCount = 0;

for (let i = 1; i < lines.length; i++) {
  const line = lines[i];
  
  // 處理包含逗號的欄位(用引號包裹)
  const fields = [];
  let currentField = '';
  let inQuotes = false;
  
  for (let j = 0; j < line.length; j++) {
    const char = line[j];
    
    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      fields.push(currentField);
      currentField = '';
    } else {
      currentField += char;
    }
  }
  fields.push(currentField); // 最後一個欄位
  
  if (fields.length < 6) {
    console.warn(`第 ${i + 1} 行資料不完整,跳過`);
    errorCount++;
    continue;
  }
  
  const [id, page, language, title, description, keywords] = fields;
  
  try {
    await connection.execute(
      `INSERT INTO seoSettings (page, language, title, description, keywords) 
       VALUES (?, ?, ?, ?, ?) 
       ON DUPLICATE KEY UPDATE 
       title = VALUES(title), 
       description = VALUES(description), 
       keywords = VALUES(keywords)`,
      [page, language, title, description, keywords]
    );
    successCount++;
  } catch (error) {
    console.error(`第 ${i + 1} 行導入失敗:`, error.message);
    errorCount++;
  }
}

await connection.end();

console.log(`\n✅ 導入完成!`);
console.log(`成功: ${successCount} 筆`);
console.log(`失敗: ${errorCount} 筆`);

process.exit(0);

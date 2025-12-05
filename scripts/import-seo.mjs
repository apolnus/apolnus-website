import { drizzle } from 'drizzle-orm/mysql2';
import { seoSettings } from '../drizzle/schema.ts';

// 從上傳的檔案讀取 SEO 配置
const seoConfigPath = '/home/ubuntu/upload/client/src/config/seo.ts';

// 讀取並解析 seo.ts
import { readFileSync } from 'fs';
const seoContent = readFileSync(seoConfigPath, 'utf-8');

// 提取 seoConfig 物件
const seoConfigMatch = seoContent.match(/export const seoConfig: Record<string, PageSEO> = ({[\s\S]*?});?\s*$/m);
if (!seoConfigMatch) {
  console.error('無法找到 seoConfig');
  process.exit(1);
}

// 使用 eval 解析配置 (僅用於導入腳本)
const seoConfig = eval(`(${seoConfigMatch[1]})`);

// 連接資料庫
const db = drizzle(process.env.DATABASE_URL);

// 準備插入資料
const insertData = [];

for (const [page, languages] of Object.entries(seoConfig)) {
  for (const [language, config] of Object.entries(languages)) {
    insertData.push({
      page,
      language,
      title: config.title,
      description: config.description || '',
      keywords: config.keywords || '',
    });
  }
}

console.log(`準備導入 ${insertData.length} 筆 SEO 資料...`);

// 批次插入 - 使用原生 SQL 避免 Drizzle 欄位名稱問題
import mysql from 'mysql2/promise';

try {
  const connection = await mysql.createConnection(process.env.DATABASE_URL);
  
  for (const data of insertData) {
    await connection.execute(
      `INSERT INTO seoSettings (page, language, title, description, keywords) 
       VALUES (?, ?, ?, ?, ?) 
       ON DUPLICATE KEY UPDATE 
       title = VALUES(title), 
       description = VALUES(description), 
       keywords = VALUES(keywords)`,
      [data.page, data.language, data.title, data.description, data.keywords]
    );
  }
  
  await connection.end();
  console.log('✅ SEO 資料導入成功!');
} catch (error) {
  console.error('❌ 導入失敗:', error);
  process.exit(1);
}

process.exit(0);

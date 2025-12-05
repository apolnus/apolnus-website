import { getDb } from './server/db.ts';
import * as schema from './drizzle/schema.ts';
import fs from 'fs';

async function importServiceCenters() {
  console.log('開始匯入授權維修中心資料...');
  
  const db = await getDb();
  if (!db) {
    console.error('無法連接資料庫');
    return;
  }
  
  // 讀取 CSV 檔案
  const csvContent = fs.readFileSync('/home/ubuntu/upload/service_centers_20251122_085141.csv', 'utf-8');
  const lines = csvContent.split('\n').filter(line => line.trim());
  
  // 跳過標題行
  const dataLines = lines.slice(1);
  
  let successCount = 0;
  let errorCount = 0;
  
  for (const line of dataLines) {
    try {
      // 解析 CSV 行（處理可能包含逗號的欄位）
      const fields = line.match(/(".*?"|[^,]+)(?=\s*,|\s*$)/g) || [];
      const cleanFields = fields.map(f => f.replace(/^"|"$/g, '').trim());
      
      if (cleanFields.length < 8) {
        console.log(`跳過無效行: ${line}`);
        continue;
      }
      
      const [id, nameZhTw, nameZhCn, nameJa, nameEn, nameKo, country, address, phone, email, website, latitude, longitude, businessHours] = cleanFields;
      
      // 插入資料到 serviceCenters 表
      await db.insert(schema.serviceCenters).values({
        name: nameZhTw, // 使用繁體中文名稱
        phone: phone || '',
        address: address || '',
        businessHours: businessHours || null,
        services: null,
        latitude: latitude ? parseFloat(latitude) : null,
        longitude: longitude ? parseFloat(longitude) : null,
      });
      
      successCount++;
      console.log(`✓ 成功匯入: ${nameZhTw}`);
    } catch (error) {
      errorCount++;
      console.error(`✗ 匯入失敗: ${line}`, error.message);
    }
  }
  
  console.log(`\n授權維修中心匯入完成！成功: ${successCount}, 失敗: ${errorCount}`);
}

async function importDealers() {
  console.log('\n開始匯入授權經銷商資料...');
  
  const db = await getDb();
  if (!db) {
    console.error('無法連接資料庫');
    return;
  }
  
  // 原本購買通路頁面的經銷商資料
  const dealers = [
    {
      name: "How living 秀泰文心店",
      phone: "04-2473-8980",
      address: "臺中市南屯區文心南路289號5樓",
      businessHours: null,
      latitude: null,
      longitude: null,
    },
  ];
  
  let successCount = 0;
  let errorCount = 0;
  
  for (const dealer of dealers) {
    try {
      await db.insert(schema.dealers).values(dealer);
      successCount++;
      console.log(`✓ 成功匯入: ${dealer.name}`);
    } catch (error) {
      errorCount++;
      console.error(`✗ 匯入失敗: ${dealer.name}`, error.message);
    }
  }
  
  console.log(`\n授權經銷商匯入完成！成功: ${successCount}, 失敗: ${errorCount}`);
}

async function main() {
  try {
    await importServiceCenters();
    await importDealers();
    console.log('\n所有資料匯入完成！');
    process.exit(0);
  } catch (error) {
    console.error('匯入過程發生錯誤:', error);
    process.exit(1);
  }
}

main();

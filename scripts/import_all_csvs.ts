import fs from 'fs';
import path from 'path';
import { createClient } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";
import * as schema from '../drizzle/schema';
import { sql } from 'drizzle-orm';
import 'dotenv/config';

// 定義 CSV 檔案與 Table 的對應
const CSV_MAPPING = [
    { file: 'authorizedDealers_20251205_104217.csv', table: schema.authorizedDealers, name: 'authorizedDealers' },
    { file: 'authorizedServiceCenters_20251205_104221.csv', table: schema.authorizedServiceCenters, name: 'authorizedServiceCenters' },
    { file: 'faqs_20251205_104224.csv', table: schema.faqs, name: 'faqs' },
    { file: 'jobs_20251205_104227.csv', table: schema.jobs, name: 'jobs' },
    { file: 'onlineStores_20251205_104234.csv', table: schema.onlineStores, name: 'onlineStores' },
    { file: 'productModels_20251205_104239.csv', table: schema.productModels, name: 'productModels' },
    { file: 'seoSettings_20251205_104245.csv', table: schema.seoSettings, name: 'seoSettings' },
    { file: 'siteSettings_20251205_104248.csv', table: schema.siteSettings, name: 'siteSettings' },
    { file: 'socialLinks_20251205_104251.csv', table: schema.socialLinks, name: 'socialLinks' },
    { file: 'subscribers_20251205_104254.csv', table: schema.subscribers, name: 'subscribers' },
    { file: 'ticketReplies_20251205_104305.csv', table: schema.ticketReplies, name: 'ticketReplies' },
    { file: 'warrantyRegistrations_20251205_104310.csv', table: schema.warrantyRegistrations, name: 'warrantyRegistrations' },
];

/**
 * 解析 CSV 行，處理引號內的逗號與雙引號跳脫
 */
function parseCSVLine(line: string): string[] {
    const result: string[] = [];
    let currentToken = '';
    let inQuotes = false;

    for (let i = 0; i < line.length; i++) {
        const char = line[i];

        if (inQuotes) {
            if (char === '"') {
                if (i + 1 < line.length && line[i + 1] === '"') {
                    // 雙引號跳脫 "" -> "
                    currentToken += '"';
                    i++;
                } else {
                    // 結束引號
                    inQuotes = false;
                }
            } else {
                currentToken += char;
            }
        } else {
            if (char === '"') {
                inQuotes = true;
            } else if (char === ',') {
                result.push(currentToken);
                currentToken = '';
            } else {
                currentToken += char;
            }
        }
    }
    result.push(currentToken); // Push last token
    return result;
}

function processValue(value: string, fieldName: string, tableName: string) {
    if (value === '' || value === 'NULL') return null;

    // 處理 JSON 欄位
    if (
        (tableName === 'faqs' && ['question', 'answer', 'relatedProducts'].includes(fieldName)) ||
        (tableName === 'ticketReplies' && fieldName === 'attachments')
    ) {
        try {
            // 嘗試解析 JSON，若失敗則回傳原字串或空物件
            return JSON.parse(value);
        } catch (e) {
            // console.warn(`[Warn] Bad JSON in ${tableName}.${fieldName}:`, value);
            return value === '[]' ? [] : {};
        }
    }

    // 處理數值
    if (['isActive', 'order', 'displayOrder', 'id', 'userId', 'ticketId'].includes(fieldName)) {
        return parseInt(value, 10);
    }

    if (fieldName === 'latitude' || fieldName === 'longitude') {
        return value ? value : null; // Keep as string
    }

    // 處理日期 (SQLite 無 Date 型別，使用 integer timestamp 或 ISO string)
    if (fieldName.endsWith('At') || fieldName.endsWith('Date')) {
        const date = new Date(value);
        if (isNaN(date.getTime())) return null;
        return date; // Drizzle handles Date object -> timestamp conversion based on schema mode
    }

    return value;
}

async function importCSV(filePath: string, table: any, tableName: string, db: any) {
    const fullPath = path.resolve(process.cwd(), '..', filePath);

    if (!fs.existsSync(fullPath)) {
        console.log(`[Skip] 檔案不存在: ${filePath}`);
        return;
    }

    console.log(`\n[Start] 匯入 ${tableName}...`);
    const content = fs.readFileSync(fullPath, 'utf-8');
    const lines = content.split('\n').filter(l => l.trim().length > 0);

    if (lines.length <= 1) {
        console.log(`[Info] ${tableName} 無資料 (僅標題)`);
        return;
    }

    const headers = parseCSVLine(lines[0].trim());
    const dataRows = lines.slice(1);
    const valuesToInsert: any[] = [];

    for (const line of dataRows) {
        const values = parseCSVLine(line.trim());
        if (values.length !== headers.length) {
            continue;
        }

        const row: any = {};
        headers.forEach((header, index) => {
            row[header] = processValue(values[index], header, tableName);
        });
        valuesToInsert.push(row);
    }

    if (valuesToInsert.length > 0) {
        // LibSQL: 分批 Insert，避免 payload 過大
        const BATCH_SIZE = 50;
        for (let i = 0; i < valuesToInsert.length; i += BATCH_SIZE) {
            const batch = valuesToInsert.slice(i, i + BATCH_SIZE);
            try {
                await db.insert(table).values(batch).onConflictDoNothing();
            } catch (e) {
                console.error(`[Error] 匯入批次失敗 (${tableName}):`, e);
            }
        }
        console.log(`[Success] 已處理 ${valuesToInsert.length} 筆資料至 ${tableName}`);
    }
}

async function main() {
    const client = createClient({ url: 'file:sqlite.db' });
    const db = drizzle(client);

    // SQLite 不支援 SET FOREIGN_KEY_CHECKS，使用 PRAGMA
    await client.execute("PRAGMA foreign_keys = OFF");

    for (const { file, table, name } of CSV_MAPPING) {
        await importCSV(file, table, name, db);
    }

    await client.execute("PRAGMA foreign_keys = ON");
    console.log('\n所有 CSV 匯入完成！');
    process.exit(0);
}

main().catch(console.error);

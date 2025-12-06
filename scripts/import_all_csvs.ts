import fs from 'fs';
import path from 'path';
import { drizzle } from "drizzle-orm/mysql2";
import mysql from 'mysql2/promise';
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

    // 處理日期
    if (fieldName.endsWith('At') || fieldName.endsWith('Date')) {
        const date = new Date(value);
        if (isNaN(date.getTime())) return null;
        return date;
    }

    return value;
}

async function importCSV(filePath: string, table: any, tableName: string, db: any) {
    // 優先在當前目錄尋找，如果沒有才往上找 (兼容本地開發與 Docker)
    let fullPath = path.resolve(process.cwd(), filePath);
    if (!fs.existsSync(fullPath)) {
        fullPath = path.resolve(process.cwd(), '..', filePath);
    }

    if (!fs.existsSync(fullPath)) {
        console.log(`[Skip] 檔案不存在: ${filePath} (嘗試了 . 和 ..)`);
        return;
    }

    console.log(`\n[Start] 匯入 ${tableName}...`);
    const content = fs.readFileSync(fullPath, 'utf-8');

    // 使用自定義分割函數處理引號內的換行
    const lines = splitCSVContent(content).filter(l => l.trim().length > 0);

    // ... (rest of the code)
}

/**
 * 分割 CSV 內容為行，但忽略引號內的換行符
 */
function splitCSVContent(content: string): string[] {
    const lines: string[] = [];
    let currentLine = '';
    let inQuotes = false;

    for (let i = 0; i < content.length; i++) {
        const char = content[i];

        if (char === '"') {
            // 檢查是否是跳脫的引號 ("")
            if (inQuotes && i + 1 < content.length && content[i + 1] === '"') {
                currentLine += '"';
                i++; // 跳過下一個引號
                // 狀態保持不變 (仍在引號內)
                continue;
            }
            inQuotes = !inQuotes;
        }

        if (char === '\n' && !inQuotes) {
            lines.push(currentLine);
            currentLine = '';
        } else if (char === '\r' && !inQuotes) {
            // 忽略 \r 如果後面跟著 \n，或者直接忽略
            if (i + 1 < content.length && content[i + 1] === '\n') {
                i++;
                lines.push(currentLine);
                currentLine = '';
            }
        } else {
            currentLine += char;
        }
    }
    if (currentLine.length > 0) {
        lines.push(currentLine);
    }
    return lines;


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
        // 分批 Insert，避免 payload 過大
        const BATCH_SIZE = 50;
        for (let i = 0; i < valuesToInsert.length; i += BATCH_SIZE) {
            const batch = valuesToInsert.slice(i, i + BATCH_SIZE);
            try {
                // @ts-ignore
                await db.insert(table).values(batch);
            } catch (e: any) {
                // 若是重複鍵值錯誤 (ER_DUP_ENTRY)，則忽略 (模擬 Ignore 行為)
                if (e.code === 'ER_DUP_ENTRY') {
                    console.log(`[Info] 部分資料已存在 (${tableName})，跳過批次`);
                } else {
                    console.error(`[Error] 匯入批次失敗 (${tableName}):`, e);
                }
            }
        }
        console.log(`[Done] 已處理 ${valuesToInsert.length} 筆資料至 ${tableName}`);
    }
}

async function main() {
    const databaseUrl = process.env.DATABASE_URL;
    if (!databaseUrl) {
        console.error('[Error] DATABASE_URL environment variable is not set');
        process.exit(1);
    }

    // 支援 SSL 連線，這對於外部連線至 Zeabur MySQL 是必需的
    const connection = await mysql.createConnection({
        uri: databaseUrl,
        ssl: {
            rejectUnauthorized: false
        }
    });
    const db = drizzle(connection);

    // MySQL: 停用外鍵檢查
    await connection.execute("SET FOREIGN_KEY_CHECKS = 0");

    for (const { file, table, name } of CSV_MAPPING) {
        await importCSV(file, table, name, db);
    }

    // 恢復外鍵檢查
    await connection.execute("SET FOREIGN_KEY_CHECKS = 1");

    await connection.end();
    console.log('\n所有 CSV 匯入完成！');
    process.exit(0);
}

main().catch(console.error);

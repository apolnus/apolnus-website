import fs from 'fs';
import path from 'path';
import { drizzle } from "drizzle-orm/mysql2";
import mysql from 'mysql2/promise';
import * as schema from '../drizzle/schema';
import 'dotenv/config';

// CSV File to restore
const CSV_FILE = 'users_20251206_072842.csv';

function parseCSVLine(line: string): string[] {
    const result: string[] = [];
    let currentToken = '';
    let inQuotes = false;

    for (let i = 0; i < line.length; i++) {
        const char = line[i];
        if (inQuotes) {
            if (char === '"') {
                if (i + 1 < line.length && line[i + 1] === '"') {
                    currentToken += '"';
                    i++;
                } else {
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
    result.push(currentToken);
    return result;
}

function processValue(value: string) {
    if (value === '' || value === 'NULL') return null;
    return value;
}

async function main() {
    // Use the known working URI directly since .env might be tricky in this context
    const databaseUrl = 'mysql://root:Bju81O0Kx7iHVEQDCqwN2UJIt534Wg69@sjc1.clusters.zeabur.com:24053/zeabur?ssl={"rejectUnauthorized":false}';

    const connection = await mysql.createConnection({
        uri: databaseUrl,
        ssl: { rejectUnauthorized: false }
    });
    const db = drizzle(connection);

    let fullPath = path.resolve(process.cwd(), CSV_FILE);
    if (!fs.existsSync(fullPath)) {
        fullPath = path.resolve(process.cwd(), '..', CSV_FILE);
    }

    if (!fs.existsSync(fullPath)) {
        console.error(`[Error] File not found: ${CSV_FILE}`);
        process.exit(1);
    }

    console.log(`[Start] Restoring users from ${CSV_FILE}...`);
    const content = fs.readFileSync(fullPath, 'utf-8');
    const lines = content.split(/\r?\n/).filter(l => l.trim().length > 0);

    if (lines.length <= 1) {
        console.log(`[Info] No data found`);
        return;
    }

    const headers = parseCSVLine(lines[0].trim());
    const dataRows = lines.slice(1);

    let successCount = 0;
    let errorCount = 0;

    for (const line of dataRows) {
        const values = parseCSVLine(line.trim());
        if (values.length !== headers.length) continue;

        const row: any = {};
        headers.forEach((header, index) => {
            row[header] = processValue(values[index]);
        });

        // Skip if critical data is missing
        if (!row.openId) continue;

        try {
            // Explicit UPSERT query to ensure role is updated even if user exists
            // We use raw SQL for precise control over ON DUPLICATE KEY UPDATE
            const sql = `
            INSERT INTO users (openId, name, email, avatar, loginMethod, role, phone, address, createdAt, updatedAt, lastSignedIn)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            ON DUPLICATE KEY UPDATE
              name = VALUES(name),
              email = VALUES(email),
              avatar = VALUES(avatar),
              role = VALUES(role),
              phone = VALUES(phone),
              address = VALUES(address),
              updatedAt = VALUES(updatedAt)
          `;

            const params = [
                row.openId,
                row.name,
                row.email,
                row.avatar,
                row.loginMethod,
                row.role || 'user', // Default to user if null
                row.phone,
                row.address,
                row.createdAt ? new Date(row.createdAt) : new Date(),
                new Date(), // updatedAt
                row.lastSignedIn ? new Date(row.lastSignedIn) : new Date()
            ];

            await connection.execute(sql, params);
            process.stdout.write('.');
            successCount++;
        } catch (e: any) {
            console.error(`\n[Error] Failed to upsert ${row.name} (${row.email}):`, e.message);
            errorCount++;
        }
    }

    console.log(`\n\n[Done] Processed ${dataRows.length} rows.`);
    console.log(`Success: ${successCount}`);
    console.log(`Errors: ${errorCount}`);

    await connection.end();
    process.exit(0);
}

main().catch(console.error);

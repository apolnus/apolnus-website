import 'dotenv/config';
import { getDb } from '../server/db';
import { translations } from '../drizzle/schema';
import fs from 'fs/promises';
import path from 'path';
import { sql } from 'drizzle-orm';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


/**
 * Migration Script: JSON Files -> Database
 * 
 * This script reads existing i18n JSON files from client/src/i18n/locales
 * and upserts them into the 'translations' table in the database.
 */

const LOCALES_DIR = path.join(process.cwd(), 'client/src/i18n/locales');
// Check both 'locales' (common) and 'client/src/i18n/locales' (structure dependent)
// but since we are running with tsx from root, we need to be careful with paths.
// Let's assume script is run from project root.

async function main() {
    console.log('Starting translation migration...');
    const db = await getDb();

    try {
        const files = await fs.readdir(LOCALES_DIR);
        const jsonFiles = files.filter(f => f.endsWith('.json'));

        if (jsonFiles.length === 0) {
            console.warn('No JSON translation files found in', LOCALES_DIR);
            return;
        }

        let totalInserted = 0;

        for (const file of jsonFiles) {
            const lang = path.basename(file, '.json'); // e.g., 'zh-TW'
            console.log(`Processing ${lang}...`);

            const content = await fs.readFile(path.join(LOCALES_DIR, file), 'utf-8');
            const data = JSON.parse(content);

            // Flatten keys if nested. Although our admin supports flat keys, 
            // i18next usually uses nested. We'll flatten them for storage.
            // If the file is already flat (key: value), this function handles it too.
            const flattened = flattenObject(data);

            const records = Object.entries(flattened).map(([key, value]) => ({
                key,
                lang,
                value: String(value),
                namespace: 'translation', // default namespace
            }));

            if (records.length > 0) {
                // Upsert in batches
                const chunkSize = 100;
                for (let i = 0; i < records.length; i += chunkSize) {
                    const chunk = records.slice(i, i + chunkSize);
                    await db.insert(translations)
                        .values(chunk)
                        // Update the value on conflict so that JSON file translations
                        // always overwrite database entries (fixes zh-TW showing key instead of value)
                        .onDuplicateKeyUpdate({ set: { value: sql`VALUES(value)` } });
                }

                console.log(`  Imported ${records.length} keys for ${lang}`);
                totalInserted += records.length;
            }
        }

        console.log(`Migration completed! Total records processed: ${totalInserted}`);

    } catch (error) {
        console.error('Migration failed:', error);
        // Do not crash the deployment if migration fails (e.g. connectivity issues)
        // The server should still attempt to start.
        console.warn('Migration warning: Continuing startup despite migration failure.');
        process.exit(0);
    }
}

// Helper to flatten nested JSON object to dot notation
function flattenObject(ob: any, prefix = '', result: any = {}): any {
    for (const i in ob) {
        if ((typeof ob[i]) === 'object' && ob[i] !== null) {
            flattenObject(ob[i], prefix + i + '.', result);
        } else {
            result[prefix + i] = ob[i];
        }
    }
    return result;
}

main().catch(console.error);

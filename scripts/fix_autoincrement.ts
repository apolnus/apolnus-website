// @ts-nocheck
import mysql from 'mysql2/promise';

async function fixAutoIncrement() {
    const dbUrl = process.env.DATABASE_URL;
    if (!dbUrl) {
        console.error('DATABASE_URL environment variable is not set');
        process.exit(1);
    }

    const connection = await mysql.createConnection({
        uri: dbUrl,
        ssl: {
            rejectUnauthorized: false
        }
    });

    console.log('Connected to database');

    // 修復 users 表的 id 欄位
    console.log('Fixing users.id AUTO_INCREMENT...');
    await connection.execute('ALTER TABLE users MODIFY COLUMN id INT NOT NULL AUTO_INCREMENT;');
    console.log('✓ users.id fixed');

    // 修復其他表（如果需要的話）
    const tables = [
        'warrantyRegistrations',
        'supportTickets',
        'ticketReplies',
        'authorizedServiceCenters',
        'subscribers',
        'partners',
        'siteSettings',
        'productModels',
        'faqs',
        'authorizedDealers',
        'onlineStores',
        'jobs',
        'seoSettings',
        'socialLinks'
    ];

    for (const table of tables) {
        try {
            console.log(`Fixing ${table}.id AUTO_INCREMENT...`);
            await connection.execute(`ALTER TABLE ${table} MODIFY COLUMN id INT NOT NULL AUTO_INCREMENT;`);
            console.log(`✓ ${table}.id fixed`);
        } catch (e: any) {
            console.log(`⚠ ${table}: ${e.message}`);
        }
    }

    await connection.end();
    console.log('\n✅ All AUTO_INCREMENT fixes applied!');
}

fixAutoIncrement().catch(console.error);

import { drizzle } from 'drizzle-orm/mysql2';
import mysql from 'mysql2/promise';
import * as dotenv from 'dotenv';

dotenv.config();

const connection = await mysql.createConnection(process.env.DATABASE_URL);
const db = drizzle(connection);

console.log('📦 Backing up current FAQ data...');
const oldFaqs = await connection.query('SELECT * FROM faqs ORDER BY id');
console.log(`✅ Backed up ${oldFaqs[0].length} FAQs`);

// Save backup to JSON
import { writeFileSync } from 'fs';
writeFileSync('faqs_backup.json', JSON.stringify(oldFaqs[0], null, 2));
console.log('💾 Saved backup to faqs_backup.json');

console.log('\n🔄 Altering table structure...');

// Drop and recreate table with new structure
await connection.query('DROP TABLE IF EXISTS faqs_new');
await connection.query(`
  CREATE TABLE faqs_new (
    id INT AUTO_INCREMENT PRIMARY KEY,
    category VARCHAR(100) NOT NULL,
    relatedProducts JSON,
    question JSON NOT NULL,
    answer JSON NOT NULL,
    \`order\` INT NOT NULL DEFAULT 0,
    isActive INT NOT NULL DEFAULT 1,
    createdAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
  )
`);

console.log('✅ Created new table structure');

console.log('\n📝 Migrating data to new structure...');
for (const faq of oldFaqs[0]) {
  await connection.query(`
    INSERT INTO faqs_new (id, category, relatedProducts, question, answer, \`order\`, isActive, createdAt, updatedAt)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `, [
    faq.id,
    faq.category || '一般',
    JSON.stringify([]), // Empty array for now, will be set manually later
    JSON.stringify({ 'zh-TW': faq.question }),
    JSON.stringify({ 'zh-TW': faq.answer }),
    faq.order,
    faq.isActive,
    faq.createdAt,
    faq.updatedAt
  ]);
}

console.log(`✅ Migrated ${oldFaqs[0].length} FAQs`);

console.log('\n🔄 Replacing old table...');
await connection.query('DROP TABLE faqs');
await connection.query('RENAME TABLE faqs_new TO faqs');

console.log('✅ Migration complete!');

await connection.end();

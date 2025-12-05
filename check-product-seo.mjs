import mysql from 'mysql2/promise';

const conn = await mysql.createConnection(process.env.DATABASE_URL);

const [rows] = await conn.query(`
  SELECT page, title, description 
  FROM seoSettings 
  WHERE language = 'zh-TW' 
  AND (page LIKE 'product-%' OR page LIKE '%specs' OR page LIKE '%downloads' OR page LIKE '%faq')
  ORDER BY page
`);

console.log('產品頁面SEO記錄總數:', rows.length);
console.log('\n空白title的頁面:');
const emptyTitle = rows.filter(r => r.title === null || r.title.trim() === '');
emptyTitle.forEach(r => console.log(`  - ${r.page}`));

console.log('\n有title但無description的頁面:');
const emptyDesc = rows.filter(r => r.title && r.title.trim() !== '' && (r.description === null || r.description.trim() === ''));
emptyDesc.forEach(r => console.log(`  - ${r.page}: ${r.title}`));

console.log('\n完整的頁面:');
const complete = rows.filter(r => r.title && r.title.trim() !== '' && r.description && r.description.trim() !== '');
complete.forEach(r => console.log(`  - ${r.page}: ${r.title.substring(0, 50)}...`));

await conn.end();

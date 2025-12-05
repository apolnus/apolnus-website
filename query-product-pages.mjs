import mysql from 'mysql2/promise';

const connection = await mysql.createConnection(process.env.DATABASE_URL);

try {
  const [rows] = await connection.execute(
    "SELECT page, language, title FROM seoSettings WHERE (page LIKE '%specs%' OR page LIKE '%downloads%' OR page LIKE '%faq%' OR page LIKE '%one-x%') AND language = 'zh-TW' ORDER BY page"
  );
  console.log('Found', rows.length, 'product pages:');
  rows.forEach(row => console.log(` - ${row.page}: "${row.title}"`));
} catch (error) {
  console.error('Error:', error);
} finally {
  await connection.end();
}

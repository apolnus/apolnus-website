import mysql from 'mysql2/promise';

const connection = await mysql.createConnection(process.env.DATABASE_URL);

try {
  const [rows] = await connection.execute(
    "SELECT page, language, title FROM seoSettings WHERE page IN ('one-x', 'specs', 'downloads', 'faq') AND language = 'zh-TW'"
  );
  console.log('Found', rows.length, 'short page IDs:');
  rows.forEach(row => console.log(` - ${row.page}: "${row.title}"`));
} catch (error) {
  console.error('Error:', error);
} finally {
  await connection.end();
}

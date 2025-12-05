import mysql from 'mysql2/promise';

const connection = await mysql.createConnection(process.env.DATABASE_URL);

try {
  const [rows] = await connection.execute(
    "SELECT DISTINCT page FROM seoSettings WHERE page LIKE '%one%' OR page LIKE '%One%' ORDER BY page"
  );
  console.log('Found', rows.length, 'One X related pages:');
  rows.forEach(row => console.log(' -', row.page));
} catch (error) {
  console.error('Error:', error);
} finally {
  await connection.end();
}

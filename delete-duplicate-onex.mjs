import { drizzle } from 'drizzle-orm/mysql2';
import mysql from 'mysql2/promise';
import { sql } from 'drizzle-orm';

const connection = await mysql.createConnection(process.env.DATABASE_URL);

try {
  const result = await connection.execute(
    "DELETE FROM seoSettings WHERE page LIKE 'products/one-x%'"
  );
  console.log('Deleted', result[0].affectedRows, 'records');
} catch (error) {
  console.error('Error:', error);
} finally {
  await connection.end();
}

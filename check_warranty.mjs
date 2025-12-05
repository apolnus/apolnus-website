import { getDb } from './server/db.js';
import { warrantyRegistrations } from './drizzle/schema.js';

const db = await getDb();
const results = await db.select().from(warrantyRegistrations).orderBy(warrantyRegistrations.registeredAt).limit(5);
console.log('Warranty Registrations:', JSON.stringify(results, null, 2));
process.exit(0);

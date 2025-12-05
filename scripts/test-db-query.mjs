import { drizzle } from "drizzle-orm/mysql2";
import { seoSettings } from "../drizzle/schema.js";

console.log("Testing direct database query...");

try {
  const db = drizzle(process.env.DATABASE_URL);
  const results = await db.select().from(seoSettings).limit(5);
  
  console.log(`✅ Successfully fetched ${results.length} records`);
  
  if (results.length > 0) {
    console.log("\nFirst record:");
    console.log(JSON.stringify(results[0], null, 2));
  }
} catch (error) {
  console.error("❌ Error:", error.message);
  console.error(error);
}

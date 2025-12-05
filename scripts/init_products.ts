import { getDb } from "../server/db";
import { productModels } from "../drizzle/schema";
import { eq } from "drizzle-orm";

async function main() {
  const db = await getDb();
  if (!db) {
    console.error("Failed to connect to database");
    process.exit(1);
  }

  const products = [
    { name: "One X", slug: "one-x", order: 1 },
    { name: "Ultra S7", slug: "ultra-s7", order: 2 },
    // 下列為純後勤產品,不設 slug
    { name: "C18ES-L", slug: null, order: 99 },
    { name: "Vephos True", slug: null, order: 99 },
  ];

  for (const p of products) {
    try {
      // 檢查產品是否已存在
      const existing = await db.select().from(productModels).where(eq(productModels.name, p.name));
      
      if (existing.length > 0) {
        // 更新現有產品
        await db.update(productModels)
          .set({ slug: p.slug, order: p.order })
          .where(eq(productModels.name, p.name));
        console.log(`✓ Updated: ${p.name} (slug: ${p.slug || 'null'})`);
      } else {
        // 插入新產品
        await db.insert(productModels).values(p);
        console.log(`✓ Inserted: ${p.name} (slug: ${p.slug || 'null'})`);
      }
    } catch (error) {
      console.error(`✗ Failed to upsert ${p.name}:`, error);
    }
  }

  console.log("\n✅ Product initialization completed!");
  process.exit(0);
}

main();

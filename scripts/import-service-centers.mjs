import { drizzle } from "drizzle-orm/mysql2";
import { serviceCenters } from "../drizzle/schema.ts";
import fs from "fs";

const db = drizzle(process.env.DATABASE_URL);

async function importServiceCenters() {
  try {
    // 讀取 JSON 檔案
    const data = JSON.parse(
      fs.readFileSync("./client/public/service-centers.json", "utf-8")
    );

    console.log(`Found ${data.length} service centers to import`);

    // 批次插入資料
    let imported = 0;
    for (const center of data) {
      try {
        await db.insert(serviceCenters).values({
          name: center.nameZhTw || center.nameEn || "Unknown",
          nameZhTw: center.nameZhTw,
          nameZhCn: center.nameZhCn,
          nameEn: center.nameEn,
          nameJa: center.nameJa,
          nameKo: center.nameKo,
          country: center.country || "台灣",
          address: center.address,
          phone: center.phone,
          email: center.email || null,
          website: center.website || null,
          latitude: center.latitude ? parseFloat(center.latitude) : null,
          longitude: center.longitude ? parseFloat(center.longitude) : null,
          businessHours: center.businessHours || null,
          displayOrder: parseInt(center.order) || 0,
          isActive: parseInt(center.isActive) === 1,
        });
        imported++;
        if (imported % 100 === 0) {
          console.log(`Imported ${imported} service centers...`);
        }
      } catch (error) {
        console.error(`Failed to import center ${center.id}:`, error.message);
      }
    }

    console.log(`Successfully imported ${imported} service centers!`);
  } catch (error) {
    console.error("Import failed:", error);
    process.exit(1);
  }
}

importServiceCenters();

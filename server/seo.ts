import { eq, and } from "drizzle-orm";
import { getDb } from "./db";
import { seoSettings, InsertSeoSetting } from "../drizzle/schema";

/**
 * 獲取所有 SEO 設定
 */
export async function getAllSeoSettings() {
  console.log("[SEO] getAllSeoSettings called");
  const db = await getDb();
  if (!db) {
    console.error("[SEO] Database not available");
    return [];
  }
  
  try {
    const results = await db.select().from(seoSettings);
    console.log(`[SEO] Found ${results.length} settings`);
    return results;
  } catch (error) {
    console.error("[SEO] Query failed:", error);
    return [];
  }
}

/**
 * 根據頁面和語言獲取 SEO 設定
 */
export async function getSeoSetting(page: string, language: string) {
  const db = await getDb();
  if (!db) return null;
  
  const results = await db
    .select()
    .from(seoSettings)
    .where(and(eq(seoSettings.page, page), eq(seoSettings.language, language)))
    .limit(1);
  
  return results.length > 0 ? results[0] : null;
}

/**
 * 創建或更新 SEO 設定
 */
export async function upsertSeoSetting(data: InsertSeoSetting) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const existing = await getSeoSetting(data.page, data.language);
  
  if (existing) {
    // 更新現有記錄
    await db
      .update(seoSettings)
      .set({
        title: data.title,
        description: data.description,
        keywords: data.keywords,
      })
      .where(and(eq(seoSettings.page, data.page), eq(seoSettings.language, data.language)));
  } else {
    // 插入新記錄
    await db.insert(seoSettings).values(data);
  }
}

/**
 * 批量創建或更新 SEO 設定
 */
export async function batchUpsertSeoSettings(dataList: InsertSeoSetting[]) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  for (const data of dataList) {
    await upsertSeoSetting(data);
  }
}

/**
 * 刪除 SEO 設定
 */
export async function deleteSeoSetting(page: string, language: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db
    .delete(seoSettings)
    .where(and(eq(seoSettings.page, page), eq(seoSettings.language, language)));
}

/**
 * 獲取所有唯一的頁面識別碼
 */
export async function getAllPages() {
  const db = await getDb();
  if (!db) return [];
  
  const results = await db
    .selectDistinct({ page: seoSettings.page })
    .from(seoSettings);
  
  return results.map(r => r.page);
}

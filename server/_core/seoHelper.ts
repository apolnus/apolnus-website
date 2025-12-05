import { getDb } from "../db";
import { seoSettings } from "../../drizzle/schema";
import { and, eq } from "drizzle-orm";

// 語言前綴映射 (與前端保持一致)
const URL_PREFIX_MAP: Record<string, string> = {
  "tw": "zh-TW",
  "cn": "zh-CN",
  "jp": "ja",
  "kr": "ko",
  "de": "de",
  "fr": "fr"
};

export async function getSeoByPath(path: string) {
  try {
    const segments = path.split('/').filter(Boolean);
    let lang = 'en'; // 預設英文 (根目錄)
    let pageKey = 'home';

    // 判斷語言前綴
    if (segments.length > 0 && URL_PREFIX_MAP[segments[0]]) {
      lang = URL_PREFIX_MAP[segments[0]];
      // 移除語言前綴，剩下的就是 pageKey
      const pathSegments = segments.slice(1);
      pageKey = pathSegments.length > 0 ? pathSegments.join('/') : 'home';
    } else {
      // 無前綴，就是英文版，整串都是 pageKey
      pageKey = segments.length > 0 ? segments.join('/') : 'home';
    }

    // 查詢資料庫
    const db = await getDb();
    if (!db) return null;

    const result = await db.select().from(seoSettings).where(and(
      eq(seoSettings.page, pageKey),
      eq(seoSettings.language, lang)
    )).limit(1);

    const seoData = result[0] || null;
    
    // 硬編碼修正：英文首頁使用正確的描述和圖片
    if (seoData && pageKey === 'home' && lang === 'en') {
      return {
        ...seoData,
        description: "Committed to creating top-tier smart home appliances, combining ultimate craftsmanship with sustainable technology. Apolnus redefines the highest standard of living quality for those who pursue excellence.",
        og_image: "https://3000-id4ajja5jt5vyq7y9yshr-5eb4720d.manus-asia.computer/uploads/og-image-1764211751045.jpg"
      };
    }
    
    return seoData;
  } catch (e) {
    console.error("SEO Fetch Error:", e);
    return null;
  }
}

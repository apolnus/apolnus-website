import { getDb } from "../db";
import { productModels } from "../../drizzle/schema";
import { eq } from "drizzle-orm";

// 1. 設定與快取
const BASE_URL = "https://www.apolnus.com";
const CACHE_TTL = 3600 * 1000; // 1 小時快取
let sitemapCache = { xml: "", timestamp: 0 };

// 2. 語言定義 (Mapping)
// 英文 (en) 對應根目錄 ""，其他語言對應前綴
const LANG_MAP: Record<string, string> = {
  "en": "",       // Default (Root)
  "zh-TW": "tw",  // Taiwan
  "zh-CN": "cn",  // China
  "ja": "jp",     // Japan
  "ko": "kr",     // Korea
  "de": "de",     // Germany
  "fr": "fr"      // France
};

// 3. 靜態頁面清單
const STATIC_PAGES = [
  { url: "/", priority: "1.0", freq: "daily" },
  { url: "/about", priority: "0.6", freq: "monthly" },
  { url: "/support", priority: "0.8", freq: "weekly" },
  { url: "/where-to-buy", priority: "0.8", freq: "monthly" },
  { url: "/faq", priority: "0.7", freq: "weekly" },
  { url: "/careers", priority: "0.5", freq: "monthly" },
  { url: "/partner-program", priority: "0.6", freq: "monthly" },
  { url: "/privacy", priority: "0.3", freq: "yearly" },
  { url: "/terms", priority: "0.3", freq: "yearly" }
];

// 產生 Hreflang 標記 (告訴 Google 其他語言版本在哪)
function generateHreflang(path: string) {
  return Object.entries(LANG_MAP).map(([isoCode, prefix]) => {
    // 如果是英文(prefix為空)，路徑就是 BASE + path
    // 如果是其他(prefix為tw)，路徑就是 BASE + /tw + path
    const url = prefix 
      ? `${BASE_URL}/${prefix}${path === '/' ? '' : path}` 
      : `${BASE_URL}${path}`;
    return `    <xhtml:link rel="alternate" hreflang="${isoCode}" href="${url}" />`;
  }).join('\n');
}

export async function sitemapHandler(req: any, res: any) {
  try {
    // A. 快取命中檢查
    if (sitemapCache.xml && (Date.now() - sitemapCache.timestamp < CACHE_TTL)) {
      res.header('Content-Type', 'application/xml');
      return res.send(sitemapCache.xml);
    }

    let pages = [...STATIC_PAGES];

    // B. 抓取動態產品 (含 3秒 熔斷保護)
    try {
      const db = await getDb();
      if (db) {
        const products = await Promise.race([
          db.select().from(productModels).where(eq(productModels.isActive, 1)),
          new Promise<any[]>((_, reject) => 
            setTimeout(() => reject(new Error("Timeout")), 3000)
          )
        ]) as any[];
        
        const productPages = products
          .filter(p => p.slug) // 只選有 slug 的產品
          .map(p => ({
            url: `/products/${p.slug}`,
            priority: "0.9",
            freq: "weekly",
            lastmod: p.updatedAt ? new Date(p.updatedAt).toISOString() : new Date().toISOString()
          }));
        pages = [...pages, ...productPages];
      }
    } catch (e) {
      console.error("Sitemap DB Error:", e);
    }

    // C. 生成 XML (雙重迴圈: 頁面 x 語言)
    const urlBlocks = pages.flatMap(page => {
      // 為每個頁面生成 "所有語言版本" 的條目
      return Object.entries(LANG_MAP).map(([isoCode, prefix]) => {
        const pageUrl = prefix 
          ? `${BASE_URL}/${prefix}${page.url === '/' ? '' : page.url}` 
          : `${BASE_URL}${page.url}`;
        const lastmod = (page as any).lastmod || new Date().toISOString();
        
        return `  <url>
    <loc>${pageUrl}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${page.freq}</changefreq>
    <priority>${page.priority}</priority>
${generateHreflang(page.url)}
  </url>`;
      });
    }).join('\n');

    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
${urlBlocks}
</urlset>`;

    // D. 寫入快取
    sitemapCache = { xml: sitemap, timestamp: Date.now() };
    res.header('Content-Type', 'application/xml');
    res.send(sitemap);
  } catch (e) {
    console.error(e);
    res.status(500).send("Error generating sitemap");
  }
}

export function robotsHandler(req: any, res: any) {
  res.type('text/plain').send(`User-agent: *
Allow: /
Disallow: /admin/
Sitemap: ${BASE_URL}/sitemap.xml`);
}

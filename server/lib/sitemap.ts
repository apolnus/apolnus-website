import { getDb } from "../db";
import { productModels } from "../../drizzle/schema";
import { eq } from "drizzle-orm";

/**
 * 動態生成 Sitemap.xml
 * 支援多語系與動態產品路由
 * 符合 Google Sitemap Protocol 0.9
 */
export async function generateSitemap(): Promise<string> {
  const baseUrl = process.env.BASE_URL || 'https://www.apolnus.com';
  
  // 1. 定義所有支援的語系 (URL prefix)
  // 英文使用根路徑 (無前綴)，其他語言使用國家代碼前綴
  const locales = [
    { prefix: '', lang: 'en' },      // 英文 (根路徑)
    { prefix: '/tw', lang: 'zh-TW' }, // 繁體中文
    { prefix: '/cn', lang: 'zh-CN' }, // 簡體中文
    { prefix: '/jp', lang: 'ja' },    // 日文
    { prefix: '/kr', lang: 'ko' },    // 韓文
    { prefix: '/de', lang: 'de' },    // 德文
    { prefix: '/fr', lang: 'fr' },    // 法文
  ];

  // 2. 定義靜態頁面 (不包含產品頁面)
  const staticPages = [
    { path: '/', changefreq: 'daily', priority: '1.0' },
    { path: '/about', changefreq: 'monthly', priority: '0.8' },
    { path: '/contact', changefreq: 'monthly', priority: '0.7' },
    { path: '/support', changefreq: 'weekly', priority: '0.8' },
    { path: '/support/service-centers', changefreq: 'weekly', priority: '0.7' },
    { path: '/support/authorized-dealers', changefreq: 'weekly', priority: '0.7' },
    { path: '/support/warranty', changefreq: 'monthly', priority: '0.7' },
    { path: '/support/faq', changefreq: 'weekly', priority: '0.6' },
    { path: '/careers', changefreq: 'monthly', priority: '0.5' },
    { path: '/partner-program', changefreq: 'monthly', priority: '0.5' },
  ];

  // 3. 從資料庫讀取所有上架的產品型號
  const db = await getDb();
  if (!db) {
    throw new Error("資料庫連線失敗");
  }
  
  const products = await db
    .select({
      slug: productModels.slug,
      updatedAt: productModels.updatedAt,
    })
    .from(productModels)
    .where(eq(productModels.isActive, 1));

  // 過濾出有 slug 的產品 (前台產品)
  const activeProducts = products.filter(p => p.slug);

  // 4. 定義產品子頁面
  const productSubPages = [
    { suffix: '', changefreq: 'weekly', priority: '0.9' },      // 產品主頁
    { suffix: '/specs', changefreq: 'monthly', priority: '0.7' }, // 技術規格
    { suffix: '/downloads', changefreq: 'monthly', priority: '0.6' }, // 下載中心
    { suffix: '/faq', changefreq: 'weekly', priority: '0.6' },   // 常見問題
  ];

  // 5. 生成所有 URL 條目
  const urls: string[] = [];

  // 5.1 靜態頁面 x 語系
  for (const locale of locales) {
    for (const page of staticPages) {
      const url = `${baseUrl}${locale.prefix}${page.path}`;
      urls.push(generateUrlEntry(url, page.changefreq, page.priority));
    }
  }

  // 5.2 產品頁面 x 語系 x 子頁面
  for (const locale of locales) {
    for (const product of activeProducts) {
      for (const subPage of productSubPages) {
        const url = `${baseUrl}${locale.prefix}/products/${product.slug}${subPage.suffix}`;
        const lastmod = product.updatedAt ? new Date(product.updatedAt).toISOString().split('T')[0] : undefined;
        urls.push(generateUrlEntry(url, subPage.changefreq, subPage.priority, lastmod));
      }
    }
  }

  // 6. 組合完整的 Sitemap XML
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.join('\n')}
</urlset>`;
}

/**
 * 生成單個 URL 條目
 */
function generateUrlEntry(
  loc: string,
  changefreq: string,
  priority: string,
  lastmod?: string
): string {
  const lastmodTag = lastmod ? `\n    <lastmod>${lastmod}</lastmod>` : '';
  return `  <url>
    <loc>${loc}</loc>${lastmodTag}
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`;
}

/**
 * 獲取 Sitemap 統計資訊
 */
export async function getSitemapStats(): Promise<{
  totalUrls: number;
  staticUrls: number;
  productUrls: number;
  locales: number;
  products: number;
}> {
  const locales = 7; // en, tw, cn, jp, kr, de, fr
  const staticPages = 10; // 靜態頁面數量
  
  const db = await getDb();
  if (!db) {
    return {
      totalUrls: 0,
      staticUrls: 0,
      productUrls: 0,
      locales: 0,
      products: 0,
    };
  }
  
  const products = await db
    .select({ slug: productModels.slug })
    .from(productModels)
    .where(eq(productModels.isActive, 1));
  
  const activeProducts = products.filter(p => p.slug).length;
  const productSubPages = 4; // 每個產品有 4 個子頁面
  
  const staticUrls = staticPages * locales;
  const productUrls = activeProducts * productSubPages * locales;
  const totalUrls = staticUrls + productUrls;

  return {
    totalUrls,
    staticUrls,
    productUrls,
    locales,
    products: activeProducts,
  };
}

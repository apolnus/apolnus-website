import { z } from "zod";
import { router, protectedProcedure, adminProcedure } from "../_core/trpc";
import {
  getAllSeoSettings,
  getSeoSetting,
  upsertSeoSetting,
  batchUpsertSeoSettings,
  deleteSeoSetting,
  getAllPages,
} from "../seo";
import { TRPCError } from "@trpc/server";
import { invokeLLM } from "../_core/llm";

export const seoRouter = router({
  // 獲取所有 SEO 設定
  getAll: protectedProcedure.query(async () => {
    return await getAllSeoSettings();
  }),

  // 獲取特定頁面和語言的 SEO 設定
  get: protectedProcedure
    .input(z.object({
      page: z.string(),
      language: z.string(),
    }))
    .query(async ({ input }) => {
      return await getSeoSetting(input.page, input.language);
    }),

  // 更新 SEO 設定 (僅管理員)
  update: adminProcedure
    .input(z.object({
      page: z.string(),
      language: z.string(),
      title: z.string(),
      description: z.string().optional(),
      keywords: z.string().optional(),
    }))
    .mutation(async ({ input }) => {
      await upsertSeoSetting({
        page: input.page,
        language: input.language,
        title: input.title,
        description: input.description || "",
        keywords: input.keywords || "",
      });
      return { success: true };
    }),

  // 批量更新 SEO 設定 (僅管理員)
  batchUpdate: adminProcedure
    .input(z.array(z.object({
      page: z.string(),
      language: z.string(),
      title: z.string(),
      description: z.string().optional(),
      keywords: z.string().optional(),
    })))
    .mutation(async ({ input }) => {
      const dataList = input.map(item => ({
        page: item.page,
        language: item.language,
        title: item.title,
        description: item.description || "",
        keywords: item.keywords || "",
      }));
      
      await batchUpsertSeoSettings(dataList);
      return { success: true, count: dataList.length };
    }),

  // 刪除 SEO 設定 (僅管理員)
  delete: adminProcedure
    .input(z.object({
      page: z.string(),
      language: z.string(),
    }))
    .mutation(async ({ input }) => {
      await deleteSeoSetting(input.page, input.language);
      return { success: true };
    }),

  // 獲取所有頁面列表
  getPages: protectedProcedure.query(async () => {
    return await getAllPages();
  }),

  // 匯出所有 SEO 設定為 JSON
  export: adminProcedure.query(async () => {
    const settings = await getAllSeoSettings();
    return settings;
  }),

  // 匯入 SEO 設定 (僅管理員)
  import: adminProcedure
    .input(z.array(z.object({
      page: z.string(),
      language: z.string(),
      title: z.string(),
      description: z.string().optional(),
      keywords: z.string().optional(),
    })))
    .mutation(async ({ input }) => {
      const dataList = input.map(item => ({
        page: item.page,
        language: item.language,
        title: item.title,
        description: item.description || "",
        keywords: item.keywords || "",
      }));
      
      await batchUpsertSeoSettings(dataList);
      return { success: true, count: dataList.length };
    }),

  // AI 翻譯單頁 SEO 內容 (僅管理員)
  translate: adminProcedure
    .input(z.object({
      page: z.string(),
      sourceLanguage: z.string(),
      targetLanguages: z.array(z.string()),
    }))
    .mutation(async ({ input }) => {
      const sourceSeo = await getSeoSetting(input.page, input.sourceLanguage);
      
      if (!sourceSeo) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: `找不到來源語言的 SEO 設定`,
        });
      }

      const results: any[] = [];
      
      for (const targetLang of input.targetLanguages) {
        try {
          const langNames: Record<string, string> = {
            "en": "English",
            "zh-CN": "简体中文",
            "ja": "日本語",
            "ko": "한국어",
            "de": "Deutsch",
            "fr": "Français",
          };

          const prompt = `Translate the following SEO content to ${langNames[targetLang]}. Keep the same meaning and SEO optimization. Preserve brand names and special symbols (®, ™, ©).

Title: ${sourceSeo.title}
Description: ${sourceSeo.description}
Keywords: ${sourceSeo.keywords}

Respond in JSON format:
{
  "title": "translated title",
  "description": "translated description",
  "keywords": "translated keywords"
}`;

          const response = await invokeLLM({
            messages: [
              { role: "system", content: "You are a professional SEO translator. Always respond with valid JSON." },
              { role: "user", content: prompt },
            ],
          });

          const content = response.choices[0]?.message?.content;
          if (!content || typeof content !== 'string') {
            throw new Error("翻譯回應為空");
          }

          const translated = JSON.parse(content);
          
          await upsertSeoSetting({
            page: input.page,
            language: targetLang,
            title: translated.title,
            description: translated.description,
            keywords: translated.keywords,
          });

          results.push({
            language: targetLang,
            success: true,
            data: translated,
          });
        } catch (error: any) {
          results.push({
            language: targetLang,
            success: false,
            error: error.message,
          });
        }
      }

      return { success: true, results };
    }),

  // 同步網站頁面到SEO設定表 (僅管理員)
  syncPages: adminProcedure.mutation(async () => {
    const { getDb } = await import("../db");
    const db = await getDb();
    if (!db) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "資料庫連線失敗",
      });
    }

    // 定義所有靜態頁面
    const staticPages = [
      { id: "home", name: "首頁" },
      { id: "about", name: "關於我們" },
      { id: "where-to-buy", name: "購買通路" },
      { id: "service-centers", name: "授權維修中心" },
      { id: "support", name: "服務與支援" },
      { id: "faq", name: "常見問題" },
      { id: "profile", name: "個人中心" },
      { id: "warranty-registration", name: "保固登錄" },
      { id: "support-ticket", name: "客服工單" },
      { id: "my-tickets", name: "我的工單" },
      { id: "partner-program", name: "合作夥伴申請" },
      { id: "careers", name: "招聘精英" },
      { id: "privacy-policy", name: "隱私權政策" },
      { id: "terms-of-use", name: "使用條款" },
    ];

    // 從productModels表讀取所有產品
    const { productModels } = await import("../../drizzle/schema");
    const products = await db.select().from(productModels);

    // 為每個產品生成頁面ID
    const productPages: Array<{ id: string; name: string }> = [];
    for (const product of products) {
      const baseId = product.name.toLowerCase().replace(/\s+/g, "-");
      productPages.push(
        { id: `product-${baseId}`, name: `產品 - ${product.name}` },
        { id: `product-${baseId}-specs`, name: `產品 - ${product.name} 規格` },
        { id: `product-${baseId}-downloads`, name: `產品 - ${product.name} 下載` },
        { id: `product-${baseId}-faq`, name: `產品 - ${product.name} FAQ` }
      );
    }

    // 合併所有頁面
    const allPages = [...staticPages, ...productPages];

    // 同步到seoSettings表(只添加不存在的頁面,保留已有的SEO設定)
    const { seoSettings } = await import("../../drizzle/schema");
    const { eq, and } = await import("drizzle-orm");
    
    let addedCount = 0;
    const languages = ["zh-TW", "en", "zh-CN", "ja", "ko", "de", "fr"];

    for (const page of allPages) {
      for (const lang of languages) {
        // 檢查是否已存在
        const existing = await db
          .select()
          .from(seoSettings)
          .where(and(eq(seoSettings.page, page.id), eq(seoSettings.language, lang)))
          .limit(1);

        if (existing.length === 0) {
          // 不存在則插入設定(繁中使用頁面名稱作為title)
          await db.insert(seoSettings).values({
            page: page.id,
            language: lang,
            title: lang === "zh-TW" ? page.name : "",
            description: "",
            keywords: "",
          });
          addedCount++;
        }
      }
    }

    return {
      success: true,
      totalPages: allPages.length,
      addedSettings: addedCount,
      pages: allPages,
    };
  }),

  // 獲取 Sitemap 統計資訊 (僅管理員)
  getSitemapStats: adminProcedure.query(async () => {
    const { getSitemapStats } = await import("../lib/sitemap");
    return await getSitemapStats();
  }),

  // 更新 Sitemap 快取 (僅管理員)
  refreshSitemap: adminProcedure.mutation(async () => {
    const { generateSitemap } = await import("../lib/sitemap");
    
    try {
      // 重新生成 Sitemap
      const sitemap = await generateSitemap();
      
      // 獲取統計資訊
      const { getSitemapStats } = await import("../lib/sitemap");
      const stats = await getSitemapStats();
      
      return {
        success: true,
        message: `Sitemap 已更新，包含 ${stats.totalUrls} 個連結`,
        stats,
      };
    } catch (error: any) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: `Sitemap 更新失敗: ${error.message}`,
      });
    }
  }),

  // 批次 AI 翻譯所有頁面 (僅管理員)
  batchTranslate: adminProcedure
    .input(z.object({
      sourceLanguage: z.string(),
      targetLanguages: z.array(z.string()),
    }))
    .mutation(async ({ input }) => {
      const allSettings = await getAllSeoSettings();
      const sourceSettings = allSettings.filter(s => s.language === input.sourceLanguage);
      
      if (sourceSettings.length === 0) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: `找不到任何 ${input.sourceLanguage} 的 SEO 設定`,
        });
      }

      const results: any[] = [];
      
      for (const sourceSeo of sourceSettings) {
        for (const targetLang of input.targetLanguages) {
          try {
            const langNames: Record<string, string> = {
              "en": "English",
              "zh-CN": "简体中文",
              "ja": "日本語",
              "ko": "한국어",
              "de": "Deutsch",
              "fr": "Français",
            };

            const prompt = `Translate the following SEO content to ${langNames[targetLang]}. Keep the same meaning and SEO optimization. Preserve brand names and special symbols (®, ™, ©).

Title: ${sourceSeo.title}
Description: ${sourceSeo.description}
Keywords: ${sourceSeo.keywords}

Respond in JSON format:
{
  "title": "translated title",
  "description": "translated description",
  "keywords": "translated keywords"
}`;

            const response = await invokeLLM({
              messages: [
                { role: "system", content: "You are a professional SEO translator. Always respond with valid JSON." },
                { role: "user", content: prompt },
              ],
            });

            const content = response.choices[0]?.message?.content;
            if (!content || typeof content !== 'string') {
              throw new Error("翻譯回應為空");
            }

            const translated = JSON.parse(content);
            
            await upsertSeoSetting({
              page: sourceSeo.page,
              language: targetLang,
              title: translated.title,
              description: translated.description,
              keywords: translated.keywords,
            });

            results.push({
              page: sourceSeo.page,
              language: targetLang,
              success: true,
            });
          } catch (error: any) {
            results.push({
              page: sourceSeo.page,
              language: targetLang,
              success: false,
              error: error.message,
            });
          }
        }
      }

      const successCount = results.filter(r => r.success).length;
      return { success: true, total: results.length, successCount, results };
    }),
});

import { z } from "zod";
import { adminProcedure, router } from "../_core/trpc";
import { getDb } from "../db";
import { subscribers, partners, siteSettings, productModels, faqs, warrantyRegistrations, supportTickets, ticketReplies, seoSettings, jobs, users } from "../../drizzle/schema";
import { eq, and, desc } from "drizzle-orm";
import * as fs from 'fs/promises';
import * as path from 'path';
import * as crypto from 'crypto';
import * as XLSX from 'xlsx';

export const adminRouter = router({
  // 網站設定 (頂層 API,供 AdminSettings 頁面使用)
  getSettings: adminProcedure.query(async () => {
    const db = await getDb();
    const allSettings = await db.select().from(siteSettings);

    // 將設定轉換為物件格式
    const settingsObj: Record<string, any> = {};
    for (const setting of allSettings) {
      settingsObj[setting.key] = setting.value;
    }

    return settingsObj;
  }),

  updateSettings: adminProcedure
    .input(z.object({
      ga4_id: z.string().optional(),
      meta_pixel_id: z.string().optional(),
      social_links: z.string().optional(),
    }))
    .mutation(async ({ input }) => {
      const db = await getDb();

      // 更新每個設定
      for (const [key, value] of Object.entries(input)) {
        if (value !== undefined) {
          const [existing] = await db.select()
            .from(siteSettings)
            .where(eq(siteSettings.key, key));

          if (existing) {
            await db.update(siteSettings)
              .set({ value: value })
              .where(eq(siteSettings.key, key));
          } else {
            await db.insert(siteSettings).values({ key, value });
          }
        }
      }

      return { success: true };
    }),

  // Dashboard Statistics
  dashboard: router({
    stats: adminProcedure.query(async () => {
      const db = await getDb();

      // 統計訂閱者數量
      const subscribersResult = await db.select().from(subscribers);
      const totalSubscribers = subscribersResult.length;

      // 統計待處理工單數量
      const pendingTicketsResult = await db.select().from(supportTickets).where(eq(supportTickets.status, 'pending'));
      const pendingTickets = pendingTicketsResult.length;

      // 統計保固登錄數量
      const warrantiesResult = await db.select().from(warrantyRegistrations);
      const totalWarranties = warrantiesResult.length;

      // 統計合作夥伴申請數量
      const partnersResult = await db.select().from(partners);
      const totalPartners = partnersResult.length;

      return {
        totalSubscribers,
        pendingTickets,
        totalWarranties,
        totalPartners,
      };
    }),
  }),

  // Subscribers Management
  subscribers: router({
    list: adminProcedure.query(async () => {
      const db = await getDb();
      return await db.select().from(subscribers).orderBy(subscribers.subscribedAt);
    }),

    add: adminProcedure
      .input(z.object({ email: z.string().email() }))
      .mutation(async ({ input }) => {
        const db = await getDb();
        const [result] = await db.insert(subscribers).values({ email: input.email });
        return { success: true, id: result.insertId };
      }),

    delete: adminProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        const db = await getDb();
        await db.delete(subscribers).where(eq(subscribers.id, input.id));
        return { success: true };
      }),
  }),

  // Partners Management
  partners: router({
    list: adminProcedure.query(async () => {
      const db = await getDb();
      return await db.select().from(partners).orderBy(partners.createdAt);
    }),

    add: adminProcedure
      .input(z.object({
        companyName: z.string(),
        contactName: z.string(),
        email: z.string().email(),
        phone: z.string().optional(),
        message: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        const db = await getDb();
        const [result] = await db.insert(partners).values(input);
        return { success: true, id: result.insertId };
      }),

    updateStatus: adminProcedure
      .input(z.object({
        id: z.number(),
        status: z.enum(["pending", "approved", "rejected"]),
      }))
      .mutation(async ({ input }) => {
        const db = await getDb();
        await db.update(partners)
          .set({ status: input.status })
          .where(eq(partners.id, input.id));
        return { success: true };
      }),

    delete: adminProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        const db = await getDb();
        await db.delete(partners).where(eq(partners.id, input.id));
        return { success: true };
      }),
  }),

  // Site Settings (GA & Meta Pixel)
  settings: router({
    get: adminProcedure
      .input(z.object({ key: z.string() }))
      .query(async ({ input }) => {
        const db = await getDb();
        const [setting] = await db.select()
          .from(siteSettings)
          .where(eq(siteSettings.key, input.key));
        return setting || null;
      }),

    getAll: adminProcedure.query(async () => {
      const db = await getDb();
      return await db.select().from(siteSettings);
    }),

    getSettings: adminProcedure.query(async () => {
      const db = await getDb();
      const allSettings = await db.select().from(siteSettings);

      // 將設定轉換為物件格式
      const settingsObj: Record<string, any> = {};
      for (const setting of allSettings) {
        settingsObj[setting.key] = setting.value;
      }

      return settingsObj;
    }),

    updateSettings: adminProcedure
      .input(z.object({
        ga4_id: z.string().optional(),
        meta_pixel_id: z.string().optional(),
        social_links: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        const db = await getDb();

        // 更新每個設定
        for (const [key, value] of Object.entries(input)) {
          if (value !== undefined) {
            const [existing] = await db.select()
              .from(siteSettings)
              .where(eq(siteSettings.key, key));

            if (existing) {
              await db.update(siteSettings)
                .set({ value: value })
                .where(eq(siteSettings.key, key));
            } else {
              await db.insert(siteSettings).values({ key, value });
            }
          }
        }

        return { success: true };
      }),

    set: adminProcedure
      .input(z.object({
        key: z.string(),
        value: z.string(),
      }))
      .mutation(async ({ input }) => {
        const db = await getDb();
        const [existing] = await db.select()
          .from(siteSettings)
          .where(eq(siteSettings.key, input.key));

        if (existing) {
          await db.update(siteSettings)
            .set({ value: input.value })
            .where(eq(siteSettings.key, input.key));
        } else {
          await db.insert(siteSettings).values(input);
        }
        return { success: true };
      }),
  }),

  // Product Models Management
  productModels: router({
    list: adminProcedure
      .input(z.object({ hasPage: z.boolean().optional() }).optional())
      .query(async ({ input }) => {
        const db = await getDb();
        let query = db.select().from(productModels);

        // 如果 hasPage === true，只回傳 slug 不為 null 的產品
        if (input?.hasPage === true) {
          const allProducts = await query.orderBy(productModels.order);
          return allProducts.filter(p => p.slug !== null);
        }

        // 否則回傳全部（給工單系統用）
        return await query.orderBy(productModels.order);
      }),

    add: adminProcedure
      .input(z.object({ name: z.string() }))
      .mutation(async ({ input }) => {
        const db = await getDb();
        // Get the max order value and add 1
        const models = await db.select().from(productModels);
        const maxOrder = models.length > 0 ? Math.max(...models.map(m => m.order)) : 0;
        const [result] = await db.insert(productModels).values({ name: input.name, order: maxOrder + 1 });
        return { success: true, id: result.insertId };
      }),

    updateOrder: adminProcedure
      .input(z.object({ items: z.array(z.object({ id: z.number(), order: z.number() })) }))
      .mutation(async ({ input }) => {
        const db = await getDb();
        // Update order for each item
        for (const item of input.items) {
          await db.update(productModels)
            .set({ order: item.order })
            .where(eq(productModels.id, item.id));
        }
        return { success: true };
      }),

    delete: adminProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        const db = await getDb();
        await db.delete(productModels).where(eq(productModels.id, input.id));
        return { success: true };
      }),
  }),

  // Warranty Registrations Management
  warranties: router({
    list: adminProcedure.query(async () => {
      const db = await getDb();
      return await db.select().from(warrantyRegistrations).orderBy(warrantyRegistrations.registeredAt);
    }),

    delete: adminProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        const db = await getDb();
        await db.delete(warrantyRegistrations).where(eq(warrantyRegistrations.id, input.id));
        return { success: true };
      }),
  }),

  // Support Tickets Management
  tickets: router({
    list: adminProcedure.query(async () => {
      const db = await getDb();
      const tickets = await db.select().from(supportTickets).orderBy(desc(supportTickets.createdAt));

      // For each ticket, count unread user replies (for admin view)
      const ticketsWithUnreadCount = await Promise.all(
        tickets.map(async (ticket) => {
          const unreadReplies = await db
            .select()
            .from(ticketReplies)
            .where(eq(ticketReplies.ticketId, ticket.id));

          const unreadCount = unreadReplies.filter(
            (reply) => reply.isAdmin === 0 && reply.isReadByAdmin === 0
          ).length;

          return {
            ...ticket,
            unreadCount,
          };
        })
      );

      return ticketsWithUnreadCount;
    }),

    getById: adminProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        const db = await getDb();
        const result = await db.select().from(supportTickets)
          .where(eq(supportTickets.id, input.id))
          .limit(1);
        return result[0] || null;
      }),

    updateStatus: adminProcedure
      .input(z.object({
        id: z.number(),
        status: z.enum(["pending", "in_progress", "resolved", "closed"]),
      }))
      .mutation(async ({ input }) => {
        const db = await getDb();
        await db.update(supportTickets)
          .set({ status: input.status })
          .where(eq(supportTickets.id, input.id));
        return { success: true };
      }),

    delete: adminProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        const db = await getDb();
        await db.delete(supportTickets).where(eq(supportTickets.id, input.id));
        return { success: true };
      }),

    batchUpdateStatus: adminProcedure
      .input(z.object({
        ids: z.array(z.number()),
        status: z.enum(["pending", "in_progress", "resolved", "closed"]),
      }))
      .mutation(async ({ input }) => {
        const db = await getDb();
        // 批次更新多個工單的狀態
        for (const id of input.ids) {
          await db.update(supportTickets)
            .set({ status: input.status })
            .where(eq(supportTickets.id, id));
        }
        return { success: true, count: input.ids.length };
      }),

    getReplies: adminProcedure
      .input(z.object({ ticketId: z.number() }))
      .query(async ({ input }) => {
        const db = await getDb();
        return await db.select().from(ticketReplies)
          .where(eq(ticketReplies.ticketId, input.ticketId))
          .orderBy(ticketReplies.createdAt);
      }),
  }),

  // SEO Management
  seo: router({
    getSettings: adminProcedure.query(async () => {
      const db = await getDb();
      if (!db) return [];
      return await db.select().from(seoSettings);
    }),

    getSitemapStats: adminProcedure.query(async () => {
      const { getSitemapStats } = await import('../lib/sitemap');
      return await getSitemapStats();
    }),

    updateSetting: adminProcedure
      .input(z.object({
        page: z.string(),
        language: z.string(),
        title: z.string(),
        description: z.string().optional(),
        keywords: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        const db = await getDb();
        if (!db) throw new Error("Database not available");

        // Check if record exists
        const existing = await db.select().from(seoSettings)
          .where(and(
            eq(seoSettings.page, input.page),
            eq(seoSettings.language, input.language)
          ));

        if (existing.length > 0) {
          // Update existing record
          await db.update(seoSettings)
            .set({
              title: input.title,
              description: input.description,
              keywords: input.keywords,
            })
            .where(and(
              eq(seoSettings.page, input.page),
              eq(seoSettings.language, input.language)
            ));
        } else {
          // Insert new record
          await db.insert(seoSettings).values(input);
        }

        return { success: true };
      }),

    // Alias for updateSetting (for backward compatibility)
    update: adminProcedure
      .input(z.object({
        page: z.string(),
        language: z.string(),
        title: z.string(),
        description: z.string().optional(),
        keywords: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        const db = await getDb();
        if (!db) throw new Error("Database not available");

        // Check if record exists
        const existing = await db.select().from(seoSettings)
          .where(and(
            eq(seoSettings.page, input.page),
            eq(seoSettings.language, input.language)
          ));

        if (existing.length > 0) {
          // Update existing record
          await db.update(seoSettings)
            .set({
              title: input.title,
              description: input.description,
              keywords: input.keywords,
            })
            .where(and(
              eq(seoSettings.page, input.page),
              eq(seoSettings.language, input.language)
            ));
        } else {
          // Insert new record
          await db.insert(seoSettings).values(input);
        }

        return { success: true };
      }),

    translate: adminProcedure
      .input(z.object({
        text: z.string(),
        sourceLang: z.string().default("zh-TW"),
      }))
      .mutation(async ({ input }) => {
        const forgeApiUrl = process.env.BUILT_IN_FORGE_API_URL;
        const forgeApiKey = process.env.BUILT_IN_FORGE_API_KEY;

        const systemPrompt = `You are an SEO expert for high-end appliance brand 'Apolnus'. Translate the given text into: English (en), Japanese (ja), Korean (ko), German (de), French (fr), Simplified Chinese (zh-CN).

IMPORTANT RULES:
1. MUST preserve all special symbols exactly as they appear: ®, ™, ©, etc.
2. MUST keep brand names unchanged (e.g., "Apolnus®" stays "Apolnus®" in all languages)
3. Return a pure JSON object where keys are language codes and values are translations
4. DO NOT include markdown code blocks or any other formatting

Example: If input is "Apolnus® Air Purifier", output must be:
{
  "en": "Apolnus® Air Purifier",
  "ja": "Apolnus® 空気清浄機",
  "ko": "Apolnus® 공기청정기",
  "de": "Apolnus® Luftreiniger",
  "fr": "Apolnus® Purificateur d'air",
  "zh-CN": "Apolnus® 空气净化器"
}`;

        const response = await fetch(`${forgeApiUrl}/v1/chat/completions`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${forgeApiKey}`,
          },
          body: JSON.stringify({
            model: "gpt-4o-mini",
            messages: [
              { role: "system", content: systemPrompt },
              { role: "user", content: input.text },
            ],
          }),
        });

        if (!response.ok) {
          throw new Error(`Forge API error: ${response.statusText}`);
        }

        const result = await response.json();
        const responseText = result.choices?.[0]?.message?.content || "{}";

        // Parse JSON response
        try {
          const translations = JSON.parse(responseText);
          return translations;
        } catch (error) {
          // If JSON parsing fails, try to extract JSON from markdown code block
          const jsonMatch = responseText.match(/```(?:json)?\s*({[\s\S]*?})\s*```/);
          if (jsonMatch) {
            return JSON.parse(jsonMatch[1]);
          }
          throw new Error("Failed to parse translation response");
        }
      }),

    // Sync pages from routes and products
    syncPages: adminProcedure
      .mutation(async () => {
        const db = await getDb();
        if (!db) throw new Error("Database not available");

        // Define standard static pages (public pages only, exclude member/admin pages)
        const staticPages = [
          'home',
          'about',
          'support',
          'faq',
          'service-centers',
          'where-to-buy',
          'privacy',
          'terms',
          'partner-program',
          'careers',
        ];

        // Define product pages that exist in App.tsx routes
        // Only include products that have actual route definitions
        const productSlugs = ['one-x', 'ultra-s7']; // Add more as routes are created
        const productPages = productSlugs.flatMap(slug => [
          `products/${slug}`,
          `products/${slug}/specs`,
          `products/${slug}/downloads`,
          `products/${slug}/faq`,
        ]);

        // Combine all pages
        const allPages = [...staticPages, ...productPages];

        // Sync to seoSettings table
        let addedCount = 0;
        const addedPages: string[] = [];

        for (const page of allPages) {
          // Check if page already exists in seoSettings
          const existing = await db.select().from(seoSettings)
            .where(and(
              eq(seoSettings.page, page),
              eq(seoSettings.language, 'zh-TW')
            ));

          if (existing.length === 0) {
            // Insert default SEO settings
            await db.insert(seoSettings).values({
              page,
              language: 'zh-TW',
              title: page.split('/').pop() || page,
              description: '',
              keywords: '',
            });
            addedCount++;
            addedPages.push(page);
          }
        }

        return { success: true, addedCount, pages: addedPages };
      }),

    // Batch fill SEO content for product pages
    batchFillProductSeo: adminProcedure
      .mutation(async () => {
        const db = await getDb();
        if (!db) throw new Error("Database not available");

        // Get all products from productModels table
        const products = await db.select().from(productModels);

        let updatedCount = 0;
        const updatedPages: string[] = [];

        for (const product of products) {
          const productName = product.name;
          // Convert product name to slug format (e.g., "One X" -> "one-x")
          const slug = productName.toLowerCase().replace(/\s+/g, '-');

          // Define page types and their SEO templates
          const pageTemplates = [
            {
              page: `products/${slug}`,
              title: `Apolnus ${productName} | 高效能空氣清淨解決方案 | Apolnus®`,
              description: `${productName} 結合先進淨化技術與精緻工藝,為您打造純淨健康的室內環境。Apolnus 專業空氣清淨機,重新定義空氣品質的標準。`,
              keywords: `${productName},Apolnus,空氣清淨機,空氣淨化,室內空氣品質`
            },
            {
              page: `products/${slug}/specs`,
              title: `${productName} 技術規格 | 詳細效能參數 | Apolnus®`,
              description: `查看 ${productName} 完整技術規格,包含淨化效能、適用坪數、運轉音量、功率規格等詳細參數。專業數據,透明呈現。`,
              keywords: `${productName},技術規格,產品參數,效能數據,Apolnus`
            },
            {
              page: `products/${slug}/downloads`,
              title: `${productName} 下載中心 | 使用手冊與韌體更新 | Apolnus®`,
              description: `下載 ${productName} 使用手冊、快速入門指南、產品規格書及最新韌體更新。完整資源,隨時取用。`,
              keywords: `${productName},使用手冊,下載,韌體更新,產品資料,Apolnus`
            },
            {
              page: `products/${slug}/faq`,
              title: `${productName} 常見問題 | 使用與保養指南 | Apolnus®`,
              description: `${productName} 常見問題解答,涵蓋產品使用、維護保養、故障排除等實用資訊。專業解答,快速找到答案。`,
              keywords: `${productName},常見問題,FAQ,使用指南,保養,Apolnus`
            }
          ];

          // Update SEO settings for each page type (zh-TW only)
          for (const template of pageTemplates) {
            // Check if record exists
            const existing = await db.select().from(seoSettings)
              .where(and(
                eq(seoSettings.page, template.page),
                eq(seoSettings.language, 'zh-TW')
              ));

            // Update if title is empty, null, or looks like a slug (e.g., "one-x", "faq", "specs")
            const shouldUpdate = existing.length > 0 && (
              !existing[0].title ||
              existing[0].title.trim() === '' ||
              existing[0].title === template.page.split('/').pop() // title equals the last part of page path
            );

            if (shouldUpdate) {
              await db.update(seoSettings)
                .set({
                  title: template.title,
                  description: template.description,
                  keywords: template.keywords,
                })
                .where(and(
                  eq(seoSettings.page, template.page),
                  eq(seoSettings.language, 'zh-TW')
                ));
              updatedCount++;
              updatedPages.push(template.page);
            }
          }
        }

        return { success: true, updatedCount, pages: updatedPages };
      }),

    // Refresh Sitemap
    refreshSitemap: adminProcedure
      .mutation(async () => {
        const { generateSitemap } = await import('../lib/sitemap');
        const sitemapXml = await generateSitemap();

        // Write sitemap to public directory
        const fs = await import('fs/promises');
        const path = await import('path');
        const publicDir = path.join(process.cwd(), 'client', 'public');
        const sitemapPath = path.join(publicDir, 'sitemap.xml');

        await fs.writeFile(sitemapPath, sitemapXml, 'utf-8');

        return {
          success: true,
          message: '✅ Sitemap 已成功更新!'
        };
      }),
  }),

  // Translations Management
  translations: router({
    // Get all translations for a specific language
    list: adminProcedure
      .input(z.object({ lang: z.string() }))
      .query(async ({ input }) => {
        const localesDir = path.join(process.cwd(), 'client/src/i18n/locales');
        const zhTWPath = path.join(localesDir, 'zh-TW.json');
        const targetPath = path.join(localesDir, `${input.lang}.json`);

        // Read both files
        const [zhTWContent, targetContent] = await Promise.all([
          fs.readFile(zhTWPath, 'utf-8'),
          fs.readFile(targetPath, 'utf-8').catch(() => '{}'),
        ]);

        const zhTWData = JSON.parse(zhTWContent);
        const targetData = JSON.parse(targetContent);

        // Flatten nested objects to get all keys
        const flattenObject = (obj: any, prefix = ''): Record<string, string> => {
          return Object.keys(obj).reduce((acc: Record<string, string>, key) => {
            const newKey = prefix ? `${prefix}.${key}` : key;
            if (typeof obj[key] === 'object' && obj[key] !== null && !Array.isArray(obj[key])) {
              Object.assign(acc, flattenObject(obj[key], newKey));
            } else {
              acc[newKey] = obj[key];
            }
            return acc;
          }, {});
        };

        const zhTWFlat = flattenObject(zhTWData);
        const targetFlat = flattenObject(targetData);

        // Build translation entries
        const entries = Object.keys(zhTWFlat).map(key => ({
          key,
          zhTW: zhTWFlat[key],
          target: targetFlat[key] || '',
          missing: !targetFlat[key],
        }));

        const totalCount = entries.length;
        const missingCount = entries.filter(e => e.missing).length;

        return {
          lang: input.lang,
          totalCount,
          missingCount,
          entries,
        };
      }),

    // Update a single translation entry
    update: adminProcedure
      .input(z.object({
        lang: z.string(),
        key: z.string(),
        value: z.string(),
      }))
      .mutation(async ({ input }) => {
        const localesDir = path.join(process.cwd(), 'client/src/i18n/locales');
        const targetPath = path.join(localesDir, `${input.lang}.json`);

        // Read current file
        const content = await fs.readFile(targetPath, 'utf-8').catch(() => '{}');
        const data = JSON.parse(content);

        // Set nested value
        const keys = input.key.split('.');
        let current = data;
        for (let i = 0; i < keys.length - 1; i++) {
          if (!current[keys[i]]) {
            current[keys[i]] = {};
          }
          current = current[keys[i]];
        }
        current[keys[keys.length - 1]] = input.value;

        // Write back
        await fs.writeFile(targetPath, JSON.stringify(data, null, 2), 'utf-8');

        return { success: true };
      }),

    // Batch update multiple translation entries
    batchUpdate: adminProcedure
      .input(z.object({
        lang: z.string(),
        updates: z.array(z.object({
          key: z.string(),
          value: z.string(),
        })),
      }))
      .mutation(async ({ input }) => {
        const localesDir = path.join(process.cwd(), 'client/src/i18n/locales');
        const targetPath = path.join(localesDir, `${input.lang}.json`);

        // Read current file
        const content = await fs.readFile(targetPath, 'utf-8').catch(() => '{}');
        const data = JSON.parse(content);

        // Apply all updates
        for (const update of input.updates) {
          const keys = update.key.split('.');
          let current = data;
          for (let i = 0; i < keys.length - 1; i++) {
            if (!current[keys[i]]) {
              current[keys[i]] = {};
            }
            current = current[keys[i]];
          }
          current[keys[keys.length - 1]] = update.value;
        }

        // Write back once
        await fs.writeFile(targetPath, JSON.stringify(data, null, 2), 'utf-8');

        return { success: true, updatedCount: input.updates.length };
      }),

    // AI auto-fill missing translations
    // Create a new translation key
    create: adminProcedure
      .input(z.object({
        key: z.string(),
        zhTW: z.string(),
      }))
      .mutation(async ({ input }) => {
        const fs = await import('fs/promises');
        const path = await import('path');
        const localesDir = path.join(process.cwd(), 'client/src/i18n/locales');
        const zhTWPath = path.join(localesDir, 'zh-TW.json');

        // Read current file
        const content = await fs.readFile(zhTWPath, 'utf-8');
        const data = JSON.parse(content);

        // Check if key already exists
        const keys = input.key.split('.');
        let current = data;
        let exists = true;
        for (let i = 0; i < keys.length - 1; i++) {
          if (!current[keys[i]]) {
            exists = false;
            break;
          }
          current = current[keys[i]];
        }
        if (exists && current[keys[keys.length - 1]]) {
          throw new Error('Key already exists');
        }

        // Set value
        current = data;
        for (let i = 0; i < keys.length - 1; i++) {
          if (!current[keys[i]]) {
            current[keys[i]] = {};
          }
          current = current[keys[i]];
        }
        current[keys[keys.length - 1]] = input.zhTW;

        // Write back
        await fs.writeFile(zhTWPath, JSON.stringify(data, null, 2), 'utf-8');

        return { success: true };
      }),

    // Delete a translation key
    delete: adminProcedure
      .input(z.object({
        key: z.string(),
      }))
      .mutation(async ({ input }) => {
        const fs = await import('fs/promises');
        const path = await import('path');
        const localesDir = path.join(process.cwd(), 'client/src/i18n/locales');
        const files = await fs.readdir(localesDir);

        for (const file of files) {
          if (!file.endsWith('.json')) continue;

          const filePath = path.join(localesDir, file);
          const content = await fs.readFile(filePath, 'utf-8');
          const data = JSON.parse(content);

          const keys = input.key.split('.');
          let current = data;
          const stack: { obj: any, key: string }[] = [];

          // Navigate to parent of leaf
          let found = true;
          for (let i = 0; i < keys.length - 1; i++) {
            if (!current[keys[i]]) {
              found = false;
              break;
            }
            stack.push({ obj: current, key: keys[i] });
            current = current[keys[i]];
          }

          if (found && current[keys[keys.length - 1]] !== undefined) {
            delete current[keys[keys.length - 1]];

            // Clean up empty objects up the tree
            // (Optional: usually not strictly necessary but keeps JSON clean)

            await fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf-8');
          }
        }

        return { success: true };
      }),

    // AI auto-fill missing translations
    autoFill: adminProcedure
      .input(z.object({
        lang: z.string(),
        keys: z.array(z.string()).optional()
      }))
      .mutation(async ({ input }) => {
        const localesDir = path.join(process.cwd(), 'client/src/i18n/locales');
        const zhTWPath = path.join(localesDir, 'zh-TW.json');
        const targetPath = path.join(localesDir, `${input.lang}.json`);

        // Read both files
        const [zhTWContent, targetContent] = await Promise.all([
          fs.readFile(zhTWPath, 'utf-8'),
          fs.readFile(targetPath, 'utf-8').catch(() => '{}'),
        ]);

        const zhTWData = JSON.parse(zhTWContent);
        const targetData = JSON.parse(targetContent);

        // Flatten to find missing keys
        const flattenObject = (obj: any, prefix = ''): Record<string, string> => {
          return Object.keys(obj).reduce((acc: Record<string, string>, key) => {
            const newKey = prefix ? `${prefix}.${key}` : key;
            if (typeof obj[key] === 'object' && obj[key] !== null && !Array.isArray(obj[key])) {
              Object.assign(acc, flattenObject(obj[key], newKey));
            } else {
              acc[newKey] = obj[key];
            }
            return acc;
          }, {});
        };

        const zhTWFlat = flattenObject(zhTWData);
        const targetFlat = flattenObject(targetData);

        // Find missing translations
        let missingKeys: string[];
        if (input.keys && input.keys.length > 0) {
          // 只處理指定的keys中缺漏的項目
          missingKeys = input.keys.filter(key => !targetFlat[key] && zhTWFlat[key]);
        } else {
          // 掃描全檔案
          missingKeys = Object.keys(zhTWFlat).filter(key => !targetFlat[key]);
        }

        if (missingKeys.length === 0) {
          return { success: true, translatedCount: 0 };
        }

        // Batch translate missing keys (process in chunks of 10)
        const forgeApiUrl = process.env.BUILT_IN_FORGE_API_URL;
        const forgeApiKey = process.env.BUILT_IN_FORGE_API_KEY;

        if (!forgeApiUrl || !forgeApiKey) {
          throw new Error("Forge API credentials not configured");
        }

        const langMap: Record<string, string> = {
          'en': 'English',
          'ja': 'Japanese',
          'ko': 'Korean',
          'de': 'German',
          'fr': 'French',
          'zh-CN': 'Simplified Chinese',
        };

        const targetLangName = langMap[input.lang] || input.lang;

        let translatedCount = 0;
        const chunkSize = 10;

        for (let i = 0; i < missingKeys.length; i += chunkSize) {
          const chunk = missingKeys.slice(i, i + chunkSize);
          const textsToTranslate = chunk.map(key => zhTWFlat[key]);

          const systemPrompt = `You are a professional translator. Translate the following Traditional Chinese texts to ${targetLangName}.
Return ONLY a JSON array of translated strings in the same order as input.
DO NOT include any explanations, markdown formatting, or code blocks.
Example input: ["空氣清淨機", "產品規格"]
Example output: ["Air Purifier", "Product Specifications"]`;

          const response = await fetch(`${forgeApiUrl}/v1/chat/completions`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${forgeApiKey}`,
            },
            body: JSON.stringify({
              model: "gpt-4o-mini",
              messages: [
                { role: "system", content: systemPrompt },
                { role: "user", content: JSON.stringify(textsToTranslate) },
              ],
            }),
          });

          if (!response.ok) {
            console.error(`Forge API error for chunk ${i}: ${response.statusText}`);
            continue;
          }

          const result = await response.json();
          const responseText = result.choices?.[0]?.message?.content || "[]";

          try {
            const translations = JSON.parse(responseText);

            // Update target data with translations
            chunk.forEach((key, idx) => {
              if (translations[idx]) {
                const keys = key.split('.');
                let current = targetData;
                for (let j = 0; j < keys.length - 1; j++) {
                  if (!current[keys[j]]) {
                    current[keys[j]] = {};
                  }
                  current = current[keys[j]];
                }
                current[keys[keys.length - 1]] = translations[idx];
                translatedCount++;
              }
            });
          } catch (error) {
            console.error(`Failed to parse translation response for chunk ${i}:`, error);
          }
        }

        // Write updated translations back to file
        await fs.writeFile(targetPath, JSON.stringify(targetData, null, 2), 'utf-8');

        return { success: true, translatedCount };
      }),

    // Extract hardcoded Chinese from source code
    extractFromSource: adminProcedure
      .mutation(async () => {
        const fs = await import('fs/promises');
        const path = await import('path');
        const crypto = await import('crypto');
        const pagesDir = path.join(process.cwd(), 'client/src/pages');
        const localesDir = path.join(process.cwd(), 'client/src/i18n/locales');
        const zhTWPath = path.join(localesDir, 'zh-TW.json');

        // Read existing translations
        const zhTWContent = await fs.readFile(zhTWPath, 'utf-8');
        const zhTWData = JSON.parse(zhTWContent);

        let extractedCount = 0;
        const newTranslations: Record<string, string> = {};

        // Recursively scan all .tsx files
        async function scanDirectory(dir: string): Promise<void> {
          const entries = await fs.readdir(dir, { withFileTypes: true });

          for (const entry of entries) {
            const fullPath = path.join(dir, entry.name);

            if (entry.isDirectory()) {
              await scanDirectory(fullPath);
            } else if (entry.name.endsWith('.tsx')) {
              // Skip Admin pages
              if (entry.name.startsWith('Admin')) {
                continue;
              }

              await processFile(fullPath, entry.name);
            }
          }
        }

        // Process a single file
        async function processFile(filePath: string, fileName: string): Promise<void> {
          let content = await fs.readFile(filePath, 'utf-8');
          let modified = false;
          const filePrefix = fileName.replace('.tsx', '').toLowerCase();

          // Check if file already has useTranslation
          const hasTranslationImport = /import.*useTranslation.*from.*react-i18next/.test(content);
          const hasUseTranslationHook = /const\s*{\s*t\s*}\s*=\s*useTranslation\(\)/.test(content);

          // Regex for JSX content: >中文<
          const jsxRegex = />([^<>{}]+?[\u4e00-\u9fff]+[^<>{}]*?)</g;
          const matches: Array<{ text: string; key: string }> = [];

          let match;
          while ((match = jsxRegex.exec(content)) !== null) {
            const text = match[1].trim();

            // Skip if empty or already a translation key
            if (!text || text.includes('{t(') || text.includes('const ') || text.startsWith('//')) {
              continue;
            }

            // Generate key
            const hash = crypto.createHash('md5').update(text).digest('hex').substring(0, 8);
            const key = `${filePrefix}.t_${hash}`;

            // Check if already exists
            if (!zhTWData[key] && !newTranslations[key]) {
              newTranslations[key] = text;
              matches.push({ text, key });
              extractedCount++;
            }
          }

          // Regex for attributes: attr="中文" or attr='中文'
          // Improved to catch single single quotes and more attributes
          const attrRegex = /([a-zA-Z-]+)=["']([^"']*?[\u4e00-\u9fff]+[^"']*?)["']/g;
          while ((match = attrRegex.exec(content)) !== null) {
            const attrName = match[1];
            const text = match[2].trim();

            // Skip certain attributes
            if (attrName === 'className' || attrName === 'id' || !text || text.includes('{t(')) {
              continue;
            }

            const hash = crypto.createHash('md5').update(text).digest('hex').substring(0, 8);
            const key = `${filePrefix}.t_${hash}`;

            if (!zhTWData[key] && !newTranslations[key]) {
              newTranslations[key] = text;
              matches.push({ text, key });
              extractedCount++;
            }
          }
          // Replace hardcoded text with translation keys
          if (matches.length > 0) {
            modified = true;

            // Replace JSX content
            content = content.replace(jsxRegex, (fullMatch, text) => {
              const trimmed = text.trim();
              const found = matches.find(m => m.text === trimmed);
              if (found) {
                // preserve open and close brackets logic: original text was wrapped in > <
                // regex match[0] is >text<
                // match[1] is text
                const open = fullMatch[0];
                const close = fullMatch[fullMatch.length - 1];
                return `${open}{t('${found.key}')}${close}`;
              }
              return fullMatch;
            });

            // Replace attributes
            content = content.replace(attrRegex, (fullMatch, attrName, text) => {
              if (attrName === 'className' || attrName === 'id') {
                return fullMatch;
              }
              const trimmed = text.trim();
              const found = matches.find(m => m.text === trimmed);
              if (found) {
                return `${attrName}={t('${found.key}')}`;
              }
              return fullMatch;
            });

            // Add import and hook if needed
            if (!hasTranslationImport) {
              const importStatement = "import { useTranslation } from 'react-i18next';\n";
              // Insert after first import
              const firstImportEnd = content.indexOf(';\n') + 2;
              content = content.slice(0, firstImportEnd) + importStatement + content.slice(firstImportEnd);
            }

            if (!hasUseTranslationHook) {
              // Find the function component and add hook. Support function declaration and arrow function const.
              const functionMatch = content.match(/export default function \w+\([^)]*\)\s*{/) || content.match(/const \w+\s*=\s*\([^)]*\)\s*=>\s*{/);
              if (functionMatch) {
                const insertPos = functionMatch.index! + functionMatch[0].length;
                content = content.slice(0, insertPos) + "\n  const { t } = useTranslation();\n" + content.slice(insertPos);
              }
            }
            // Write modified file
            await fs.writeFile(filePath, content, 'utf-8');
          }
        }

        // Scan all pages
        await scanDirectory(pagesDir);

        // Write new translations to zh-TW.json
        if (Object.keys(newTranslations).length > 0) {
          const updatedData = { ...zhTWData, ...newTranslations };
          await fs.writeFile(zhTWPath, JSON.stringify(updatedData, null, 2), 'utf-8');
        }

        return { success: true, extractedCount };
      }),
  }),

  // Jobs Management
  jobs: router({
    list: adminProcedure.query(async () => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");
      return await db.select().from(jobs).orderBy(jobs.postedAt);
    }),

    upsert: adminProcedure
      .input(
        z.object({
          id: z.number().optional(),
          jobId: z.string(),
          title: z.string(),
          department: z.string(),
          location: z.string(),
          country: z.string(),
          description: z.string(),
          requirements: z.string().optional(),
          isActive: z.number().default(1),
        })
      )
      .mutation(async ({ input }) => {
        const db = await getDb();
        if (!db) throw new Error("Database not available");

        if (input.id) {
          // Update
          await db
            .update(jobs)
            .set({
              jobId: input.jobId,
              title: input.title,
              department: input.department,
              location: input.location,
              country: input.country,
              description: input.description,
              requirements: input.requirements || null,
              isActive: input.isActive,
            })
            .where(eq(jobs.id, input.id));
          return { success: true, id: input.id };
        } else {
          // Insert
          const [result] = await db.insert(jobs).values({
            jobId: input.jobId,
            title: input.title,
            department: input.department,
            location: input.location,
            country: input.country,
            description: input.description,
            requirements: input.requirements || null,
            isActive: input.isActive,
          });
          return { success: true, id: result.insertId };
        }
      }),

    delete: adminProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        const db = await getDb();
        if (!db) throw new Error("Database not available");
        await db.delete(jobs).where(eq(jobs.id, input.id));
        return { success: true };
      }),

    exportCSV: adminProcedure.query(async () => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      const allJobs = await db.select().from(jobs).orderBy(jobs.postedAt);

      // 生成 CSV 內容
      const headers = ['職位編號', '職位名稱', '部門', '地點', '國家', '職位描述', '職位要求', '發布日期', '狀態'];
      const rows = allJobs.map(job => [
        job.jobId,
        job.title,
        job.department,
        job.location,
        job.country,
        job.description,
        job.requirements || '',
        new Date(job.postedAt).toISOString().split('T')[0],
        job.isActive === 1 ? '啟用' : '停用'
      ]);

      const csvContent = [
        headers.join(','),
        ...rows.map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(','))
      ].join('\n');

      // 添加 BOM 以支援 Excel 正確顯示中文
      const csvWithBOM = '\uFEFF' + csvContent;

      return {
        content: csvWithBOM,
        filename: `jobs_export_${new Date().toISOString().split('T')[0]}.csv`
      };
    }),

    exportExcel: adminProcedure.query(async () => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      const allJobs = await db.select().from(jobs).orderBy(jobs.postedAt);

      // 準備 Excel 資料
      const excelData = allJobs.map(job => ({
        '職位編號': job.jobId,
        '職位名稱': job.title,
        '部門': job.department,
        '地點': job.location,
        '國家': job.country,
        '職位描述': job.description,
        '職位要求': job.requirements || '',
        '發布日期': new Date(job.postedAt).toISOString().split('T')[0],
        '狀態': job.isActive === 1 ? '啟用' : '停用'
      }));

      // 建立工作簿和工作表
      const worksheet = XLSX.utils.json_to_sheet(excelData);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, '職缺列表');

      // 生成 Excel 檔案 (base64)
      const excelBuffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });
      const base64 = excelBuffer.toString('base64');

      return {
        content: base64,
        filename: `jobs_export_${new Date().toISOString().split('T')[0]}.xlsx`
      };
    }),

    importCSV: adminProcedure
      .input(z.object({ content: z.string() }))
      .mutation(async ({ input }) => {
        const db = await getDb();
        if (!db) throw new Error("Database not available");

        // 移除 BOM 如果存在
        let content = input.content;
        if (content.charCodeAt(0) === 0xFEFF) {
          content = content.slice(1);
        }

        // 解析 CSV
        const lines = content.split('\n').filter(line => line.trim());
        if (lines.length < 2) {
          throw new Error('檔案格式錯誤：至少需要標題列和一筆資料');
        }

        // 跳過標題列
        const dataLines = lines.slice(1);

        let successCount = 0;
        let errorCount = 0;
        const errors: string[] = [];

        for (let i = 0; i < dataLines.length; i++) {
          try {
            // 解析 CSV 列 (處理引號內的逗號)
            const matches = dataLines[i].match(/"([^"]*)"|([^,]+)/g);
            if (!matches || matches.length < 8) {
              throw new Error(`第 ${i + 2} 列格式錯誤`);
            }

            const cells = matches.map(cell => cell.replace(/^"|"$/g, '').replace(/""/g, '"'));

            const [jobId, title, department, location, country, description, requirements, postedAt, status] = cells;

            // 驗證必填欄位
            if (!jobId || !title || !department || !location || !country || !description) {
              throw new Error(`第 ${i + 2} 列缺少必填欄位`);
            }

            // 檢查是否已存在 (依 jobId)
            const existing = await db.select().from(jobs).where(eq(jobs.jobId, jobId));

            const jobData = {
              jobId,
              title,
              department,
              location,
              country,
              description,
              requirements: requirements || null,
              isActive: status === '啟用' ? 1 : 0,
              postedAt: postedAt ? new Date(postedAt) : new Date()
            };

            if (existing.length > 0) {
              // 更新現有資料
              await db.update(jobs).set(jobData).where(eq(jobs.jobId, jobId));
            } else {
              // 新增資料
              await db.insert(jobs).values(jobData);
            }

            successCount++;
          } catch (error) {
            errorCount++;
            errors.push(`第 ${i + 2} 列: ${error instanceof Error ? error.message : '未知錯誤'}`);
          }
        }

        return {
          success: true,
          successCount,
          errorCount,
          errors: errors.slice(0, 10) // 只返回前 10 個錯誤
        };
      }),

    importExcel: adminProcedure
      .input(z.object({ content: z.string() })) // base64
      .mutation(async ({ input }) => {
        const db = await getDb();
        if (!db) throw new Error("Database not available");

        try {
          // 解析 base64 為 buffer
          const buffer = Buffer.from(input.content, 'base64');

          // 讀取 Excel 檔案
          const workbook = XLSX.read(buffer, { type: 'buffer' });
          const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
          const data = XLSX.utils.sheet_to_json(firstSheet) as any[];

          if (data.length === 0) {
            throw new Error('檔案中沒有資料');
          }

          let successCount = 0;
          let errorCount = 0;
          const errors: string[] = [];

          for (let i = 0; i < data.length; i++) {
            try {
              const row = data[i];

              const jobId = row['職位編號'];
              const title = row['職位名稱'];
              const department = row['部門'];
              const location = row['地點'];
              const country = row['國家'];
              const description = row['職位描述'];
              const requirements = row['職位要求'] || null;
              const postedAt = row['發布日期'];
              const status = row['狀態'];

              // 驗證必填欄位
              if (!jobId || !title || !department || !location || !country || !description) {
                throw new Error(`第 ${i + 2} 列缺少必填欄位`);
              }

              // 檢查是否已存在
              const existing = await db.select().from(jobs).where(eq(jobs.jobId, String(jobId)));

              const jobData = {
                jobId: String(jobId),
                title: String(title),
                department: String(department),
                location: String(location),
                country: String(country),
                description: String(description),
                requirements: requirements ? String(requirements) : null,
                isActive: status === '啟用' ? 1 : 0,
                postedAt: postedAt ? new Date(postedAt) : new Date()
              };

              if (existing.length > 0) {
                // 更新
                await db.update(jobs).set(jobData).where(eq(jobs.jobId, String(jobId)));
              } else {
                // 新增
                await db.insert(jobs).values(jobData);
              }

              successCount++;
            } catch (error) {
              errorCount++;
              errors.push(`第 ${i + 2} 列: ${error instanceof Error ? error.message : '未知錯誤'}`);
            }
          }

          return {
            success: true,
            successCount,
            errorCount,
            errors: errors.slice(0, 10)
          };
        } catch (error) {
          throw new Error(`解析 Excel 檔案失敗: ${error instanceof Error ? error.message : '未知錯誤'}`);
        }
      }),
  }),

  // Local File Upload (繞過雲端浮水印)
  uploadLocal: adminProcedure
    .input(z.object({
      fileData: z.string(), // Base64 字串
      fileName: z.string(),
    }))
    .mutation(async ({ input }) => {
      try {
        // 設定上傳目錄
        const uploadsDir = path.join(process.cwd(), 'client/public/uploads');

        // 確保目錄存在
        await fs.mkdir(uploadsDir, { recursive: true });

        // 從 Base64 Data URL 中提取實際的 Base64 資料
        // 格式: data:image/jpeg;base64,/9j/4AAQ...
        const base64Data = input.fileData.includes('base64,')
          ? input.fileData.split('base64,')[1]
          : input.fileData;

        // 轉換為 Buffer
        const buffer = Buffer.from(base64Data, 'base64');

        // 生成帶時間戳記的檔名防止快取
        const timestamp = Date.now();
        const ext = path.extname(input.fileName) || '.jpg';
        const baseName = path.basename(input.fileName, ext);
        const finalFileName = `${baseName}-${timestamp}${ext}`;

        // 寫入檔案
        const filePath = path.join(uploadsDir, finalFileName);
        await fs.writeFile(filePath, buffer);

        // 回傳相對路徑 URL
        const relativeUrl = `/uploads/${finalFileName}`;

        return {
          success: true,
          url: relativeUrl,
          fileName: finalFileName,
        };
      } catch (error) {
        console.error('本地檔案上傳失敗:', error);
        throw new Error(`上傳失敗: ${error instanceof Error ? error.message : '未知錯誤'}`);
      }
    }),

  // User Management
  users: router({
    list: adminProcedure.query(async () => {
      const db = await getDb();
      return await db.select().from(users).orderBy(desc(users.createdAt));
    }),

    updateRole: adminProcedure
      .input(z.object({
        id: z.number(),
        role: z.enum(["user", "admin"]),
      }))
      .mutation(async ({ input }) => {
        const db = await getDb();
        await db.update(users)
          .set({ role: input.role })
          .where(eq(users.id, input.id));
        return { success: true };
      }),
  }),
});

import { router, publicProcedure } from "../_core/trpc";
import { z } from "zod";
import { getDb } from "../db";
import { faqs } from "../../drizzle/schema";
import { eq, sql } from "drizzle-orm";

/**
 * FAQ Router - 支援多產品標籤和多國語言
 * 
 * 核心概念:
 * - 內容集中管理在單一 faqs 表格
 * - relatedProducts 標籤決定 FAQ 出現在哪些產品頁面
 * - 多語言內容儲存為 JSON,前端根據語言參數提取
 */

export const faqsRouter = router({
  /**
   * 前台 API: 取得 FAQ 列表
   * 支援按產品 slug 篩選和多語言輸出
   */
  list: publicProcedure
    .input(z.object({
      productSlug: z.string().optional(),
    }))
    .query(async ({ input }) => {
      const db = await getDb();
      
      const allFaqs = await db
        .select()
        .from(faqs)
        .where(eq(faqs.isActive, 1))
        .orderBy(faqs.order);
      
      // 篩選產品相關的 FAQ
      let filteredFaqs = allFaqs;
      if (input.productSlug) {
        filteredFaqs = allFaqs.filter(faq => {
          const products = faq.relatedProducts as string[] | null;
          // 如果 relatedProducts 為空或 null,代表通用問題,所有產品頁都顯示
          if (!products || products.length === 0) return true;
          // 檢查是否包含指定產品
          return products.includes(input.productSlug!);
        });
      }
      
      // 回傳完整 JSON 資料,讓前端根據語言提取
      return filteredFaqs.map(faq => ({
        id: faq.id,
        category: faq.category,
        question: faq.question as Record<string, string>,
        answer: faq.answer as Record<string, string>,
        order: faq.order,
      }));
    }),

  /**
   * 後台 API: 取得完整 FAQ 列表 (包含所有語言)
   */
  adminList: publicProcedure.query(async () => {
    const db = await getDb();
    return await db
      .select()
      .from(faqs)
      .orderBy(faqs.order);
  }),

  /**
   * 後台 API: 新增或更新 FAQ
   */
  upsert: publicProcedure
    .input(z.object({
      id: z.number().optional(),
      category: z.string(),
      relatedProducts: z.array(z.string()).nullable(),
      question: z.record(z.string(), z.string()), // { "zh-TW": "問題", "en": "Question" }
      answer: z.record(z.string(), z.string()),
      order: z.number().default(0),
      isActive: z.number().default(1),
    }))
    .mutation(async ({ input }) => {
      const db = await getDb();
      
      if (input.id) {
        // 更新
        await db
          .update(faqs)
          .set({
            category: input.category,
            relatedProducts: input.relatedProducts,
            question: input.question,
            answer: input.answer,
            order: input.order,
            isActive: input.isActive,
          })
          .where(eq(faqs.id, input.id));
        
        return { success: true, id: input.id };
      } else {
        // 新增
        const result = await db.insert(faqs).values({
          category: input.category,
          relatedProducts: input.relatedProducts,
          question: input.question,
          answer: input.answer,
          order: input.order,
          isActive: input.isActive,
        });
        
        return { success: true, id: result[0].insertId };
      }
    }),

  /**
   * 後台 API: 刪除 FAQ
   */
  delete: publicProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      const db = await getDb();
      await db.delete(faqs).where(eq(faqs.id, input.id));
      return { success: true };
    }),

  /**
   * AI 翻譯 API: 翻譯問題和答案
   * TODO: 整合 OpenAI API
   */
  translate: publicProcedure
    .input(z.object({
      question: z.string(),
      answer: z.string(),
      targetLang: z.string(),
    }))
    .mutation(async ({ input }) => {
      // TODO: 呼叫 OpenAI API 進行翻譯
      // 目前先回傳原文 + 語言標記
      return {
        question: `[${input.targetLang}] ${input.question}`,
        answer: `[${input.targetLang}] ${input.answer}`,
      };
    }),

  /**
   * 後台 API: 匯出所有 FAQ 資料
   */
  export: publicProcedure.query(async () => {
    const db = await getDb();
    const allFaqs = await db.select().from(faqs).orderBy(faqs.order);
    
    return allFaqs.map(faq => ({
      id: faq.id,
      category: faq.category,
      relatedProducts: faq.relatedProducts,
      question: faq.question,
      answer: faq.answer,
      order: faq.order,
      isActive: faq.isActive,
    }));
  }),

  /**
   * 後台 API: 匯入 FAQ 資料 (批次寫入)
   */
  import: publicProcedure
    .input(z.array(z.object({
      id: z.number().optional(),
      category: z.string(),
      relatedProducts: z.array(z.string()).nullable(),
      question: z.record(z.string(), z.string()),
      answer: z.record(z.string(), z.string()),
      order: z.number().default(0),
      isActive: z.number().default(1),
    })))
    .mutation(async ({ input }) => {
      const db = await getDb();
      
      // 批次寫入資料 (如果 ID 存在則更新)
      for (const faq of input) {
        if (faq.id) {
          // 更新現有資料
          await db
            .update(faqs)
            .set({
              category: faq.category,
              relatedProducts: faq.relatedProducts,
              question: faq.question,
              answer: faq.answer,
              order: faq.order,
              isActive: faq.isActive,
            })
            .where(eq(faqs.id, faq.id));
        } else {
          // 新增資料
          await db.insert(faqs).values({
            category: faq.category,
            relatedProducts: faq.relatedProducts,
            question: faq.question,
            answer: faq.answer,
            order: faq.order,
            isActive: faq.isActive,
          });
        }
      }
      
      return { success: true, count: input.length };
    }),
});

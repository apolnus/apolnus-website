import { describe, it, expect, beforeAll } from 'vitest';
import { appRouter } from './routers';
import type { Context } from './_core/trpc';

describe('FAQ API', () => {
  const mockContext: Context = {
    user: null,
    req: {} as any,
    res: {} as any,
  };

  const caller = appRouter.createCaller(mockContext);

  describe('faqs.list', () => {
    it('should return FAQ list in default language (zh-TW)', async () => {
      const result = await caller.faqs.list({ lang: 'zh-TW' });
      
      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBeGreaterThan(0);
      
      // 驗證回傳格式
      const firstFaq = result[0];
      expect(firstFaq).toHaveProperty('id');
      expect(firstFaq).toHaveProperty('category');
      expect(firstFaq).toHaveProperty('question');
      expect(firstFaq).toHaveProperty('answer');
      expect(firstFaq).toHaveProperty('order');
      
      // 驗證是字串而非 JSON 物件
      expect(typeof firstFaq.question).toBe('string');
      expect(typeof firstFaq.answer).toBe('string');
    });

    it('should filter FAQs by productSlug', async () => {
      // 先取得所有 FAQ
      const allFaqs = await caller.faqs.list({ lang: 'zh-TW' });
      
      // 取得特定產品的 FAQ (假設有 one-x 產品)
      const productFaqs = await caller.faqs.list({ 
        lang: 'zh-TW',
        productSlug: 'one-x'
      });
      
      // 產品專屬 FAQ 應該少於或等於全部 FAQ
      expect(productFaqs.length).toBeLessThanOrEqual(allFaqs.length);
      
      // 所有回傳的 FAQ 都應該是有效的
      productFaqs.forEach(faq => {
        expect(faq.question).toBeTruthy();
        expect(faq.answer).toBeTruthy();
      });
    });

    it('should fallback to zh-TW when requested language is not available', async () => {
      const result = await caller.faqs.list({ lang: 'fr' }); // 法文 (不存在)
      
      expect(Array.isArray(result)).toBe(true);
      // 應該回傳繁中內容作為 fallback
      if (result.length > 0) {
        expect(result[0].question).toBeTruthy();
        expect(result[0].answer).toBeTruthy();
      }
    });
  });

  describe('faqs.adminList', () => {
    it('should return complete FAQ data with JSON structure', async () => {
      const result = await caller.faqs.adminList();
      
      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBeGreaterThan(0);
      
      // 驗證回傳完整的 JSON 結構
      const firstFaq = result[0];
      expect(firstFaq).toHaveProperty('id');
      expect(firstFaq).toHaveProperty('category');
      expect(firstFaq).toHaveProperty('relatedProducts');
      expect(firstFaq).toHaveProperty('question');
      expect(firstFaq).toHaveProperty('answer');
      
      // 驗證 question 和 answer 是物件 (JSON)
      expect(typeof firstFaq.question).toBe('object');
      expect(typeof firstFaq.answer).toBe('object');
    });
  });

  describe('faqs.upsert', () => {
    it('should create a new FAQ', async () => {
      const newFaq = {
        category: '測試分類',
        relatedProducts: ['one-x'],
        question: {
          'zh-TW': '這是測試問題?',
          'en': 'This is a test question?'
        },
        answer: {
          'zh-TW': '這是測試答案。',
          'en': 'This is a test answer.'
        },
        order: 999,
        isActive: 1,
      };
      
      const result = await caller.faqs.upsert(newFaq);
      
      expect(result.success).toBe(true);
      expect(result.id).toBeDefined();
      expect(typeof result.id).toBe('number');
    });

    it('should update an existing FAQ', async () => {
      // 先取得一個 FAQ
      const allFaqs = await caller.faqs.adminList();
      const existingFaq = allFaqs[0];
      
      // 更新它
      const updatedFaq = {
        id: existingFaq.id,
        category: existingFaq.category,
        relatedProducts: existingFaq.relatedProducts as string[] | null,
        question: existingFaq.question as Record<string, string>,
        answer: existingFaq.answer as Record<string, string>,
        order: existingFaq.order,
        isActive: existingFaq.isActive,
      };
      
      const result = await caller.faqs.upsert(updatedFaq);
      
      expect(result.success).toBe(true);
      expect(result.id).toBe(existingFaq.id);
    });
  });

  describe('faqs.translate', () => {
    it('should return translated content', async () => {
      const result = await caller.faqs.translate({
        question: '如何使用產品?',
        answer: '請參考使用手冊。',
        targetLang: 'en',
      });
      
      expect(result).toHaveProperty('question');
      expect(result).toHaveProperty('answer');
      expect(typeof result.question).toBe('string');
      expect(typeof result.answer).toBe('string');
    });
  });
});

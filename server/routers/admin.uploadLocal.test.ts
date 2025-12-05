import { describe, it, expect, beforeAll } from 'vitest';
import { adminRouter } from './admin';
import * as fs from 'fs/promises';
import * as path from 'path';

describe('Admin uploadLocal API', () => {
  let caller: ReturnType<typeof adminRouter.createCaller>;

  beforeAll(() => {
    // 建立 TRPC caller
    caller = adminRouter.createCaller({});
  });

  it('應該成功上傳 Base64 圖片到本地檔案系統', async () => {
    // 讀取測試圖片
    const testImagePath = path.join(process.cwd(), 'client/public/og-image-facebook.jpg');
    const imageBuffer = await fs.readFile(testImagePath);
    const base64Data = `data:image/jpeg;base64,${imageBuffer.toString('base64')}`;

    // 呼叫 uploadLocal
    const result = await caller.uploadLocal({
      fileData: base64Data,
      fileName: 'test-upload.jpg',
    });

    // 驗證回傳結果
    expect(result.success).toBe(true);
    expect(result.url).toMatch(/^\/uploads\/test-upload-\d+\.jpg$/);
    expect(result.fileName).toMatch(/^test-upload-\d+\.jpg$/);

    // 驗證檔案確實存在
    const uploadedFilePath = path.join(process.cwd(), 'client/public', result.url);
    const fileExists = await fs.access(uploadedFilePath).then(() => true).catch(() => false);
    expect(fileExists).toBe(true);

    // 驗證檔案大小
    const stats = await fs.stat(uploadedFilePath);
    expect(stats.size).toBeGreaterThan(0);
    expect(stats.size).toBe(imageBuffer.length);

    console.log('✅ 本地上傳測試通過');
    console.log(`   上傳路徑: ${result.url}`);
    console.log(`   檔案大小: ${(stats.size / 1024).toFixed(2)} KB`);
    console.log('   🎉 完全繞過雲端，無浮水印！');

    // 清理測試檔案
    await fs.unlink(uploadedFilePath);
  });

  it('應該正確處理不同的圖片格式', async () => {
    // 建立一個簡單的 PNG Base64 (1x1 紅色像素)
    const pngBase64 = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8DwHwAFBQIAX8jx0gAAAABJRU5ErkJggg==';

    const result = await caller.uploadLocal({
      fileData: pngBase64,
      fileName: 'test.png',
    });

    expect(result.success).toBe(true);
    expect(result.url).toMatch(/^\/uploads\/test-\d+\.png$/);

    // 清理
    const uploadedFilePath = path.join(process.cwd(), 'client/public', result.url);
    await fs.unlink(uploadedFilePath);
  });

  it('應該在檔名中加入時間戳記防止快取', async () => {
    const testBase64 = 'data:image/jpeg;base64,/9j/4AAQSkZJRg==';

    const result1 = await caller.uploadLocal({
      fileData: testBase64,
      fileName: 'same-name.jpg',
    });

    // 等待 1 毫秒確保時間戳記不同
    await new Promise(resolve => setTimeout(resolve, 1));

    const result2 = await caller.uploadLocal({
      fileData: testBase64,
      fileName: 'same-name.jpg',
    });

    // 兩次上傳應該產生不同的檔名
    expect(result1.fileName).not.toBe(result2.fileName);
    expect(result1.url).not.toBe(result2.url);

    // 清理
    const path1 = path.join(process.cwd(), 'client/public', result1.url);
    const path2 = path.join(process.cwd(), 'client/public', result2.url);
    await fs.unlink(path1).catch(() => {});
    await fs.unlink(path2).catch(() => {});
  });
});

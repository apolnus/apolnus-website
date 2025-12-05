import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function testLocalUpload() {
  try {
    console.log('🧪 測試本地檔案上傳 API...\n');
    
    // 讀取現有的 og-image-facebook.jpg 作為測試檔案
    const testImagePath = path.join(__dirname, 'client/public/og-image-facebook.jpg');
    const imageBuffer = await fs.readFile(testImagePath);
    const base64Data = `data:image/jpeg;base64,${imageBuffer.toString('base64')}`;
    
    console.log('✅ 測試圖片已讀取');
    console.log(`   檔案大小: ${(imageBuffer.length / 1024).toFixed(2)} KB\n`);
    
    // 呼叫 TRPC API (使用正確的 batch 格式)
    const input = {
      "0": {
        fileData: base64Data,
        fileName: 'test-og-image.jpg',
      }
    };
    
    const response = await fetch(`http://localhost:3000/trpc/admin.uploadLocal?batch=1&input=${encodeURIComponent(JSON.stringify(input))}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP ${response.status}: ${errorText}`);
    }
    
    const result = await response.json();
    console.log('✅ API 回應成功');
    console.log('   回應內容:', JSON.stringify(result, null, 2));
    
    // 驗證檔案是否真的被寫入
    if (result.result?.data?.url) {
      const uploadedFilePath = path.join(__dirname, 'client/public', result.result.data.url);
      const fileExists = await fs.access(uploadedFilePath).then(() => true).catch(() => false);
      
      if (fileExists) {
        const stats = await fs.stat(uploadedFilePath);
        console.log('\n✅ 檔案已成功寫入本地檔案系統');
        console.log(`   路徑: ${uploadedFilePath}`);
        console.log(`   大小: ${(stats.size / 1024).toFixed(2)} KB`);
        console.log(`   URL: ${result.result.data.url}`);
        console.log('\n🎉 本地上傳功能測試通過！完全繞過雲端，無浮水印！');
      } else {
        console.log('\n❌ 錯誤：API 回傳成功但檔案未找到');
      }
    }
    
  } catch (error) {
    console.error('\n❌ 測試失敗:', error.message);
    process.exit(1);
  }
}

testLocalUpload();

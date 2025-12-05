/**
 * SHA-256 加密工具函數
 * 用於 Meta 進階配對 (Advanced Matching) 的使用者資料加密
 */

/**
 * 將字串轉換為 SHA-256 雜湊值
 * @param text 要加密的文字
 * @returns Promise<string> 雜湊後的十六進位字串
 */
export async function sha256(text: string): Promise<string> {
  if (!text || text.trim() === '') {
    return '';
  }

  // 正規化文字:移除空白、轉小寫
  const normalized = text.trim().toLowerCase();

  // 使用 Web Crypto API 進行 SHA-256 加密
  const encoder = new TextEncoder();
  const data = encoder.encode(normalized);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);

  // 轉換為十六進位字串
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');

  return hashHex;
}

/**
 * 批次加密多個欄位
 * @param data 包含要加密欄位的物件
 * @returns Promise<Record<string, string>> 加密後的欄位對照表
 */
export async function hashUserData(data: {
  email?: string | null;
  phone?: string | null;
  firstName?: string | null;
  lastName?: string | null;
}): Promise<Record<string, string>> {
  const hashed: Record<string, string> = {};

  if (data.email) {
    hashed.em = await sha256(data.email);
  }

  if (data.phone) {
    // 移除電話號碼中的空格、破折號等符號
    const cleanPhone = data.phone.replace(/[\s\-\(\)]/g, '');
    hashed.ph = await sha256(cleanPhone);
  }

  if (data.firstName) {
    hashed.fn = await sha256(data.firstName);
  }

  if (data.lastName) {
    hashed.ln = await sha256(data.lastName);
  }

  return hashed;
}

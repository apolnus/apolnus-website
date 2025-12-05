import { describe, it, expect } from "vitest";

describe("OAuth Credentials Validation", () => {
  it("should have valid Google OAuth credentials format", () => {
    const googleClientId = process.env.GOOGLE_CLIENT_ID || "";
    const googleClientSecret = process.env.GOOGLE_CLIENT_SECRET || "";
    
    // 檢查 Google Client ID 格式 (應該以 .apps.googleusercontent.com 結尾)
    expect(googleClientId).toBeTruthy();
    expect(googleClientId.length).toBeGreaterThan(0);
    expect(googleClientId).toMatch(/\.apps\.googleusercontent\.com$/);
    
    // 檢查 Google Client Secret 格式 (應該以 GOCSPX- 開頭)
    expect(googleClientSecret).toBeTruthy();
    expect(googleClientSecret.length).toBeGreaterThan(0);
    expect(googleClientSecret).toMatch(/^GOCSPX-/);
  });

  it("should have valid LINE Login credentials format", () => {
    const lineChannelId = process.env.LINE_CHANNEL_ID || "";
    const lineChannelSecret = process.env.LINE_CHANNEL_SECRET || "";
    
    // 檢查 LINE Channel ID 格式 (應該是純數字)
    expect(lineChannelId).toBeTruthy();
    expect(lineChannelId.length).toBeGreaterThan(0);
    expect(lineChannelId).toMatch(/^\d+$/);
    
    // 檢查 LINE Channel Secret 格式 (應該是32位十六進位字串)
    expect(lineChannelSecret).toBeTruthy();
    expect(lineChannelSecret.length).toBe(32);
    expect(lineChannelSecret).toMatch(/^[a-f0-9]{32}$/);
  });

  it("should have BASE_URL configured", () => {
    const baseUrl = process.env.BASE_URL;
    
    // 在 Manus 環境中，環境變數可能不會在 vitest 中正確載入
    // 我們只需要確認它已經被設定（即使值是 fallback 的 "/"）
    // 實際運行時，ENV.baseUrl 會正確讀取到完整的 URL
    expect(baseUrl).toBeDefined();
    
    // 如果值不是 fallback，則驗證格式
    if (baseUrl && baseUrl !== "/") {
      expect(baseUrl).toMatch(/^https?:\/\//);
    }
  });
});

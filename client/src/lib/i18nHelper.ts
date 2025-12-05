// ============================================
// Root-as-Global 策略：英文版在根目錄，其他語言使用子目錄
// ============================================

// 1. 定義所有支援的內部語言代碼
export const ALL_LANGS = ["en", "zh-TW", "zh-CN", "ja", "ko", "de", "fr"];

// 2. 定義 URL 前置映射 (注意：不包含 en，因為英文不使用前置)
// 對於尚未翻譯的國家 (mx, it, nl...)，暫時映射到 'en' (Fallback to English)
export const URL_PREFIX_MAP: Record<string, string> = {
  "tw": "zh-TW",    // 台灣 -> 繁體中文
  "cn": "zh-CN",    // 中國 -> 簡體中文
  "jp": "ja",       // 日本 -> 日文
  "kr": "ko",       // 韓國 -> 韓文
  "de": "de",       // 德國 -> 德文
  "fr": "fr",       // 法國 -> 法文
  // 未翻譯國家 (Fallback to English)
  "mx": "en",       // Mexico -> English
  "it": "en",       // Italy -> English
  "nl": "en",       // Netherlands -> English
  "es": "en",       // Spain -> English
  "uk": "en",       // United Kingdom -> English
  "au": "en",       // Australia -> English
  "sg": "en",       // Singapore -> English
  "nz": "en",       // New Zealand -> English
  "ca": "en",       // Canada -> English
  // 注意：這裡移除了 "us"/"en"，因為英文不使用前置
};

// 反向映射 (i18n -> URL)，用於語言切換
export const LANG_URL_MAP = Object.fromEntries(
  Object.entries(URL_PREFIX_MAP).map(([url, code]) => [code, url])
);

export const PREFIX_LANGS = Object.keys(URL_PREFIX_MAP); // ['tw', 'cn', 'jp'...]
export const PREFIX_KEYS = Object.keys(URL_PREFIX_MAP); // 別名，供 LanguageSelector 使用
export const DEFAULT_LANG = "en"; // 預設語言為英文

// 向後兼容的別名
export const VALID_URL_LANGS = [...PREFIX_LANGS, "en"]; // 包含所有語言的URL代碼
export const DEFAULT_URL_LANG = "en"; // 預設URL語言

/**
 * 從 URL 路徑判斷語言
 * @param path URL 路徑 (例如 '/tw/about' 或 '/about')
 * @returns i18n 語言代碼 (例如 'zh-TW' 或 'en')
 */
export function getLangFromPath(path: string): string {
  const firstSegment = path.split('/').filter(Boolean)[0]; // 取得第一段
  if (firstSegment && URL_PREFIX_MAP[firstSegment]) {
    return URL_PREFIX_MAP[firstSegment];
  }
  return DEFAULT_LANG; // 沒對應到前綴，就是英文
}

/**
 * 從 URL 簡碼取得 i18n 語言代碼
 * @param urlLang URL 中的語言簡碼 (例如 'tw')
 * @returns i18n 語言代碼 (例如 'zh-TW')
 */
export function getI18nLangFromUrl(urlLang: string): string {
  if (urlLang === "en" || urlLang === "us") return "en";
  return URL_PREFIX_MAP[urlLang] || DEFAULT_LANG;
}

/**
 * 從 i18n 語言代碼取得 URL 簡碼
 * @param i18nLang i18n 語言代碼 (例如 'zh-TW')
 * @returns URL 簡碼 (例如 'tw')，英文返回空字串
 */
export function getUrlLangFromI18n(i18nLang: string): string {
  if (i18nLang === "en") return ""; // 英文不使用前綴
  return LANG_URL_MAP[i18nLang] || "";
}

/**
 * 檢查 URL 語言簡碼是否有效
 * @param urlLang URL 中的語言簡碼
 * @returns 是否為有效的語言簡碼
 */
export function isValidUrlLang(urlLang: string): boolean {
  return VALID_URL_LANGS.includes(urlLang);
}

/**
 * 檢查語言是否需要URL前綴
 * @param i18nLang i18n 語言代碼
 * @returns 是否需要前綴
 */
export function needsPrefix(i18nLang: string): boolean {
  return i18nLang !== "en";
}

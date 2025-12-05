import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { useLocation } from "wouter";
import { URL_PREFIX_MAP, PREFIX_LANGS, DEFAULT_LANG } from "@/lib/i18nHelper";

// 語言名稱映射
const LANG_NAMES: Record<string, { name: string; region: string }> = {
  "en": { name: "English", region: "United States" },
  "zh-TW": { name: "繁體中文", region: "台灣" },
  "zh-CN": { name: "简体中文", region: "中国" },
  "ja": { name: "日本語", region: "日本" },
  "ko": { name: "한국어", region: "한국" },
  "de": { name: "Deutsch", region: "Deutschland" },
  "fr": { name: "Français", region: "France" },
};

// 瀏覽器語言到i18n語言的映射
const BROWSER_LANG_MAP: Record<string, string> = {
  "zh-tw": "zh-TW",
  "zh-hk": "zh-TW",
  "zh-cn": "zh-CN",
  "zh-hans": "zh-CN",
  "zh-hant": "zh-TW",
  "ja": "ja",
  "ja-jp": "ja",
  "ko": "ko",
  "ko-kr": "ko",
  "de": "de",
  "de-de": "de",
  "fr": "fr",
  "fr-fr": "fr",
  "en": "en",
  "en-us": "en",
  "en-gb": "en",
  "en-au": "en",
  "en-ca": "en",
};

interface Suggestion {
  code: string;
  name: string;
  region: string;
  url: string;
  text: string;
  buttonText: string;
}

// 定義橫幅高度
const BANNER_HEIGHT = "44px";

export default function LocaleNotification() {
  const [isVisible, setIsVisible] = useState(false);
  const [suggestion, setSuggestion] = useState<Suggestion | null>(null);
  const [location, setLocation] = useLocation();

  useEffect(() => {
    // 1. 檢查 Session 是否已關閉
    if (sessionStorage.getItem("locale-banner-dismissed")) return;

    // 2. 偵測瀏覽器語言
    const browserLang = navigator.language.toLowerCase(); // e.g., "zh-tw", "en-us"
    const i18nLang = BROWSER_LANG_MAP[browserLang] || BROWSER_LANG_MAP[browserLang.split('-')[0]] || "en";

    // 3. 判斷當前 URL 語言
    const currentPath = location;
    const pathSegments = currentPath.split('/').filter(Boolean);
    const currentPrefix = pathSegments.length > 0 && PREFIX_LANGS.includes(pathSegments[0]) ? pathSegments[0] : '';
    const currentLang = currentPrefix ? URL_PREFIX_MAP[currentPrefix] : DEFAULT_LANG;

    // 4. 比對與建議邏輯
    if (i18nLang !== currentLang) {
      // 語言不符,建議切換
      const langInfo = LANG_NAMES[i18nLang] || LANG_NAMES["en"];
      
      // 計算建議的URL
      let suggestedUrl = "";
      if (i18nLang === "en") {
        // 建議切換到英文(根目錄)
        if (currentPrefix) {
          // 移除語言前綴
          const pathWithoutPrefix = "/" + pathSegments.slice(1).join("/");
          suggestedUrl = pathWithoutPrefix || "/";
        } else {
          suggestedUrl = currentPath;
        }
      } else {
        // 建議切換到其他語言
        const targetPrefix = Object.keys(URL_PREFIX_MAP).find(
          key => URL_PREFIX_MAP[key] === i18nLang
        ) || "tw";
        
        if (currentPrefix) {
          // 替換語言前綴
          pathSegments[0] = targetPrefix;
          suggestedUrl = "/" + pathSegments.join("/");
        } else {
          // 添加語言前綴
          suggestedUrl = `/${targetPrefix}${currentPath === "/" ? "" : currentPath}`;
        }
      }

      // 設定建議
      setSuggestion({
        code: i18nLang,
        name: langInfo.name,
        region: langInfo.region,
        url: suggestedUrl,
        text: `Looks like you're in ${langInfo.region}. Would you like to visit the ${langInfo.region} website?`,
        buttonText: `Switch to ${langInfo.name}`,
      });
      setIsVisible(true);
    }
  }, [location]);

  // 關鍵：透過 CSS 變數控制全站推擠
  useEffect(() => {
    const root = document.documentElement;
    if (isVisible) {
      root.style.setProperty("--banner-height", BANNER_HEIGHT);
    } else {
      root.style.removeProperty("--banner-height");
    }
    // Cleanup on unmount
    return () => root.style.removeProperty("--banner-height");
  }, [isVisible]);

  const handleClose = () => {
    sessionStorage.setItem("locale-banner-dismissed", "true");
    setIsVisible(false);
  };

  const handleSwitch = () => {
    if (suggestion) {
      setLocation(suggestion.url);
      handleClose();
    }
  };

  if (!isVisible || !suggestion) return null;

  return (
    <div
      className="fixed top-0 left-0 right-0 z-[60] bg-[#1d1d1f] text-[#f5f5f7] flex items-center justify-center transition-all duration-300 ease-in-out"
      style={{ height: BANNER_HEIGHT }}
    >
      <div className="container mx-auto px-4 flex flex-row items-center justify-between gap-4">
        <div className="flex-1 text-center lg:text-left text-xs lg:text-sm">
          <span>{suggestion.text}</span>
        </div>
        <div className="flex items-center gap-4 flex-shrink-0">
          <button
            onClick={handleSwitch}
            className="text-[#2997ff] hover:underline whitespace-nowrap font-medium text-xs lg:text-sm"
          >
            {suggestion.buttonText}
          </button>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-white transition-colors"
            aria-label="Close notification"
          >
            <X size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}

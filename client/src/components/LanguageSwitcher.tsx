import { useState } from "react";
import { Globe } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";
import { getUrlLangFromI18n, URL_LANG_MAP } from "@/lib/i18nHelper";

// 國家/地區和語言配置
const REGIONS = [
  {
    code: "us",
    name: "United States",
    flag: "🇺🇸",
    languages: [
      { code: "en", name: "English" },
    ],
  },
  {
    code: "jp",
    name: "Japan",
    flag: "🇯🇵",
    languages: [
      { code: "ja", name: "日本語" },
    ],
  },
  {
    code: "tw",
    name: "Taiwan",
    flag: "🇹🇼",
    languages: [
      { code: "zh-TW", name: "繁體中文" },
    ],
  },
  {
    code: "kr",
    name: "South Korea",
    flag: "🇰🇷",
    languages: [
      { code: "ko", name: "한국어" },
    ],
  },
  {
    code: "cn",
    name: "China",
    flag: "🇨🇳",
    languages: [
      { code: "zh-CN", name: "简体中文" },
    ],
  },
  {
    code: "de",
    name: "Germany",
    flag: "🇩🇪",
    languages: [
      { code: "de", name: "Deutsch" },
    ],
  },
  {
    code: "fr",
    name: "France",
    flag: "🇫🇷",
    languages: [
      { code: "fr", name: "Français" },
    ],
  },
];

export default function LanguageSwitcher() {
  const [open, setOpen] = useState(false);
  const [selectedRegion, setSelectedRegion] = useState("tw");
  const [selectedLanguage, setSelectedLanguage] = useState("zh-TW");

  // 從 localStorage 載入用戶偏好
  useState(() => {
    const savedRegion = localStorage.getItem("selectedRegion");
    const savedLanguage = localStorage.getItem("selectedLanguage");
    if (savedRegion) setSelectedRegion(savedRegion);
    if (savedLanguage) setSelectedLanguage(savedLanguage);
  });

  const [location, setLocation] = useLocation();

  const handleLanguageChange = (regionCode: string, languageCode: string) => {
    setSelectedRegion(regionCode);
    setSelectedLanguage(languageCode);
    localStorage.setItem("selectedRegion", regionCode);
    localStorage.setItem("selectedLanguage", languageCode);
    setOpen(false);
    
    // 取得目標語言的 URL 簡碼
    const targetUrlLang = getUrlLangFromI18n(languageCode);
    
    // 解析當前路徑,提取語言和路徑部分
    const pathParts = location.split('/').filter(Boolean);
    const currentUrlLang = pathParts[0];
    
    // 如果當前路徑有語言前綴,替換為新語言
    let newPath: string;
    if (Object.keys(URL_LANG_MAP).includes(currentUrlLang)) {
      // 有語言前綴,替換它
      pathParts[0] = targetUrlLang;
      newPath = '/' + pathParts.join('/');
      // 如果替換後只剩語言前綴,添加結尾斜線
      if (pathParts.length === 1) {
        newPath += '/';
      }
    } else {
      // 沒有語言前綴,添加新語言前綴
      newPath = `/${targetUrlLang}${location}`;
    }
    
    // 執行 URL 跳轉
    setLocation(newPath);
  };

  const getCurrentRegion = () => {
    return REGIONS.find((r) => r.code === selectedRegion) || REGIONS[2];
  };

  const getCurrentLanguage = () => {
    const region = getCurrentRegion();
    return region.languages.find((l) => l.code === selectedLanguage) || region.languages[0];
  };

  return (
    <>
      {/* 語言切換按鈕 */}
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors"
      >
        <Globe className="w-4 h-4" />
        <span>{getCurrentLanguage().name}</span>
      </button>

      {/* 語言選擇彈窗 */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">選擇您的國家/地區和語言</DialogTitle>
          </DialogHeader>

          <div className="space-y-6 mt-6">
            {REGIONS.map((region) => (
              <div key={region.code} className="border-b pb-6 last:border-b-0">
                {/* 國家/地區標題 */}
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-3xl">{region.flag}</span>
                  <h3 className="text-lg font-semibold">{region.name}</h3>
                </div>

                {/* 語言選項 */}
                <div className="grid grid-cols-2 lg:grid-cols-3 lg:grid-cols-4 gap-3 ml-12">
                  {region.languages.map((language) => (
                    <Button
                      key={`${region.code}-${language.code}`}
                      variant={
                        selectedRegion === region.code && selectedLanguage === language.code
                          ? "default"
                          : "outline"
                      }
                      className="justify-start"
                      onClick={() => handleLanguageChange(region.code, language.code)}
                    >
                      {language.name}
                    </Button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

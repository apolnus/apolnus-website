import { useState } from "react";
import { X } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useLocation } from "wouter";
import { getUrlLangFromI18n, URL_PREFIX_MAP, PREFIX_LANGS, PREFIX_KEYS } from "@/lib/i18nHelper";

// 語言選擇器數據結構
type Region = {
  id: string;
  name: string;
  countries: Country[];
};

type Country = {
  id: string;
  name: string;
  flag: string;
  language: string;
};

const regions: Region[] = [
  {
    id: "americas",
    name: "region.americas",
    countries: [
      { id: "us", name: "United States", flag: "🇺🇸", language: "English" },
      { id: "ca", name: "Canada", flag: "🇨🇦", language: "English" },
      { id: "mx", name: "Mexico", flag: "🇲🇽", language: "Español" },
    ],
  },
  {
    id: "asia-pacific",
    name: "region.asiaPacific",
    countries: [
      { id: "tw", name: "Taiwan", flag: "🇹🇼", language: "繁體中文" },
      { id: "cn", name: "China", flag: "🇨🇳", language: "简体中文" },
      { id: "jp", name: "Japan", flag: "🇯🇵", language: "日本語" },
      { id: "kr", name: "South Korea", flag: "🇰🇷", language: "한국어" },
      { id: "sg", name: "Singapore", flag: "🇸🇬", language: "English" },
      { id: "au", name: "Australia", flag: "🇦🇺", language: "English" },
      { id: "nz", name: "New Zealand", flag: "🇳🇿", language: "English" },
    ],
  },
  {
    id: "europe",
    name: "region.europe",
    countries: [
      { id: "de", name: "Germany", flag: "🇩🇪", language: "Deutsch" },
      { id: "fr", name: "France", flag: "🇫🇷", language: "Français" },
      { id: "uk", name: "United Kingdom", flag: "🇬🇧", language: "English" },
      { id: "it", name: "Italy", flag: "🇮🇹", language: "Italiano" },
      { id: "es", name: "Spain", flag: "🇪🇸", language: "Español" },
      { id: "nl", name: "Netherlands", flag: "🇳🇱", language: "Nederlands" },
    ],
  },
];

interface LanguageSelectorProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function LanguageSelector({ isOpen, onClose }: LanguageSelectorProps) {
  const { i18n, t } = useTranslation();
  const [selectedRegion, setSelectedRegion] = useState<string>("asia-pacific");

  // 語言代碼映射
  const languageMap: Record<string, string> = {
    us: "en",
    ca: "en",
    mx: "en", // 暫時使用英文，可以之後添加西班牙文
    tw: "zh-TW",
    cn: "zh-CN",
    jp: "ja",
    kr: "ko",
    sg: "en",
    au: "en",
    nz: "en",
    de: "de",
    fr: "fr",
    uk: "en",
    it: "en", // 暫時使用英文，可以之後添加義大利文
    es: "en", // 暫時使用英文，可以之後添加西班牙文
    nl: "en", // 暫時使用英文，可以之後添加荷蘭文
  };

  const [location, setLocation] = useLocation();

  const handleLanguageChange = (targetCountryId: string) => {
    // targetCountryId 是 'tw', 'jp', 'mx', 'us' 等
    const currentPath = window.location.pathname;
    const segments = currentPath.split('/').filter(Boolean);

    // 1. 判斷當前路徑第一段是否為已知的語言前置 (如 'kr', 'tw')
    const hasPrefix = segments.length > 0 && PREFIX_KEYS.includes(segments[0]);
    
    // 2. 取得「純路徑」 (剝離語言層)
    // 如果有前置就切掉第一段，否則整串就是純路徑
    const purePath = hasPrefix 
      ? '/' + segments.slice(1).join('/') 
      : currentPath === '/' ? '' : currentPath;

    // 3. 決定目標前置
    // 如果是 'us' (美國)，我們設為根目錄 (無前置)
    // 其他國家則使用 countryId 作為前置
    const targetPrefix = targetCountryId === 'us' ? '' : `/${targetCountryId}`;

    // 4. 組合新路徑
    const newPath = `${targetPrefix}${purePath}` || "/";

    console.log(`Switching: ${currentPath} -> ${newPath}`);
    window.location.href = newPath;
  };

  if (!isOpen) return null;

  const currentRegion = regions.find((r) => r.id === selectedRegion);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* 背景遮罩 */}
      <div
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
      />

      {/* 彈窗內容 */}
      <div className="relative bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[80vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-2xl font-semibold text-gray-900">{t('region.title')}</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            aria-label="關閉"
          >
            <X className="w-6 h-6 text-gray-600" />
          </button>
        </div>

        {/* 區域標籤 */}
        <div className="flex border-b bg-gray-50">
          {regions.map((region) => (
            <button
              key={region.id}
              onClick={() => setSelectedRegion(region.id)}
              className={`flex-1 px-6 py-4 text-sm font-medium transition-colors ${
                selectedRegion === region.id
                  ? "text-blue-600 border-b-2 border-blue-600 bg-white"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
              }`}
            >
              {t(region.name)}
            </button>
          ))}
        </div>

        {/* 國家列表 */}
        <div className="p-6 overflow-y-auto max-h-[calc(80vh-180px)]">
          <div className="grid grid-cols-1 lg:grid-cols-2 lg:grid-cols-3 gap-4">
            {currentRegion?.countries.map((country) => (
              <button
                key={country.id}
                onClick={() => {
                  handleLanguageChange(country.id);
                  onClose();
                }}
                className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all group"
              >
                <span className="text-3xl">{country.flag}</span>
                <div className="flex-1 text-left">
                  <div className="text-sm font-medium text-gray-900 group-hover:text-blue-600">
                    {country.name}
                  </div>
                  <div className="text-xs text-gray-500">{country.language}</div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

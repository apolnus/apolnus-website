import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import zhTW from './locales/zh-TW.json';
import zhCN from './locales/zh-CN.json';
import en from './locales/en.json';
import ja from './locales/ja.json';
import ko from './locales/ko.json';
import de from './locales/de.json';
import fr from './locales/fr.json';

const resources = {
  'zh-TW': { translation: zhTW },
  'zh-CN': { translation: zhCN },
  en: { translation: en },
  ja: { translation: ja },
  ko: { translation: ko },
  de: { translation: de },
  fr: { translation: fr },
};

// Initialize i18n synchronously
i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'zh-TW',
    lng: 'zh-TW', // Set default language explicitly
    supportedLngs: ['zh-TW', 'zh-CN', 'en', 'ja', 'ko', 'de', 'fr'],
    debug: true,
    interpolation: {
      escapeValue: false,
    },
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
    },
    react: {
      useSuspense: false, // Disable suspense to avoid loading issues
    },
  });

console.log('[i18n] Initialized');
console.log('[i18n] Current language:', i18n.language);
console.log('[i18n] Test translation:', i18n.t('nav.one'));

// Expose to window for debugging
if (typeof window !== 'undefined') {
  (window as any).i18next = i18n;
}

export default i18n;

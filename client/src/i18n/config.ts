import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Import all locale JSON files directly
import tw from './locales/tw.json';
import cn from './locales/cn.json';
import en from './locales/en.json';
import jp from './locales/jp.json';
import ko from './locales/ko.json';
import de from './locales/de.json';
import fr from './locales/fr.json';

// Initialize i18n with local JSON files
i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      'zh-TW': { translation: tw },
      'zh-CN': { translation: cn },
      'en': { translation: en },
      'ja': { translation: jp },
      'ko': { translation: ko },
      'de': { translation: de },
      'fr': { translation: fr },
    },
    fallbackLng: 'zh-TW',
    lng: 'zh-TW', // Set default language explicitly
    supportedLngs: ['zh-TW', 'zh-CN', 'en', 'ja', 'ko', 'de', 'fr'],
    debug: false,
    interpolation: {
      escapeValue: false,
    },
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
    },
    react: {
      useSuspense: false,
    },
  });

console.log('[i18n] Initialized with local JSON files');

export default i18n;

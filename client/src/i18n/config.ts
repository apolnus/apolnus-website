import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import HttpBackend from 'i18next-http-backend';

// Initialize i18n
i18n
  .use(HttpBackend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    backend: {
      loadPath: '/api/translations/{{lng}}',
    },
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
      useSuspense: false, // Disable suspense to avoid loading issues used in components without Suspense boundary
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

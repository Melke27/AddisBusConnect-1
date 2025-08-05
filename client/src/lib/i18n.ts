import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Import translations
import en from '../locales/en.json';
import am from '../locales/am.json';
import om from '../locales/om.json';
import ti from '../locales/ti.json';

i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en },
      am: { translation: am },
      om: { translation: om },
      ti: { translation: ti },
    },
    lng: 'en', // default language
    fallbackLng: 'en',
    debug: true, // Enable debug mode to see what's happening
    interpolation: {
      escapeValue: false,
    },
    react: {
      useSuspense: false, // This helps with SSR and prevents issues
    },
    // Add better error handling
    missingKeyHandler: (lng, ns, key, res) => {
      console.warn(`Missing translation key: ${key} for language: ${lng}`);
      return key; // Return the key as fallback
    },
  });

export default i18n;

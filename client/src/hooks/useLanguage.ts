import { useState, useEffect } from 'react';
import i18n from '@/lib/i18n';

export function useLanguage() {
  const [language, setLanguage] = useState(i18n.language || 'en');

  useEffect(() => {
    const handleLanguageChange = (lng: string) => {
      console.log('Language changed to:', lng);
      setLanguage(lng);
    };

    i18n.on('languageChanged', handleLanguageChange);
    return () => {
      i18n.off('languageChanged', handleLanguageChange);
    };
  }, []);

  const changeLanguage = (lng: string) => {
    console.log('Changing language to:', lng);
    i18n.changeLanguage(lng);
  };

  const t = (key: string, options?: any) => {
    const translation = i18n.t(key, options);
    console.log(`Translation for "${key}":`, translation);
    return translation;
  };

  return {
    language,
    changeLanguage,
    t,
  };
}

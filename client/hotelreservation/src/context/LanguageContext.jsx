import { createContext, useContext, useEffect, useMemo } from 'react';
import { translations } from '../i18n/translations';

const LanguageContext = createContext(null);
const LANG = 'az';

const fill = (text, vars) => {
  if (!vars) return text;
  return Object.entries(vars).reduce(
    (result, [key, value]) => result.replaceAll(`{${key}}`, String(value)),
    text
  );
};

export const LanguageProvider = ({ children }) => {
  useEffect(() => {
    localStorage.removeItem('lang');
    document.documentElement.lang = LANG;
    document.title = 'AE Hotel — Otel & Travel';
  }, []);

  const value = useMemo(() => {
    const t = (key, vars) => {
      const text = translations.az[key] ?? key;
      return fill(text, vars);
    };
    return { lang: LANG, setLang: () => {}, t, locale: 'az-AZ' };
  }, []);

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider');
  }
  return context;
};

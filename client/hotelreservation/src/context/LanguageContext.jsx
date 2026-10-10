import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { LOCALES, translations } from '../i18n/translations';

const LanguageContext = createContext(null);

const fill = (text, vars) => {
  if (!vars) return text;
  return Object.entries(vars).reduce(
    (result, [key, value]) => result.replaceAll(`{${key}}`, String(value)),
    text
  );
};

export const LanguageProvider = ({ children }) => {
  const [lang, setLangState] = useState(() => localStorage.getItem('lang') || 'az');

  const setLang = (code) => {
    const next = translations[code] ? code : 'az';
    setLangState(next);
    localStorage.setItem('lang', next);
  };

  useEffect(() => {
    document.documentElement.lang = lang;
    const titles = {
      az: 'AE Hotel — Otel & Travel',
      tr: 'AE Hotel — Otel & Seyahat',
      ru: 'AE Hotel — Отель и путешествия',
      en: 'AE Hotel — Hotel & Travel',
    };
    document.title = titles[lang] || titles.az;
  }, [lang]);

  const value = useMemo(() => {
    const t = (key, vars) => {
      const text = translations[lang]?.[key] ?? translations.az[key] ?? key;
      return fill(text, vars);
    };
    return { lang, setLang, t, locale: LOCALES[lang] || 'az-AZ' };
  }, [lang]);

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

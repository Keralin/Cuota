import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { translations, LOCALES } from './translations';

const STORAGE_KEY = 'cuota.lang';

const detectLanguage = () => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored && translations[stored]) return stored;
  } catch {
    // localStorage unavailable (private mode, etc.)
  }
  return navigator.language?.toLowerCase().startsWith('es') ? 'es' : 'en';
};

const LanguageContext = createContext(null);

export const LanguageProvider = ({ children }) => {
  const [lang, setLang] = useState(detectLanguage);

  useEffect(() => {
    document.documentElement.lang = lang;
    document.title = translations[lang]['meta.title'];
    try {
      localStorage.setItem(STORAGE_KEY, lang);
    } catch {
      // ignore
    }
  }, [lang]);

  // t('key', { n: 1 }) replaces {n} placeholders
  const t = useCallback((key, vars = {}) => {
    const str = translations[lang][key] ?? translations.es[key] ?? key;
    return str.replace(/\{(\w+)\}/g, (_, v) => vars[v] ?? `{${v}}`);
  }, [lang]);

  const formatCurrency = useCallback(
    (val) => new Intl.NumberFormat(LOCALES[lang], { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(val),
    [lang]
  );

  return (
    <LanguageContext.Provider value={{ lang, setLang, t, formatCurrency }}>
      {children}
    </LanguageContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useLanguage = () => useContext(LanguageContext);

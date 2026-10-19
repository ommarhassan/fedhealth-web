import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { LANGUAGES, translations } from "./translations";

const STORAGE_KEY = "fedhealth_lang";
const LanguageContext = createContext(null);

function initialLang() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved && LANGUAGES[saved]) return saved;
  } catch {}
  return "en";
}

export function LanguageProvider({ children }) {
  const [lang, setLangState] = useState(initialLang);

  // بنغيّر lang و dir على الـ <html> عشان الـ RTL يشتغل في الصفحة كلها
  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = LANGUAGES[lang].dir;
  }, [lang]);

  const setLang = useCallback((next) => {
    setLangState(next);
    try { localStorage.setItem(STORAGE_KEY, next); } catch {}
  }, []);

  // t("hospitalN", { n: 1 }) -> "Hospital 1"
  const t = useCallback(
    (key, vars = {}) => {
      const text = translations[lang][key] ?? translations.en[key] ?? key;
      return text.replace(/\{(\w+)\}/g, (_, name) => vars[name] ?? "");
    },
    [lang]
  );

  const value = useMemo(() => ({ lang, setLang, t }), [lang, setLang, t]);
  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export const useLang = () => useContext(LanguageContext);

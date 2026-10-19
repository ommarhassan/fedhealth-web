import { useEffect, useRef, useState } from "react";
import { Check, ChevronDown, Globe } from "lucide-react";
import { LANGUAGES } from "../i18n/translations";
import { useLang } from "../i18n/LanguageContext";

export default function LanguageSwitcher() {
  const { lang, setLang, t } = useLang();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    if (!open) return;
    const close = (e) => { if (e.type === "keydown" ? e.key === "Escape" : !ref.current?.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", close);
    document.addEventListener("keydown", close);
    return () => { document.removeEventListener("mousedown", close); document.removeEventListener("keydown", close); };
  }, [open]);

  return (
    <div className="lang-switcher" ref={ref}>
      <button type="button" className="lang" onClick={() => setOpen((o) => !o)} aria-haspopup="listbox" aria-expanded={open} aria-label={t("language")}>
        <Globe size={15} /> {LANGUAGES[lang].label} <ChevronDown size={14} />
      </button>
      {open && (
        <ul className="lang-menu" role="listbox">
          {Object.entries(LANGUAGES).map(([code, l]) => (
            <li key={code}>
              <button type="button" role="option" aria-selected={code === lang} className={code === lang ? "on" : ""} onClick={() => { setLang(code); setOpen(false); }}>
                {l.name} {code === lang && <Check size={14} />}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

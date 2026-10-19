import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Check, LogOut, SlidersHorizontal } from "lucide-react";
import { LANGUAGES } from "../i18n/translations";
import { useLang } from "../i18n/LanguageContext";
import { clearSession } from "../services/session";

export default function QuickSettings() {
  const { lang, setLang, t } = useLang();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    if (!open) return;
    const close = (e) => { if (e.type === "keydown" ? e.key === "Escape" : !ref.current?.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", close);
    document.addEventListener("keydown", close);
    return () => { document.removeEventListener("mousedown", close); document.removeEventListener("keydown", close); };
  }, [open]);

  function signOut() {
    clearSession();
    navigate("/login");
  }

  return (
    <div className="lang-switcher" ref={ref}>
      <button type="button" className="quick" onClick={() => setOpen((o) => !o)} aria-haspopup="menu" aria-expanded={open}>
        <SlidersHorizontal size={20} />
        <span>{t("quickSettings")}</span>
      </button>
      {open && (
        <div className="lang-menu qs-menu" role="menu">
          <span className="qs-title">{t("language")}</span>
          {Object.entries(LANGUAGES).map(([code, l]) => (
            <button key={code} type="button" role="menuitemradio" aria-checked={code === lang} className={code === lang ? "on" : ""} onClick={() => setLang(code)}>
              {l.name} {code === lang && <Check size={14} />}
            </button>
          ))}
          <hr />
          <button type="button" role="menuitem" onClick={signOut}>{t("signOut")} <LogOut size={14} /></button>
        </div>
      )}
    </div>
  );
}

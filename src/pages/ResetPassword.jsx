import { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { ArrowRight, Lock } from "lucide-react";
import Logo from "../components/Logo";
import Disclaimer from "../components/Disclaimer";
import LanguageSwitcher from "../components/LanguageSwitcher";
import { useLang } from "../i18n/LanguageContext";
import { resetPassword } from "../services/api";

export default function ResetPassword() {
  const { t } = useLang();
  const token = useSearchParams()[0].get("token"); // من اللينك اللي في الإيميل
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    if (password.length < 8) return setError(t("errPasswordShort"));
    if (password !== confirm) return setError(t("errMismatch"));
    setLoading(true);
    try {
      await resetPassword(token, password);
      setDone(true);
    } catch (err) {
      setError(err.status === 0 ? t("errNetwork") : err.status === 400 ? t("errResetInvalid") : t("errGeneric"));
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="screen auth">
      <header className="topbar">
        <span className="brand"><Logo size={26} /> FedHealth</span>
        <LanguageSwitcher />
      </header>

      <h1 className="auth-title">{t("resetTitle")}</h1>

      {!token ? (
        <>
          <p className="msg error" role="alert">{t("resetNoToken")}</p>
          <Link to="/forgot-password" className="btn">{t("requestNewLink")}</Link>
        </>
      ) : done ? (
        <>
          <p className="msg ok" role="status">{t("resetDone")}</p>
          <Link to="/login" className="btn">{t("signIn")} <ArrowRight size={18} className="flip" /></Link>
        </>
      ) : (
        <>
          <p className="muted">{t("resetDesc")}</p>
          <form onSubmit={handleSubmit} noValidate>
            <label className="label" htmlFor="password">{t("newPassword")}</label>
            <div className="field">
              <Lock size={18} />
              <input id="password" type="password" dir="ltr" value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="new-password" />
            </div>
            <p className="hint">{t("passwordHint")}</p>

            <label className="label" htmlFor="confirm">{t("confirmPassword")}</label>
            <div className="field">
              <Lock size={18} />
              <input id="confirm" type="password" dir="ltr" value={confirm} onChange={(e) => setConfirm(e.target.value)} autoComplete="new-password" />
            </div>

            {error && <p className="msg error" role="alert">{error}</p>}
            <button type="submit" className="btn" disabled={loading}>
              {loading ? t("wait") : t("savePassword")}
            </button>
          </form>
        </>
      )}
      <Disclaimer />
    </main>
  );
}

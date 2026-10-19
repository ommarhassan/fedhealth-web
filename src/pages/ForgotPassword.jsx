import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Mail } from "lucide-react";
import Logo from "../components/Logo";
import Disclaimer from "../components/Disclaimer";
import LanguageSwitcher from "../components/LanguageSwitcher";
import { useLang } from "../i18n/LanguageContext";
import { forgotPassword } from "../services/api";

export default function ForgotPassword() {
  const { t } = useLang();
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    if (!email.trim()) return setError(t("errRequired"));
    setLoading(true);
    try {
      await forgotPassword(email.trim());
      setSent(true);
    } catch (err) {
      setError(err.status === 0 ? t("errNetwork") : t("errGeneric"));
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

      <h1 className="auth-title">{t("forgotTitle")}</h1>
      <p className="muted">{t("forgotDesc")}</p>

      {sent ? (
        <p className="msg ok" role="status">{t("forgotSent")}</p>
      ) : (
        <form onSubmit={handleSubmit} noValidate>
          <label className="label" htmlFor="email">{t("fieldEmail")}</label>
          <div className="field">
            <Mail size={18} />
            <input id="email" type="email" dir="ltr" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="dr.sarah@hospital1.org" autoComplete="email" />
          </div>
          {error && <p className="msg error" role="alert">{error}</p>}
          <button type="submit" className="btn" disabled={loading}>
            {loading ? t("wait") : t("sendLink")}
            {!loading && <ArrowRight size={18} className="flip" />}
          </button>
        </form>
      )}

      <Link to="/login" className="link back">{t("backToSignIn")}</Link>
      <Disclaimer />
    </main>
  );
}

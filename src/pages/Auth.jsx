import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight, Check, Eye, EyeOff, Lock, Mail, SlidersHorizontal, Stethoscope } from "lucide-react";
import Logo from "../components/Logo";
import Disclaimer from "../components/Disclaimer";
import LanguageSwitcher from "../components/LanguageSwitcher";
import { useLang } from "../i18n/LanguageContext";
import { login, register } from "../services/api";
import { saveSession } from "../services/session";

// رقم المستشفى في التصميم -> الكود اللي في الداتابيز (seed)
const HOSPITALS = [{ n: 1, code: "H1" }, { n: 2, code: "H2" }, { n: 3, code: "H3" }];

export default function Auth() {
  const navigate = useNavigate();
  const { t } = useLang();
  const [tab, setTab] = useState("login");
  const [role, setRole] = useState("doctor");
  const [hospital, setHospital] = useState("H1");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(true);
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");
  const [loading, setLoading] = useState(false);

  const isLogin = tab === "login";

  function switchTab(next) {
    setTab(next);
    setError("");
    setInfo("");
    if (next === "signup") setRole("doctor"); // التسجيل للدكاترة بس
  }

  // رسايل الباك بالإنجليزي، فبنترجم حسب كود الحالة
  function friendlyError(err) {
    if (err.status === 0) return t("errNetwork");
    if (err.status === 401) return t("errInvalid");
    if (err.status === 403) return t("errPending");
    if (err.status === 409) return t("errExists");
    return err.i18n ? t(err.i18n) : t("errGeneric");
  }
  const fail = (key) => Object.assign(new Error(key), { i18n: key });

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setInfo("");
    try {
      if (!email.trim() || !password || (!isLogin && !name.trim())) throw fail("errRequired");
      if (!isLogin && password.length < 8) throw fail("errPasswordShort");

      setLoading(true);
      if (isLogin) {
        const { token, user } = await login(email.trim(), password);
        if (user.role !== role) throw fail(role === "admin" ? "errRoleAdmin" : "errRoleDoctor");
        if (role === "doctor" && user.hospital?.code !== hospital) throw fail("errHospital");
        saveSession(token, user, remember);
        navigate("/assessment");
      } else {
        await register({ name: name.trim(), email: email.trim(), password, hospitalCode: hospital });
        setInfo(t("signupSent"));
        setPassword("");
        setTab("login");
      }
    } catch (err) {
      setError(friendlyError(err));
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

      <h1 className="auth-title">{t("authWelcome")}</h1>
      <p className="muted">{t("authSubtitle")}</p>

      <div className="tabs" role="tablist">
        <button type="button" role="tab" aria-selected={isLogin} className={isLogin ? "on" : ""} onClick={() => switchTab("login")}>{t("tabLogin")}</button>
        <button type="button" role="tab" aria-selected={!isLogin} className={!isLogin ? "on" : ""} onClick={() => switchTab("signup")}>{t("tabSignup")}</button>
      </div>

      <form onSubmit={handleSubmit} noValidate>
        <span className="label">{t("roleLabel")}</span>
        <div className="roles">
          <button type="button" className={`role ${role === "doctor" ? "on" : ""}`} onClick={() => setRole("doctor")} aria-pressed={role === "doctor"}>
            <Stethoscope size={18} />
            <strong>{t("roleDoctor")}</strong>
            <i className="radio">{role === "doctor" && <Check size={12} />}</i>
          </button>
          <button type="button" className={`role ${role === "admin" ? "on" : ""}`} onClick={() => setRole("admin")} aria-pressed={role === "admin"} disabled={!isLogin}>
            <SlidersHorizontal size={18} />
            <strong>{t("roleAdmin")}</strong>
            <i className="radio">{role === "admin" && <Check size={12} />}</i>
          </button>
        </div>

        {role === "doctor" && ( // الأدمن مش مربوط بمستشفى
          <>
            <span className="label">{t("hospitalLabel")}</span>
            <div className="hospitals">
              {HOSPITALS.map((h) => (
                <button key={h.code} type="button" className={hospital === h.code ? "on" : ""} onClick={() => setHospital(h.code)} aria-pressed={hospital === h.code}>
                  {t("hospitalN", { n: h.n })}
                </button>
              ))}
            </div>
          </>
        )}

        {!isLogin && (
          <>
            <label className="label" htmlFor="name">{t("fieldName")}</label>
            <div className="field">
              <input id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder={t("placeholderName")} autoComplete="name" />
            </div>
          </>
        )}

        <label className="label" htmlFor="email">{isLogin ? t("fieldEmailLogin") : t("fieldEmail")}</label>
        <div className="field">
          <Mail size={18} />
          <input id="email" type="email" dir="ltr" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="dr.sarah@hospital1.org" autoComplete="email" />
        </div>

        <label className="label" htmlFor="password">{t("fieldPassword")}</label>
        <div className="field">
          <Lock size={18} />
          <input id="password" type={showPassword ? "text" : "password"} dir="ltr" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••••••" autoComplete={isLogin ? "current-password" : "new-password"} />
          <button type="button" className="eye" onClick={() => setShowPassword((s) => !s)} aria-label={showPassword ? t("hidePassword") : t("showPassword")}>
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>
        {!isLogin && <p className="hint">{t("passwordHint")}</p>}

        {isLogin && (
          <div className="row">
            <label className="check">
              <input type="checkbox" checked={remember} onChange={(e) => setRemember(e.target.checked)} />
              <span className="box"><Check size={12} /></span>
              {t("remember")}
            </label>
            <Link to="/forgot-password" className="link">{t("forgot")}</Link>
          </div>
        )}

        {error && <p className="msg error" role="alert">{error}</p>}
        {info && <p className="msg ok" role="status">{info}</p>}

        <button type="submit" className="btn" disabled={loading}>
          {loading ? t("wait") : isLogin ? t("signIn") : t("requestAccess")}
          {!loading && <ArrowRight size={18} className="flip" />}
        </button>
      </form>

      <p className="meta">{isLogin ? t("footerLogin") : t("footerSignup")}</p>
      <Disclaimer />
    </main>
  );
}

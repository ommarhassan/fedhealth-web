import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Check, ChevronDown, Eye, EyeOff, Globe, Lock, Mail, SlidersHorizontal, Stethoscope } from "lucide-react";
import Logo from "../components/Logo";
import Disclaimer from "../components/Disclaimer";
import { login, register } from "../services/api";
import { saveSession } from "../services/session";

// اسم المستشفى في التصميم -> الكود اللي في الداتابيز (seed)
const HOSPITALS = [
  { label: "Hospital 1", code: "H1" },
  { label: "Hospital 2", code: "H2" },
  { label: "Hospital 3", code: "H3" }
];

export default function Auth() {
  const navigate = useNavigate();
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
  const showHospital = role === "doctor"; // الأدمن مش مربوط بمستشفى

  function switchTab(next) {
    setTab(next);
    setError("");
    setInfo("");
    if (next === "signup") setRole("doctor"); // التسجيل للدكاترة بس
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setInfo("");
    setLoading(true);
    try {
      if (isLogin) {
        const { token, user } = await login(email.trim(), password);
        if (user.role !== role) {
          throw new Error(`This account is not a ${role === "admin" ? "system administrator" : "doctor"} account.`);
        }
        if (role === "doctor" && user.hospital?.code !== hospital) {
          throw new Error("This account belongs to a different hospital.");
        }
        saveSession(token, user, remember);
        navigate("/dashboard");
      } else {
        await register({ name: name.trim(), email: email.trim(), password, hospitalCode: hospital });
        setInfo("Request sent. An administrator needs to approve your account before you can sign in.");
        setPassword("");
        setTab("login");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="screen auth">
      <header className="topbar">
        <span className="brand"><Logo size={26} /> FedHealth</span>
        <span className="lang"><Globe size={15} /> EN <ChevronDown size={14} /></span>
      </header>

      <h1 className="auth-title">Welcome</h1>
      <p className="muted">Connect to your hospital’s research workspace.</p>

      <div className="tabs" role="tablist">
        <button type="button" role="tab" aria-selected={isLogin} className={isLogin ? "on" : ""} onClick={() => switchTab("login")}>Login</button>
        <button type="button" role="tab" aria-selected={!isLogin} className={!isLogin ? "on" : ""} onClick={() => switchTab("signup")}>Sign Up</button>
      </div>

      <form onSubmit={handleSubmit} noValidate>
        <span className="label">Your role</span>
        <div className="roles">
          <button type="button" className={`role ${role === "doctor" ? "on" : ""}`} onClick={() => setRole("doctor")} aria-pressed={role === "doctor"}>
            <Stethoscope size={18} />
            <strong>Doctor / Medical Staff</strong>
            <i className="radio">{role === "doctor" && <Check size={12} />}</i>
          </button>
          <button type="button" className={`role ${role === "admin" ? "on" : ""}`} onClick={() => setRole("admin")} aria-pressed={role === "admin"} disabled={!isLogin}>
            <SlidersHorizontal size={18} />
            <strong>System Administrator</strong>
            <i className="radio">{role === "admin" && <Check size={12} />}</i>
          </button>
        </div>

        {showHospital && (
          <>
            <span className="label">Select your hospital</span>
            <div className="hospitals">
              {HOSPITALS.map((h) => (
                <button key={h.code} type="button" className={hospital === h.code ? "on" : ""} onClick={() => setHospital(h.code)} aria-pressed={hospital === h.code}>
                  {h.label}
                </button>
              ))}
            </div>
          </>
        )}

        {!isLogin && (
          <>
            <label className="label" htmlFor="name">Full name</label>
            <div className="field">
              <input id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Dr. Sarah Ahmed" autoComplete="name" required />
            </div>
          </>
        )}

        <label className="label" htmlFor="email">{isLogin ? "Email / Medical ID" : "Email"}</label>
        <div className="field">
          <Mail size={18} />
          <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="dr.sarah@hospital1.org" autoComplete="email" required />
        </div>

        <label className="label" htmlFor="password">Password</label>
        <div className="field">
          <Lock size={18} />
          <input id="password" type={showPassword ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••••••" autoComplete={isLogin ? "current-password" : "new-password"} required />
          <button type="button" className="eye" onClick={() => setShowPassword((s) => !s)} aria-label={showPassword ? "Hide password" : "Show password"}>
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>
        {!isLogin && <p className="hint">At least 8 characters.</p>}

        {isLogin && (
          <div className="row">
            <label className="check">
              <input type="checkbox" checked={remember} onChange={(e) => setRemember(e.target.checked)} />
              <span className="box"><Check size={12} /></span>
              Remember Me
            </label>
            <button type="button" className="link" onClick={() => setInfo("Ask your administrator to reset your password.")}>Forgot password?</button>
          </div>
        )}

        {error && <p className="msg error" role="alert">{error}</p>}
        {info && <p className="msg ok" role="status">{info}</p>}

        <button type="submit" className="btn" disabled={loading}>
          {loading ? "Please wait…" : isLogin ? "Sign In to Hospital Portal" : "Request Hospital Access"}
          {!loading && <ArrowRight size={18} />}
        </button>
      </form>

      <p className="meta">
        {isLogin
          ? "New to FedHealth? Select Sign Up to request hospital access from your administrator."
          : "Your administrator reviews each request before access is granted."}
      </p>
      <Disclaimer />
    </main>
  );
}

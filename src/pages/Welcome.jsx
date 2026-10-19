import { Link } from "react-router-dom";
import { ArrowRight, Building2, Network } from "lucide-react";
import LanguageSwitcher from "../components/LanguageSwitcher";
import { useLang } from "../i18n/LanguageContext";
import Logo from "../components/Logo";
import Disclaimer from "../components/Disclaimer";

const hospitals = [
  { n: 1, left: "13%" },
  { n: 2, left: "50%" },
  { n: 3, left: "87%" }
];

export default function Welcome() {
  const { t } = useLang();
  return (
    <main className="screen welcome">
      <header className="topbar">
        <span className="edition">{t("edition")}</span>
        <LanguageSwitcher />
      </header>

      <section className="hero">
        <Logo size={70} />
        <h1>{t("welcomeTitle")}</h1>
        <p className="muted">{t("welcomeSubtitle")}</p>
      </section>

      <div className="network" role="img" aria-label="FedAvg">
        <div className="network-bg" />
        <svg className="network-lines" viewBox="0 0 300 190" preserveAspectRatio="none" aria-hidden="true">
          <line x1="150" y1="42" x2="39" y2="128" />
          <line x1="150" y1="42" x2="150" y2="128" />
          <line x1="150" y1="42" x2="261" y2="128" />
        </svg>
        <div className="fedavg"><Network size={18} /><span>FedAvg</span></div>
        {hospitals.map((h) => (
          <div key={h.n} className="hospital" style={{ left: h.left }}>
            <div className="hospital-icon"><Building2 size={20} /></div>
            <span>{t("hospitalN", { n: h.n })}</span>
          </div>
        ))}
      </div>

      <p className="muted center">
        {t("welcomeDesc")}
      </p>

      <Link to="/login" className="btn">{t("getStarted")} <ArrowRight size={18} className="flip" /></Link>
      <p className="meta">{t("welcomeMeta")}</p>
      <Disclaimer />
    </main>
  );
}

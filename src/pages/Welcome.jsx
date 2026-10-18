import { Link } from "react-router-dom";
import { ArrowRight, Building2, Globe, Network, ChevronDown } from "lucide-react";
import Logo from "../components/Logo";
import Disclaimer from "../components/Disclaimer";

const hospitals = [
  { name: "Hospital 1", left: "13%" },
  { name: "Hospital 2", left: "50%" },
  { name: "Hospital 3", left: "87%" }
];

export default function Welcome() {
  return (
    <main className="screen welcome">
      <header className="topbar">
        <span className="edition">RESEARCH EDITION</span>
        <span className="lang"><Globe size={15} /> EN <ChevronDown size={14} /></span>
      </header>

      <section className="hero">
        <Logo size={70} />
        <h1>FedHealth - Federated Learning System</h1>
        <p className="muted">Privacy-Preserving Breast Cancer Outcome Prediction</p>
      </section>

      <div className="network" role="img" aria-label="Three hospitals connected to a FedAvg server">
        <div className="network-bg" />
        <svg className="network-lines" viewBox="0 0 300 190" preserveAspectRatio="none" aria-hidden="true">
          <line x1="150" y1="42" x2="39" y2="128" />
          <line x1="150" y1="42" x2="150" y2="128" />
          <line x1="150" y1="42" x2="261" y2="128" />
        </svg>
        <div className="fedavg"><Network size={18} /><span>FedAvg</span></div>
        {hospitals.map((h) => (
          <div key={h.name} className="hospital" style={{ left: h.left }}>
            <div className="hospital-icon"><Building2 size={20} /></div>
            <span>{h.name}</span>
          </div>
        ))}
      </div>

      <p className="muted center">
        Patient records stay at each hospital. Model updates come together with FedAvg.
      </p>

      <Link to="/login" className="btn">Get Started <ArrowRight size={18} /></Link>
      <p className="meta">Haberman dataset · 306 cases · 3 hospitals</p>
      <Disclaimer />
    </main>
  );
}

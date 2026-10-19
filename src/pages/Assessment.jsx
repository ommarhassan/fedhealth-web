import { useState } from "react";
import { Activity, Check, FlaskConical, Sparkles, X } from "lucide-react";
import Disclaimer from "../components/Disclaimer";
import { useLang } from "../i18n/LanguageContext";
import { predictSurvival } from "../utils/predict";

function Field({ id, label, unit, value, onChange, placeholder }) {
  return (
    <>
      <label className="label" htmlFor={id}>{label}</label>
      <div className="field pill">
        <input id={id} inputMode="numeric" value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} autoComplete="off" />
        {unit && <span className="unit">{unit}</span>}
      </div>
    </>
  );
}

export default function Assessment() {
  const { t } = useLang();
  const [age, setAge] = useState("");
  const [year, setYear] = useState("");
  const [nodes, setNodes] = useState("");
  const [error, setError] = useState("");
  const [result, setResult] = useState(null);

  const num = (v) => (v.trim() === "" ? NaN : Number(v));

  function run(e) {
    e.preventDefault();
    const a = num(age), n = num(nodes);
    let y = num(year);
    if (y >= 1900) y -= 1900; // 1964 -> 64
    if (!(a >= 0 && a <= 120)) return setError(t("errAge"));
    if (!(y >= 0 && y <= 99)) return setError(t("errYear"));
    if (!(n >= 0)) return setError(t("errNodes"));
    setError("");
    setResult(predictSurvival({ age: a, year: y, nodes: n }));
  }

  return (
    <>
      <h1 className="page-title">{t("assessmentTitle")}</h1>
      <p className="muted small">{t("assessmentSub")}</p>

      <div className="banner"><FlaskConical size={14} /> {t("demoRecord")}</div>

      <form onSubmit={run} noValidate>
        <Field id="age" label={t("fieldAge")} unit={t("unitYears")} value={age} onChange={setAge} placeholder={t("phAge")} />
        <Field id="year" label={t("fieldYear")} value={year} onChange={setYear} placeholder={t("phYear")} />
        <Field id="nodes" label={t("fieldNodes")} unit={t("unitNodes")} value={nodes} onChange={setNodes} placeholder={t("phNodes")} />

        {error && <p className="msg error" role="alert">{error}</p>}

        <button type="submit" className="btn">{t("runModel")} <Sparkles size={18} /></button>
      </form>

      {result && (
        <section className="result" aria-live="polite">
          <h2><Activity size={16} /> {t("outcomeTitle")}</h2>
          <div className="result-row">
            <div>
              <span className={`badge ${result.positive ? "pos" : "neg"}`}>
                {result.positive ? <Check size={14} /> : <X size={14} />}
                {t(result.positive ? "positive" : "negative")}
              </span>
              <p className="muted small">{t(result.positive ? "negNotSelected" : "posNotSelected")}</p>
            </div>
            <div className="score">
              <strong>{result.confidence.toFixed(1)}%</strong>
              <span>{t("illustrativeConfidence")}</span>
            </div>
          </div>
          <div className="bar" role="progressbar" aria-valuenow={Math.round(result.confidence)} aria-valuemin={0} aria-valuemax={100}>
            <i style={{ width: `${result.confidence}%` }} />
          </div>
          <p className="muted small">{t("outcomeNote")}</p>
        </section>
      )}

      <Disclaimer />
    </>
  );
}

import { NavLink, Outlet } from "react-router-dom";
import { ClipboardPlus, TrendingUp, User } from "lucide-react";
import QuickSettings from "./QuickSettings";
import { useLang } from "../i18n/LanguageContext";
import { getSession } from "../services/session";

const TABS = [
  { to: "/assessment", icon: ClipboardPlus, label: "tabAssessment" },
  // شكل بس لحد ما يتعمل تصميمهم: من غير `to` بيتعرضوا كزرار مش بيعمل حاجة
  { icon: TrendingUp, label: "tabResearch" },
  { icon: User, label: "tabProfile" }
];

export const initials = (name = "") =>
  name.replace(/^(dr\.?|د\.?)\s*/i, "").split(/\s+/).filter(Boolean).slice(0, 2).map((w) => w[0].toUpperCase()).join("");

// الإطار المشترك للصفحات الداخلية: هيدر اليوزر + محتوى الصفحة + شريط التابات
export default function AppShell() {
  const { t } = useLang();
  const { user } = getSession();
  const n = user.hospital?.code?.replace(/\D/g, "");

  return (
    <div className="screen shell">
      <header className="app-header">
        <div className="who">
          <span className="avatar">{initials(user.name)}</span>
          <div>
            <strong>{user.name}</strong>
            <small>
              <i className="dot" />
              {n ? t("hospitalN", { n }) : user.hospital?.name} · {user.status === "active" ? t("statusActive") : user.status}
            </small>
          </div>
        </div>
        <QuickSettings />
      </header>

      <div className="shell-content"><Outlet /></div>

      <nav className="tabbar" aria-label="Main">
        {TABS.map(({ to, icon: Icon, label }) =>
          to ? (
            <NavLink key={label} to={to} className={({ isActive }) => (isActive ? "tab on" : "tab")}>
              <Icon size={20} />
              {t(label)}
            </NavLink>
          ) : (
            <button key={label} type="button" className="tab" aria-disabled="true" tabIndex={-1}>
              <Icon size={20} />
              {t(label)}
            </button>
          )
        )}
      </nav>
    </div>
  );
}

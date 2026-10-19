import { Info } from "lucide-react";
import { useLang } from "../i18n/LanguageContext";

export default function Disclaimer() {
  const { t } = useLang();
  return (
    <div className="note">
      <Info size={16} />
      <span>{t("disclaimer")}</span>
    </div>
  );
}

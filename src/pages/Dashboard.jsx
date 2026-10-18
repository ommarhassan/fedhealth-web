import { useNavigate } from "react-router-dom";
import { clearSession, getSession } from "../services/session";

// صفحة مؤقتة لحد ما نعمل تصميم الداشبورد
export default function Dashboard() {
  const navigate = useNavigate();
  const { user } = getSession();

  function logout() {
    clearSession();
    navigate("/login");
  }

  return (
    <main className="screen">
      <h1 className="auth-title">Dashboard</h1>
      <p className="muted">
        Signed in as {user.name} ({user.role}
        {user.hospital ? `, ${user.hospital.name}` : ""}).
      </p>
      <button className="btn" onClick={logout}>Sign out</button>
    </main>
  );
}

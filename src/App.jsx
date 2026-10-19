import { Navigate, Route, Routes } from "react-router-dom";
import Welcome from "./pages/Welcome";
import Auth from "./pages/Auth";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import AppShell from "./components/AppShell";
import Assessment from "./pages/Assessment";
import { getSession } from "./services/session";

function RequireAuth({ children }) {
  return getSession() ? children : <Navigate to="/login" replace />;
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Welcome />} />
      <Route path="/login" element={<Auth />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route element={<RequireAuth><AppShell /></RequireAuth>}>
        <Route path="/assessment" element={<Assessment />} />
      </Route>
      <Route path="/dashboard" element={<Navigate to="/assessment" replace />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

import AuthPage from "./components/AuthPage";
import Dashboard from "./components/Dashboard";
import DeadlinesPage from "./components/DeadlinesPage";
import InsightsPage from "./components/InsightsPage";
import HomePage from "./components/HomePage";
import { useAuth } from "./context/AuthContext";
import { Navigate, Route, Routes } from "react-router-dom";

export default function App() {
  const { isAuthenticated, logout } = useAuth();

  if (!isAuthenticated) {
    return (
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/auth" element={<AuthPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    );
  }

  return (
    <Routes>
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="/dashboard" element={<Dashboard onLogout={logout} />} />
      <Route path="/deadlines" element={<DeadlinesPage onLogout={logout} />} />
      <Route path="/insights" element={<InsightsPage onLogout={logout} />} />
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}

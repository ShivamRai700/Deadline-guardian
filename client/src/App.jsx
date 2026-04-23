import AuthPage from "./components/AuthPage";
import Dashboard from "./components/Dashboard";
import DeadlinesPage from "./components/DeadlinesPage";
import InsightsPage from "./components/InsightsPage";
import { useAuth } from "./context/AuthContext";
import { Navigate, Route, Routes } from "react-router-dom";

export default function App() {
  const { isAuthenticated, logout } = useAuth();

  if (!isAuthenticated) {
    return <AuthPage />;
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

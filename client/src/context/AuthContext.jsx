import { createContext, useContext, useMemo, useState } from "react";
import api from "../utils/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const [name, setName] = useState(localStorage.getItem("userName") || "");

  const login = async (email, password) => {
    const { data } = await api.post("/auth/login", { email, password });
    const storedName = localStorage.getItem("userName") || "";
    localStorage.setItem("token", data.token);
    setToken(data.token);
    if (storedName) {
      setName(storedName);
    }
  };

  const register = async (name, email, password) => {
    const { data } = await api.post("/auth/register", { name, email, password });
    const resolvedName = data.name || name || localStorage.getItem("userName") || "";
    localStorage.setItem("token", data.token);
    localStorage.setItem("userName", resolvedName);
    setToken(data.token);
    setName(resolvedName);
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userName");
    setToken("");
    setName("");
  };

  const value = useMemo(
    () => ({ token, name, isAuthenticated: Boolean(token), login, register, logout }),
    [token, name]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}

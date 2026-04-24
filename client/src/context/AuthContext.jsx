import { createContext, useContext, useMemo, useState } from "react";
import api from "../utils/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const [name, setName] = useState(localStorage.getItem("userName") || "");

  const login = async (email, password) => {
    const { data } = await api.post("/auth/login", { email, password });
    localStorage.setItem("token", data.token);
    setToken(data.token);
  };

  const register = async (name, email, password) => {
    const { data } = await api.post("/auth/register", { name, email, password });
    localStorage.setItem("token", data.token);
    localStorage.setItem("userName", name);
    setToken(data.token);
    setName(name);
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

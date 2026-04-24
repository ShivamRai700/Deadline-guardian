import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import BrandLogo from "./BrandLogo";

export default function AuthPage() {
  const { login, register } = useAuth();
  const [searchParams] = useSearchParams();
  const [mode, setMode] = useState("login");
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");

  useEffect(() => {
    const requestedMode = searchParams.get("mode");
    if (requestedMode === "login" || requestedMode === "register") {
      setMode(requestedMode);
    }
  }, [searchParams]);

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      if (mode === "login") {
        await login(form.email, form.password);
      } else {
        await register(form.name, form.email, form.password);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950 p-4 text-slate-100 md:p-8">
      <div className="grid w-full max-w-5xl gap-6 lg:grid-cols-2">
        <section className="hidden flex-col justify-between rounded-3xl border border-slate-800 bg-gradient-to-b from-slate-900 to-slate-950 p-8 shadow-2xl shadow-slate-950/40 lg:flex">
          <div>
            <BrandLogo size="md" />
            <h2 className="mt-8 text-3xl font-semibold leading-tight text-slate-100">Track deadlines. Stay ahead.</h2>
            <p className="mt-3 max-w-sm text-slate-400">
              A focused workspace to prioritize what matters, avoid overdue tasks, and keep momentum every day.
            </p>
          </div>
          <div className="text-xs text-slate-500">Simple, fast, and built for clarity.</div>
        </section>

        <section className="w-full rounded-3xl border border-slate-800 bg-slate-900/80 p-6 shadow-2xl shadow-slate-950/40 backdrop-blur-xl md:p-8">
          <BrandLogo size="sm" subtitle="Track deadlines. Stay ahead." className="mb-6 lg:hidden" />

          <div className="space-y-1">
            <h2 className="text-2xl font-semibold tracking-tight">{mode === "login" ? "Welcome back" : "Create your account"}</h2>
            <p className="text-sm text-slate-400">
              {mode === "login" ? "Sign in to continue managing your deadlines." : "Get started with a clean and focused workflow."}
            </p>
          </div>

          <div className="mt-6 flex rounded-xl border border-slate-700 bg-slate-800/70 p-1">
            <button
              className={`flex-1 rounded-lg py-2.5 text-sm font-medium transition-colors ${
                mode === "login" ? "bg-slate-100 text-slate-900" : "text-slate-300 hover:text-slate-100"
              }`}
              onClick={() => setMode("login")}
            >
              Login
            </button>
            <button
              className={`flex-1 rounded-lg py-2.5 text-sm font-medium transition-colors ${
                mode === "register" ? "bg-slate-100 text-slate-900" : "text-slate-300 hover:text-slate-100"
              }`}
              onClick={() => setMode("register")}
            >
              Register
            </button>
          </div>

          <form className="mt-5 space-y-3.5" onSubmit={submit}>
            {mode === "register" && (
              <input
                className="w-full rounded-xl border border-slate-700 bg-slate-800/90 px-3.5 py-2.5 outline-none transition-all focus:border-indigo-500/40 focus:ring-2 focus:ring-indigo-500/40"
                placeholder="Name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
              />
            )}
            <input
              type="email"
              className="w-full rounded-xl border border-slate-700 bg-slate-800/90 px-3.5 py-2.5 outline-none transition-all focus:border-indigo-500/40 focus:ring-2 focus:ring-indigo-500/40"
              placeholder="Email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
            />
            <input
              type="password"
              className="w-full rounded-xl border border-slate-700 bg-slate-800/90 px-3.5 py-2.5 outline-none transition-all focus:border-indigo-500/40 focus:ring-2 focus:ring-indigo-500/40"
              placeholder="Password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              required
            />
            {error && <p className="text-sm text-red-400">{error}</p>}
            <button
              className="w-full rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold transition-all shadow-lg shadow-indigo-900/30 hover:bg-indigo-500 active:scale-[0.99]"
              type="submit"
            >
              {mode === "login" ? "Login" : "Create account"}
            </button>
          </form>
        </section>
      </div>
    </div>
  );
}

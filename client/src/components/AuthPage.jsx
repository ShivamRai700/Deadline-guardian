import { useState } from "react";
import { useAuth } from "../context/AuthContext";

export default function AuthPage() {
  const { login, register } = useAuth();
  const [mode, setMode] = useState("login");
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");

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
    <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-4 md:p-8">
      <div className="w-full max-w-5xl grid lg:grid-cols-2 gap-6">
        <section className="hidden lg:flex flex-col justify-between rounded-3xl border border-slate-800 bg-gradient-to-b from-slate-900 to-slate-950 p-8 shadow-2xl shadow-slate-950/40">
          <div>
            <div className="inline-flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-indigo-500 to-cyan-400 flex items-center justify-center text-slate-950 font-black">
                DG
              </div>
              <span className="text-lg font-semibold tracking-tight">Deadline Guardian</span>
            </div>
            <h2 className="mt-8 text-3xl font-semibold leading-tight text-slate-100">Track deadlines. Stay ahead.</h2>
            <p className="mt-3 text-slate-400 max-w-sm">
              A focused workspace to prioritize what matters, avoid overdue tasks, and keep momentum every day.
            </p>
          </div>
          <div className="text-xs text-slate-500">Simple, fast, and built for clarity.</div>
        </section>

        <section className="w-full rounded-3xl border border-slate-800 bg-slate-900/80 backdrop-blur-xl p-6 md:p-8 shadow-2xl shadow-slate-950/40">
          <div className="flex items-center gap-3 lg:hidden mb-6">
            <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-indigo-500 to-cyan-400 flex items-center justify-center text-slate-950 font-black">
              DG
            </div>
            <div>
              <h1 className="text-lg font-semibold">Deadline Guardian</h1>
              <p className="text-xs text-slate-400">Track deadlines. Stay ahead.</p>
            </div>
          </div>

          <div className="space-y-1">
            <h2 className="text-2xl font-semibold tracking-tight">{mode === "login" ? "Welcome back" : "Create your account"}</h2>
            <p className="text-sm text-slate-400">
              {mode === "login" ? "Sign in to continue managing your deadlines." : "Get started with a clean and focused workflow."}
            </p>
          </div>

          <div className="mt-6 flex rounded-xl border border-slate-700 bg-slate-800/70 p-1">
            <button
              className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                mode === "login" ? "bg-slate-100 text-slate-900" : "text-slate-300 hover:text-slate-100"
              }`}
              onClick={() => setMode("login")}
            >
              Login
            </button>
            <button
              className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-colors ${
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
              className="w-full bg-slate-800/90 border border-slate-700 rounded-xl px-3.5 py-2.5 outline-none transition-all focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500/40"
              placeholder="Name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
            />
          )}
          <input
            type="email"
            className="w-full bg-slate-800/90 border border-slate-700 rounded-xl px-3.5 py-2.5 outline-none transition-all focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500/40"
            placeholder="Email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            required
          />
          <input
            type="password"
            className="w-full bg-slate-800/90 border border-slate-700 rounded-xl px-3.5 py-2.5 outline-none transition-all focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500/40"
            placeholder="Password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            required
          />
          {error && <p className="text-red-400 text-sm">{error}</p>}
          <button
            className="w-full bg-indigo-600 hover:bg-indigo-500 active:scale-[0.99] transition-all rounded-xl px-4 py-2.5 text-sm font-semibold shadow-lg shadow-indigo-900/30"
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

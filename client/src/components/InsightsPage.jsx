import { useEffect, useMemo, useState } from "react";
import api from "../utils/api";
import { useAuth } from "../context/AuthContext";
import SidebarNav from "./SidebarNav";

export default function InsightsPage({ onLogout }) {
  const { name } = useAuth();
  const [deadlines, setDeadlines] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDeadlines = async () => {
      try {
        setError("");
        const { data } = await api.get("/deadlines");
        setDeadlines(data);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load insights");
      }
    };
    fetchDeadlines();
  }, []);

  const stats = useMemo(() => {
    const total = deadlines.length;
    const completed = deadlines.filter((item) => item.status === "done").length;
    const pending = total - completed;
    const highPriority = deadlines.filter((item) => item.priority === "high" && item.status === "pending").length;
    const overdue = deadlines.filter((item) => item.status === "pending" && dayDiff(item.deadlineDate) < 0).length;
    return { total, completed, pending, highPriority, overdue };
  }, [deadlines]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <div className="max-w-7xl mx-auto p-4 md:p-6 grid md:grid-cols-[220px_1fr] gap-5 md:gap-6">
        <SidebarNav onLogout={onLogout} />

        <main className="space-y-5">
          {error && <div className="bg-rose-500/10 border border-rose-500/30 rounded-xl px-4 py-2.5 text-sm text-rose-200">{error}</div>}

          <section className="bg-slate-900/70 border border-slate-800 rounded-2xl px-4 md:px-5 py-4 flex items-center justify-between gap-3">
            <div>
              <h1 className="text-xl md:text-2xl font-semibold tracking-tight">Insights</h1>
              <p className="text-slate-400 text-sm mt-0.5">A quick pulse of your current workload.</p>
            </div>
            {name && (
              <div className="flex items-center gap-2 bg-slate-800/80 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-slate-300">
                <div className="h-6 w-6 rounded-full bg-gradient-to-br from-indigo-500 to-cyan-400 flex items-center justify-center text-slate-950 font-semibold text-xs">
                  {name.charAt(0).toUpperCase()}
                </div>
                <span className="hidden sm:inline">{name}</span>
              </div>
            )}
          </section>

          <section className="grid sm:grid-cols-2 lg:grid-cols-5 gap-3">
            <InsightCard label="Total" value={stats.total} />
            <InsightCard label="Completed" value={stats.completed} />
            <InsightCard label="Pending" value={stats.pending} />
            <InsightCard label="Overdue" value={stats.overdue} tone="alert" />
            <InsightCard label="High Priority Open" value={stats.highPriority} tone="warning" />
          </section>
        </main>
      </div>
    </div>
  );
}

function InsightCard({ label, value, tone = "default" }) {
  const toneClass = {
    default: "bg-slate-900/90 border-slate-800",
    alert: "bg-rose-500/10 border-rose-500/30",
    warning: "bg-amber-500/10 border-amber-500/30",
  };

  return (
    <div className={`${toneClass[tone]} border rounded-xl p-3.5 shadow-md shadow-slate-950/30`}>
      <p className="text-slate-400 text-xs">{label}</p>
      <p className="text-2xl font-semibold mt-1">{value}</p>
    </div>
  );
}

function dayDiff(dateValue) {
  const d = normalizeDateOnly(new Date(dateValue));
  const t = normalizeDateOnly(new Date());
  return Math.round((d - t) / 86400000);
}

function normalizeDateOnly(value) {
  const parsed = new Date(value);
  return new Date(parsed.getUTCFullYear(), parsed.getUTCMonth(), parsed.getUTCDate());
}

import { useEffect, useMemo, useState } from "react";
import api from "../utils/api";
import { useAuth } from "../context/AuthContext";
import SidebarNav from "./SidebarNav";
import UserBadge from "./UserBadge";
import { getDaysDiff } from "../utils/deadlineDates";

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
    <div className="min-h-screen overflow-x-hidden bg-slate-950 text-slate-100">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-5 p-4 md:p-6 lg:grid-cols-4 lg:gap-6">
        <SidebarNav onLogout={onLogout} />

        <main className="min-w-0 space-y-5 lg:col-span-3">
          {error && <div className="bg-rose-500/10 border border-rose-500/30 rounded-xl px-4 py-2.5 text-sm text-rose-200">{error}</div>}

          <section className="bg-slate-900/70 border border-slate-800 rounded-2xl px-4 md:px-5 py-4 flex flex-wrap items-center justify-between gap-3">
            <div>
              <h1 className="text-xl md:text-2xl font-semibold tracking-tight">Insights</h1>
              <p className="text-slate-400 text-sm mt-0.5">A quick pulse of your current workload.</p>
            </div>
            <UserBadge name={name} className="sm:ml-auto" />
          </section>

          <section className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5">
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
    <div className={`${toneClass[tone]} border rounded-xl p-3 shadow-md shadow-slate-950/30`}>
      <p className="text-slate-400 text-xs">{label}</p>
      <p className="mt-1 text-lg font-semibold sm:text-xl">{value}</p>
    </div>
  );
}

function dayDiff(dateValue) {
  return getDaysDiff(dateValue);
}

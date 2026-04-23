import { useEffect, useMemo, useState } from "react";
import api from "../utils/api";
import SidebarNav from "./SidebarNav";

export default function DeadlinesPage({ onLogout }) {
  const [deadlines, setDeadlines] = useState([]);
  const [error, setError] = useState("");

  const fetchDeadlines = async () => {
    try {
      setError("");
      const { data } = await api.get("/deadlines");
      setDeadlines(data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load deadlines");
    }
  };

  useEffect(() => {
    fetchDeadlines();
  }, []);

  const sorted = useMemo(
    () =>
      [...deadlines].sort((a, b) => {
        const dateDiff = new Date(a.deadlineDate) - new Date(b.deadlineDate);
        if (dateDiff !== 0) return dateDiff;
        return a.title.localeCompare(b.title);
      }),
    [deadlines]
  );

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <div className="max-w-7xl mx-auto p-4 md:p-6 grid md:grid-cols-[220px_1fr] gap-5 md:gap-6">
        <SidebarNav onLogout={onLogout} />

        <main className="space-y-5">
          {error && <div className="bg-rose-500/10 border border-rose-500/30 rounded-xl px-4 py-2.5 text-sm text-rose-200">{error}</div>}

          <section className="bg-slate-900/70 border border-slate-800 rounded-2xl px-4 md:px-5 py-4">
            <h1 className="text-xl md:text-2xl font-semibold tracking-tight">All Deadlines</h1>
            <p className="text-slate-400 text-sm mt-0.5">A complete list of your deadlines sorted by due date.</p>
          </section>

          <section className="grid gap-2.5">
            {sorted.map((item) => (
              <article key={item._id} className="bg-slate-900/90 border border-slate-800 rounded-xl p-3.5">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <h3 className="font-semibold text-base truncate">{item.title}</h3>
                    <p className="text-slate-400 text-sm mt-0.5">{item.description || "No description"}</p>
                    <p className="text-xs text-slate-400 mt-2">Due {formatDate(item.deadlineDate)}</p>
                  </div>
                  <div className="flex gap-2 text-[11px]">
                    <Badge kind={item.priority}>{capitalize(item.priority)}</Badge>
                    <Badge kind={item.status}>{capitalize(item.status)}</Badge>
                  </div>
                </div>
              </article>
            ))}

            {!sorted.length && (
              <div className="bg-slate-900 border border-dashed border-slate-700 rounded-xl p-10 text-center">
                <p className="text-slate-200 font-medium">No deadlines yet</p>
                <p className="text-slate-400 text-sm mt-1">Head to Dashboard and add your first deadline.</p>
              </div>
            )}
          </section>
        </main>
      </div>
    </div>
  );
}

function Badge({ children, kind }) {
  const styles = {
    high: "bg-rose-500/15 text-rose-200 border-rose-500/30",
    medium: "bg-amber-500/15 text-amber-200 border-amber-500/30",
    low: "bg-emerald-500/15 text-emerald-200 border-emerald-500/30",
    pending: "bg-sky-500/15 text-sky-200 border-sky-500/30",
    done: "bg-violet-500/15 text-violet-200 border-violet-500/30",
  };
  return <span className={`px-2 py-1 rounded-full border ${styles[kind] || "bg-slate-800 border-slate-700"}`}>{children}</span>;
}

function formatDate(value) {
  return new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric" }).format(new Date(value));
}

function capitalize(text) {
  return text.charAt(0).toUpperCase() + text.slice(1);
}

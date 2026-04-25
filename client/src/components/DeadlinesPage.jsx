import { useEffect, useMemo, useState } from "react";
import api from "../utils/api";
import SidebarNav from "./SidebarNav";
import UserBadge from "./UserBadge";
import { formatDeadlineDateTime, formatTimeUntilDeadline, getDeadlineAlertLevel } from "../utils/deadlineDates";

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
    <div className="min-h-screen overflow-x-hidden bg-slate-950 text-slate-100">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-5 p-4 md:p-6 lg:grid-cols-4 lg:gap-6">
        <SidebarNav onLogout={onLogout} />

        <main className="min-w-0 space-y-5 lg:col-span-3">
          {error && <div className="bg-rose-500/10 border border-rose-500/30 rounded-xl px-4 py-2.5 text-sm text-rose-200">{error}</div>}

          <section className="bg-slate-900/70 border border-slate-800 rounded-2xl px-4 md:px-5 py-4 flex flex-wrap items-center justify-between gap-3">
            <div>
              <h1 className="text-xl md:text-2xl font-semibold tracking-tight">All Deadlines</h1>
              <p className="text-slate-400 text-sm mt-0.5">A complete list of your deadlines sorted by due date.</p>
            </div>
            <UserBadge className="sm:ml-auto" />
          </section>

          <section className="grid gap-3">
            {sorted.map((item) => {
              const deadlineAlertLevel = getDeadlineAlertLevel(item);

              return (
                <article
                  key={item._id}
                  className={`rounded-xl border bg-slate-900/90 p-4 shadow-md shadow-slate-950/30 ${
                    deadlineAlertLevel === "withinHour"
                      ? "border-rose-500/45"
                      : deadlineAlertLevel === "withinDay"
                        ? "border-amber-500/35"
                        : "border-slate-800"
                  }`}
                >
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div className="min-w-0">
                      <h3 className="text-base font-semibold leading-tight text-slate-100">{item.title}</h3>
                      <p className="mt-1 text-sm leading-relaxed text-slate-400">{item.description || "No description"}</p>
                      <p className="mt-3 text-xs text-slate-400">
                        Due {formatDeadlineDateTime(item.deadlineDate)} - {formatTimeUntilDeadline(item.deadlineDate)}
                      </p>
                    </div>
                    <div className="flex flex-wrap gap-2 text-[11px] sm:shrink-0 sm:justify-end">
                      <Badge kind={item.priority}>{capitalize(item.priority)}</Badge>
                      <Badge kind={item.status}>{capitalize(item.status)}</Badge>
                      {deadlineAlertLevel === "withinDay" && <Badge kind="withinDay">Next 24h</Badge>}
                      {deadlineAlertLevel === "withinHour" && <Badge kind="withinHour">Next 1h</Badge>}
                    </div>
                  </div>
                </article>
              );
            })}

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
    withinDay: "bg-amber-500/15 text-amber-200 border-amber-500/30",
    withinHour: "bg-rose-500/15 text-rose-200 border-rose-500/30",
  };
  return <span className={`px-2 py-1 rounded-full border ${styles[kind] || "bg-slate-800 border-slate-700"}`}>{children}</span>;
}

function capitalize(text) {
  return text.charAt(0).toUpperCase() + text.slice(1);
}

import { useEffect, useMemo, useState } from "react";
import api from "../utils/api";
import { useAuth } from "../context/AuthContext";
import SidebarNav from "./SidebarNav";
import UserBadge from "./UserBadge";

const initialForm = {
  title: "",
  description: "",
  deadlineDate: "",
  priority: "medium",
  status: "pending",
};

export default function Dashboard({ onLogout }) {
  const { name } = useAuth();
  const [deadlines, setDeadlines] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [filters, setFilters] = useState({ status: "all", priority: "all" });
  const [editingId, setEditingId] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [error, setError] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiSuggestion, setAiSuggestion] = useState(null);

  const fetchDeadlines = async () => {
    try {
      setError("");
      const { data } = await api.get("/deadlines", { params: filters });
      setDeadlines(data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load deadlines");
    }
  };

  useEffect(() => {
    fetchDeadlines();
  }, [filters.status, filters.priority]);

  const submit = async (e) => {
    e.preventDefault();
    try {
      setIsSaving(true);
      setError("");
      if (editingId) {
        await api.put(`/deadlines/${editingId}`, form);
      } else {
        await api.post("/deadlines", form);
      }
      setForm(initialForm);
      setEditingId("");
      setIsFormOpen(false);
      setAiSuggestion(null);
      await fetchDeadlines();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to save deadline");
    } finally {
      setIsSaving(false);
    }
  };

  const startEdit = (item) => {
    setEditingId(item._id);
    setForm({
      title: item.title,
      description: item.description || "",
      deadlineDate: item.deadlineDate.slice(0, 10),
      priority: item.priority,
      status: item.status,
    });
    setAiSuggestion(null);
    setIsFormOpen(true);
  };

  const remove = async (id) => {
    try {
      setError("");
      await api.delete(`/deadlines/${id}`);
      await fetchDeadlines();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete deadline");
    }
  };

  const handleAIClick = async () => {
    if (!form.title.trim()) {
      setError("Please enter a title first");
      return;
    }

    try {
      setAiLoading(true);
      setError("");
      const { data } = await api.post("/ai/priority", {
        title: form.title,
        description: form.description,
      });
      setAiSuggestion(data);
    } catch (err) {
      setError("AI suggestion unavailable");
      setAiSuggestion(null);
    } finally {
      setAiLoading(false);
    }
  };

  const classifiedDeadlines = useMemo(() => {
    const today = normalizeDateOnly(new Date());
    return deadlines.map((item) => {
      const dayDiff = getDaysDiff(item.deadlineDate, today);
      return {
        ...item,
        dayDiff,
        urgency: getUrgencyBucket(item, dayDiff),
      };
    });
  }, [deadlines]);

  const stats = useMemo(() => {
    const total = classifiedDeadlines.length;
    const completed = classifiedDeadlines.filter((d) => d.status === "done").length;
    const pending = total - completed;
    const overdue = classifiedDeadlines.filter((d) => d.status === "pending" && d.dayDiff < 0).length;
    const dueToday = classifiedDeadlines.filter((d) => d.status === "pending" && d.dayDiff === 0).length;
    const dueThisWeek = classifiedDeadlines.filter((d) => d.status === "pending" && d.dayDiff >= 3 && d.dayDiff <= 7).length;
    return { total, completed, pending, overdue, dueToday, dueThisWeek };
  }, [classifiedDeadlines]);

  const soonCount = useMemo(
    () => classifiedDeadlines.filter((item) => item.status === "pending" && item.dayDiff > 0 && item.dayDiff <= 2).length,
    [classifiedDeadlines]
  );

  const quickInsight = useMemo(() => {
    if (!classifiedDeadlines.length) {
      return "No deadlines yet. Add one to get started.";
    }
    if (stats.overdue > 0) {
      return `${stats.overdue} overdue item${stats.overdue > 1 ? "s" : ""} need attention first.`;
    }
    if (stats.dueToday > 0) {
      return `${stats.dueToday} deadline${stats.dueToday > 1 ? "s are" : " is"} due today.`;
    }
    if (soonCount > 0) {
      return `${soonCount} deadline${soonCount > 1 ? "s are" : " is"} due in the next 2 days.`;
    }
    return "No urgent deadlines right now.";
  }, [classifiedDeadlines.length, soonCount, stats.overdue, stats.dueToday]);

  const visibleDeadlines = useMemo(() => {
    const sorted = [...classifiedDeadlines].sort((a, b) => {
      const urgencyOrder = { urgent: 0, upcoming: 1, later: 2, done: 3 };
      const urgencyDiff = urgencyOrder[a.urgency] - urgencyOrder[b.urgency];
      if (urgencyDiff !== 0) return urgencyDiff;
      return a.dayDiff - b.dayDiff;
    });

    if (activeTab === "all") return sorted;
    return sorted.filter((item) => item.urgency === activeTab);
  }, [classifiedDeadlines, activeTab]);

  const urgentCount = classifiedDeadlines.filter((item) => item.urgency === "urgent").length;
  const upcomingCount = classifiedDeadlines.filter((item) => item.urgency === "upcoming").length;

  return (
    <div className="min-h-screen overflow-x-hidden bg-slate-950 text-slate-100">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-5 p-4 md:p-6 lg:grid-cols-4 lg:gap-6">
        <SidebarNav
          onLogout={onLogout}
          onQuickAdd={() => {
            setEditingId("");
            setForm(initialForm);
            setAiSuggestion(null);
            setIsFormOpen(true);
          }}
        />

        <main className="min-w-0 space-y-6 lg:col-span-3">
          {error && (
            <section className="bg-rose-500/10 border border-rose-500/30 rounded-xl px-4 py-2.5 text-sm text-rose-200">
              {error}
            </section>
          )}

          <section className="bg-slate-900/70 border border-slate-800 rounded-2xl px-4 py-4 md:px-5 flex flex-wrap items-center justify-between gap-4">
            <div>
              <h1 className="text-xl md:text-2xl font-semibold tracking-tight">Deadline Dashboard</h1>
              <p className="text-slate-400 text-sm mt-0.5">Track progress, prioritize urgent work, and stay ahead.</p>
            </div>
            <div className="flex w-full flex-wrap items-center gap-3 sm:w-auto sm:justify-end">
              <div className="hidden sm:flex items-center gap-2 text-xs text-slate-400 bg-slate-800/80 border border-slate-700 rounded-lg px-2.5 py-1.5">
                <span className="h-2 w-2 rounded-full bg-emerald-400" />
                {quickInsight}
              </div>
              <UserBadge />
              <button
                onClick={() => {
                  setEditingId("");
                  setForm(initialForm);
                  setAiSuggestion(null);
                  setIsFormOpen(true);
                }}
                className="bg-indigo-600 hover:bg-indigo-500 active:scale-[0.99] transition-all px-4 py-2 rounded-lg text-sm font-semibold"
              >
                + Add
              </button>
            </div>
          </section>

          {urgentCount === 0 && (
            <section className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl px-4 py-2.5 text-sm text-emerald-200">
              No urgent deadlines. Great momentum.
            </section>
          )}

          <section className="flex flex-wrap items-center gap-2">
            <FilterTab label={`Urgent (${urgentCount})`} active={activeTab === "urgent"} onClick={() => setActiveTab("urgent")} />
            <FilterTab
              label={`Upcoming (${upcomingCount})`}
              active={activeTab === "upcoming"}
              onClick={() => setActiveTab("upcoming")}
            />
            <FilterTab label={`All (${classifiedDeadlines.length})`} active={activeTab === "all"} onClick={() => setActiveTab("all")} />
          </section>

          <section className="grid gap-3">
            {visibleDeadlines.map((item) => (
              <article
                key={item._id}
                className={`rounded-xl border bg-slate-900/90 p-4 shadow-md shadow-slate-950/30 transition-all hover:-translate-y-0.5 hover:shadow-lg ${
                  item.urgency === "urgent"
                    ? "border-rose-500/40 shadow-rose-950/40"
                    : item.urgency === "upcoming"
                      ? "border-cyan-500/20 hover:border-cyan-500/40"
                      : "border-slate-800 hover:border-slate-700 opacity-90"
                }`}
              >
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div className="min-w-0">
                    <h4 className="text-base font-semibold leading-tight text-slate-100">{item.title}</h4>
                    <p className="mt-1 text-sm leading-relaxed text-slate-400">{item.description || "No description"}</p>
                    <p className="mt-3 text-xs text-slate-400">
                      Due {formatDate(item.deadlineDate)} - {dueLabel(item.dayDiff)}
                    </p>
                    <div className="mt-2 flex flex-wrap gap-2 text-[11px]">
                      <Badge kind={item.priority}>{capitalize(item.priority)}</Badge>
                      <Badge kind={item.status}>{capitalize(item.status)}</Badge>
                      <Badge kind={item.urgency}>{capitalize(item.urgency)}</Badge>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-1.5 sm:shrink-0 sm:justify-end">
                    <button
                      className="text-xs bg-slate-800 hover:bg-slate-700 transition-colors px-2.5 py-1.5 rounded-lg"
                      onClick={() => startEdit(item)}
                    >
                      Edit
                    </button>
                    <button
                      className="text-xs bg-red-600/80 hover:bg-red-500/90 transition-colors px-2.5 py-1.5 rounded-lg"
                      onClick={() => remove(item._id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </article>
            ))}
            {!visibleDeadlines.length && (
              <div className="bg-slate-900 border border-dashed border-slate-700 rounded-xl p-10 text-center">
                <p className="text-slate-200 font-medium">{classifiedDeadlines.length ? "No tasks in this view" : "No deadlines yet"}</p>
                <p className="text-slate-400 text-sm mt-1">
                  {classifiedDeadlines.length
                    ? "Try another tab or update filters."
                    : "Create your first deadline to start tracking progress."}
                </p>
                <button
                  onClick={() => {
                    setEditingId("");
                    setForm(initialForm);
                    setAiSuggestion(null);
                    setIsFormOpen(true);
                  }}
                  className="mt-4 bg-indigo-600 hover:bg-indigo-500 transition-colors px-4 py-2 rounded-lg text-sm font-semibold"
                >
                  Add deadline
                </button>
              </div>
            )}
          </section>

          <section className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4">
            <div className="grid gap-4 md:grid-cols-2">
              <FilterGroup
                title="Status"
                values={["all", "pending", "done"]}
                current={filters.status}
                onChange={(value) => setFilters({ ...filters, status: value })}
                columns="grid-cols-2 sm:grid-cols-3 md:grid-cols-4"
              />
              <FilterGroup
                title="Priority"
                values={["all", "low", "medium", "high"]}
                current={filters.priority}
                onChange={(value) => setFilters({ ...filters, priority: value })}
                columns="grid-cols-2 sm:grid-cols-3 md:grid-cols-4"
              />
            </div>
          </section>

          <section className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
            <StatCard title="Total" value={stats.total} />
            <StatCard title="Completed" value={stats.completed} />
            <StatCard title="Pending" value={stats.pending} />
            <StatCard title="Overdue" value={stats.overdue} tone="urgent" />
            <StatCard title="Due Today" value={stats.dueToday} tone="today" />
            <StatCard title="Due This Week" value={stats.dueThisWeek} tone="upcoming" />
          </section>
        </main>
      </div>

      {isFormOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-2xl p-4 md:p-5 shadow-2xl shadow-slate-950/60">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">{editingId ? "Edit deadline" : "Add deadline"}</h3>
              <button
                className="text-sm px-2 py-1 rounded-md text-slate-300 hover:bg-slate-800"
                onClick={() => {
                  setIsFormOpen(false);
                  setEditingId("");
                  setForm(initialForm);
                  setAiSuggestion(null);
                }}
              >
                Close
              </button>
            </div>
            <form onSubmit={submit} className="grid md:grid-cols-2 gap-3.5">
              <input
                className="bg-slate-800/90 border border-slate-700 rounded-xl px-3 py-2.5 outline-none transition-all focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500/40"
                placeholder="Title"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                required
              />
              <input
                type="date"
                className="bg-slate-800/90 border border-slate-700 rounded-xl px-3 py-2.5 outline-none transition-all focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500/40"
                value={form.deadlineDate}
                onChange={(e) => setForm({ ...form, deadlineDate: e.target.value })}
                required
              />
              <textarea
                className="md:col-span-2 bg-slate-800/90 border border-slate-700 rounded-xl px-3 py-2.5 outline-none transition-all focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500/40 min-h-24"
                placeholder="Description"
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
              />
              <button
                type="button"
                onClick={handleAIClick}
                disabled={aiLoading || !form.title.trim()}
                className="md:col-span-2 bg-purple-600 hover:bg-purple-500 disabled:bg-slate-600 disabled:cursor-not-allowed transition-colors px-4 py-2.5 rounded-xl text-sm font-semibold"
              >
                {aiLoading ? "✨ Analyzing..." : "✨ AI Priority Assistant"}
              </button>
              {aiSuggestion && (
                <div className="md:col-span-2 bg-purple-950/40 border border-purple-500/30 rounded-xl p-3.5 space-y-2">
                  <p className="text-xs uppercase tracking-wider text-purple-300 font-semibold">AI Suggestion (Preview)</p>
                  <div className="space-y-1.5 text-sm">
                    <div>
                      <p className="text-slate-400 text-xs">Improved Title:</p>
                      <p className="text-purple-100 font-medium">{aiSuggestion.improvedTitle}</p>
                    </div>
                    <div>
                      <p className="text-slate-400 text-xs">Description:</p>
                      <p className="text-purple-100">{aiSuggestion.description}</p>
                    </div>
                    <div>
                      <p className="text-slate-400 text-xs">Suggested Priority:</p>
                      <p className="text-purple-100 font-medium capitalize">{aiSuggestion.priority}</p>
                    </div>
                  </div>
                  <div className="flex gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => {
                        setForm({
                          ...form,
                          title: aiSuggestion.improvedTitle,
                          description: aiSuggestion.description,
                          priority: aiSuggestion.priority,
                        });
                        setAiSuggestion(null);
                      }}
                      className="text-xs bg-purple-600 hover:bg-purple-500 transition-colors px-3 py-1.5 rounded-lg"
                    >
                      Apply All
                    </button>
                    <button
                      type="button"
                      onClick={() => setAiSuggestion(null)}
                      className="text-xs bg-slate-700 hover:bg-slate-600 transition-colors px-3 py-1.5 rounded-lg"
                    >
                      Dismiss
                    </button>
                  </div>
                </div>
              )}
              <select
                className="bg-slate-800/90 border border-slate-700 rounded-xl px-3 py-2.5 outline-none transition-all focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500/40"
                value={form.priority}
                onChange={(e) => setForm({ ...form, priority: e.target.value })}
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
              <select
                className="bg-slate-800/90 border border-slate-700 rounded-xl px-3 py-2.5 outline-none transition-all focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500/40"
                value={form.status}
                onChange={(e) => setForm({ ...form, status: e.target.value })}
              >
                <option value="pending">Pending</option>
                <option value="done">Done</option>
              </select>
              <div className="md:col-span-2 flex gap-2">
                <button
                  className="bg-indigo-600 hover:bg-indigo-500 transition-colors px-4 py-2.5 rounded-xl text-sm font-semibold"
                  type="submit"
                  disabled={isSaving}
                >
                  {isSaving ? "Saving..." : editingId ? "Update" : "Add"}
                </button>
                <button
                  type="button"
                  className="bg-slate-700 hover:bg-slate-600 transition-colors px-4 py-2.5 rounded-xl text-sm"
                  onClick={() => {
                    setIsFormOpen(false);
                    setEditingId("");
                    setForm(initialForm);
                  }}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

function StatCard({ title, value, tone = "default" }) {
  const toneClass = {
    default: "bg-slate-900/90 border-slate-800",
    urgent: "bg-rose-500/10 border-rose-500/25",
    today: "bg-amber-500/10 border-amber-500/25",
    upcoming: "bg-cyan-500/10 border-cyan-500/25",
  };

  return (
    <div className={`${toneClass[tone]} border rounded-xl p-3 shadow-md shadow-slate-950/30`}>
      <p className="text-xs text-slate-400">{title}</p>
      <p className="mt-1 text-lg font-semibold sm:text-xl">{value}</p>
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
    urgent: "bg-rose-500/15 text-rose-200 border-rose-500/30",
    upcoming: "bg-cyan-500/15 text-cyan-200 border-cyan-500/30",
    later: "bg-slate-700/70 text-slate-300 border-slate-600",
  };

  return <span className={`px-2 py-1 rounded-full border ${styles[kind] || "bg-slate-800 border-slate-700"}`}>{children}</span>;
}

function FilterTab({ label, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`px-3 py-1.5 text-sm rounded-full border transition-colors ${
        active ? "bg-indigo-500/20 border-indigo-500 text-indigo-200" : "bg-slate-900 border-slate-700 hover:border-slate-500"
      }`}
    >
      {label}
    </button>
  );
}

function FilterGroup({ title, values, current, onChange, columns }) {
  return (
    <div className="space-y-2">
      <p className="text-[11px] uppercase tracking-wider text-slate-500">{title}</p>
      <div className={`grid gap-2 ${columns}`}>
        {values.map((value) => (
          <button
            key={value}
            onClick={() => onChange(value)}
            className={`rounded-lg border px-3 py-2 text-center text-sm transition-colors ${
              current === value
                ? "border-indigo-500 bg-indigo-600/20 text-indigo-200 shadow-sm shadow-indigo-950/40"
                : "border-slate-700 bg-slate-800/80 text-slate-300 hover:border-slate-500 hover:bg-slate-800"
            }`}
          >
            {value === "all" ? "All" : capitalize(value)}
          </button>
        ))}
      </div>
    </div>
  );
}

function normalizeDateOnly(value) {
  if (typeof value === "string") {
    const match = value.match(/^(\d{4})-(\d{2})-(\d{2})/);
    if (match) {
      const [, y, m, d] = match;
      return new Date(Number(y), Number(m) - 1, Number(d));
    }
  }

  const parsed = new Date(value);
  return new Date(parsed.getUTCFullYear(), parsed.getUTCMonth(), parsed.getUTCDate());
}

function getDaysDiff(dateValue, baseDate = normalizeDateOnly(new Date())) {
  const target = normalizeDateOnly(dateValue);
  return Math.round((target - baseDate) / 86400000);
}

function getUrgencyBucket(item, dayDiff) {
  if (item.status === "done") return "done";
  if (dayDiff <= 2) return "urgent";
  if (dayDiff >= 3 && dayDiff <= 7) return "upcoming";
  return "later";
}

function dueLabel(diff) {
  if (diff < 0) {
    const days = Math.abs(diff);
    return `Overdue by ${days} day${days > 1 ? "s" : ""}`;
  }
  if (diff === 0) {
    return "Due Today";
  }
  if (diff === 1) {
    return "Due in 1 day";
  }
  return `Due in ${diff} days`;
}

function formatDate(value) {
  return new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric" }).format(new Date(value));
}

function capitalize(text) {
  return text.charAt(0).toUpperCase() + text.slice(1);
}

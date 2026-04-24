import { NavLink } from "react-router-dom";
import BrandLogo from "./BrandLogo";

export default function SidebarNav({ onLogout, onQuickAdd }) {
  return (
    <aside className="h-fit w-full max-w-full rounded-2xl border border-slate-800 bg-slate-900/80 p-4 shadow-xl shadow-slate-950/30 backdrop-blur-sm">
      <BrandLogo size="sm" subtitle="Planning workspace" />

      {onQuickAdd && (
        <button
          className="mt-6 w-full rounded-lg bg-indigo-600 py-2.5 text-sm font-semibold transition-all shadow-lg shadow-indigo-900/30 hover:bg-indigo-500 active:scale-[0.99]"
          onClick={onQuickAdd}
        >
          Quick Add
        </button>
      )}

      <nav className="mt-6 grid grid-cols-1 gap-2 text-sm sm:grid-cols-3 lg:grid-cols-1">
        <SidebarLink to="/dashboard" label="Dashboard" icon={<DashboardIcon />} />
        <SidebarLink to="/deadlines" label="Deadlines" icon={<DeadlinesIcon />} />
        <SidebarLink to="/insights" label="Insights" icon={<InsightsIcon />} />
      </nav>

      <button
        className="mt-6 w-full cursor-pointer rounded-lg bg-slate-800 py-2 text-sm transition-colors hover:bg-slate-700"
        onClick={onLogout}
      >
        Logout
      </button>
    </aside>
  );
}

function SidebarLink({ to, label, icon }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `flex w-full min-w-0 cursor-pointer items-center gap-2 rounded-lg border px-3 py-2.5 text-xs transition-colors ${
          isActive
            ? "border-slate-700 bg-slate-800 text-slate-100"
            : "border-transparent text-slate-400 hover:bg-slate-800/70 hover:text-slate-200"
        }`
      }
    >
      <span className="shrink-0 text-slate-300">{icon}</span>
      <span className="truncate">{label}</span>
    </NavLink>
  );
}

function DashboardIcon() {
  return (
    <svg viewBox="0 0 16 16" className="h-3.5 w-3.5 fill-none stroke-current stroke-[1.5]">
      <rect x="2.25" y="2.25" width="4.5" height="4.5" rx="1" />
      <rect x="9.25" y="2.25" width="4.5" height="7.5" rx="1" />
      <rect x="2.25" y="9.25" width="4.5" height="4.5" rx="1" />
      <rect x="9.25" y="11.25" width="4.5" height="2.5" rx="1" />
    </svg>
  );
}

function DeadlinesIcon() {
  return (
    <svg viewBox="0 0 16 16" className="h-3.5 w-3.5 fill-none stroke-current stroke-[1.5]">
      <rect x="2.25" y="3.25" width="11.5" height="10.5" rx="2" />
      <path d="M5 2v2.5M11 2v2.5M2.5 6.5h11" />
      <path d="m5.5 10 1.5 1.5 3-3" />
    </svg>
  );
}

function InsightsIcon() {
  return (
    <svg viewBox="0 0 16 16" className="h-3.5 w-3.5 fill-none stroke-current stroke-[1.5]">
      <path d="M3 12.75h10" />
      <path d="M4.5 10.5 7 8l2 1.75 2.5-3.5" />
      <circle cx="4.5" cy="10.5" r=".75" fill="currentColor" stroke="none" />
      <circle cx="7" cy="8" r=".75" fill="currentColor" stroke="none" />
      <circle cx="9" cy="9.75" r=".75" fill="currentColor" stroke="none" />
      <circle cx="11.5" cy="6.25" r=".75" fill="currentColor" stroke="none" />
    </svg>
  );
}

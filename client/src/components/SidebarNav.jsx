import { NavLink } from "react-router-dom";

export default function SidebarNav({ onLogout, onQuickAdd }) {
  return (
    <aside className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 h-fit shadow-xl shadow-slate-950/30 backdrop-blur-sm">
      <div className="flex items-center gap-3">
        <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-indigo-500 to-cyan-400 flex items-center justify-center text-slate-950 font-black">
          DG
        </div>
        <div>
          <h2 className="text-sm font-semibold tracking-wide">Deadline Guardian</h2>
          <p className="text-slate-400 text-xs">Planning workspace</p>
        </div>
      </div>

      {onQuickAdd && (
        <button
          className="mt-5 w-full bg-indigo-600 hover:bg-indigo-500 active:scale-[0.99] transition-all rounded-lg py-2.5 text-sm font-semibold shadow-lg shadow-indigo-900/30"
          onClick={onQuickAdd}
        >
          Quick Add
        </button>
      )}

      <nav className="mt-5 space-y-1 text-sm">
        <SidebarLink to="/dashboard" label="Dashboard" icon="◉" />
        <SidebarLink to="/deadlines" label="Deadlines" icon="◌" />
        <SidebarLink to="/insights" label="Insights" icon="◌" />
      </nav>

      <button
        className="mt-5 w-full bg-slate-800 hover:bg-slate-700 transition-colors rounded-lg py-2 text-sm cursor-pointer"
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
        `flex items-center gap-2 rounded-lg px-2.5 py-2 border text-xs transition-colors cursor-pointer ${
          isActive
            ? "bg-slate-800 border-slate-700 text-slate-100"
            : "border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-800/70"
        }`
      }
    >
      <span className="text-[10px]">{icon}</span>
      <span>{label}</span>
    </NavLink>
  );
}

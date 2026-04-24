import { useAuth } from "../context/AuthContext";

export default function UserBadge({ name, className = "" }) {
  const { name: authName = "" } = useAuth();
  const displayName = name?.trim() || authName.trim() || "Guest";
  const initial = displayName.charAt(0).toUpperCase();

  return (
    <div
      className={`inline-flex max-w-full items-center gap-2 rounded-full border border-slate-700/80 bg-slate-900/72 px-3 py-1.5 text-sm text-slate-200 shadow-lg shadow-slate-950/25 ring-1 ring-white/5 backdrop-blur-xl ${className}`.trim()}
    >
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-indigo-600 via-sky-500 to-cyan-300 text-sm font-bold text-slate-950 ring-2 ring-slate-900/50 shadow-md shadow-cyan-500/15">
        {initial}
      </div>
      <span className="min-w-0 truncate font-semibold">{displayName}</span>
    </div>
  );
}

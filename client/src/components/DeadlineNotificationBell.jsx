import { useEffect, useRef, useState } from "react";
import { formatDeadlineDateTime, formatTimeUntilDeadline } from "../utils/deadlineDates";

export default function DeadlineNotificationBell({
  upcomingCount,
  upcomingTasks,
  notificationsSupported,
  permission,
  canRequestPermission,
  onRequestPermission,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    if (!isOpen) {
      return undefined;
    }

    const handlePointerDown = (event) => {
      if (!containerRef.current?.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handlePointerDown);
    return () => document.removeEventListener("mousedown", handlePointerDown);
  }, [isOpen]);

  return (
    <div className="relative" ref={containerRef}>
      <button
        type="button"
        onClick={() => setIsOpen((current) => !current)}
        className="relative inline-flex h-11 w-11 items-center justify-center rounded-xl border border-slate-700/80 bg-slate-900/80 text-slate-200 transition-colors hover:border-slate-600 hover:bg-slate-800"
        aria-label="Open deadline reminders"
        aria-expanded={isOpen}
      >
        <BellIcon />
        {upcomingCount > 0 && (
          <span className="absolute -right-1 -top-1 inline-flex min-h-5 min-w-5 items-center justify-center rounded-full bg-rose-500 px-1.5 text-[10px] font-bold text-white shadow-lg shadow-rose-950/40">
            {upcomingCount > 9 ? "9+" : upcomingCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 z-20 mt-3 w-80 max-w-[calc(100vw-2rem)] rounded-2xl border border-slate-800 bg-slate-950/95 p-3 shadow-2xl shadow-black/40 backdrop-blur">
          <div className="flex items-start justify-between gap-3 border-b border-slate-800 pb-3">
            <div>
              <p className="text-sm font-semibold text-slate-100">Upcoming deadlines</p>
              <p className="mt-1 text-xs text-slate-400">Tasks due in the next 24 hours.</p>
            </div>
            <span className="rounded-full border border-slate-700 bg-slate-900 px-2 py-1 text-[11px] text-slate-300">
              {upcomingCount}
            </span>
          </div>

          {notificationsSupported && permission === "granted" && (
            <div className="mt-3 rounded-xl border border-emerald-500/25 bg-emerald-500/10 px-3 py-2 text-xs text-emerald-200">
              Browser reminders are active.
            </div>
          )}

          {notificationsSupported && canRequestPermission && (
            <div className="mt-3 rounded-xl border border-sky-500/25 bg-sky-500/10 p-3">
              <p className="text-xs text-sky-100">Turn on browser reminders for 24-hour and 1-hour deadline alerts.</p>
              <button
                type="button"
                onClick={onRequestPermission}
                className="mt-2 rounded-lg bg-sky-500/20 px-3 py-1.5 text-xs font-semibold text-sky-100 transition-colors hover:bg-sky-500/30"
              >
                Enable reminders
              </button>
            </div>
          )}

          {notificationsSupported && !canRequestPermission && permission === "denied" && (
            <div className="mt-3 rounded-xl border border-amber-500/25 bg-amber-500/10 px-3 py-2 text-xs text-amber-100">
              Browser notifications are blocked. You can re-enable them from your browser site settings.
            </div>
          )}

          {!notificationsSupported && (
            <div className="mt-3 rounded-xl border border-slate-700 bg-slate-900 px-3 py-2 text-xs text-slate-300">
              This browser does not support native notifications, but upcoming tasks still appear here.
            </div>
          )}

          <div className="mt-3 space-y-2">
            {upcomingTasks.length > 0 ? (
              upcomingTasks.map((task) => (
                <article key={task._id} className="rounded-xl border border-slate-800 bg-slate-900/80 p-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-slate-100">{task.title}</p>
                      <p className="mt-1 text-xs text-slate-400">{formatDeadlineDateTime(task.deadlineDate)}</p>
                    </div>
                    <span className="rounded-full border border-rose-500/25 bg-rose-500/10 px-2 py-1 text-[11px] text-rose-100">
                      {formatTimeUntilDeadline(task.deadlineDate)}
                    </span>
                  </div>
                </article>
              ))
            ) : (
              <div className="rounded-xl border border-dashed border-slate-800 px-3 py-6 text-center">
                <p className="text-sm text-slate-200">Nothing due soon.</p>
                <p className="mt-1 text-xs text-slate-400">You are clear for the next 24 hours.</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function BellIcon() {
  return (
    <svg viewBox="0 0 20 20" className="h-5 w-5 fill-none stroke-current stroke-[1.7]">
      <path d="M10 3.25a3.25 3.25 0 0 0-3.25 3.25v1.16c0 .8-.24 1.58-.68 2.24l-1.2 1.8c-.53.79.04 1.85.99 1.85h8.18c.95 0 1.52-1.06.99-1.85l-1.2-1.8a4.02 4.02 0 0 1-.68-2.24V6.5A3.25 3.25 0 0 0 10 3.25Z" />
      <path d="M8.25 15.25a1.75 1.75 0 0 0 3.5 0" />
    </svg>
  );
}

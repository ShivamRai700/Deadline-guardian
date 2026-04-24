import { useNavigate } from "react-router-dom";
import BrandLogo from "./BrandLogo";

export default function HomePage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen overflow-x-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-slate-100">
      <nav className="sticky top-0 z-40 border-b border-slate-800 bg-slate-950/50 backdrop-blur-sm">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 md:px-6">
          <BrandLogo size="sm" />
          <div className="flex items-center gap-2">
            <button
              onClick={() => navigate("/auth?mode=login")}
              className="px-4 py-2 text-sm text-slate-300 transition-colors hover:text-slate-100"
            >
              Login
            </button>
            <button
              onClick={() => navigate("/auth?mode=register")}
              className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold transition-colors hover:bg-indigo-500"
            >
              Sign Up
            </button>
          </div>
        </div>
      </nav>

      <section className="relative">
        <div className="absolute left-1/2 top-14 h-72 w-72 -translate-x-1/2 rounded-full bg-cyan-500/12 blur-3xl" />
        <div className="absolute right-8 top-20 h-64 w-64 rounded-full bg-indigo-500/12 blur-3xl" />
        <div className="mx-auto flex min-h-[calc(100vh-73px)] max-w-7xl items-center px-4 py-10 md:px-6 md:py-14">
          <div className="grid w-full items-center gap-10 lg:grid-cols-[minmax(0,1.05fr)_minmax(320px,0.95fr)]">
            <div className="relative z-10 max-w-3xl space-y-6">
              <div className="inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-slate-900/70 px-3 py-1 text-xs font-medium text-cyan-100 shadow-lg shadow-slate-950/25">
                <span className="h-2 w-2 rounded-full bg-cyan-300" />
                Stay ahead of every deadline
              </div>

              <div className="space-y-4">
                <h1 className="text-4xl font-bold leading-tight tracking-tight md:text-5xl lg:text-6xl">
                  Track. Prioritize.{" "}
                  <span className="bg-gradient-to-r from-indigo-300 via-sky-300 to-cyan-300 bg-clip-text text-transparent">
                    Never Miss a Deadline.
                  </span>
                </h1>
                <p className="max-w-2xl text-base leading-relaxed text-slate-400 md:text-lg">
                  Deadline Guardian helps you stay on top of your work with clear planning, smarter prioritization, and focused
                  progress tracking in one calm workspace.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <button
                  onClick={() => navigate("/auth?mode=login")}
                  className="rounded-lg bg-indigo-600 px-6 py-3 font-semibold transition-colors shadow-lg shadow-indigo-500/20 hover:bg-indigo-500"
                >
                  Login
                </button>
                <button
                  onClick={() => navigate("/auth?mode=register")}
                  className="rounded-lg border border-slate-700 bg-slate-800 px-6 py-3 font-semibold transition-colors hover:border-slate-600 hover:bg-slate-700"
                >
                  Create Account
                </button>
              </div>

              <div className="flex flex-wrap gap-3 text-sm text-slate-300">
                <HeroStat label="Focus view" value="Compact dashboard" />
                <HeroStat label="Planning" value="Priority guidance" />
                <HeroStat label="Progress" value="Quick insights" />
              </div>
            </div>

            <div className="relative mx-auto w-full max-w-md lg:max-w-none">
              <div className="absolute inset-x-10 top-10 h-48 rounded-full bg-gradient-to-r from-indigo-500/25 to-cyan-400/20 blur-3xl" />
              <div className="relative rounded-[2rem] border border-slate-800 bg-slate-900/80 p-5 shadow-2xl shadow-slate-950/50 backdrop-blur-sm">
                <div className="flex items-center justify-between gap-3">
                  <BrandLogo size="sm" subtitle="Today at a glance" textClassName="pr-3" />
                  <div className="rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 text-xs font-medium text-emerald-200">
                    3 on track
                  </div>
                </div>

                <div className="mt-5 space-y-3">
                  <HeroTask tone="urgent" title="Client proposal" meta="Due in 1 day" detail="High priority" />
                  <HeroTask tone="upcoming" title="Sprint review notes" meta="Due in 3 days" detail="Ready to refine" />
                  <HeroTask tone="calm" title="Quarter roadmap" meta="Due next week" detail="Steady progress" />
                </div>

                <div className="mt-5 grid grid-cols-3 gap-3">
                  <MetricCard label="Due Today" value="2" tone="border-amber-500/20 bg-amber-500/10 text-amber-100" />
                  <MetricCard label="Completed" value="8" tone="border-emerald-500/20 bg-emerald-500/10 text-emerald-100" />
                  <MetricCard label="Upcoming" value="5" tone="border-cyan-500/20 bg-cyan-500/10 text-cyan-100" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl space-y-10 px-4 py-14 md:px-6">
        <div className="space-y-3 text-center">
          <h2 className="text-3xl font-bold md:text-4xl">Powerful features to manage your time</h2>
          <p className="mx-auto max-w-2xl text-slate-400">Everything you need to stay organized and productive</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <FeatureCard
            icon={<TrackingIcon />}
            accent="from-indigo-500/25 to-indigo-300/10"
            title="Smart Deadline Tracking"
            description="Track all your deadlines in one clear dashboard and spot what needs attention first."
          />
          <FeatureCard
            icon={<SparkIcon />}
            accent="from-sky-500/25 to-cyan-300/10"
            title="AI Priority Assistant"
            description="Get smart suggestions to improve task titles and priorities without changing your flow."
          />
          <FeatureCard
            icon={<ChartIcon />}
            accent="from-cyan-500/25 to-cyan-300/10"
            title="Insights & Analytics"
            description="See progress, overdue work, and current workload at a glance."
          />
          <FeatureCard
            icon={<TargetIcon />}
            accent="from-emerald-500/25 to-emerald-300/10"
            title="Clean Dashboard UI"
            description="A focused interface designed to keep planning simple on desktop and mobile."
          />
        </div>
      </section>

      <section className="mx-auto max-w-7xl space-y-8 px-4 py-14 md:px-6">
        <div className="space-y-6 rounded-3xl border border-indigo-500/20 bg-gradient-to-r from-indigo-500/10 to-cyan-500/10 p-12 text-center md:p-16">
          <h2 className="text-3xl font-bold md:text-4xl">Ready to take control of your deadlines?</h2>
          <p className="mx-auto max-w-2xl text-lg text-slate-400">
            Join thousands of productive people who use Deadline Guardian to stay on top of their work.
          </p>
          <div className="flex flex-wrap justify-center gap-3 pt-4">
            <button
              onClick={() => navigate("/auth?mode=register")}
              className="rounded-lg bg-indigo-600 px-6 py-3 font-semibold transition-colors hover:bg-indigo-500"
            >
              Get Started Free
            </button>
            <button
              onClick={() => navigate("/auth?mode=login")}
              className="rounded-lg border border-slate-700 bg-slate-800 px-6 py-3 font-semibold transition-colors hover:border-slate-600 hover:bg-slate-700"
            >
              Already have an account?
            </button>
          </div>
        </div>
      </section>

      <footer className="border-t border-slate-800 bg-slate-950/50 backdrop-blur-sm">
        <div className="mx-auto max-w-7xl px-4 py-12 md:px-6">
          <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
            <BrandLogo size="sm" textClassName="pr-2" />
            <p className="text-sm text-slate-400">Made to help you stay organized and productive.</p>
            <p className="text-xs text-slate-500">© 2026. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

function HeroStat({ label, value }) {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/70 px-4 py-3 shadow-lg shadow-slate-950/20">
      <p className="text-xs uppercase tracking-[0.2em] text-slate-500">{label}</p>
      <p className="mt-1 font-medium text-slate-100">{value}</p>
    </div>
  );
}

function HeroTask({ title, meta, detail, tone }) {
  const toneClass = {
    urgent: "border-rose-500/30 bg-rose-500/10",
    upcoming: "border-cyan-500/25 bg-cyan-500/10",
    calm: "border-slate-700 bg-slate-800/70",
  };

  return (
    <div className={`rounded-2xl border px-4 py-3 ${toneClass[tone] || toneClass.calm}`}>
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="font-medium text-slate-100">{title}</p>
          <p className="mt-1 text-sm text-slate-400">{detail}</p>
        </div>
        <span className="rounded-full border border-white/10 bg-slate-950/30 px-2.5 py-1 text-xs text-slate-300">{meta}</span>
      </div>
    </div>
  );
}

function MetricCard({ label, value, tone }) {
  return (
    <div className={`rounded-2xl border px-3 py-3 text-center ${tone}`}>
      <p className="text-[11px] uppercase tracking-[0.18em] text-slate-400">{label}</p>
      <p className="mt-1 text-xl font-semibold text-slate-100">{value}</p>
    </div>
  );
}

function FeatureCard({ icon, accent, title, description }) {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-6 transition-all hover:border-slate-700 hover:shadow-lg hover:shadow-slate-950/40">
      <div className={`mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${accent}`}>{icon}</div>
      <h3 className="mb-2 text-lg font-semibold">{title}</h3>
      <p className="text-sm text-slate-400">{description}</p>
    </div>
  );
}

function TrackingIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5 fill-none stroke-indigo-200 stroke-[1.8]">
      <rect x="4" y="5" width="16" height="15" rx="3" />
      <path d="M8 3v4M16 3v4M4 10h16M8.5 14 11 16.5 16 11.5" />
    </svg>
  );
}

function SparkIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5 fill-none stroke-cyan-100 stroke-[1.8]">
      <path d="m12 4 1.8 4.2L18 10l-4.2 1.8L12 16l-1.8-4.2L6 10l4.2-1.8L12 4Z" />
      <path d="M18.5 4.5 19 6l1.5.5L19 7l-.5 1.5L18 7l-1.5-.5L18 6l.5-1.5ZM6 16.5l.5 1.5 1.5.5-1.5.5L6 20l-.5-1.5-1.5-.5 1.5-.5L6 16.5Z" />
    </svg>
  );
}

function ChartIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5 fill-none stroke-cyan-100 stroke-[1.8]">
      <path d="M4 19h16" />
      <path d="M7 16v-3M12 16V8M17 16v-6" />
      <circle cx="7" cy="11" r="1" fill="currentColor" stroke="none" />
      <circle cx="12" cy="6" r="1" fill="currentColor" stroke="none" />
      <circle cx="17" cy="8" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

function TargetIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5 fill-none stroke-emerald-100 stroke-[1.8]">
      <circle cx="12" cy="12" r="7" />
      <circle cx="12" cy="12" r="3.5" />
      <path d="M12 5V3M12 21v-2M19 12h2M3 12h2" />
    </svg>
  );
}

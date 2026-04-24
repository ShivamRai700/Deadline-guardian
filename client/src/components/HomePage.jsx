import { useNavigate } from "react-router-dom";

export default function HomePage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-slate-100">
      {/* Navigation Bar */}
      <nav className="border-b border-slate-800 bg-slate-950/50 backdrop-blur-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-indigo-500 to-cyan-400 flex items-center justify-center text-slate-950 font-black text-sm">
              DG
            </div>
            <span className="text-lg font-semibold tracking-tight">Deadline Guardian</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => navigate("/auth?mode=login")}
              className="px-4 py-2 text-sm text-slate-300 hover:text-slate-100 transition-colors"
            >
              Login
            </button>
            <button
              onClick={() => navigate("/auth?mode=register")}
              className="px-4 py-2 text-sm bg-indigo-600 hover:bg-indigo-500 transition-colors rounded-lg font-semibold"
            >
              Sign Up
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 md:px-6 py-20 md:py-32 space-y-8">
        <div className="space-y-6 max-w-3xl">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight leading-tight">
            Track. Prioritize.{" "}
            <span className="bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent">
              Never Miss a Deadline.
            </span>
          </h1>
          <p className="text-lg md:text-xl text-slate-400 leading-relaxed max-w-2xl">
            Deadline Guardian helps you stay on top of your tasks. Get smart AI-powered priority suggestions, track progress with beautiful insights, and keep your focus where it matters.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 pt-4">
          <button
            onClick={() => navigate("/auth?mode=login")}
            className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 transition-colors rounded-lg font-semibold shadow-lg shadow-indigo-500/20"
          >
            Login
          </button>
          <button
            onClick={() => navigate("/auth?mode=register")}
            className="px-6 py-3 bg-slate-800 hover:bg-slate-700 transition-colors rounded-lg font-semibold border border-slate-700 hover:border-slate-600"
          >
            Create Account
          </button>
        </div>
      </section>

      {/* Features Section */}
      <section className="max-w-7xl mx-auto px-4 md:px-6 py-20 space-y-12">
        <div className="text-center space-y-3">
          <h2 className="text-3xl md:text-4xl font-bold">Powerful features to manage your time</h2>
          <p className="text-slate-400 max-w-2xl mx-auto">Everything you need to stay organized and productive</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Feature 1 */}
          <div className="bg-slate-900/50 border border-slate-800 hover:border-slate-700 rounded-2xl p-6 transition-all hover:shadow-lg hover:shadow-slate-950/40">
            <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-indigo-500/20 to-indigo-400/10 flex items-center justify-center mb-4">
              <span className="text-xl">📅</span>
            </div>
            <h3 className="text-lg font-semibold mb-2">Smart Deadline Tracking</h3>
            <p className="text-slate-400 text-sm">Track all your deadlines in one beautiful dashboard. Get alerts and stay organized.</p>
          </div>

          {/* Feature 2 */}
          <div className="bg-slate-900/50 border border-slate-800 hover:border-slate-700 rounded-2xl p-6 transition-all hover:shadow-lg hover:shadow-slate-950/40">
            <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-purple-500/20 to-purple-400/10 flex items-center justify-center mb-4">
              <span className="text-xl">✨</span>
            </div>
            <h3 className="text-lg font-semibold mb-2">AI Priority Assistant</h3>
            <p className="text-slate-400 text-sm">Get smart suggestions to improve task titles and priorities powered by AI.</p>
          </div>

          {/* Feature 3 */}
          <div className="bg-slate-900/50 border border-slate-800 hover:border-slate-700 rounded-2xl p-6 transition-all hover:shadow-lg hover:shadow-slate-950/40">
            <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-cyan-500/20 to-cyan-400/10 flex items-center justify-center mb-4">
              <span className="text-xl">📊</span>
            </div>
            <h3 className="text-lg font-semibold mb-2">Insights & Analytics</h3>
            <p className="text-slate-400 text-sm">Visualize your progress and understand your work patterns at a glance.</p>
          </div>

          {/* Feature 4 */}
          <div className="bg-slate-900/50 border border-slate-800 hover:border-slate-700 rounded-2xl p-6 transition-all hover:shadow-lg hover:shadow-slate-950/40">
            <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-emerald-500/20 to-emerald-400/10 flex items-center justify-center mb-4">
              <span className="text-xl">🎯</span>
            </div>
            <h3 className="text-lg font-semibold mb-2">Clean Dashboard UI</h3>
            <p className="text-slate-400 text-sm">Minimal, focused interface designed to keep you productive without distractions.</p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-7xl mx-auto px-4 md:px-6 py-20 space-y-8">
        <div className="bg-gradient-to-r from-indigo-500/10 to-cyan-500/10 border border-indigo-500/20 rounded-3xl p-12 md:p-16 text-center space-y-6">
          <h2 className="text-3xl md:text-4xl font-bold">Ready to take control of your deadlines?</h2>
          <p className="text-slate-400 max-w-2xl mx-auto text-lg">
            Join thousands of productive people who use Deadline Guardian to stay on top of their work.
          </p>
          <div className="flex flex-wrap justify-center gap-3 pt-4">
            <button
              onClick={() => navigate("/auth?mode=register")}
              className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 transition-colors rounded-lg font-semibold"
            >
              Get Started Free
            </button>
            <button
              onClick={() => navigate("/auth?mode=login")}
              className="px-6 py-3 bg-slate-800 hover:bg-slate-700 transition-colors rounded-lg font-semibold border border-slate-700 hover:border-slate-600"
            >
              Already have an account?
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-800 bg-slate-950/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-12">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-indigo-500 to-cyan-400 flex items-center justify-center text-slate-950 font-black text-sm">
                DG
              </div>
              <span className="text-sm font-medium">Deadline Guardian</span>
            </div>
            <p className="text-sm text-slate-400">Made to help you stay organized and productive.</p>
            <p className="text-xs text-slate-500">© 2026. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

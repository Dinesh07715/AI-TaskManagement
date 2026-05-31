import React, { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import ErrorAlert from "../components/ErrorAlert";
import { useAuth } from "../hooks/useAuth";
import { validateLogin } from "../utils/validators";

export default function LoginPage() {
  const [values, setValues] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const { login, isAuthenticated, user } = useAuth();

  const navigate = useNavigate();

  if (isAuthenticated) {
    return <Navigate to={user?.role === "ADMIN" ? "/dashboard/admin" : "/dashboard/user"} replace />;
  }



  async function handleSubmit(event) {
    event.preventDefault();
    const nextErrors = validateLogin(values);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;
    setSubmitting(true);
    setMessage("");
    try {
      const loggedInUser = await login(values);
      navigate(loggedInUser?.role === "ADMIN" ? "/dashboard/admin" : "/dashboard/user", { replace: true });
    } catch (err) {
      setMessage(err.message || "Login failed");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#0d1117] flex items-center justify-center px-6">
      <div className="w-full max-w-5xl flex items-center gap-12">

        {/* Left panel */}
        <div className="flex-1 relative">
          <div className="absolute w-72 h-72 rounded-full bg-blue-900/40 -top-20 -left-20 blur-3xl pointer-events-none" />
          <div className="absolute w-56 h-56 rounded-full bg-sky-900/30 bottom-0 right-0 blur-3xl pointer-events-none" />
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-14">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-sky-400 flex items-center justify-center text-white font-bold text-sm">
                AI
              </div>
              <span className="text-slate-200 font-medium">AI Task Portal</span>
            </div>
            <h1 className="text-5xl font-bold text-white leading-tight mb-5">
              Manage tasks<br />
              with{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-sky-400">
                intelligence
              </span>
            </h1>
            <p className="text-slate-400 text-base leading-relaxed mb-10 max-w-sm">
              A smarter way to plan, track, and complete your work — powered by AI.
            </p>
            <ul className="space-y-4">
              {[
                "AI-powered task suggestions",
                "Real-time team collaboration",
                "Smart priority automation",
              ].map((f) => (
                <li key={f} className="flex items-center gap-3 text-slate-400 text-sm">
                  <span className="w-2 h-2 rounded-full bg-blue-500 flex-shrink-0" />
                  {f}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Right card */}
        <div className="w-full max-w-sm flex-shrink-0">
          <div className="bg-[#0f1923] rounded-2xl border border-slate-700/60 p-8">
            <div className="mb-7">
              <h2 className="text-2xl font-bold text-white mb-1.5">Welcome back</h2>
              <p className="text-slate-500 text-sm">Sign in to your account to continue</p>
            </div>

            <ErrorAlert message={message} />

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-widest mb-2" htmlFor="email">
                  Email address
                </label>
                <input
                  id="email"
                  type="email"
                  className="w-full bg-[#0d1117] border border-slate-700 rounded-xl px-4 py-3 text-sm text-slate-100 placeholder-slate-600 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition"
                  value={values.email}
                  placeholder="you@example.com"
                  onChange={(e) => setValues({ ...values, email: e.target.value })}
                />
                {errors.email && <p className="mt-1.5 text-xs text-rose-400">{errors.email}</p>}
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-widest mb-2" htmlFor="password">
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  className="w-full bg-[#0d1117] border border-slate-700 rounded-xl px-4 py-3 text-sm text-slate-100 placeholder-slate-600 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition"
                  value={values.password}
                  placeholder="••••••••"
                  onChange={(e) => setValues({ ...values, password: e.target.value })}
                />
                {errors.password && <p className="mt-1.5 text-xs text-rose-400">{errors.password}</p>}
              </div>
              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-500 to-sky-500 hover:from-blue-600 hover:to-sky-600 text-white text-sm font-semibold transition disabled:opacity-60"
              >
                {submitting ? "Signing in..." : "Sign in"}
              </button>
            </form>

            <p className="mt-6 text-center text-sm text-slate-500">
              New here?{" "}
              <Link to="/register" className="text-blue-400 font-semibold hover:text-blue-300 transition">
                Create an account
              </Link>
            </p>
          </div>
        </div>

      </div>
    </main>
  );
}

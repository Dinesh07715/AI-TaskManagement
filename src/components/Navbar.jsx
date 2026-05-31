import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export default function Navbar({ onMenuClick }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate("/login", { replace: true });
  }

  return (
    <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 backdrop-blur dark:border-slate-800 dark:bg-slate-950/95">
      <div className="flex h-16 items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onMenuClick}
            className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-slate-200 text-slate-700 lg:hidden dark:border-slate-800 dark:text-slate-100"
            aria-label="Open menu"
          >
            <span className="text-xl leading-none">☰</span>
          </button>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-sky-600 dark:text-sky-400">AI Task Portal</p>
            <h1 className="text-base font-semibold text-slate-950 dark:text-white">Task Management</h1>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Link to="/profile" className="hidden text-sm font-medium text-slate-600 hover:text-sky-700 sm:block dark:text-slate-300">
            {user?.name}
          </Link>
          <span className="rounded-md bg-slate-100 px-2 py-1 text-xs font-semibold text-slate-700 dark:bg-slate-800 dark:text-slate-200">
            {user?.role}
          </span>
          <button type="button" onClick={handleLogout} className="btn-secondary px-3 py-2">
            Logout
          </button>
        </div>
      </div>
    </header>
  );
}

import { Link } from "react-router-dom";

export default function NotFoundPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4 dark:bg-slate-950">
      <section className="max-w-md text-center">
        <p className="text-sm font-bold uppercase tracking-wide text-sky-600 dark:text-sky-300">404</p>
        <h1 className="mt-2 text-3xl font-bold text-slate-950 dark:text-white">Page not found</h1>
        <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">The route you opened does not exist in the task portal.</p>
        <Link to="/dashboard" className="btn-primary mt-6">Go to dashboard</Link>
      </section>
    </main>
  );
}

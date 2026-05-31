import { useAuth } from "../hooks/useAuth";

export default function ProfilePage() {
  const { user } = useAuth();

  return (
    <div className="mx-auto max-w-3xl space-y-5">
      <div>
        <h2 className="text-2xl font-bold text-slate-950 dark:text-white">Profile</h2>
        <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">Your current mock session details.</p>
      </div>
      <section className="panel p-5">
        <div className="flex items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-lg bg-sky-600 text-xl font-bold text-white">
            {user?.name?.split(" ").map((part) => part[0]).join("").slice(0, 2)}
          </div>
          <div>
            <h3 className="text-lg font-semibold text-slate-950 dark:text-white">{user?.name}</h3>
            <p className="text-sm text-slate-600 dark:text-slate-300">{user?.email}</p>
          </div>
        </div>
        <dl className="mt-6 grid gap-4 sm:grid-cols-2">
          <div className="rounded-lg bg-slate-50 p-4 dark:bg-slate-800">
            <dt className="text-xs font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400">Role</dt>
            <dd className="mt-1 font-semibold text-slate-950 dark:text-white">{user?.role}</dd>
          </div>
          <div className="rounded-lg bg-slate-50 p-4 dark:bg-slate-800">
            <dt className="text-xs font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400">Department</dt>
            <dd className="mt-1 font-semibold text-slate-950 dark:text-white">{user?.department || "General"}</dd>
          </div>
        </dl>
      </section>
    </div>
  );
}

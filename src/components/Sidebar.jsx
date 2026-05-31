import { NavLink } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { useTasks } from "../hooks/useTasks";
import { USER_ROLES } from "../utils/constants";
import { classNames } from "../utils/helpers";

const adminLinks = [
  { to: "/dashboard/admin", label: "Dashboard", icon: "DB" },
  { to: "/tasks", label: "Tasks", icon: "TS" },
  { to: "/users", label: "Users", icon: "US" },
  { to: "/ai", label: "AI Assistant", icon: "AI" },
  { to: "/settings", label: "Settings", icon: "ST" }
];

const userLinks = [
  { to: "/dashboard/user", label: "Dashboard", icon: "DB" },
  { to: "/tasks", label: "My Tasks", icon: "TS" },
  { to: "/ai", label: "AI Assistant", icon: "AI" },
  { to: "/profile", label: "Profile", icon: "PF" },
  { to: "/settings", label: "Settings", icon: "ST" }
];

export default function Sidebar({ open, onClose }) {
  const { user } = useAuth();
  const { canViewUsers } = useTasks();
  console.log("Logged User:", user);
  console.log("Role:", user?.role);
  const links = user?.role === USER_ROLES.ADMIN ? adminLinks : userLinks;

  return (
    <>
      <div
        className={classNames("fixed inset-0 z-40 bg-slate-950/50 lg:hidden", open ? "block" : "hidden")}
        onClick={onClose}
      />
      <aside
        className={classNames(
          "fixed inset-y-0 left-0 z-50 flex w-72 transform flex-col border-r border-slate-200 bg-white transition lg:static lg:z-auto lg:translate-x-0 dark:border-slate-800 dark:bg-slate-950",
          open ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex h-16 items-center border-b border-slate-200 px-6 dark:border-slate-800">
          <div className="flex h-10 w-10 items-center justify-center rounded-md bg-sky-600 text-lg font-bold text-white">AI</div>
          <div className="ml-3">
            <p className="text-sm font-bold text-slate-950 dark:text-white">Task Portal</p>
            <p className="text-xs text-slate-500 dark:text-slate-400">Mock data mode</p>
          </div>
        </div>

        <nav className="flex-1 space-y-1 px-3 py-5">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              onClick={onClose}
              className={({ isActive }) =>
                classNames(
                  "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-semibold transition",
                  isActive
                    ? "bg-sky-50 text-sky-700 dark:bg-sky-950 dark:text-sky-200"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-950 dark:text-slate-300 dark:hover:bg-slate-900 dark:hover:text-white"
                )
              }
            >
              <span className="inline-flex h-7 w-7 items-center justify-center rounded-md bg-slate-100 text-xs dark:bg-slate-800">
                {link.icon}
              </span>
              {link.label}
            </NavLink>
          ))}
        </nav>

        <div className="border-t border-slate-200 p-4 dark:border-slate-800">
          <div className="rounded-lg bg-slate-50 p-4 dark:bg-slate-900">
            <p className="text-sm font-semibold text-slate-950 dark:text-white">{user?.name}</p>
            <p className="mt-1 break-all text-xs text-slate-500 dark:text-slate-400">{user?.email}</p>
            {canViewUsers(user) && <p className="mt-3 text-xs font-semibold text-emerald-700 dark:text-emerald-300">Admin: user visibility enabled</p>}
          </div>
        </div>
      </aside>
    </>
  );
}

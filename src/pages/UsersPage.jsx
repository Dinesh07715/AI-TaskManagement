import { useEffect, useMemo, useState } from "react";
import { useTasks } from "../hooks/useTasks";
import { userService } from "../services/userService";

export default function UsersPage() {
  const { tasks } = useTasks();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      const data = await userService.getUsers();
      setUsers(data || []);
    } catch (error) {
      console.error("Failed to load users:", error);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  const usersWithTaskCount = useMemo(() => {
    return users.map((u) => ({
      ...u,
      assignedCount:
        tasks?.filter((t) => t.assignedTo?.id === u.id).length || 0
    }));
  }, [users, tasks]);

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
          Users
        </h2>

        <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
          Manage users and view assigned workload.
        </p>
      </div>

      <section className="panel overflow-hidden border border-slate-200 dark:border-slate-700 rounded-lg">
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-bold uppercase text-slate-600 dark:text-slate-300">
                  Name
                </th>

                <th className="px-4 py-3 text-left text-xs font-bold uppercase text-slate-600 dark:text-slate-300">
                  Email
                </th>

                <th className="px-4 py-3 text-left text-xs font-bold uppercase text-slate-600 dark:text-slate-300">
                  Role
                </th>

                <th className="px-4 py-3 text-left text-xs font-bold uppercase text-slate-600 dark:text-slate-300">
                  Assigned Tasks
                </th>
              </tr>
            </thead>

            <tbody className="bg-white dark:bg-slate-900 divide-y divide-slate-200 dark:divide-slate-700">
              {loading ? (
                <tr>
                  <td
                    colSpan={4}
                    className="px-4 py-8 text-center text-slate-600 dark:text-slate-300"
                  >
                    Loading users...
                  </td>
                </tr>
              ) : usersWithTaskCount.length === 0 ? (
                <tr>
                  <td
                    colSpan={4}
                    className="px-4 py-8 text-center text-slate-600 dark:text-slate-300"
                  >
                    No users found
                  </td>
                </tr>
              ) : (
                usersWithTaskCount.map((u) => (
                  <tr
                    key={u.id}
                    className="hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                  >
                    <td className="px-4 py-4 font-semibold text-slate-900 dark:text-white">
                      {u.name}
                    </td>

                    <td className="px-4 py-4 text-slate-700 dark:text-slate-300">
                      {u.email}
                    </td>

                    <td className="px-4 py-4 text-slate-700 dark:text-slate-300">
                      {u.role}
                    </td>

                    <td className="px-4 py-4 text-slate-700 dark:text-slate-300">
                      {u.assignedCount}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
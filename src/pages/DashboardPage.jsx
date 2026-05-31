import { Link } from "react-router-dom";
import LoadingSpinner from "../components/LoadingSpinner";
import TaskCard from "../components/TaskCard";
import { useTasks } from "../hooks/useTasks";
import { useAuth } from "../hooks/useAuth";
import { getMockUsers } from "../mock/mockUsers";



const cards = [
  { key: "total", label: "Total Tasks", tone: "border-sky-200 bg-sky-50 text-sky-700 dark:border-sky-900 dark:bg-sky-950 dark:text-sky-200" },
  { key: "assigned", label: "Assigned Tasks", tone: "border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-900 dark:bg-amber-950 dark:text-amber-200" },
  { key: "inProgress", label: "In Progress", tone: "border-indigo-200 bg-indigo-50 text-indigo-700 dark:border-indigo-900 dark:bg-indigo-950 dark:text-indigo-200" },
  { key: "done", label: "Completed Tasks", tone: "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950 dark:text-emerald-200" }
];

function AdminDashboardContent({ tasks, loading, recentTasks }) {
  const mockUsers = getMockUsers();
  // NOTE: tasks are already scoped per role via TaskContext/service.
  const cardsAdmin = [
    { key: "totalUsers", label: "Total Users", tone: "border-sky-200 bg-sky-50 text-sky-700 dark:border-sky-900 dark:bg-sky-950 dark:text-sky-200" },
    { key: "totalTasks", label: "Total Tasks", tone: "border-indigo-200 bg-indigo-50 text-indigo-700 dark:border-indigo-900 dark:bg-indigo-950 dark:text-indigo-200" },
    { key: "pendingTasks", label: "Pending Tasks", tone: "border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-900 dark:bg-amber-950 dark:text-amber-200" },
    { key: "completedTasks", label: "Completed Tasks", tone: "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950 dark:text-emerald-200" }
  ];

  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((t) => t.status === "DONE").length;
  const pendingTasks = tasks.filter((t) => t.status !== "DONE").length;

  const adminStats = {
    totalUsers: mockUsers.length,
    totalTasks,
    pendingTasks,
    completedTasks
  };

  return (
    <>
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {cardsAdmin.map((card) => (
          <div key={card.key} className={`rounded-lg border p-5 ${card.tone}`}>
            <p className="text-sm font-semibold">{card.label}</p>
            <p className="mt-3 text-3xl font-bold">{adminStats[card.key]}</p>
          </div>
        ))}
      </section>

      <section>
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-slate-950 dark:text-white">Recent Activity</h3>
          <span className="text-sm font-semibold text-sky-700 dark:text-sky-300">Mock data</span>
        </div>
        {loading ? (
          <LoadingSpinner label="Loading tasks" />
        ) : recentTasks.length ? (
          <div className="grid gap-4 lg:grid-cols-3">
            {recentTasks.map((task) => (
              <TaskCard key={task.id} task={task} />
            ))}
          </div>
        ) : (
          <div className="panel p-6 text-sm text-slate-600 dark:text-slate-300">No recent activity.</div>
        )}
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        <div className="panel p-5">
          <h3 className="text-lg font-semibold text-slate-950 dark:text-white">Task Assignment Overview</h3>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">Assigned tasks count derived from mock data.</p>
          <div className="mt-4 space-y-2">
            {mockUsers.slice(0, 6).map((mockUser) => {
              const count = tasks.filter((t) => t.assignedTo === mockUser.id).length;
              return (
                <div key={mockUser.id} className="flex items-center justify-between text-sm">
                  <span className="font-semibold text-slate-700 dark:text-slate-200">{mockUser.name}</span>
                  <span className="font-bold">{count}</span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="panel p-5">
          <h3 className="text-lg font-semibold text-slate-950 dark:text-white">Task Status Summary</h3>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">TODO / IN_PROGRESS / DONE</p>
          <div className="mt-4 space-y-2 text-sm">
            {[
              { s: "TODO", label: "TODO" },
              { s: "IN_PROGRESS", label: "IN_PROGRESS" },
              { s: "DONE", label: "DONE" }
            ].map((item) => (
              <div key={item.s} className="flex items-center justify-between">
                <span className="font-semibold text-slate-700 dark:text-slate-200">{item.label}</span>
                <span className="font-bold">{tasks.filter((t) => t.status === item.s).length}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

export default function DashboardPage() {
  const { user } = useAuth();
  const { tasks, loading, stats } = useTasks();

  console.log("Logged User:", user);
  console.log("Role:", user?.role);
  const isAdmin = user?.role === "ADMIN";
  const recentTasks = [...tasks].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 3);
  const assignedTasks = tasks.filter((task) => task.assignedTo === user?.id);
  const userStats = {
    ...stats,
    assigned: assignedTasks.length
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-950 dark:text-white">{isAdmin ? "Admin Dashboard" : "Dashboard"}</h2>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
            {isAdmin ? "Analytics overview of workload, assignments, and progress." : "A focused view of task load, progress, and priority movement."}
          </p>
        </div>
        <Link to="/tasks/new" className="btn-primary">Create Task</Link>
      </div>

      {!isAdmin ? (
        <>
          <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {cards.map((card) => (
              <div key={card.key} className={`rounded-lg border p-5 ${card.tone}`}>
                <p className="text-sm font-semibold">{card.label}</p>
                <p className="mt-3 text-3xl font-bold">{userStats[card.key]}</p>
              </div>
            ))}
          </section>

          <section>
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-slate-950 dark:text-white">Recent Tasks</h3>
              <Link to="/tasks" className="text-sm font-semibold text-sky-700 dark:text-sky-300">View all</Link>
            </div>
            {loading ? (
              <LoadingSpinner label="Loading tasks" />
            ) : recentTasks.length ? (
              <div className="grid gap-4 lg:grid-cols-3">
                {recentTasks.map((task) => <TaskCard key={task.id} task={task} />)}
              </div>
            ) : (
              <div className="panel p-6 text-sm text-slate-600 dark:text-slate-300">No tasks yet.</div>
            )}
          </section>

          <section>
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-slate-950 dark:text-white">Assigned Tasks</h3>
              <Link to="/tasks" className="text-sm font-semibold text-sky-700 dark:text-sky-300">Open tasks</Link>
            </div>
            {loading ? (
              <LoadingSpinner label="Loading assigned tasks" />
            ) : assignedTasks.length ? (
              <div className="grid gap-4 lg:grid-cols-3">
                {assignedTasks.slice(0, 3).map((task) => <TaskCard key={task.id} task={task} />)}
              </div>
            ) : (
              <div className="panel p-6 text-sm text-slate-600 dark:text-slate-300">No assigned tasks yet.</div>
            )}
          </section>
        </>
      ) : (
        <AdminDashboardContent tasks={tasks} loading={loading} recentTasks={recentTasks} />
      )}

    </div>
  );
}

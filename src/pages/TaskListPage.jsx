import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import ConfirmModal from "../components/ConfirmModal";
import ErrorAlert from "../components/ErrorAlert";
import LoadingSpinner from "../components/LoadingSpinner";
import { useAuth } from "../hooks/useAuth";
import { useTasks } from "../hooks/useTasks";
import { TASK_PRIORITY, TASK_STATUS, USER_ROLES } from "../utils/constants";
import { formatDate, formatDateTime, getPriorityLabel, getStatusLabel, isOverdue, sortTasks } from "../utils/helpers";

const badge = {
  HIGH: "bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-200",
  MEDIUM: "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-200",
  LOW: "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-200",
  TODO: "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-200",
  IN_PROGRESS: "bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-200",
  DONE: "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-200"
};

export default function TaskListPage() {
  const { user } = useAuth();
  const { tasks, loading, error, deleteTask, updateTask, canManageTask, canUpdateTaskStatus } = useTasks();
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("ALL");
  const [priority, setPriority] = useState("ALL");
  const [sortBy, setSortBy] = useState("createdAt");
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [actionError, setActionError] = useState("");
  const isAdmin = user?.role === USER_ROLES.ADMIN;

  const filteredTasks = useMemo(() => {
    const normalized = search.trim().toLowerCase();
    const filtered = tasks.filter((task) => {
      const matchesSearch =
        !normalized ||
        `${task.title} ${task.description} ${task.createdByName} ${task.assignedToName}`.toLowerCase().includes(normalized);
      const matchesStatus = status === "ALL" || task.status === status;
      const matchesPriority = priority === "ALL" || task.priority === priority;
      return matchesSearch && matchesStatus && matchesPriority;
    });
    return sortTasks(filtered, sortBy);
  }, [priority, search, sortBy, status, tasks]);

  async function handleStatusChange(task, nextStatus) {
    setActionError("");
    if (!canUpdateTaskStatus(task, user)) {
      setActionError("Only admins can update task status.");
      return;
    }
    try {
      await updateTask(task.id, { status: nextStatus }, user);
    } catch (err) {
      setActionError(err.message || "Unable to update task");
    }
  }

  async function confirmDelete() {
    setActionError("");
    try {
      await deleteTask(deleteTarget.id, user);
      setDeleteTarget(null);
    } catch (err) {
      setActionError(err.message || "Unable to delete task");
    }
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-950 dark:text-white">Tasks</h2>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
            {isAdmin ? "Managing all team tasks." : "Managing your tasks and assigned work."}
          </p>
        </div>
        <Link to="/tasks/new" className="btn-primary">New Task</Link>
      </div>

      <ErrorAlert message={error || actionError} />

      <section className="panel grid gap-4 p-4 md:grid-cols-4">
        <div className="md:col-span-1">
          <label className="field-label" htmlFor="search">Search</label>
          <input id="search" className="field-input" placeholder="Title, description, user" value={search} onChange={(event) => setSearch(event.target.value)} />
        </div>
        <div>
          <label className="field-label" htmlFor="status">Status</label>
          <select id="status" className="field-input" value={status} onChange={(event) => setStatus(event.target.value)}>
            <option value="ALL">All statuses</option>
            <option value={TASK_STATUS.TODO}>TODO</option>
            <option value={TASK_STATUS.IN_PROGRESS}>IN_PROGRESS</option>
            <option value={TASK_STATUS.DONE}>DONE</option>
          </select>
        </div>
        <div>
          <label className="field-label" htmlFor="priority">Priority</label>
          <select id="priority" className="field-input" value={priority} onChange={(event) => setPriority(event.target.value)}>
            <option value="ALL">All priorities</option>
            <option value={TASK_PRIORITY.LOW}>LOW</option>
            <option value={TASK_PRIORITY.MEDIUM}>MEDIUM</option>
            <option value={TASK_PRIORITY.HIGH}>HIGH</option>
          </select>
        </div>
        <div>
          <label className="field-label" htmlFor="sort">Sort</label>
          <select id="sort" className="field-input" value={sortBy} onChange={(event) => setSortBy(event.target.value)}>
            <option value="createdAt">Newest</option>
            <option value="dueDate">Due date</option>
            <option value="priority">Priority</option>
            <option value="status">Status</option>
            <option value="title">Title</option>
          </select>
        </div>
      </section>

      {loading ? (
        <LoadingSpinner label="Loading tasks" />
      ) : (
        <section className="panel overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-800">
              <thead className="bg-slate-50 dark:bg-slate-900">
                <tr>
                  {["Task", "Priority", "Status", "Due", "Assigned To", "Created By", "Created", "Actions"].map((heading) => (
                    <th key={heading} className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400">{heading}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 bg-white dark:divide-slate-800 dark:bg-slate-900">
                {filteredTasks.map((task) => (
                  <tr key={task.id} className="align-top">
                    <td className="max-w-xs px-4 py-4">
                      <p className="font-semibold text-slate-950 dark:text-white">{task.title}</p>
                      <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">{task.description}</p>
                    </td>
                    <td className="px-4 py-4">
                      <span className={`rounded-md px-2 py-1 text-xs font-bold ${badge[task.priority]}`}>{getPriorityLabel(task.priority)}</span>
                    </td>
                    <td className="px-4 py-4">
                      {canUpdateTaskStatus(task, user) && (
                        <select
                          className="field-input min-w-36"
                          value={task.status}
                          onChange={(event) => handleStatusChange(task, event.target.value)}
                        >
                          <option value={TASK_STATUS.TODO}>TODO</option>
                          <option value={TASK_STATUS.IN_PROGRESS}>IN_PROGRESS</option>
                          <option value={TASK_STATUS.DONE}>DONE</option>
                        </select>
                      )}
                      <span className={`mt-2 inline-flex rounded-md px-2 py-1 text-xs font-bold ${badge[task.status]}`}>{getStatusLabel(task.status)}</span>
                    </td>
                    <td className={`px-4 py-4 text-sm ${isOverdue(task) ? "font-semibold text-rose-600 dark:text-rose-300" : "text-slate-600 dark:text-slate-300"}`}>
                      {formatDate(task.dueDate)}
                    </td>
                    <td className="px-4 py-4 text-sm text-slate-600 dark:text-slate-300">{task.assignedToName}</td>
                    <td className="px-4 py-4 text-sm text-slate-600 dark:text-slate-300">{task.createdByName}</td>
                    <td className="px-4 py-4 text-sm text-slate-600 dark:text-slate-300">{formatDateTime(task.createdAt)}</td>
                    <td className="px-4 py-4">
                      <div className="flex flex-wrap gap-2">
                        {canManageTask(task, user) && (
                          <Link to={`/tasks/edit/${task.id}`} className="btn-secondary px-3 py-1.5">Edit</Link>
                        )}
                        {canManageTask(task, user) && (
                          <button type="button" className="btn-danger px-3 py-1.5" onClick={() => setDeleteTarget(task)}>Delete</button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {!filteredTasks.length && <div className="p-6 text-sm text-slate-600 dark:text-slate-300">No tasks match your current view.</div>}
        </section>
      )}

      <ConfirmModal
        open={Boolean(deleteTarget)}
        title="Delete task"
        message={`Delete "${deleteTarget?.title}"? This removes it from mock storage.`}
        confirmLabel="Delete"
        onConfirm={confirmDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}

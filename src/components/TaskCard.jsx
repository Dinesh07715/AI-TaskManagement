import { Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { useTasks } from "../hooks/useTasks";
import { formatDate, getPriorityLabel, getStatusLabel, isOverdue } from "../utils/helpers";

const priorityClass = {
  HIGH: "bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-200",
  MEDIUM: "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-200",
  LOW: "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-200"
};

export default function TaskCard({ task }) {
  const { user } = useAuth();
  const { canManageTask } = useTasks();

  return (
    <article className="panel p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-sm font-semibold text-slate-950 dark:text-white">{task.title}</h3>
          <p className="mt-1 line-clamp-2 text-sm text-slate-600 dark:text-slate-300">{task.description}</p>
        </div>
        <span className={`shrink-0 rounded-md px-2 py-1 text-xs font-bold ${priorityClass[task.priority]}`}>
          {getPriorityLabel(task.priority)}
        </span>
      </div>
      <div className="mt-4 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500 dark:text-slate-400">
        <span>{getStatusLabel(task.status)}</span>
        <span className={isOverdue(task) ? "font-semibold text-rose-600 dark:text-rose-300" : ""}>{formatDate(task.dueDate)}</span>
      </div>
      <div className="mt-3 grid gap-1 text-xs text-slate-500 dark:text-slate-400">
        <span>Assigned To: {task.assignedToName}</span>
        <span>Created By: {task.createdByName}</span>
      </div>
      {canManageTask(task, user) && (
        <Link to={`/tasks/edit/${task.id}`} className="mt-4 inline-flex text-sm font-semibold text-sky-700 hover:text-sky-800 dark:text-sky-300">
          Edit task
        </Link>
      )}
    </article>
  );
}

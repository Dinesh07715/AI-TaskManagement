import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import LoadingSpinner from "../components/LoadingSpinner";
import TaskForm from "../components/TaskForm";
import { useAuth } from "../hooks/useAuth";
import { useTasks } from "../hooks/useTasks";

export default function TaskFormPage() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const { user } = useAuth();
  const { getTask, createTask, updateTask, canManageTask } = useTasks();
  const navigate = useNavigate();
  const location = useLocation();
  const [initialValues, setInitialValues] = useState(isEdit ? null : location.state || null);
  const [loading, setLoading] = useState(isEdit);
  const [error, setError] = useState("");

  useEffect(() => {
    let mounted = true;
    async function loadTask() {
      if (!isEdit) return;
      setLoading(true);
      try {
        const task = await getTask(id, user);
        if (mounted) {
          if (!canManageTask(task, user)) {
            setError("Only admins and task owners can edit task details.");
            setInitialValues(null);
          } else {
            setInitialValues(task);
          }
        }
      } catch (err) {
        if (mounted) setError(err.message || "Unable to load task");
      } finally {
        if (mounted) setLoading(false);
      }
    }
    loadTask();
    return () => {
      mounted = false;
    };
  }, [canManageTask, getTask, id, isEdit, user]);

  async function handleSubmit(values) {
    setError("");
    try {
      if (isEdit) await updateTask(id, values, user);
      else await createTask(values, user);
      navigate("/tasks");
    } catch (err) {
      setError(err.message || "Unable to save task");
    }
  }

  return (
    <div className="mx-auto max-w-3xl space-y-5">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-950 dark:text-white">{isEdit ? "Edit Task" : "Create Task"}</h2>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">Set priority, status, and due date in one clean pass.</p>
        </div>
        <Link to="/tasks" className="btn-secondary">Back</Link>
      </div>
      {loading ? (
        <LoadingSpinner label="Loading task" />
      ) : isEdit && error && !initialValues ? (
        <div className="panel p-5 text-sm text-rose-600 dark:text-rose-300">{error}</div>
      ) : (
        <TaskForm initialValues={initialValues} onSubmit={handleSubmit} submitLabel={isEdit ? "Update Task" : "Create Task"} error={error} />
      )}
    </div>
  );
}

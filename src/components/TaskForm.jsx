import { useMemo, useState } from "react";
import ErrorAlert from "./ErrorAlert";
import { getMockUsers } from "../mock/mockUsers";
import { useAuth } from "../hooks/useAuth";
import { TASK_PRIORITY, TASK_STATUS, USER_ROLES } from "../utils/constants";
import { validateTask } from "../utils/validators";

const initialState = {
  title: "",
  description: "",
  priority: TASK_PRIORITY.MEDIUM,
  dueDate: "",
  status: TASK_STATUS.TODO,
  assignedTo: ""
};

export default function TaskForm({ initialValues, onSubmit, submitLabel = "Save Task", error }) {
  const { user } = useAuth();
  const isAdmin = user?.role === USER_ROLES.ADMIN;
  const mockUsers = useMemo(() => getMockUsers(), []);
  const [values, setValues] = useState({ ...initialState, ...initialValues });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const minDate = useMemo(() => new Date().toISOString().slice(0, 10), []);

  function updateField(field, value) {
    setValues((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: "" }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    const nextErrors = validateTask(values);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;

    setSubmitting(true);
    try {
      const payload = isAdmin
        ? { ...values, assignedTo: values.assignedTo || user.id }
        : values;
      await onSubmit(payload);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="panel space-y-5 p-5">
      <ErrorAlert message={error} />
      <div>
        <label className="field-label" htmlFor="title">
          Title
        </label>
        <input id="title" className="field-input" value={values.title} onChange={(event) => updateField("title", event.target.value)} />
        {errors.title && <p className="mt-1 text-xs text-rose-600">{errors.title}</p>}
      </div>
      <div>
        <label className="field-label" htmlFor="description">
          Description
        </label>
        <textarea
          id="description"
          rows="5"
          className="field-input resize-y"
          value={values.description}
          onChange={(event) => updateField("description", event.target.value)}
        />
        {errors.description && <p className="mt-1 text-xs text-rose-600">{errors.description}</p>}
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        <div>
          <label className="field-label" htmlFor="priority">
            Priority
          </label>
          <select id="priority" className="field-input" value={values.priority} onChange={(event) => updateField("priority", event.target.value)}>
            <option value={TASK_PRIORITY.LOW}>LOW</option>
            <option value={TASK_PRIORITY.MEDIUM}>MEDIUM</option>
            <option value={TASK_PRIORITY.HIGH}>HIGH</option>
          </select>
        </div>
        {isAdmin && (
          <div>
            <label className="field-label" htmlFor="status">
              Status
            </label>
            <select id="status" className="field-input" value={values.status} onChange={(event) => updateField("status", event.target.value)}>
              <option value={TASK_STATUS.TODO}>TODO</option>
              <option value={TASK_STATUS.IN_PROGRESS}>IN_PROGRESS</option>
              <option value={TASK_STATUS.DONE}>DONE</option>
            </select>
          </div>
        )}
        {isAdmin && (
          <div>
            <label className="field-label" htmlFor="assignedTo">
              Assigned To
            </label>
            <select id="assignedTo" className="field-input" value={values.assignedTo || user.id} onChange={(event) => updateField("assignedTo", event.target.value)}>
              {mockUsers.map((mockUser) => (
                <option key={mockUser.id} value={mockUser.id}>
                  {mockUser.name} ({mockUser.role})
                </option>
              ))}
            </select>
          </div>
        )}
        <div>
          <label className="field-label" htmlFor="dueDate">
            Due Date
          </label>
          <input
            id="dueDate"
            type="date"
            min={minDate}
            className="field-input"
            value={values.dueDate}
            onChange={(event) => updateField("dueDate", event.target.value)}
          />
          {errors.dueDate && <p className="mt-1 text-xs text-rose-600">{errors.dueDate}</p>}
        </div>
      </div>
      <div className="flex justify-end">
        <button type="submit" disabled={submitting} className="btn-primary">
          {submitting ? "Saving..." : submitLabel}
        </button>
      </div>
    </form>
  );
}

import { PRIORITY_LABELS, STATUS_LABELS } from "./constants";

export function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export function formatDate(value) {
  if (!value) return "No due date";
  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric"
  }).format(new Date(value));
}

export function formatDateTime(value) {
  if (!value) return "";
  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit"
  }).format(new Date(value));
}

export function getStatusLabel(status) {
  return STATUS_LABELS[status] || status;
}

export function getPriorityLabel(priority) {
  return PRIORITY_LABELS[priority] || priority;
}

export function isOverdue(task) {
  return task?.dueDate && task.status !== "DONE" && new Date(task.dueDate) < new Date();
}

export function sortTasks(tasks, sortBy) {
  const priorityRank = { HIGH: 3, MEDIUM: 2, LOW: 1 };
  const statusRank = { TODO: 1, IN_PROGRESS: 2, DONE: 3 };
  const copy = [...tasks];

  return copy.sort((a, b) => {
    if (sortBy === "dueDate") return new Date(a.dueDate || "9999-12-31") - new Date(b.dueDate || "9999-12-31");
    if (sortBy === "priority") return priorityRank[b.priority] - priorityRank[a.priority];
    if (sortBy === "status") return statusRank[a.status] - statusRank[b.status];
    if (sortBy === "title") return a.title.localeCompare(b.title);
    return new Date(b.createdAt) - new Date(a.createdAt);
  });
}

export function makeId(prefix = "id") {
  const randomId = globalThis.crypto?.randomUUID ? globalThis.crypto.randomUUID() : `${Date.now()}-${Math.random().toString(16).slice(2)}`;
  return `${prefix}-${randomId}`;
}

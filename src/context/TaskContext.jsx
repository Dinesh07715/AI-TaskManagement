import React, { createContext, useCallback, useMemo, useState } from "react";
import { taskService } from "../services/taskService";
import { USER_ROLES } from "../utils/constants";

export const TaskContext = createContext(null);

export function TaskProvider({ children }) {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const loadTasks = useCallback(async (user) => {
    if (!user) {
      setTasks([]);
      return [];
    }
    setLoading(true);
    setError("");
    try {
      const data = await taskService.getTasks(user);
      console.log("getTasks result:", data, typeof data); // debug — remove after fix confirmed
      const normalized = Array.isArray(data) ? data : data?.tasks ?? data?.data ?? [];
      setTasks(normalized);
      return normalized;
    } catch (err) {
      setError(err.message || "Unable to load tasks");
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  const getTask = useCallback(async (id, user) => taskService.getTaskById(id, user), []);

  const createTask = useCallback(async (payload, user) => {
    const task = await taskService.createTask(payload, user);
    setTasks((current) => [task, ...current]);
    return task;
  }, []);

  const updateTask = useCallback(async (id, payload, user) => {
    const task = await taskService.updateTask(id, payload, user);
    setTasks((current) => current.map((item) => (item.id === id ? task : item)));
    return task;
  }, []);

  const deleteTask = useCallback(async (id, user) => {
    await taskService.deleteTask(id, user);
    setTasks((current) => current.filter((task) => task.id !== id));
  }, []);

  const stats = useMemo(() => {
    const safeTasks = Array.isArray(tasks) ? tasks : [];
    return {
      total: safeTasks.length,
      todo: safeTasks.filter((t) => t.status === "TODO").length,
      inProgress: safeTasks.filter((t) => t.status === "IN_PROGRESS").length,
      done: safeTasks.filter((t) => t.status === "DONE").length,
    };
  }, [tasks]);

  const value = useMemo(
    () => ({
      tasks,
      loading,
      error,
      stats,
      loadTasks,
      getTask,
      createTask,
      updateTask,
      deleteTask,
      canViewUsers: (user) => user?.role === USER_ROLES.ADMIN,
      canManageTask: (task, user) =>
        user?.role === USER_ROLES.ADMIN || task?.createdBy === user?.id,
      canUpdateTaskStatus: (_task, user) => user?.role === USER_ROLES.ADMIN,
      canAssignTasks: (user) => user?.role === USER_ROLES.ADMIN,
    }),
    [createTask, deleteTask, error, getTask, loadTasks, loading, stats, tasks, updateTask]
  );

  return <TaskContext.Provider value={value}>{children}</TaskContext.Provider>;
}
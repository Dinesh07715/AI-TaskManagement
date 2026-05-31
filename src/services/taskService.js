import apiClient from "./apiClient";
import { mockTasks } from "../mock/mockTasks";
import { getMockUsers } from "../mock/mockUsers";
import { TASKS_KEY, USE_MOCK_DATA, USER_ROLES } from "../utils/constants";
import { makeId } from "../utils/helpers";

const delay = (value) => new Promise((resolve) => setTimeout(() => resolve(value), 200));

function readTasks() {
  const stored = localStorage.getItem(TASKS_KEY);
  if (stored) {
    try {
      return normalizeTasks(JSON.parse(stored));
    } catch (error) {
      localStorage.removeItem(TASKS_KEY);
    }
  }
  writeTasks(mockTasks);
  return normalizeTasks(mockTasks);
}

function writeTasks(tasks) {
  localStorage.setItem(TASKS_KEY, JSON.stringify(tasks));
}

function getUserName(userId) {
  return getMockUsers().find((user) => user.id === userId)?.name || "Unassigned";
}

function normalizeTasks(tasks) {
  return tasks.map((task) => {
    const createdBy = task.createdBy || task.ownerId;
    const assignedTo = task.assignedTo || task.ownerId || createdBy;

    return {
      ...task,
      createdBy,
      assignedTo,
      createdByName: task.createdByName || task.ownerName || getUserName(createdBy),
      assignedToName: task.assignedToName || getUserName(assignedTo),
      ownerId: task.ownerId || createdBy,
      ownerName: task.ownerName || getUserName(createdBy)
    };
  });
}

function visibleTasks(tasks, user) {
  if (user?.role === USER_ROLES.ADMIN) return tasks;
  return tasks.filter((task) => task.createdBy === user?.id || task.assignedTo === user?.id);
}

function canEditTask(task, user) {
  return user?.role === USER_ROLES.ADMIN || task.createdBy === user?.id;
}

function canDeleteTask(task, user) {
  return user?.role === USER_ROLES.ADMIN || task.createdBy === user?.id;
}

export const taskService = {
  async getTasks(user) {
    if (!USE_MOCK_DATA) {
      const { data } = await apiClient.get("/tasks");
      return data;
    }
    return delay(visibleTasks(readTasks(), user));
  },

  async getTaskById(id, user) {
    if (!USE_MOCK_DATA) {
      const { data } = await apiClient.get(`/tasks/${id}`);
      return data;
    }
    const task = visibleTasks(readTasks(), user).find((item) => item.id === id);
    if (!task) throw new Error("Task not found");
    return delay(task);
  },

  async createTask(payload, user) {
    if (!USE_MOCK_DATA) {
      const { data } = await apiClient.post("/tasks", payload);
      return data;
    }
    const task = {
      ...payload,
      id: makeId("task"),
      createdAt: new Date().toISOString(),
      createdBy: user.id,
      assignedTo: user.role === USER_ROLES.ADMIN ? payload.assignedTo || user.id : user.id,
      createdByName: user.name,
      assignedToName: getUserName(user.role === USER_ROLES.ADMIN ? payload.assignedTo || user.id : user.id),
      ownerId: user.id,
      ownerName: user.name
    };
    const tasks = [task, ...readTasks()];
    writeTasks(tasks);
    return delay(task);
  },

  async updateTask(id, payload, user) {
    if (!USE_MOCK_DATA) {
      const { data } = await apiClient.put(`/tasks/${id}`, payload);
      return data;
    }
    const allTasks = readTasks();
    const existing = allTasks.find((task) => task.id === id);
    if (!existing || !canEditTask(existing, user)) throw new Error("Task not found");
    const isAdmin = user.role === USER_ROLES.ADMIN;
    const permittedPayload = isAdmin
      ? payload
      : {
          title: payload.title,
          description: payload.description,
          priority: payload.priority,
          dueDate: payload.dueDate
        };
    const nextAssignedTo = isAdmin ? permittedPayload.assignedTo || existing.assignedTo : existing.assignedTo;
    const updated = {
      ...existing,
      ...permittedPayload,
      status: isAdmin ? permittedPayload.status || existing.status : existing.status,
      assignedTo: nextAssignedTo,
      assignedToName: getUserName(nextAssignedTo),
      createdByName: getUserName(existing.createdBy),
      ownerId: existing.createdBy,
      ownerName: getUserName(existing.createdBy)
    };
    writeTasks(allTasks.map((task) => (task.id === id ? updated : task)));
    return delay(updated);
  },

  async deleteTask(id, user) {
    if (!USE_MOCK_DATA) {
      await apiClient.delete(`/tasks/${id}`);
      return true;
    }
    const allTasks = readTasks();
    const existing = allTasks.find((task) => task.id === id);
    if (!existing || !canDeleteTask(existing, user)) throw new Error("Task not found");
    writeTasks(allTasks.filter((task) => task.id !== id));
    return delay(true);
  }
};

import apiClient from "./apiClient";
import { getMockUsers, saveRegisteredUser } from "../mock/mockUsers";
import {
  ROLE_KEY,
  TOKEN_KEY,
  USE_MOCK_DATA,
  USER_KEY,
  USER_ROLES
} from "../utils/constants";
import { makeId } from "../utils/helpers";

const delay = (value) =>
  new Promise((resolve) => setTimeout(() => resolve(value), 250));

const LEGACY_USER_KEY = "ai_task_portal_user";

function clearSharedAuthStorage() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
  localStorage.removeItem(LEGACY_USER_KEY);
  localStorage.removeItem(ROLE_KEY);
}

function storeSession(token, user) {
  sessionStorage.setItem(TOKEN_KEY, token);
  sessionStorage.setItem(USER_KEY, JSON.stringify(user));
  sessionStorage.setItem(ROLE_KEY, user.role);

  clearSharedAuthStorage();

  console.log("[auth] Stored tab-scoped session for role:", user.role);
}

function publicUser(user) {
  const { password, ...safeUser } = user;
  return safeUser;
}

export const authService = {
  async login(credentials) {
    if (!USE_MOCK_DATA) {
      const response = await apiClient.post("/auth/login", credentials);

      const token = response?.data?.data?.token;
      const user = response?.data?.data?.user;

      if (!token || !user) {
        throw new Error(
          response?.data?.message || "Invalid login response from server"
        );
      }

      storeSession(token, user);

      console.log("Logged User:", user);
      console.log("Role:", user?.role);

      return {
        token,
        user
      };
    }

    const user = getMockUsers().find(
      (item) =>
        item.email.toLowerCase() === credentials.email.toLowerCase() &&
        item.password === credentials.password
    );

    if (!user) {
      throw new Error("Invalid email or password");
    }

    const token = `mock-jwt-${user.id}-${Date.now()}`;
    const safeUser = publicUser(user);

    console.log("Logged User:", safeUser);
    console.log("Role:", safeUser?.role);

    storeSession(token, safeUser);

    return delay({
      token,
      user: safeUser
    });
  },

  async register(values) {
    if (!USE_MOCK_DATA) {
      const response = await apiClient.post("/auth/register", values);

      const token = response?.data?.data?.token;
      const user = response?.data?.data?.user;

      if (!token || !user) {
        throw new Error(
          response?.data?.message || "Invalid registration response from server"
        );
      }

      storeSession(token, user);

      console.log("Registered User:", user);
      console.log("Role:", user?.role);

      return {
        token,
        user
      };
    }

    const exists = getMockUsers().some(
      (item) =>
        item.email.toLowerCase() === values.email.toLowerCase()
    );

    if (exists) {
      throw new Error("An account with this email already exists");
    }

    const user = {
      id: makeId("user"),
      name: values.name,
      email: values.email,
      password: values.password,
      role: USER_ROLES.USER,
      department: "General"
    };

    const token = `mock-jwt-${user.id}-${Date.now()}`;

    saveRegisteredUser(user);

    const safeUser = publicUser(user);

    storeSession(token, safeUser);

    return delay({
      token,
      user: safeUser
    });
  },

  logout() {
    try {
      sessionStorage.removeItem(TOKEN_KEY);
      sessionStorage.removeItem(USER_KEY);
      sessionStorage.removeItem(ROLE_KEY);

      clearSharedAuthStorage();
    } catch (error) {
      console.error("Logout cleanup error:", error);
    }
  },

  getStoredSession() {
    try {
      const token = sessionStorage.getItem(TOKEN_KEY);
      const user = sessionStorage.getItem(USER_KEY);

      if (!token || !user) {
        console.log(
          "[auth] No tab-scoped session found. Shared localStorage auth is ignored."
        );

        clearSharedAuthStorage();

        return null;
      }

      const parsedUser = JSON.parse(user);

      console.log("Logged User:", parsedUser);
      console.log("Role:", parsedUser?.role);

      return {
        token,
        user: parsedUser
      };
    } catch (error) {
      authService.logout();
      return null;
    }
  }
};
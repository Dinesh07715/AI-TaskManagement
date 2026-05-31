import React, {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { initializeMockUsers } from "../mock/mockUsers";
import { authService } from "../services/authService";

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    initializeMockUsers();
    const session = authService.getStoredSession();
    if (session) {
      console.log("Logged User:", session.user);
      console.log("Role:", session.user?.role);
      setUser(session.user);
      setToken(session.token);
    }
    setLoading(false);
  }, []);

  const login = useCallback(async (values) => {
    setError("");
    const session = await authService.login(values);
    console.log("Logged User:", session.user);
    console.log("Role:", session.user?.role);
    setUser(session.user);
    setToken(session.token);
    return session.user;
  }, []);

  const register = useCallback(async (values) => {
    setError("");
    const session = await authService.register(values);
    setUser(session.user);
    setToken(session.token);
    return session.user;
  }, []);

  const logout = useCallback(() => {
    authService.logout();
    setUser(null);
    setToken(null);
  }, []);

  const value = useMemo(
    () => ({
      user,
      token,
      loading,
      error,
      setError,
      isAuthenticated: Boolean(user && token),
      login,
      register,
      logout,
    }),
    [error, loading, login, logout, register, token, user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
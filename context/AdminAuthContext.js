"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  adminLogin as loginRequest,
  clearAdminSession,
  fetchAdminProfile,
  getAdminUser,
} from "../lib/api/admin-client";

const AdminAuthContext = createContext(null);

export function AdminAuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const bootstrap = useCallback(async () => {
    setIsLoading(true);

    try {
      const cachedUser = getAdminUser();
      if (cachedUser) {
        setUser(cachedUser);
      }

      const profile = await fetchAdminProfile();
      setUser(profile);
    } catch {
      clearAdminSession();
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    bootstrap();
  }, [bootstrap]);

  const login = useCallback(async (email, password) => {
    const data = await loginRequest(email, password);
    setUser(data.user);
    return data;
  }, []);

  const logout = useCallback(() => {
    clearAdminSession();
    setUser(null);
  }, []);

  const value = useMemo(
    () => ({
      user,
      isLoading,
      isAuthenticated: Boolean(user),
      login,
      logout,
      refreshSession: bootstrap,
    }),
    [user, isLoading, login, logout, bootstrap],
  );

  return (
    <AdminAuthContext.Provider value={value}>{children}</AdminAuthContext.Provider>
  );
}

export function useAdminAuth() {
  const context = useContext(AdminAuthContext);

  if (!context) {
    throw new Error("useAdminAuth must be used within AdminAuthProvider");
  }

  return context;
}

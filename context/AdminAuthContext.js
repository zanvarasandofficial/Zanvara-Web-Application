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
  adminLogin,
  adminRequestOtp,
  adminVerifyOtp,
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

      if (cachedUser?.role === "ADMIN") {
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
    const data = await adminLogin(email, password);

    if (data.isAdmin) {
      setUser(data.user);
    }

    return data;
  }, []);

  const sendOtp = useCallback(async (email, name) => {
    return adminRequestOtp(email, name);
  }, []);

  const verifyOtp = useCallback(async (email, code, name, password) => {
    const data = await adminVerifyOtp(email, code, name, password);

    if (data.isAdmin) {
      setUser(data.user);
    }

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
      sendOtp,
      verifyOtp,
      logout,
      refreshSession: bootstrap,
    }),
    [user, isLoading, login, sendOtp, verifyOtp, logout, bootstrap],
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

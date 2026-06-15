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
  clearCustomerSession,
  fetchCustomerProfile,
  getCustomerUser,
  setCustomerSession,
  verifyEmailOtp,
  requestEmailOtp,
  updateCustomerProfile,
} from "../lib/api/customer-auth";

const CustomerAuthContext = createContext(null);

export function CustomerAuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const bootstrap = useCallback(async () => {
    setIsLoading(true);

    try {
      const cachedUser = getCustomerUser();
      if (cachedUser) {
        setUser(cachedUser);
      }

      const profile = await fetchCustomerProfile();
      setUser(profile);
    } catch {
      clearCustomerSession();
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    bootstrap();
  }, [bootstrap]);

  const completeSession = useCallback((accessToken, nextUser) => {
    setCustomerSession(accessToken, nextUser);
    setUser(nextUser);
  }, []);

  const sendOtp = useCallback(async (email, name) => {
    return requestEmailOtp(email, name);
  }, []);

  const verifyOtp = useCallback(async (email, code, name) => {
    const data = await verifyEmailOtp(email, code, name);
    setUser(data.user);
    return data;
  }, []);

  const updateProfile = useCallback(async (name) => {
    const profile = await updateCustomerProfile(name);
    setUser(profile);
    return profile;
  }, []);

  const logout = useCallback(() => {
    clearCustomerSession();
    setUser(null);
  }, []);

  const value = useMemo(
    () => ({
      user,
      isLoading,
      isAuthenticated: Boolean(user),
      sendOtp,
      verifyOtp,
      updateProfile,
      completeSession,
      logout,
      refreshSession: bootstrap,
    }),
    [user, isLoading, sendOtp, verifyOtp, updateProfile, completeSession, logout, bootstrap],
  );

  return (
    <CustomerAuthContext.Provider value={value}>{children}</CustomerAuthContext.Provider>
  );
}

export function useCustomerAuth() {
  const context = useContext(CustomerAuthContext);

  if (!context) {
    throw new Error("useCustomerAuth must be used within CustomerAuthProvider");
  }

  return context;
}

"use client";

import { useState, useEffect, useCallback, createContext, useContext } from "react";
import type { ReactNode } from "react";
import { authApi } from "@/lib/api/authApi";
import { clearToken, setToken } from "@/lib/api/client";
import type { User, AuthCredentials, RegisterPayload } from "@/types";

interface AuthContextValue {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (credentials: AuthCredentials) => Promise<void>;
  register: (payload: RegisterPayload) => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const refreshUser = useCallback(async () => {
    try {
      const me = await authApi.getMe();
      setUser(me);
    } catch {
      setUser(null);
    }
  }, []);

  useEffect(() => {
    refreshUser().finally(() => setIsLoading(false));
  }, [refreshUser]);

  const login = useCallback(async (credentials: AuthCredentials) => {
    const res = await authApi.login(credentials);
    setToken(res.accessToken);
    setUser(res.user);
  }, []);

  const register = useCallback(async (payload: RegisterPayload) => {
    const res = await authApi.register(payload);
    setToken(res.accessToken);
    setUser(res.user);
  }, []);

  const logout = useCallback(() => {
    authApi.logout();
    clearToken();
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, isLoading, isAuthenticated: !!user, login, register, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}

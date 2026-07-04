import React, { createContext, useContext, useEffect, useMemo, useState, useCallback } from "react";
import { api } from "../lib/api";

const AuthContext = createContext({
  user: null,
  loading: true,
  refreshUser: async () => {},
  logout: () => {},
});

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    refreshUser();
  }, []);

  const refreshUser = useCallback(async () => {
    try {
      const token = localStorage.getItem("accessToken") || localStorage.getItem("nestmate_token");
      if (!token) {
        setUser(null);
        setLoading(false);
        return;
      }

      const res = await api.get("/api/v1/users/me");
      setUser(res.data.data || null);
      setLoading(false);
    } catch (err) {
      // Token invalid/expired
      localStorage.removeItem("accessToken");
      localStorage.removeItem("nestmate_token");
      setUser(null);
      setLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("nestmate_token");
    setUser(null);
  }, []);

  const value = useMemo(() => ({ user, loading, refreshUser, logout }), [user, loading, refreshUser, logout]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}

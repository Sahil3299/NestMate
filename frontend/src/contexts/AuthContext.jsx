import React, { createContext, useContext, useEffect, useMemo, useState, useCallback } from "react";
import { api } from "../lib/api";
import { initSocket, disconnectSocket } from "../lib/socket";

let socketInitialized = false;

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
    return () => { disconnectSocket(); socketInitialized = false; };
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

      if (!socketInitialized && res.data.data) {
        initSocket();
        socketInitialized = true;
      }
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
    socketInitialized = false;
    disconnectSocket();
    setUser(null);
  }, []);

  const value = useMemo(() => ({ user, loading, refreshUser, logout }), [user, loading, refreshUser, logout]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}

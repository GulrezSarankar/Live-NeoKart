import React, { createContext, useState, useEffect, useContext } from "react";
import axiosInstance from "../api/axiosInstance";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token") || null);
  const [loadingUser, setLoadingUser] = useState(false);

  // Fetch user when token changes
  useEffect(() => {
    if (token) fetchUser();
    else setUser(null);
  }, [token]);

  const fetchUser = async () => {
    setLoadingUser(true);
    try {
      const res = await axiosInstance.get("/api/user/me"); // backend endpoint
      setUser(res.data);
    } catch (err) {
      console.error("Failed to fetch user:", err);
      logout(); // clear token if invalid
    } finally {
      setLoadingUser(false);
    }
  };

  const login = (newToken) => {
    localStorage.setItem("token", newToken);
    setToken(newToken);
    fetchUser();
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, loadingUser, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);

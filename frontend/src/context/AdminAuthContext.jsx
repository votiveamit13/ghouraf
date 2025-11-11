import axios from "axios";
import React, { createContext, useContext, useEffect, useState } from "react";

const AdminAuthContext = createContext();

export const AdminAuthProvider = ({ children }) => {
  const apiUrl = process.env.REACT_APP_API_URL;
  const [token, setToken] = useState(localStorage.getItem("authToken") || "");
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 200);
    return () => clearTimeout(timer);
  }, []);

const fetchAdminProfile = async () => {
  if (!token) return;

  try {
    const res = await axios.get(`${apiUrl}admin/profile`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    const adminData = res.data?.admin || res.data || null;
    setAdmin(adminData);
  } catch (error) {
    console.error("Failed to fetch admin profile:", error);
    setAdmin(null);
  }
};


  useEffect(() => {
    if (token) fetchAdminProfile();
  }, [token]);

  const login = (tokenValue) => {
    console.log("Storing token:", tokenValue);
    localStorage.setItem("authToken", tokenValue);
    setToken(tokenValue);
  };

  const logout = () => {
    localStorage.removeItem("authToken");
    setToken("");
  };

  const refreshAdmin = async () => {
    await fetchAdminProfile();
  };

  return (
    <AdminAuthContext.Provider
      value={{ token, admin, login, logout, loading, refreshAdmin }}
    >
      {children}
    </AdminAuthContext.Provider>
  );
};

export const useAdminAuth = () => useContext(AdminAuthContext);

import React, { createContext, useContext, useEffect, useState } from "react";

const AdminAuthContext = createContext();

export const AdminAuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem("authToken") || "");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 200);
    return () => clearTimeout(timer);
  }, []);

  const login = (tokenValue) => {
    console.log("Storing token:", tokenValue);
    localStorage.setItem("authToken", tokenValue);
    setToken(tokenValue);
  };

  const logout = () => {
    localStorage.removeItem("authToken");
    setToken("");
  };

  return (
    <AdminAuthContext.Provider value={{ token, login, logout, loading }}>
      {children}
    </AdminAuthContext.Provider>
  );
};

export const useAdminAuth = () => useContext(AdminAuthContext);

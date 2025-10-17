import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { useAdminAuth } from "context/AdminAuthContext";

export default function AdminPrivateRoute({ children }) {
  const { token, logout, loading } = useAdminAuth();
  const [isValid, setIsValid] = useState(true);

  const validateToken = () => {
    if (!token) return false;
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      return payload.exp * 1000 > Date.now();
    } catch (err) {
      return false;
    }
  };

  useEffect(() => {
    const checkToken = () => {
      const valid = validateToken();
      if (!valid) {
        logout();
        setIsValid(false);
      } else {
        setIsValid(true);
      }
    };

    checkToken();

    const handleStorage = (e) => {
      if (e.key === "authToken") checkToken();
    };
    window.addEventListener("storage", handleStorage);

    const interval = setInterval(checkToken, 1000);

    return () => {
      clearInterval(interval);
      window.removeEventListener("storage", handleStorage);
    };
  }, [token, logout]);

  if (loading) return null;

  if (!token || !isValid) return <Navigate to="/admin/login" replace />;

  return children;
}

import React, { useEffect } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { toast } from "react-toastify";
import { useAuth } from "context/AuthContext";

export default function PrivateRoute() {
  const { user, token, loading } = useAuth();

  useEffect(() => {
    if (!loading) {
      if (!token) {
        toast.warning("Login first");
      } else if (token && !user) {
        toast.error("Session timeout");
      }
    }
  }, [token, user, loading]);

  if (loading) return null;

  if (token && !user) {
    return <Navigate to="/" replace />;
  }

  if (!token) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}

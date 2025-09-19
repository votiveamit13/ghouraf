import React, { useEffect } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { toast } from "react-toastify";

const isAuthenticated = () => {
  return !!localStorage.getItem("token");
};

export default function PrivateRoute() {
  const auth = isAuthenticated();

  useEffect(() => {
    if (!auth) {
      toast.warning("Login first");
    }
  }, [auth]);

  if (!auth) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}

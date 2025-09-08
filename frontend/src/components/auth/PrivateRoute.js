import React from 'react';
import { Navigate, Outlet } from "react-router-dom";
import { toast } from 'react-toastify';

const isAuthenticated = () => {
    return localStorage.getItem("token");
};

export default function PrivateRoute(){
        if (!isAuthenticated()) {
        toast.warning("Login first");
        return <Navigate to="/" replace />;
    }

    return <Outlet />;
}
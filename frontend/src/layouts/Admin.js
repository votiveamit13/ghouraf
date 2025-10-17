import React, { useRef, useEffect } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import AdminNavbar from "components/admin/Navbars/AdminNavbar";
import Sidebar from "components/admin/Sidebar/Sidebar";
import routes from "routes.js";

const AdminLayout = () => {
  const location = useLocation();
  const mainContent = useRef(null);

  useEffect(() => {
    document.documentElement.scrollTop = 0;
    document.scrollingElement.scrollTop = 0;
    if (mainContent.current) mainContent.current.scrollTop = 0;
  }, [location]);

  const getRoutes = (routesArray) => {
    return routesArray.flatMap((route, key) => {
      if (route.subRoutes) return getRoutes(route.subRoutes);
      if (route.layout === "/admin") {
        return <Route path={route.path} element={route.component} key={route.path || key} />;
      }
      return [];
    });
  };

  return (
    <div className="admin-layout">
      <Sidebar
        routes={routes}
        logo={{
          innerLink: "/admin",
          imgSrc: require("../assets/img/theme/Ghouraf.png"),
          imgAlt: "Logo",
        }}
      />
      <div className="main-content" ref={mainContent}>
        <AdminNavbar brandText="Admin Dashboard" />
        <Routes>
          {getRoutes(routes)}
          <Route path="*" element={<Navigate to="/admin" replace />} />
        </Routes>
      </div>
    </div>
  );
};

export default AdminLayout;

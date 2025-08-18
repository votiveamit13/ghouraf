
import React from "react";
import { useLocation, Route, Routes, Navigate } from "react-router-dom";
import AdminNavbar from "components/admin/Navbars/AdminNavbar.js";
import Sidebar from "components/admin/Sidebar/Sidebar.js";

import routes from "routes.js";

const Admin = (props) => {
  const location = useLocation();
  const mainContent = React.useRef(null);

  const isAuthenticated = !!localStorage.getItem("authToken");
  const isLoginPage = location.pathname === "/admin/login";

  React.useEffect(() => {
    document.documentElement.scrollTop = 0;
    document.scrollingElement.scrollTop = 0;
    if (mainContent.current) {
      mainContent.current.scrollTop = 0;
    }
  }, [location]);

  if (!isAuthenticated && !isLoginPage) {
    return <Navigate to="/admin/login" replace />;
  }

  const getRoutes = (routes) => {
    return routes.map((prop, key) => {
      if (prop.layout === "/admin") {
        return (
          <Route path={prop.path} element={prop.component} key={key} exact />
        );
      } else {
        return null;
      }
    });
  };

  const getBrandText = (path) => {
    for (let i = 0; i < routes.length; i++) {
      if (
        props?.location?.pathname.indexOf(routes[i].layout + routes[i].path) !==
        -1
      ) {
        return routes[i].name;
      }
    }
    return "Brand";
  };

  return (
    <>
      {!isLoginPage && (
        <Sidebar
          {...props}
          routes={routes}
          logo={{
            innerLink: "/admin/index",
            imgSrc: require("../assets/img/theme/Ghouraf.png"),
            imgAlt: "...",
          }}
        />
      )}
      <div className="main-content mb-5" ref={mainContent}>
        {!isLoginPage && (
          <AdminNavbar
            {...props}
            brandText={getBrandText(props?.location?.pathname)}
          />
        )}
        <Routes>
          {getRoutes(routes)}
          <Route path="*" element={<Navigate to="/admin/index" replace />} />
        </Routes>
      </div>
    </>
  );
};

export default Admin;

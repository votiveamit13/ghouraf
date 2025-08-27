
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import "assets/plugins/nucleo/css/nucleo.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "assets/scss/argon-dashboard-react.scss";
import './tailwind.css';
import AdminLayout from "layouts/Admin.js";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Home from "pages/public/HomePage/page";
import Public from "layouts/Public";
import UserDashboard from "pages/user/page";
import PrivateRoute from "components/auth/PrivateRoute";
import { AuthProvider } from "context/AuthContext";
import EditMyDetails from "pages/user/edit-my-details/page";
import AuthVerified from "pages/authverified/AuthVerified";
const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <BrowserRouter>
    <AuthProvider>
      <Routes>
        <Route path="/admin/*" element={<AdminLayout />} />
        <Route path="/" element={<Public><Home/></Public>} />
        <Route path="/auth/verified" element={<AuthVerified/>} />
        <Route element={<PrivateRoute/>}>
          <Route path="/user" element={<Public><UserDashboard/></Public>} />
          <Route path="/user/edit-my-details" element={<Public><EditMyDetails/></Public>} />
        </Route>
      </Routes>
    <ToastContainer
      position="bottom-right"
      autoClose={3000}
      hideProgressBar={false}
      newestOnTop={false}
      closeOnClick
      pauseOnHover
      draggable
      theme="colored"
    />
     </AuthProvider>
  </BrowserRouter>
);

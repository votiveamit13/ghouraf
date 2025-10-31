
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router-dom";
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
import MyAds from "pages/user/my-ads/page";
import SavedAds from "pages/user/saved-ads/page";
import Spaces from "pages/public/spaces/page";
import AboutUs from "pages/public/aboutus/page";
import ContactUs from "pages/public/contactus/page";
import Faqs from "pages/public/faq/page";
import DetailPage from "pages/public/spaces/addetailpage/page";
import RoomWantedAd from "pages/user/room-wanted-post/page";
import PostSpace from "pages/user/post-space/page";
import PlaceWanted from "pages/public/placewanted/page";
import TeamUp from "pages/public/teamup/page";
import TeamUpAd from "pages/user/team-up-post/page";
import Messages from "pages/user/messages/page";
import ThankYouDialog from "components/common/ThankYouDialog";
import SpaceWantedDetailPage from "pages/public/placewanted/detail-page/page";
import TeamUpDetailPage from "pages/public/teamup/detail-page/page";
import { AdminAuthProvider } from "context/AdminAuthContext";
import AdminPrivateRoute from "components/auth/AdminPrivateRoute";
import LoginPage from "pages/admin/login/page";
import PrivacyPolicy from "pages/public/privacypolicy/page";
import TermsConditions from "pages/public/termsandconditions/page";
import SafetyTips from "pages/public/safetytips/page";
import Advice from "pages/public/advice/page";
const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <BrowserRouter>
    <AuthProvider>
      <AdminAuthProvider>
      <Routes>
          <Route path="/admin/login" element={<LoginPage />} />
          <Route
            path="/admin/*"
            element={
              <AdminPrivateRoute>
                <AdminLayout />
              </AdminPrivateRoute>
            }
          />

        <Route path="/" element={<Public><Home /></Public>} />
        <Route path="/spaces" element={<Public><Spaces /></Public>} />
        <Route path="/spaces/:id" element={<Public><DetailPage /></Public>} />
        <Route path="/place-wanted" element={<Public><PlaceWanted/></Public>} />
        <Route path="/place-wanted/:id" element={<Public><SpaceWantedDetailPage /></Public>} />
        <Route path="/team-up" element={<Public><TeamUp/></Public>} />
        <Route path="/team-up/:id" element={<Public><TeamUpDetailPage/></Public>} />
        <Route path="/about-us" element={<Public><AboutUs /></Public>} />
        <Route path="/contact-us" element={<Public><ContactUs /></Public>} />
        <Route path="/faq" element={<Public><Faqs /></Public>} />
        <Route path="/privacy-policy" element={<Public><PrivacyPolicy /></Public>} />
        <Route path="/terms-and-conditions" element={<Public><TermsConditions/></Public>} />
        <Route path="/safety-tips" element={<Public><SafetyTips/></Public>} />
        <Route path="/advice" element={<Public><Advice/></Public>} />
        <Route path="/auth/verified" element={<Public><AuthVerified /></Public>} />
        <Route element={<PrivateRoute />}>
          <Route path="/user" element={<Public><UserDashboard /></Public>} />
          <Route path="/user/edit-my-details" element={<Public><EditMyDetails /></Public>} />
          <Route path="/user/my-ads" element={<Public><MyAds /></Public>} />
          <Route path="/user/saved-ads" element={<Public><SavedAds /></Public>} />
          <Route path="/user/place-wanted-ad" element={<Public><RoomWantedAd /></Public>} />
          <Route path="/user/post-an-space" element={<Public><PostSpace/></Public>} />
          <Route path="/user/team-up-post" element={<Public><TeamUpAd/></Public>} />
          <Route path="/user/thank-you" element={<Public><ThankYouDialog/></Public>} />
          <Route path="/user/messages" element={<Public><Messages/></Public>} />
          <Route path="/user/messages/:chatId" element={<Public><Messages/></Public>} />
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
      </AdminAuthProvider>
    </AuthProvider>
  </BrowserRouter>
);

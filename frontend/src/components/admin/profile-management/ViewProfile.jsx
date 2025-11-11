import { FaArrowLeftLong } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";
import defaultImage from "assets/img/ghouraf/default-avatar.png";
import Header from "../Headers/Header";
import axios from "axios";
import { useEffect, useState } from "react";
import Loader from "components/common/Loader";

export default function ViewProfile() {
  const navigate = useNavigate();
  const apiUrl = process.env.REACT_APP_API_URL;
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem("authToken");
      const res = await axios.get(`${apiUrl}admin/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAdmin(res.data);
    } catch (error) {
      console.error("Failed to fetch admin profile:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loader />;

  return (
    <>
      <Header />
      <div className="px-[40px] mt-[-8%] w-full fluid position-relative">
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="px-3 py-[20px] border-b border-gray-200 d-flex justify-between">
            <h3 className="text-lg font-semibold text-gray-800">My Profile</h3>
            <button
              className="d-flex items-center gap-2 text-sm text-blue-600 hover:text-blue-800"
              onClick={() => navigate("/admin/edit-profile")}
            >
              <FaArrowLeftLong /> Edit Profile
            </button>
          </div>

          <div className="row g-3 p-4">
            <div className="col-md-12 text-center mb-4">
              <img
                src={
                  admin?.profile?.photo
                    ? `${apiUrl.replace("/api/", "")}${admin.profile.photo}`
                    : defaultImage
                }
                alt="Profile"
                className="w-24 h-24 rounded-circle object-cover border shadow-sm"
              />
            </div>

            <div className="col-md-12 mb-3">
              <div className="d-flex border-bottom pb-2">
                <span className="fw-semibold me-2 text-gray-600">First Name:</span>
                <span>{admin?.profile?.firstName || "-"}</span>
              </div>
            </div>

            <div className="col-md-12 mb-3">
              <div className="d-flex border-bottom pb-2">
                <span className="fw-semibold me-2 text-gray-600">Last Name:</span>
                <span>{admin?.profile?.lastName || "-"}</span>
              </div>
            </div>

            <div className="col-md-12 mb-3">
              <div className="d-flex border-bottom pb-2">
                <span className="fw-semibold me-2 text-gray-600">Email Id:</span>
                <span>{admin?.email || "-"}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

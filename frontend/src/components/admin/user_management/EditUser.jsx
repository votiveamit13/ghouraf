import Header from "../Headers/Header";
import { FaArrowLeftLong } from "react-icons/fa6";
import { FiEdit } from "react-icons/fi";
import { useNavigate, useLocation } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import defaultImage from "assets/img/ghouraf/default-avatar.png";

export default function EditUser() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const user = state?.user;
  const apiUrl = process.env.REACT_APP_API_URL;
  const [isSaving, setIsSaving] = useState(false);

  const formatDate = (dateString) => {
    if (!dateString) return "";
    return new Date(dateString).toISOString().split("T")[0];
  };

  const [formData, setFormData] = useState({
    firstName: user?.profile?.firstName || "",
    lastName: user?.profile?.lastName || "",
    email: user?.email || "",
    mobile: user?.profile?.mobile || "",
    age: user?.profile?.age || "",
    gender: user?.profile?.gender || "",
    dob: formatDate(user?.profile?.dob),
    termsAccepted: user?.termsAccepted || false,
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [photo, setPhoto] = useState(null);

  if (!user) return <p>No user selected</p>;

  const calculateAge = (dob) => {
    if (!dob) return "";
    const today = new Date();
    const birthDate = new Date(dob);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => {
      let updated = {
        ...prev,
        [name]: type === "checkbox" ? checked : value,
      };
      if (name === "dob") {
        updated.age = calculateAge(value);
      }
      return updated;
    });
  };
  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setPhoto(e.target.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      const data = new FormData();
      Object.keys(formData).forEach((key) => {
        if (formData[key] !== "") {
          data.append(key, formData[key]);
        }
      });

      if (photo) {
        data.append("photo", photo);
      }

      const token = localStorage.getItem("authToken");
      await axios.patch(
        `${apiUrl}/admin/users/${user._id}`,
        data,
        {
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      toast.success("User updated successfully!");
      navigate("/admin/user-management");
    } catch (err) {
      console.error("Update error:", err);
      toast.error(err.response?.data?.message || "Failed to update user");
    } finally {
      setIsSaving(false);
    }
  };


  return (
    <>
      <Header />
      <div className="px-[40px] mt-[-8%] w-full fluid position-relative">
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="px-3 py-[20px] border-b border-gray-200 d-flex justify-between">
            <h3 className="text-lg font-semibold text-gray-800">Edit Details</h3>
            <button
              className="d-flex items-center gap-2 text-sm text-blue-600 hover:text-blue-800"
              onClick={() => navigate("/admin/user-management")}
            >
              <FaArrowLeftLong /> Back
            </button>
          </div>

          <form className="p-4 space-y-4" onSubmit={handleSubmit}>
            <div className="row g-3">
              <div className="col-md-12 relative mb-4">
                <img
                  src={photo ? URL.createObjectURL(photo) : user?.profile?.photo || defaultImage}
                  alt="Profile"
                  className="w-20 h-20 rounded-full object-cover border"
                />
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleFileChange}
                />
                <button
                  type="button"
                  className="absolute bottom-0 left-20 bg-white p-1 rounded-full shadow-md"
                  onClick={() => document.querySelector('input[type="file"]').click()}
                >
                  <FiEdit className="text-[#565ABF]" />
                </button>
              </div>
              <div className="col-md-6 mb-4">
                <label className="form-label">First Name</label>
                <input type="text" className="form-control" name="firstName" value={formData.firstName}
                  onChange={handleChange} />
              </div>
              <div className="col-md-6 mb-4">
                <label className="form-label">Last Name</label>
                <input type="text" className="form-control" name="lastName" value={formData.lastName}
                  onChange={handleChange} />
              </div>
              <div className="col-md-6 mb-4">
                <label className="form-label">Email</label>
                <input type="email" className="form-control" name="email" value={formData.email}
                  onChange={handleChange} />
              </div>
              <div className="col-md-6 mb-4">
                <label className="form-label">Mobile</label>
                <input type="text" className="form-control" name="mobile" value={formData.mobile}
                  onChange={handleChange} />
              </div>
              <div className="col-md-4 mb-4">
                <label className="form-label">Current Password</label>
                <input type="password" className="form-control" name="currentPassword" value={formData.currentPassword}
                  onChange={handleChange} />
              </div>
              <div className="col-md-4 mb-4">
                <label className="form-label">New Password</label>
                <input type="password" className="form-control" name="newPassword" value={formData.newPassword}
                  onChange={handleChange} />
              </div>
              <div className="col-md-4 mb-4">
                <label className="form-label">Confirm Password</label>
                <input type="password" className="form-control" name="confirmPassword" value={formData.confirmPassword}
                  onChange={handleChange} />
              </div>
              <div className="col-md-4 mb-4">
                <label className="form-label">Age</label>
                <input type="number" className="form-control" name="age" value={formData.age}
                  onChange={handleChange} />
              </div>
              <div className="col-md-4 mb-4">
                <label className="form-label">Gender</label>
                <select className="form-control" name="gender" value={formData.gender}
                  onChange={handleChange}>
                  <option value="">Select</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                </select>
              </div>
              <div className="col-md-4 mb-4">
                <label className="form-label">Date of Birth</label>
                <input type="date" className="form-control" name="dob" value={formData.dob}
                  onChange={handleChange} />
              </div>
            </div>


            <div className="row g-3 px-4">
              <div className="col-md-4 d-flex items-center mb-4">
                <input
                  type="checkbox"
                  className="form-check-input me-2"
                  checked={formData.termsAccepted}
                  id="termsAccepted"
                  name="termsAccepted"
                  onChange={handleChange}
                />
                <label className="form-check-label" htmlFor="termsAccepted">
                  Terms Accepted
                </label>
              </div>
            </div>

            <div className="d-flex justify-end gap-3 mt-4">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => navigate("/admin/user-management")}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={isSaving}
              >
                {isSaving ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

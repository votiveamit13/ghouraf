import { useNavigate } from "react-router-dom";
import Header from "../Headers/Header";
import { useEffect, useState } from "react";
import { FaArrowLeftLong } from "react-icons/fa6";
import axios from "axios";
import { toast } from "react-toastify";
import defaultImage from "assets/img/ghouraf/default-avatar.png";
import Loader from "components/common/Loader";

export default function EditProfile() {
  const navigate = useNavigate();
  const apiUrl = process.env.REACT_APP_API_URL;

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
    image: "",
  });

  const [preview, setPreview] = useState(null);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem("authToken");
      const res = await axios.get(`${apiUrl}admin/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setFormData({
        firstName: res.data?.profile?.firstName || "",
        lastName: res.data?.profile?.lastName || "",
        email: res.data?.email || "",
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
        image: res.data?.profile?.photo || "",
      });

      setPreview(
        res.data?.profile?.photo
          ? `${apiUrl.replace("/api/", "")}${res.data.profile.photo}`
          : null
      );
    } catch (error) {
      console.error("Failed to fetch admin profile:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "image") {
      const file = files[0];
      if (file) {
        const allowedExtensions = ["jpg", "jpeg", "png", "webp"];
        const ext = file.name.split(".").pop().toLowerCase();
        if (!allowedExtensions.includes(ext)) {
          setErrors({ ...errors, image: "Only JPG, JPEG, PNG, WEBP allowed" });
          return;
        }
        setErrors({ ...errors, image: "" });
        setFormData({ ...formData, image: file });
        setPreview(URL.createObjectURL(file));
      }
    } else {
      setFormData({ ...formData, [name]: value });
      setErrors({ ...errors, [name]: "" });
    }
  };

  const handleRemoveImage = () => {
    setFormData({ ...formData, image: "" });
    setPreview(null);
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.firstName.trim()) newErrors.firstName = "First name required";
    if (!formData.lastName.trim()) newErrors.lastName = "Last name required";
    if (!formData.email.trim()) newErrors.email = "Email required";

    if (
      formData.currentPassword ||
      formData.newPassword ||
      formData.confirmPassword
    ) {
      if (!formData.currentPassword)
        newErrors.currentPassword = "Enter current password";
      if (!formData.newPassword)
        newErrors.newPassword = "Enter new password";
      if (!formData.confirmPassword)
        newErrors.confirmPassword = "Confirm your new password";
      if (
        formData.newPassword &&
        formData.confirmPassword &&
        formData.newPassword !== formData.confirmPassword
      )
        newErrors.confirmPassword = "Passwords do not match";
    }

    if (!formData.image) newErrors.image = "Profile image is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      setSaving(true);
      const token = localStorage.getItem("authToken");

      const data = new FormData();
      data.append("firstName", formData.firstName);
      data.append("lastName", formData.lastName);
      data.append("email", formData.email);

      if (formData.image && formData.image instanceof File)
        data.append("image", formData.image);

      if (formData.currentPassword && formData.newPassword) {
        data.append("currentPassword", formData.currentPassword);
        data.append("newPassword", formData.newPassword);
      }

      await axios.put(`${apiUrl}admin/edit-profile`, data, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });

      toast.success("Profile updated successfully!");
      navigate("/admin/profile");
    } catch (error) {
      console.error("Failed to update profile:", error);
      toast.error(
        error.response?.data?.message || "Failed to update profile. Try again."
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <Loader />;

  return (
    <>
      <Header />
      <div className="px-[40px] mt-[-8%] w-full fluid position-relative">
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="px-3 py-3 border-b border-gray-200 d-flex justify-between">
            <h3 className="text-lg font-semibold text-gray-800">Edit Profile</h3>
            <button
              className="d-flex items-center gap-2 text-sm text-blue-600 hover:text-blue-800"
              onClick={() => navigate("/admin/profile")}
            >
              <FaArrowLeftLong /> Back
            </button>
          </div>

          <div className="px-3 py-3">
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="form-label">
                  First Name <span className="text-danger">*</span>
                </label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  className="form-control"
                  placeholder="Enter first name"
                />
                {errors.firstName && (
                  <p className="text-danger text-sm">{errors.firstName}</p>
                )}
              </div>

              <div className="mb-4">
                <label className="form-label">
                  Last Name <span className="text-danger">*</span>
                </label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  className="form-control"
                  placeholder="Enter last name"
                />
                {errors.lastName && (
                  <p className="text-danger text-sm">{errors.lastName}</p>
                )}
              </div>

              <div className="mb-4">
                <label className="form-label">
                  Email Id <span className="text-danger">*</span>
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="form-control"
                  placeholder="Enter email"
                />
                {errors.email && (
                  <p className="text-danger text-sm">{errors.email}</p>
                )}
              </div>

              <div className="mb-4">
                <label className="form-label">Change Password <span className="text-danger">*</span></label>
                <div className="row g-3">
                  <div className="col-md-4">
                    <input
                      type="password"
                      name="currentPassword"
                      value={formData.currentPassword || ""}
                      onChange={handleChange}
                      className="form-control"
                      placeholder="Current password"
                    />
                    {errors.currentPassword && (
                      <p className="text-danger text-sm mt-1">
                        {errors.currentPassword}
                      </p>
                    )}
                  </div>

                  <div className="col-md-4">
                    <input
                      type="password"
                      name="newPassword"
                      value={formData.newPassword || ""}
                      onChange={handleChange}
                      className="form-control"
                      placeholder="New password"
                    />
                    {errors.newPassword && (
                      <p className="text-danger text-sm mt-1">
                        {errors.newPassword}
                      </p>
                    )}
                  </div>

                  <div className="col-md-4">
                    <input
                      type="password"
                      name="confirmPassword"
                      value={formData.confirmPassword || ""}
                      onChange={handleChange}
                      className="form-control"
                      placeholder="Confirm new password"
                    />
                    {errors.confirmPassword && (
                      <p className="text-danger text-sm mt-1">
                        {errors.confirmPassword}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              <div className="mb-4">
                <label className="form-label">
                  Upload Profile <span className="text-danger">*</span>
                </label>
                <input
                  type="file"
                  name="image"
                  accept=".jpg,.jpeg,.png,.webp"
                  onChange={handleChange}
                  className="form-control"
                />
                {errors.image && (
                  <p className="text-danger text-sm">{errors.image}</p>
                )}

                {preview && (
                  <div className="mt-3 position-relative d-inline-block">
                    <img
                      src={preview || defaultImage}
                      alt="Preview"
                      className="rounded border"
                      style={{
                        width: "120px",
                        height: "120px",
                        objectFit: "cover",
                      }}
                    />
                    <button
                      type="button"
                      onClick={handleRemoveImage}
                      className="btn btn-sm btn-danger position-absolute"
                      style={{
                        top: "-8px",
                        right: "-8px",
                        borderRadius: "50%",
                        padding: "2px 6px",
                      }}
                    >
                      ×
                    </button>
                  </div>
                )}
              </div>

              <div className="flex justify-end gap-3 mt-4">
                <button
                  type="button"
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-600 hover:bg-gray-100"
                  onClick={() => navigate("/admin/profile")}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-3 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50"
                >
                  {saving ? "Updating..." : "Update Profile"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}

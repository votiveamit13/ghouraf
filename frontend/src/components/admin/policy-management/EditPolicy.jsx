import { useLocation, useNavigate } from "react-router-dom";
import Header from "../Headers/Header";
import { useState } from "react";
import { FaArrowLeftLong } from "react-icons/fa6";
import axios from "axios";
import { toast } from "react-toastify";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

export default function EditPolicy() {
  const { state } = useLocation();
  const policy = state?.policy;
  const navigate = useNavigate();
  const apiUrl = process.env.REACT_APP_API_URL;

  const [formData, setFormData] = useState({
    category: policy?.category || "",
    title: policy?.title || "",
    content: policy?.content || "",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleEditorChange = (value) => {
    setFormData({ ...formData, content: value });
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.category) newErrors.category = "Please select a category.";
    if (!formData.title.trim()) newErrors.title = "Title is required.";
    if (!formData.content.trim() || formData.content === "<p><br></p>")
      newErrors.content = "Content is required.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      const token = localStorage.getItem("authToken");
      await axios.put(
        `${apiUrl}admin/policies/${policy._id}`,
        formData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      toast.success("Policy updated successfully!");
      navigate("/admin/policy-management");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update policy.");
    } finally {
      setLoading(false);
    }
  };

  const quillModules = {
    toolbar: [
      [{ header: [1, 2, 3, false] }],
      ["bold", "italic", "underline", "strike"],
      [{ list: "ordered" }, { list: "bullet" }],
      ["link"],
      ["clean"],
    ],
  };

  const quillFormats = [
    "header",
    "bold",
    "italic",
    "underline",
    "strike",
    "list",
    "bullet",
    "link",
  ];

  return (
    <>
      <Header hideStatsOnMobile={true}/>
      <div className="px-[20px] md:px-[40px] mt-[-12%] md:mt-[-8%] w-full fluid position-relative mb-4">
                <div className="bg-white shadow rounded-lg overflow-hidden">
                    <div className="px-3 py-3 border-b border-gray-200 d-flex justify-between">
                        <h3 className="text-lg font-semibold text-gray-800">Edit Policy</h3>
            <button
              className="d-flex items-center gap-2 text-sm text-blue-600 hover:text-blue-800"
              onClick={() => navigate("/admin/policy-management")}
            >
              <FaArrowLeftLong /> Back
            </button>
          </div>

           <div className="px-3 py-3">
            <form className="mb-4" onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Policy Category <span className="text-red-500">*</span>
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-1 focus:ring-indigo-500 focus:outline-none"
                >
                                    <option value="">Select Category</option>
                                    <option value="Privacy">Privacy Policy</option>
                                    <option value="Terms">Terms & Conditions</option>
                                    <option value="Safety">Safety & Tips</option>
                                    <option value="Advice">Advice</option>
                </select>
                {errors.category && (
                  <p className="text-red-500 text-sm mt-1">{errors.category}</p>
                )}
              </div>

              {/* Title Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="Enter policy title"
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-1 focus:ring-indigo-500 focus:outline-none"
                />
                {errors.title && (
                  <p className="text-red-500 text-sm mt-1">{errors.title}</p>
                )}
              </div>

              {/* Rich Text Editor */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Content <span className="text-red-500">*</span>
                </label>
                <ReactQuill
                  theme="snow"
                  value={formData.content}
                  onChange={handleEditorChange}
                  modules={quillModules}
                  formats={quillFormats}
                  placeholder="Write policy details here..."
                  className="bg-white border border-gray-300 rounded-md min-h-[200px]"
                />
                {errors.content && (
                  <p className="text-red-500 text-sm mt-1">{errors.content}</p>
                )}
              </div>

              {/* Buttons */}
              <div className="flex justify-end gap-3 mt-4">
                <button
                  type="button"
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-600 hover:bg-gray-100"
                  onClick={() => navigate("/admin/policy-management")}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50"
                >
                  {loading ? "Updating..." : "Update Policy"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}

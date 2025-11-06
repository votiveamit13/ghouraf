import { useNavigate } from "react-router-dom";
import Header from "../Headers/Header";
import { useState } from "react";
import axios from "axios";
import { FaArrowLeftLong } from "react-icons/fa6";

export default function CreateAd() {
    const navigate = useNavigate();
    const apiUrl = process.env.REACT_APP_API_URL;
    const [formData, setFormData] = useState({
        title: "",
        url: "",
        image: "",
    });
    const [preview, setPreview] = useState(null);
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value, files } = e.target;

        if (name === "image") {
            const file = files[0];
            if (file) {
                const allowedExtensions = ["jpg", "jpeg", "png", "webp"];
                const fileExtension = file.name.split(".").pop().toLowerCase();

                if (!allowedExtensions.includes(fileExtension)) {
                    setErrors({
                        ...errors,
                        image: "Only JPG, JPEG, PNG, or WEBP images are allowed.",
                    });
                    setFormData({ ...formData, image: "" });
                    setPreview(null);
                    return;
                }

                setErrors({ ...errors, image: "" });
                setFormData({ ...formData, image: file });
                setPreview(URL.createObjectURL(file));
            }
        } else {
            setFormData({
                ...formData,
                [name]: value,
            });
        }
    };

    const handleRemoveImage = () => {
        setFormData({ ...formData, image: "" });
        setPreview(null);
        setErrors({ ...errors, image: "" });
    };

    const validate = () => {
        const newErrors = {};
        if (!formData.title.trim()) newErrors.title = "Title is required.";
        if (!formData.url) newErrors.url = "URL is required.";
        if (!formData.image) newErrors.image = "Image is required.";
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };


const handleSubmit = async (e) => {
  e.preventDefault();
  if (!validate()) return;

  try {
    setLoading(true);
    const token = localStorage.getItem("adminToken");

    const adData = new FormData();
    adData.append("title", formData.title);
    adData.append("url", formData.url);
    adData.append("image", formData.image);

    await axios.post(`${apiUrl}admin/create-ad`, adData, {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${token}`,
      },
    });

    navigate("/admin/ad-management");
  } catch (error) {
    console.error("Failed to create ad:", error);
  } finally {
    setLoading(false);
  }
};


    return (
        <>
            <Header />
            <div className="px-[40px] mt-[-8%] w-full fluid position-relative">
                <div className="bg-white shadow rounded-lg overflow-hidden">
                    <div className="px-3 py-3 border-b border-gray-200 d-flex justify-between">
                        <h3 className="text-lg font-semibold text-gray-800">Create Ad</h3>
                        <button
                            className="d-flex items-center gap-2 text-sm text-blue-600 hover:text-blue-800"
                            onClick={() => navigate("/admin/ad-management")}
                        >
                            <FaArrowLeftLong /> Back
                        </button>
                    </div>

                    <div className="px-3 py-3">
                        <form className="mb-4" onSubmit={handleSubmit}>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Title <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    name="title"
                                    value={formData.title}
                                    onChange={handleChange}
                                    placeholder="Enter Ad title"
                                    className="form-control"
                                />
                                {errors.title && (
                                    <p className="text-red-500 text-sm mt-1">{errors.title}</p>
                                )}
                            </div>

                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    URL <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    name="url"
                                    value={formData.url}
                                    onChange={handleChange}
                                    placeholder="Enter Ad URL"
                                    className="form-control"
                                />
                                {errors.url && (
                                    <p className="text-red-500 text-sm mt-1">{errors.url}</p>
                                )}
                            </div>

                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Upload Image <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="file"
                                    name="image"
                                    accept=".jpg,.jpeg,.png,.webp"
                                    onChange={handleChange}
                                    className="form-control"
                                />
                                {errors.image && (
                                    <p className="text-red-500 text-sm mt-1">{errors.image}</p>
                                )}

                                {/* Image Preview Section */}
                                {preview && (
                                    <div className="mt-3 position-relative d-inline-block">
                                        <img
                                            src={preview}
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
                                    onClick={() => navigate("/admin/ad-management")}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="px-5 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50"
                                >
                                    {loading ? "Creating..." : "Create Ad"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
}

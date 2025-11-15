import { useNavigate } from "react-router-dom";
import Header from "../Headers/Header";
import { useState, useRef } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { FaArrowLeftLong } from "react-icons/fa6";
import ImageResizer from "components/common/ImageCropper";

export default function CreateAd() {
  const navigate = useNavigate();
  const apiUrl = process.env.REACT_APP_API_URL;
  const [formData, setFormData] = useState({
    title: "",
    url: "",
    image: "",
  });
  const [preview, setPreview] = useState(null);
  const [resizeMode, setResizeMode] = useState(false);
  const [originalImage, setOriginalImage] = useState(null);
  const [resizeState, setResizeState] = useState({ scale: 1, position: { x: 0, y: 0 } });
  const fileInputRef = useRef();
  
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [imgInfo, setImgInfo] = useState({ width: null, height: null });
  const REQUIRED = { width: 1500, height: 900 };

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "image") {
      const file = files[0];
      if (file) {
        const allowed = ["jpg", "jpeg", "png", "webp"];
        const ext = file.name.split(".").pop().toLowerCase();

        if (!allowed.includes(ext)) {
          setErrors({ ...errors, image: "Only JPG, JPEG, PNG, WEBP allowed." });
          setPreview(null);
          return;
        }

        // Create blob preview
        const blobUrl = URL.createObjectURL(file);
        setPreview(blobUrl);
        setOriginalImage(blobUrl);
        setFormData({ ...formData, image: file });
        setErrors({ ...errors, image: "" });
        // Reset resize state for new image
        setResizeState({ scale: 1, position: { x: 0, y: 0 } });

        // Read actual image size and then open resizer
        const img = new Image();
        img.onload = () => {
          setImgInfo({ width: img.width, height: img.height });
          // Auto-open resizer after image is loaded
          setResizeMode(true);
        };
        img.src = blobUrl;
      }
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const handleResizeSave = (blob, state) => {
    const file = new File([blob], "resized.jpg", { type: "image/jpeg" });
    const resizedUrl = URL.createObjectURL(file);

    setPreview(resizedUrl);
    setFormData({ ...formData, image: file });
    // Save the resize state
    if (state) {
      setResizeState(state);
    }
    setResizeMode(false);
  };

  const handleRemoveImage = () => {
    setFormData({ ...formData, image: "" });
    setPreview(null);
    setOriginalImage(null);
    setResizeState({ scale: 1, position: { x: 0, y: 0 } });
    setErrors({ ...errors, image: "" });

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleOpenResizer = () => {
    const imageToResize = originalImage || preview;
    if (imageToResize) {
      setResizeMode(true);
    }
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
      const token = localStorage.getItem("authToken");

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

      toast.success("Ad created successfully!");
      navigate("/admin/ad-management");
    } catch (error) {
      console.error("Failed to create ad:", error);
      toast.error(
        error.response?.data?.message || "Failed to create ad. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Header hideStatsOnMobile={true}/>
      <div className="px-[20px] md:px-[40px] mt-[-12%] md:mt-[-8%] w-full fluid position-relative mb-4">
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
                  ref={fileInputRef}
                />
                {errors.image && (
                  <p className="text-red-500 text-sm mt-1">{errors.image}</p>
                )}

                {preview && (
                  <div className="mt-3 p-3 border rounded bg-light w-full">
                    <p className="text-black">Ad Preview</p>
                    <div className="relative mb-4 p-4 bg-white border h-[310px] rounded-[12px] shadow-xl">
                      <div className="absolute top-[-2px] left-[-2px] bg-yellow-300 text-black text-xs font-semibold px-2 py-1 rounded mb-2 inline-block">
                        Advertisement
                      </div>
                      <h4 className="font-semibold text-[24px] text-black mb-2">
                        {formData.title || "Ad Title Preview"}
                      </h4>

                      <div>
                        <img
                          src={preview}
                          alt="Preview"
                          className="w-[100%] h-[220px] object-cover rounded-md border"
                        />
                      </div>

                      <div className="flex absolute top-14 md:top-11 right-2 gap-2">
                        <button
                          type="button"
                          className="btn bg-[#565ABF] text-white w-[100px] btn-sm mt-2"
                          onClick={handleOpenResizer}
                        >
                          Resize
                        </button>

                        <button
                          type="button"
                          onClick={handleRemoveImage}
                          className="btn btn-danger btn-sm mt-2"
                        >
                          Remove Image
                        </button>
                      </div>
                    </div>
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
      
      {resizeMode && (
        <ImageResizer
          image={originalImage || preview}
          onCancel={() => setResizeMode(false)}
          onSave={handleResizeSave}
          initialScale={resizeState.scale}
          initialPosition={resizeState.position}
        />
      )}
    </>
  );
}
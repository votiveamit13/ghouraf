import { useNavigate } from "react-router-dom";
import Header from "../Headers/Header";
import { useState, useRef, useCallback, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { FaArrowLeftLong } from "react-icons/fa6";
import Cropper from "react-easy-crop";

export default function CreateAd() {
  const navigate = useNavigate();
  const apiUrl = process.env.REACT_APP_API_URL;

  const PREVIEW_HEIGHT = 160;

  const [formData, setFormData] = useState({
    title: "",
    url: "",
    image: "",
  });

  const [preview, setPreview] = useState(null);
  const fileInputRef = useRef(null);
  const [showCropModal, setShowCropModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [mediaSize, setMediaSize] = useState(null);
  const cropperWrapperRef = useRef(null);
  const [cropWidth, setCropWidth] = useState(600);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const onMediaLoaded = useCallback((media) => {
    const scaledWidth = media.width * (PREVIEW_HEIGHT / media.height);
    setCropWidth(scaledWidth);
  }, []);


  useEffect(() => {
    if (!mediaSize) return;

    setCropWidth(mediaSize.width);
  }, [mediaSize]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "image") {
      const file = files?.[0];
      if (!file) return;

      const allowed = ["jpg", "jpeg", "png", "webp"];
      const ext = file.name.split(".").pop().toLowerCase();

      if (!allowed.includes(ext)) {
        setErrors({ ...errors, image: "Only JPG, JPEG, PNG, WEBP allowed." });
        return;
      }

      const blobUrl = URL.createObjectURL(file);
      setSelectedImage(blobUrl);
      setShowCropModal(true);
      setErrors({ ...errors, image: "" });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const onCropComplete = useCallback((_, croppedPixels) => {
    setCroppedAreaPixels(croppedPixels);
  }, []);

  const createImage = (url) =>
    new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = reject;
      img.crossOrigin = "anonymous";
      img.src = url;
    });

  const getCroppedImg = async () => {
    const image = await createImage(selectedImage);

    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;

    const outputHeight = 220;

    const outputWidth =
      (croppedAreaPixels.width / croppedAreaPixels.height) * outputHeight;

    const canvas = document.createElement("canvas");
    canvas.width = outputWidth;
    canvas.height = outputHeight;

    const ctx = canvas.getContext("2d");

    ctx.drawImage(
      image,
      croppedAreaPixels.x * scaleX,
      croppedAreaPixels.y * scaleY,
      croppedAreaPixels.width * scaleX,
      croppedAreaPixels.height * scaleY,
      0,
      0,
      outputWidth,
      outputHeight
    );

    return new Promise((resolve) => {
      canvas.toBlob((blob) => resolve(blob), "image/jpeg", 0.9);
    });
  };



  const handleSaveCrop = async () => {
    const blob = await getCroppedImg();
    const file = new File([blob], "ad.jpg", { type: "image/jpeg" });
    const previewUrl = URL.createObjectURL(file);

    setPreview(previewUrl);
    setFormData({ ...formData, image: file });
    setShowCropModal(false);
  };

  const handleRemoveImage = () => {
    setPreview(null);
    setSelectedImage(null);
    setFormData({ ...formData, image: "" });
    setErrors({ ...errors, image: "" });

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
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
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      toast.success("Ad created successfully!");
      navigate("/admin/ad-management");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to create ad.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Header hideStatsOnMobile />

      <div className="px-[20px] md:px-[40px] mt-[-12%] md:mt-[-8%] w-full mb-4">
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="px-3 py-3 border-b flex justify-between">
            <h3 className="text-lg font-semibold">Create Ad</h3>
            <button
              className="flex items-center gap-2 text-blue-600"
              onClick={() => navigate("/admin/ad-management")}
            >
              <FaArrowLeftLong /> Back
            </button>
          </div>

          <div className="px-3 py-3">
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">
                  Title *
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  className="form-control"
                />
                {errors.title && (
                  <p className="text-red-500 text-sm">{errors.title}</p>
                )}
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">
                  URL *
                </label>
                <input
                  type="text"
                  name="url"
                  value={formData.url}
                  onChange={handleChange}
                  className="form-control"
                />
                {errors.url && (
                  <p className="text-red-500 text-sm">{errors.url}</p>
                )}
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">
                  Upload Image *
                </label>
                <input
                  type="file"
                  name="image"
                  accept=".jpg,.jpeg,.png,.webp"
                  onChange={handleChange}
                  ref={fileInputRef}
                  className="form-control"
                />
                {errors.image && (
                  <p className="text-red-500 text-sm">{errors.image}</p>
                )}

                {preview && (
                  <div className="mt-3 p-3 border rounded bg-light">
                    <p className="text-black">Ad Preview</p>

                    <div className="relative p-4 bg-white border h-[310px] rounded-[12px] shadow-xl">
                      <div className="absolute top-[-2px] left-[-2px] bg-yellow-300 text-xs px-2 py-1 rounded">
                        Advertisement
                      </div>

                      <h4 className="font-semibold text-[24px] mb-2">
                        {formData.title || "Ad Title Preview"}
                      </h4>

                      <img
                        src={preview}
                        alt="Preview"
                        className="w-full h-[220px] object-cover rounded-md border"
                      />

                      <div className="absolute top-14 right-2">
                        <button
                          type="button"
                          onClick={handleRemoveImage}
                          className="btn btn-danger btn-sm"
                        >
                          Remove Image
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  className="px-4 py-2 border rounded"
                  onClick={() => navigate("/admin/ad-management")}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-5 py-2 bg-indigo-600 text-white rounded"
                >
                  {loading ? "Creating..." : "Create Ad"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {showCropModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-4 w-full max-w-4xl">
            <h3 className="text-lg font-semibold mb-3">
              Crop Ad Image
            </h3>

            <div className="relative w-full h-[400px] bg-black rounded">
              <div ref={cropperWrapperRef} className="relative w-full h-[400px]">
                <Cropper
                  image={selectedImage}
                  crop={crop}
                  zoom={zoom}
                  cropSize={{
                    width: cropperWrapperRef.current?.clientWidth || 600,
                    height: 180,
                  }}
                  objectFit="horizontal-cover"
                  restrictPosition={true}
                  onCropChange={setCrop}
                  onZoomChange={setZoom}
                  onCropComplete={onCropComplete}
                  onMediaLoaded={onMediaLoaded}
                />
              </div>
            </div>


            <div className="flex items-center gap-3 mt-4">
              <span className="text-sm">Zoom</span>
              <input
                type="range"
                min={1}
                max={3}
                step={0.1}
                value={zoom}
                onChange={(e) => setZoom(e.target.value)}
                className="w-full"
              />
            </div>

            <div className="flex justify-end gap-3 mt-4">
              <button
                onClick={() => setShowCropModal(false)}
                className="px-4 py-2 border rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveCrop}
                className="px-5 py-2 bg-indigo-600 text-white rounded"
              >
                Save Crop
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

import React, { useState, useCallback, useEffect } from "react";
import Cropper from "react-easy-crop";
import axios from "axios";
import { toast } from "react-toastify";

export default function AboutUsImages() {
  const apiUrl = process.env.REACT_APP_API_URL;
  const token = localStorage.getItem("authToken");

  const [images, setImages] = useState([null, null, null]);
  const [previews, setPreviews] = useState([null, null, null]);
  const [errors, setErrors] = useState(["", "", ""]);
  const [loading, setLoading] = useState(false);

  const [showCropper, setShowCropper] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [cropImage, setCropImage] = useState(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

  const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

  const aspectRatios = [4 / 4, 4 / 4, 4 / 4];

  useEffect(() => {
  const fetchExistingImages = async () => {
    try {
      const { data } = await axios.get(`${apiUrl}admin/aboutus-image`, {
        headers: { Authorization: `Bearer ${token}` },
      });


const urls = [data.imagePath1, data.imagePath2, data.imagePath3].map((url) =>
  url ? `${url}` : null
);


      setPreviews(urls);
    } catch (error) {
      console.error("Error fetching About Us images:", error);
      toast.error("Failed to load About Us images");
    }
  };

  fetchExistingImages();
}, [apiUrl, token]);


  const handleFileChange = (index, e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!allowedTypes.includes(file.type)) {
      const newErrors = [...errors];
      newErrors[index] = "Only JPG, JPEG, PNG, or WEBP images are allowed.";
      setErrors(newErrors);
      return;
    }

    const imageUrl = URL.createObjectURL(file);
    setSelectedIndex(index);
    setCropImage(imageUrl);
    setShowCropper(true);
  };

  const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const createImage = (url) =>
    new Promise((resolve, reject) => {
      const img = new Image();
      img.addEventListener("load", () => resolve(img));
      img.addEventListener("error", (error) => reject(error));
      img.setAttribute("crossOrigin", "anonymous");
      img.src = url;
    });

  const getCroppedImg = useCallback(async () => {
    const image = await createImage(cropImage);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    const { width, height, x, y } = croppedAreaPixels;
    canvas.width = width;
    canvas.height = height;

    ctx.drawImage(image, x, y, width, height, 0, 0, width, height);

    return new Promise((resolve) => {
      canvas.toBlob((blob) => {
        resolve(blob);
      }, "image/jpeg");
    });
  }, [cropImage, croppedAreaPixels]);

  const handleSaveCrop = async () => {
    const croppedBlob = await getCroppedImg();
    const newImages = [...images];
    const newPreviews = [...previews];

    newImages[selectedIndex] = croppedBlob;
    newPreviews[selectedIndex] = URL.createObjectURL(croppedBlob);

    setImages(newImages);
    setPreviews(newPreviews);
    setShowCropper(false);
  };

  const handleRemoveImage = (index) => {
    const newImages = [...images];
    const newPreviews = [...previews];
    newImages[index] = null;
    newPreviews[index] = null;
    setImages(newImages);
    setPreviews(newPreviews);
    toast.info(`Image ${index + 1} removed`);
  };

  const handleUpload = async () => {
    if (images.some((img) => !img)) {
      toast.error("All three images are required.");
      return;
    }

    try {
      setLoading(true);
      const formData = new FormData();
      images.forEach((file, i) => {
        formData.append(`image${i + 1}`, file, `aboutus-${i + 1}.jpg`);
      });

      await axios.post(`${apiUrl}admin/aboutus-image`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      toast.success("Images updated successfully!");
    } catch (error) {
      console.error(error);
      toast.error("Error uploading About Us images");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="px-3 flex items-center justify-between gap-4 mb-4 flex-wrap">
        {[1, 2, 3].map((num, index) => (
          <div
            key={num}
            className="relative flex flex-col items-center justify-center w-80 h-80 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:bg-gray-50 overflow-hidden"
          >
            {previews[index] ? (
              <>
                <img
                  src={previews[index]}
                  alt={`Preview ${num}`}
                  className="w-full h-full object-cover rounded-xl"
                />
                <button
                  onClick={() => handleRemoveImage(index)}
                  className="absolute top-2 right-2 bg-white rounded-full shadow-md px-2 py-1 text-gray-600 hover:bg-gray-200"
                >
                  ✕
                </button>
              </>
            ) : (
              <label
                htmlFor={`extra-image-${num}`}
                className="flex flex-col items-center cursor-pointer"
              >
                <span className="text-4xl text-gray-400 leading-none">+</span>
                <span className="text-sm text-gray-500 mt-2">
                  Upload Image {num}
                </span>
                <input
                  id={`extra-image-${num}`}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => handleFileChange(index, e)}
                />
              </label>
            )}
          </div>
        ))}
      </div>

      <div className="text-right mr-3 mb-8">
        <button
          onClick={handleUpload}
          disabled={loading}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
        >
          {loading ? "Uploading..." : "Upload Images"}
        </button>
      </div>

      {showCropper && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-3xl p-4 relative">
            <h3 className="text-lg font-semibold mb-3 text-gray-700">
              Adjust Image {selectedIndex + 1}
            </h3>

            <div className="relative w-full h-[400px] bg-gray-900 rounded-lg overflow-hidden">
              <Cropper
                image={cropImage}
                crop={crop}
                zoom={zoom}
                aspect={aspectRatios[selectedIndex]}
                onCropChange={setCrop}
                onZoomChange={setZoom}
                onCropComplete={onCropComplete}
              />
            </div>

            <div className="flex items-center justify-center gap-3 mt-4">
              <span className="text-sm text-gray-600">Zoom</span>
              <input
                type="range"
                min={1}
                max={3}
                step={0.1}
                value={zoom}
                onChange={(e) => setZoom(e.target.value)}
                className="w-1/2 accent-indigo-600"
              />
            </div>

            <div className="flex justify-end gap-3 mt-4">
              <button
                onClick={() => setShowCropper(false)}
                className="px-4 py-2 text-gray-600 border hover:text-gray-800 rounded-md transition"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveCrop}
                className="px-5 py-2 rounded-md text-white font-medium bg-indigo-600 hover:bg-indigo-700 transition"
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

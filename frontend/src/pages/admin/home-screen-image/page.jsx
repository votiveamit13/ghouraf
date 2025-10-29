import React, { useState, useCallback, useEffect } from "react";
import Cropper from "react-easy-crop";
import axios from "axios";
import { toast } from "react-toastify";
import Header from "components/admin/Headers/Header";

export default function HeroImage() {
    const apiUrl = process.env.REACT_APP_API_URL;
    const [currentImage, setCurrentImage] = useState(null);
    const [selectedImage, setSelectedImage] = useState(null);
    const [showCropModal, setShowCropModal] = useState(false);
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
    const [loading, setLoading] = useState(false);
    const token = localStorage.getItem("authToken");

useEffect(() => {
  const fetchHeroImage = async () => {
    try {
      const res = await axios.get(`${apiUrl}admin/hero-image`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.data?.imagePath) {
        setCurrentImage(res.data.imagePath);
      }
    } catch (error) {
      console.warn("No hero image set yet");
    }
  };
  fetchHeroImage();
}, [apiUrl, token]);

    const onSelectFile = (e) => {
        if (e.target.files && e.target.files.length > 0) {
            const file = e.target.files[0];
            const imageUrl = URL.createObjectURL(file);
            setSelectedImage(imageUrl);
            setShowCropModal(true);
        }
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
        const image = await createImage(selectedImage);
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
    }, [selectedImage, croppedAreaPixels]);

const handleSaveCrop = async () => {
  try {
    setLoading(true);
    const croppedBlob = await getCroppedImg();
    const formData = new FormData();
    formData.append("image", croppedBlob, "home.jpg");

    await axios.post(`${apiUrl}admin/hero-image`, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    });

    toast.success("Home screen image updated successfully!");

    const newUrl = URL.createObjectURL(croppedBlob);
    setCurrentImage(newUrl);
    setShowCropModal(false);
  } catch (error) {
    console.error(error);
    toast.error("Error uploading image");
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
                        <h3 className="text-lg font-semibold text-gray-800">
                            Home Screen Image
                        </h3>
                    </div>

                    <div className="flex justify-center mb-4 mt-4">
                        <img
                            src={currentImage}
                            alt="Current Home"
                            className="rounded-lg shadow-md max-h-64 object-cover"
                        />
                    </div>

                    <div>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={onSelectFile}
                            className="block w-full mb-4 px-2 text-sm text-gray-600
                     file:mr-4 file:py-2 file:px-4
                     file:rounded-full file:border-0
                     file:text-sm file:font-semibold
                     file:bg-indigo-50 file:text-indigo-700
                     hover:file:bg-indigo-100 cursor-pointer"
                        />
                    </div>

                    {showCropModal && (
                        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                            <div className="bg-white rounded-xl shadow-xl w-full max-w-3xl p-4 relative">
                                <h3 className="text-lg font-semibold mb-3 text-gray-700">
                                    Adjust Home Screen Image
                                </h3>

                                <div className="relative w-full h-[400px] bg-gray-900 rounded-lg overflow-hidden">
                                    <Cropper
                                        image={selectedImage}
                                        crop={crop}
                                        zoom={zoom}
                                        aspect={12 / 5}
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
                                        onClick={() => setShowCropModal(false)}
                                        className="px-4 py-2 text-gray-600 border hover:text-gray-800 rounded-md transition"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={handleSaveCrop}
                                        disabled={loading}
                                        className={`px-5 py-2 rounded-md text-white font-medium transition ${loading
                                            ? "bg-indigo-400 cursor-not-allowed"
                                            : "bg-indigo-600 hover:bg-indigo-700"
                                            }`}
                                    >
                                        {loading ? "Saving..." : "Save Crop"}
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}

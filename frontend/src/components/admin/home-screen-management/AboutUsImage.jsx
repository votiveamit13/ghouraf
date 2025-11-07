import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import Header from "components/admin/Headers/Header";

export default function AboutUsImages() {
  const apiUrl = process.env.REACT_APP_API_URL;
  const token = localStorage.getItem("authToken");

  const [images, setImages] = useState([null, null, null]);
  const [previews, setPreviews] = useState([null, null, null]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const res = await axios.get(`${apiUrl}admin/aboutus-image`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const { imagePath1, imagePath2, imagePath3 } = res.data;
        setPreviews([
          imagePath1 ? `${apiUrl}${imagePath1}` : null,
          imagePath2 ? `${apiUrl}${imagePath2}` : null,
          imagePath3 ? `${apiUrl}${imagePath3}` : null,
        ]);
      } catch (error) {
        console.warn("No About Us images set yet");
      }
    };
    fetchImages();
  }, [apiUrl, token]);

  const handleFileChange = (index, e) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      const newImages = [...images];
      const newPreviews = [...previews];
      newImages[index] = file;
      newPreviews[index] = URL.createObjectURL(file);
      setImages(newImages);
      setPreviews(newPreviews);
    }
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
    try {
      setLoading(true);
      const formData = new FormData();

      images.forEach((file, i) => {
        if (file) {
          formData.append(`image${i + 1}`, file);
        }
      });

      await axios.post(`${apiUrl}admin/aboutus-image`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      toast.success("About Us images updated successfully!");
    } catch (error) {
      console.error(error);
      toast.error("Error uploading About Us images");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
          <div className="flex items-center justify-center gap-6 mb-4">
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
    </>
  );
}

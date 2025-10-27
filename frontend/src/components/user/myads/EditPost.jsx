import React, { useState, useEffect } from "react";
import axios from "axios";

export default function EditPost({ show, onClose, ad, onUpdated }) {
  const [formData, setFormData] = useState({});
  const apiUrl = process.env.REACT_APP_API_URL;

  useEffect(() => {
    if (ad) setFormData(ad);
  }, [ad]);

  if (!show || !ad) return null;

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      await axios.put(`${apiUrl}my-ads/${ad._id}`, formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      onUpdated();
      onClose();
    } catch (error) {
      console.error("Error updating ad:", error.response?.data || error.message);
    }
  };

  const renderPhotoPreview = () => {
    const photos = [
      ...(formData.featuredImage ? [{ url: formData.featuredImage }] : []),
      ...(formData.photos || []),
    ];

    if (photos.length === 0) return null;

    return (
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-1">
        {photos.map((p, i) => (
          <div key={i} className="relative">
            <img
              src={p.url}
              alt={`photo-${i}`}
              className="w-full h-40 object-cover rounded-lg border"
            />
            <button
              type="button"
              onClick={() =>
                setFormData((prev) => ({
                  ...prev,
                  photos: (prev.photos || []).filter((_, idx) => idx !== i),
                }))
              }
              className="absolute top-2 right-2 bg-black/50 text-white rounded-full px-2 py-1 text-sm"
            >
              ✕
            </button>
          </div>
        ))}
      </div>
    );
  };

  const renderFields = () => {
    switch (ad.postCategory) {
      case "Space":
        return (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                ["Title", "title"],
                ["Property Type", "propertyType"],
                ["Budget", "budget"],
                ["Budget Type", "budgetType"],
                ["Personal Info", "personalInfo"],
                ["Size (m²)", "size"],
                ["Bedrooms", "bedrooms"],
                ["Rooms Available For", "roomsAvailableFor"],
                ["Country", "country"],
                ["State", "state"],
                ["City", "city"],
                ["Location", "location"],
              ].map(([label, name]) => (
                <div key={name}>
                  <label className="block text-sm font-medium mb-1">{label}</label>
                  <input
                    name={name}
                    value={formData[name] || ""}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-lg p-2"
                  />
                </div>
              ))}

              <div>
                <label className="block text-sm font-medium mb-1">Furnishing</label>
                <select
                  name="furnishing"
                  value={formData.furnishing ? "Yes" : "No"}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      furnishing: e.target.value === "Yes",
                    }))
                  }
                  className="w-full border border-gray-300 rounded-lg p-2"
                >
                  <option value="Yes">Yes</option>
                  <option value="No">No</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Smoking</label>
                <select
                  name="smoking"
                  value={formData.smoking ? "Allowed" : "Not Allowed"}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      smoking: e.target.value === "Allowed",
                    }))
                  }
                  className="w-full border border-gray-300 rounded-lg p-2"
                >
                  <option value="Allowed">Allowed</option>
                  <option value="Not Allowed">Not Allowed</option>
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-1">Description</label>
                <textarea
                  name="description"
                  rows={3}
                  value={formData.description || ""}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg p-2"
                />
              </div>
            </div>
            {renderPhotoPreview()}
          </>
        );

      case "Spacewanted":
        return (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                ["Title", "title"],
                ["Property Type", "propertyType"],
                ["Room Size", "roomSize"],
                ["Budget", "budget"],
                ["Budget Type", "budgetType"],
                ["Period", "period"],
                ["Name", "name"],
                ["Age", "age"],
                ["Gender", "gender"],
                ["Occupation", "occupation"],
                ["Country", "country"],
                ["State", "state"],
                ["City", "city"],
              ].map(([label, name]) => (
                <div key={name}>
                  <label className="block text-sm font-medium mb-1">{label}</label>
                  <input
                    name={name}
                    value={formData[name] || ""}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-lg p-2"
                  />
                </div>
              ))}

              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-1">Description</label>
                <textarea
                  name="description"
                  rows={3}
                  value={formData.description || ""}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg p-2"
                />
              </div>
            </div>
            {renderPhotoPreview()}
          </>
        );

      case "Teamup":
        return (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                ["Title", "title"],
                ["First Name", "firstName"],
                ["Last Name", "lastName"],
                ["Budget", "budget"],
                ["Budget Type", "budgetType"],
                ["Gender", "gender"],
                ["Occupation", "occupation"],
                ["Country", "country"],
                ["State", "state"],
                ["City", "city"],
                ["Min Age", "minAge"],
                ["Max Age", "maxAge"],
                ["Language", "language"],
                ["Roommate Preference", "roommatePref"],
              ].map(([label, name]) => (
                <div key={name}>
                  <label className="block text-sm font-medium mb-1">{label}</label>
                  <input
                    name={name}
                    value={formData[name] || ""}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-lg p-2"
                  />
                </div>
              ))}

              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-1">Description</label>
                <textarea
                  name="description"
                  rows={3}
                  value={formData.description || ""}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg p-2"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-1">Buddy Description</label>
                <textarea
                  name="buddyDescription"
                  rows={3}
                  value={formData.buddyDescription || ""}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg p-2"
                />
              </div>
            </div>
            {renderPhotoPreview()}
          </>
        );

      default:
        return <p>No editable fields available.</p>;
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[9999]">
      <div className="bg-white rounded-2xl shadow-xl w-[90%] max-w-5xl max-h-[90vh] overflow-y-auto relative p-3">
        <button
          onClick={onClose}
          className="absolute top-3 right-4 text-gray-500 hover:text-gray-800 text-2xl font-bold"
        >
          ×
        </button>

        <h2 className="text-2xl font-semibold text-[#565ABF] mb-4 text-center">
          Edit {ad.postCategory} Ad
        </h2>

        <form className="px-4" onSubmit={handleSubmit}>{renderFields()}</form>

        <div className="flex justify-end mt-6">
          <button
            onClick={handleSubmit}
            className="bg-[#565ABF] text-white font-medium py-2 px-4 rounded-lg hover:bg-[#4542a0]"
          >
            Save Changes →
          </button>
        </div>
      </div>
    </div>
  );
}

import React, { useState, useRef } from "react";
import { FiEdit } from "react-icons/fi";
import { FaArrowRightLong } from "react-icons/fa6";

export default function ProfileEdit({ initialData, onSave }) {
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    ...initialData,
    dob: initialData.dob ? initialData.dob.split("T")[0] : "",
    age: initialData.dob ? calculateAge(initialData.dob) : initialData.age,
  });
  const [previewImage, setPreviewImage] = useState(initialData.photo);
  const [errors, setErrors] = useState({});
  const fileInputRef = useRef(null);

  function calculateAge(dob) {
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }
    return age;
  }

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "dob") {
      setFormData({
        ...formData,
        dob: value,
        age: calculateAge(value),
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }

    setErrors({ ...errors, [name]: "" });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, photo: file });
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const validate = () => {
    let newErrors = {};

    if (!formData.mobile) {
      newErrors.mobile = "Mobile number is required";
    } else if (!/^\+?[0-9]{10,15}$/.test(formData.mobile)) {
      newErrors.mobile =
        "Enter a valid mobile number (10–15 digits, optional +)";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (!validate()) return;
    setEditMode(false);
    onSave(formData);
  };

  return (
    <div className="bg-white mb-5 shadow-sm rounded-[12px] border-[1px] border-[#D7D7D7]">
      <div className="bg-[#565ABF] px-4 py-3 text-white text-[20px] font-medium rounded-t-[12px]">
        Profile Edit
      </div>

      <div className="card-body">
        <div className="flex items-center gap-4 mb-3 relative">
          <div className="relative">
            <img
              src={previewImage}
              alt="Profile"
              className="w-20 h-20 rounded-full object-cover border"
            />
            {editMode && (
              <>
                <input
                  type="file"
                  ref={fileInputRef}
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageChange}
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current.click()}
                  className="absolute bottom-0 right-0 bg-white p-1 rounded-full shadow-md"
                >
                  <FiEdit className="text-[#565ABF]" />
                </button>
              </>
            )}
          </div>
          <span className="font-medium text-[18px] text-black">
            Your Profile Photo
          </span>
        </div>

        <div className="flex items-center gap-4 text-[16px] text-black mb-2">
          <label className="font-medium w-32">Gender:</label>
          {editMode ? (
            <input
              type="text"
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              className="form-control"
            />
          ) : (
            <span>{formData.gender}</span>
          )}
        </div>

        <div className="flex items-center gap-4 text-[16px] text-black mb-2">
          <label className="font-medium w-32">Age:</label>
          {editMode ? (
            <input
              type="text"
              name="age"
              value={formData.age}
              readOnly
              className="form-control bg-gray-100 cursor-not-allowed"
            />
          ) : (
            <span>{formData.age}</span>
          )}
        </div>

        <div className="flex flex-col mb-2">
          <div className="flex items-center gap-4 text-[16px] text-black">
            <label className="font-medium w-32">Mobile No:</label>
            {editMode ? (
              <input
                type="text"
                name="mobile"
                value={formData.mobile}
                onChange={handleChange}
                className={`form-control ${
                  errors.mobile ? "border-red-500" : ""
                }`}
              />
            ) : (
              <span>{formData.mobile}</span>
            )}
          </div>
          {errors.mobile && (
            <span className="text-red-500 text-[12px] mt-1 ml-32">
              {errors.mobile}
            </span>
          )}
        </div>

        <div className="flex items-center gap-4 text-[16px] text-black">
          <label className="font-medium w-32">DOB:</label>
          {editMode ? (
            <input
              type="date"
              name="dob"
              value={formData.dob}
              onChange={handleChange}
              className="form-control"
            />
          ) : (
            <span>{formData.dob}</span>
          )}
        </div>

        <div className="mt-3">
          {editMode ? (
            <div className="flex gap-2">
              <button
                onClick={handleSave}
                className="bg-[#565ABF] text-white px-4 py-2 rounded-[12px] flex items-center gap-2"
              >
                Save <FaArrowRightLong/>
              </button>
              <button
                onClick={() => setEditMode(false)}
                className="bg-gray-400 text-white px-4 py-2 rounded-[12px]"
              >
                Cancel
              </button>
            </div>
          ) : (
            <button
              onClick={() => setEditMode(true)}
              className="bg-[#565ABF] text-white px-4 py-2 rounded-[12px] flex items-center gap-2"
            >
              Edit Details <FaArrowRightLong/>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

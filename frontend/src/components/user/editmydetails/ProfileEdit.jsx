import React, { useState, useRef } from "react";
import { FiEdit } from "react-icons/fi";
import { FaArrowRightLong } from "react-icons/fa6";
import defaultImage from "assets/img/ghouraf/default-avatar.png";

export default function ProfileEdit({ initialData, onSave }) {
  const [editMode, setEditMode] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    ...initialData,
    dob: initialData.dob ? initialData.dob.split("T")[0] : "",
    age: initialData.dob ? calculateAge(initialData.dob) : initialData.age,
  });
  const [previewImage, setPreviewImage] = useState(initialData.photo);
  const [errors, setErrors] = useState({});
  const fileInputRef = useRef(null);

  function isAtLeast12YearsOld(dobString) {
  if (!dobString) return false;
  const [year, month, day] = dobString.split("-").map(Number);
  const dob = new Date(year, month - 1, day);
  const today = new Date();

  let age = today.getFullYear() - dob.getFullYear();
  const monthDiff = today.getMonth() - dob.getMonth();
  const dayDiff = today.getDate() - dob.getDate();

  if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
    age--;
  }

  return age >= 12;
}


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
    } else if (!/^[0-9]{10}$/.test(formData.mobile)) {
      newErrors.mobile = "Enter a valid 10-digit mobile number";
    }

    if (!formData.dob) {
    newErrors.dob = "Date of birth is required";
  } else if (!isAtLeast12YearsOld(formData.dob)) {
    newErrors.dob = "You must be at least 12 years old to register";
  }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };


  const handleSave = async () => {
    if (!validate()) return;
    setIsSaving(true);
    try {
      await onSave(formData);
      setEditMode(false);
    } finally {
      setIsSaving(false);
    }
  };

  function formatDisplayDate(dateString) {
  if (!dateString) return "";
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  return `${day}-${month}-${year}`;
}


  return (
    <div className="bg-white mb-5 shadow-xl rounded-[12px] border-[1px] border-[#D7D7D7]">
      <div className="bg-[#565ABF] px-4 py-3 text-white text-[20px] font-medium rounded-t-[12px]">
        Profile Edit
      </div>

      <div className="card-body">
        <div className="flex items-center gap-4 mb-3 relative">
          <div className="relative">
            <img
              src={previewImage || defaultImage}
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
            <select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              className="form-control"
            >
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
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
                onChange={(e) => {
                  const value = e.target.value;

                  const validValue = value.replace(/[^0-9]/g, "");

                  setFormData({ ...formData, mobile: validValue });
                  setErrors({ ...errors, mobile: "" });
                }}
                className={`form-control ${errors.mobile ? "border-red-500" : ""}`}
                maxLength={10}
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
              max={new Date(new Date().setFullYear(new Date().getFullYear() - 12))
                      .toISOString()
                      .split("T")[0]}
              className="form-control"
            />
          ) : (
            <span>{formatDisplayDate(formData.dob)}</span>
          )}
        </div>
        {errors.dob && (
  <span className="text-red-500 text-[12px] mt-1 ml-32">
    {errors.dob}
  </span>
)}


        <div className="mt-3">
          {editMode ? (
            <div className="flex gap-2">
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="bg-[#565ABF] text-white px-4 py-2 rounded-[12px] flex items-center gap-2 disabled:opacity-70"
              >
                {isSaving ? (
                  <>
                    Saving...
                  </>
                ) : (
                  <>
                    Save <FaArrowRightLong />
                  </>
                )}
              </button>
              <button
                onClick={() => setEditMode(false)}
                disabled={isSaving}
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
              Edit Details <FaArrowRightLong />
            </button>
          )}

        </div>
      </div>
    </div>
  );
}

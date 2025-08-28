import React, { useState } from "react";
import { FaArrowRightLong } from "react-icons/fa6";

export default function DetailsForm({ title, fields, onSubmit }) {
  const [formData, setFormData] = useState(
    fields.reduce((acc, field) => {
      acc[field.name] = field.value || "";
      return acc;
    }, {})
  );
  const [errors, setErrors] = useState({});
  const [isSaving, setIsSaving] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const validate = () => {
    let newErrors = {};
    fields.forEach((field) => {
      if (!formData[field.name]) {
        newErrors[field.name] = `${field.label} is required`;
      }
    });

    if ("email" in formData && "confirmEmail" in formData) {
      if (formData.email !== formData.confirmEmail) {
        newErrors.confirmEmail = "Emails do not match";
      }
    }
    if ("newPassword" in formData && "confirmPassword" in formData) {
      if (formData.newPassword !== formData.confirmPassword) {
        newErrors.confirmPassword = "Passwords do not match";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setIsSaving(true);
    try {
      await onSubmit(formData);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="bg-white mb-5 shadow-sm rounded-[12px] border-[1px] border-[#D7D7D7]">
      <div className="bg-[#565ABF] px-4 py-3 text-white text-[20px] font-medium rounded-t-[12px]">
        {title}
      </div>
      <div className="card-body">
        <form onSubmit={handleSubmit}>
          <div className="row g-3">
            {fields.map((field, idx) => (
              <div className="col-md-4" key={idx}>
                <label className="text-black text-[12px]">{field.label}</label>
                <input
                  type={field.type}
                  name={field.name}
                  placeholder={field.placeholder}
                  value={formData[field.name]}
                  onChange={handleChange}
                  className={`form-control ${
                    errors[field.name] ? "border-red-500" : ""
                  }`}
                   disabled={isSaving}
                />
                {errors[field.name] && (
                  <div className="text-red-500 text-[12px] mt-1">
                    {errors[field.name]}
                  </div>
                )}
              </div>
            ))}
          </div>

          {fields.some((f) => f.name.toLowerCase().includes("password")) && (
            <div className="mt-2 text-[12px] text-[#565ABF]">
              <a href="/" className="hover:text-[#565ABF]">
                Forgot password?
              </a>
            </div>
          )}

          <button
            type="submit"
            className="btn bg-[#565ABF] text-white text-[14px] font-medium mt-3 rounded-[12px] flex items-center gap-2"
          >
            {isSaving ? (
              <>
                Saving...
              </>
            ) : (
              <>
                Save Changes <FaArrowRightLong />
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}

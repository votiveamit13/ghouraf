import React, { useState } from "react";

export default function DetailsForm({ title, fields, onSubmit }){
    const [formData, setFormData] = useState(
        fields.reduce((acc, field) => {
            acc[field.name] = field.value || "";
            return acc;
        }, {})
    );

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData);
    };

    return (
        <div className="bg-white mb-5 shadow-sm rounded-[12px] border-[1px] border-[#D7D7D7]">
            <div className="bg-[#565ABF] px-4 py-3 text-white text-[20px] font-medium rounded-t-[12px]">{title}</div>
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
                                    className="form-control"
                                />
                            </div>
                        ))}
                    </div>
                    <div className="mt-2 text-[12px] text-[#565ABF]">
                        <a href="/" className="hover:text-[#565ABF]">Forgot password?</a>
                    </div>
                    <button type="submit" className="btn bg-[#565ABF] text-white text-[14px] font-medium mt-3 rounded-[12px]">
                        Save Changes →
                    </button>
                </form>
            </div>
        </div>
    );
}
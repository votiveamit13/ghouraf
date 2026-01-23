import { useNavigate } from "react-router-dom";
import Header from "../Headers/Header";
import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { FaArrowLeftLong } from "react-icons/fa6";

export default function AddFaq() {
    const navigate = useNavigate();
    const apiUrl = process.env.REACT_APP_API_URL;
    const [formData, setFormData] = useState({
        question: "",
        answer: "",
    });
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setErrors({ ...errors, [e.target.name]: "" });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setErrors({});

        try {
            const res = await axios.post(`${apiUrl}admin/addfaq`, formData);

            toast.success(res.data.message || "Add successfully");
            setFormData({
                question: "",
                answer: "",
            });
        } catch (err) {
            if (err.response?.status === 422 && err.response.data?.errors) {
                const fieldErrors = {};
                Object.entries(err.response.data.errors).forEach(([key, messages]) => {
                    fieldErrors[key] = messages[0];
                });
                setErrors(fieldErrors);
            } else {
                toast.error(err.response?.data?.message || "Something went wrong!");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
      <Header hideStatsOnMobile={true}/>
      <div className="px-[20px] md:px-[40px] mt-[-12%] md:mt-[-8%] w-full fluid position-relative mb-4">
                <div className="bg-white shadow rounded-lg overflow-hidden">
                    <div className="px-3 py-[20px] border-b border-gray-200 d-flex justify-between">
                        <h3 className="text-lg font-semibold text-gray-800">
                            Add FAQ
                        </h3>
                                    <button
                                      className="d-flex items-center gap-2 text-sm text-blue-600 hover:text-blue-800"
                                      onClick={() => navigate("/admin/faq-management")}
                                    >
                                      <FaArrowLeftLong /> Back
                                    </button>
                    </div>
                    <div className="px-3 py-3">
                        <form className="mb-4" onSubmit={handleSubmit}>
                            <div className="mb-4">
                                <label className="text-black">Question:</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    name="question"
                                    value={formData.question}
                                    onChange={handleChange}
                                />
                                {errors.question && (
                                        <p className="text-red-500 text-sm mt-1">{errors.question}</p>
                                    )}
                            </div>
                            <div className="mb-4">
                                <label className="text-black">Answer:</label>
                                <textarea
                                    type="text"
                                    className="form-control"
                                    rows={5}
                                    name="answer"
                                    value={formData.answer}
                                    onChange={handleChange}
                                />
                                {errors.answer && (
                                        <p className="text-red-500 text-sm mt-1">{errors.answer}</p>
                                    )}
                            </div>
                            <div className="d-flex justify-end gap-3 mt-4">
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="btn btn-primary">
                                 {loading ? "Adding..." : "Add"}
                                </button>
                                <button
                                    type="button"
                                    className="btn btn-secondary"
                                    onClick={() => navigate("/admin/faq-management")}
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
}
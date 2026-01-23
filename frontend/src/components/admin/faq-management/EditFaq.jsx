import { useLocation, useNavigate } from "react-router-dom";
import Header from "../Headers/Header";
import { useState } from "react";
import { FaArrowLeftLong } from "react-icons/fa6";
import axios from "axios";
import { toast } from "react-toastify";

export default function EditFaq() {
  const { state } = useLocation();
  const faq = state?.faq;
  const navigate = useNavigate();
  const apiUrl = process.env.REACT_APP_API_URL;

  const [formData, setFormData] = useState({
    question: faq?.question || "",
    answer: faq?.answer || "",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    let newErrors = {};
    if (!formData.question.trim()) newErrors.question = "Question is required";
    if (!formData.answer.trim()) newErrors.answer = "Answer is required";

    if (Object.keys(newErrors).length) {
      setErrors(newErrors);
      return;
    }

    try {
      setLoading(true);
      const token = localStorage.getItem("authToken");

      const response = await axios.patch(
        `${apiUrl}admin/faq/${faq._id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success(response.data.message || "FAQ updated successfully");
      navigate("/admin/faq-management");
    } catch (err) {
      console.error("Error updating FAQ:", err);
      toast.error(
        err.response?.data?.message || "Failed to update FAQ. Try again."
      );
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
              Edit FAQ
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
                  <p className="text-red-500 text-sm mt-1">
                    {errors.question}
                  </p>
                )}
              </div>
              <div className="mb-4">
                <label className="text-black">Answer:</label>
                <textarea
                  className="form-control"
                  rows={5}
                  name="answer"
                  value={formData.answer}
                  onChange={handleChange}
                />
                {errors.answer && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.answer}
                  </p>
                )}
              </div>
              <div className="d-flex justify-end gap-3 mt-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="btn btn-primary"
                >
                  {loading ? "Updating..." : "Update"}
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

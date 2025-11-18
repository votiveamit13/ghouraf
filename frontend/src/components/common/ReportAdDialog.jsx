import React, { useState } from "react";
import { toast } from "react-toastify";

export default function ReportAdDialog({ show, onClose, postId, postType, token }) {
  const apiUrl = process.env.REACT_APP_API_URL;
  const [title, setTitle] = useState("");
  const [reason, setReason] = useState("");
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  if (!show) return null;

  const validateForm = () => {
    const newErrors = {};
    if (!title.trim()) newErrors.title = "Title is required.";
    if (!reason.trim()) newErrors.reason = "Reason is required.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      setLoading(true);
      const res = await fetch(`${apiUrl}create-report`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ postId, postType, title, reason }),
      });

      const data = await res.json();

      if (data.success) {
        toast.success("Report submitted successfully!");
        onClose();
        setTitle("");
        setReason("");
        setErrors({});
      } else {
        toast.error(data.message || "Failed to submit report.");
      }
    } catch (err) {
      console.error("Error submitting report:", err);
      toast.error("Server error. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[1055] flex items-center justify-center bg-black/50 mt-0 p-3">
      <div
        className="bg-white rounded-lg shadow-xl w-full max-w-2xl relative animate-fadeIn"
        style={{ animation: "fadeIn 0.3s ease" }}
      >
        <div className="flex relative justify-between items-center border-b px-3 py-3 bg-[#565ABF] rounded-t-lg">
          <h5 className="text-white text-[20px] font-semibold text-center">Report this Ad</h5>
          <button
            type="button"
            className="text-white text-2xl leading-none hover:opacity-80 border-0 bg-transparent"
            onClick={onClose}
          >
            &times;
          </button>
        </div>

        <form onSubmit={handleSubmit} className="px-4 py-2">
          <div className="mb-3">
            <label className="form-label fw-semibold text-secondary small mb-1">
              Title
            </label>
            <input
              type="text"
              className={`form-control border rounded py-2 px-3`}
              placeholder="Enter report title"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                if (errors.title) setErrors((prev) => ({ ...prev, title: "" }));
              }}
            />
            {errors.title && (
              <small className="text-danger fw-semibold">{errors.title}</small>
            )}
          </div>

          <div className="mb-3">
            <label className="form-label fw-semibold text-secondary small mb-1">
              Reason
            </label>
            <textarea
              rows="4"
              className={`form-control border rounded py-2 px-3`}
              placeholder="Describe the issue"
              value={reason}
              onChange={(e) => {
                setReason(e.target.value);
                if (errors.reason) setErrors((prev) => ({ ...prev, reason: "" }));
              }}
            ></textarea>
            {errors.reason && (
              <small className="text-danger fw-semibold">{errors.reason}</small>
            )}
          </div>

          <div className="d-flex justify-content-end gap-2 pt-3 border-top">
            <button
              type="button"
              className="btn py-3 px-5 border text-center text-black"
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="btn p-3 text-center text-white"
              style={{
                backgroundColor: "#565ABF",
                opacity: loading ? 0.7 : 1,
              }}
            >
              {loading ? "Submitting..." : "Submit Report"}
            </button>
          </div>
        </form>
      </div>


    </div>
  );
}

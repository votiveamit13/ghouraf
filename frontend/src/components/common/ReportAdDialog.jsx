import React, { useState } from "react";
import { toast } from "react-toastify";

export default function ReportAdDialog({ show, onClose, postId, postType, token }) {
  const apiUrl = process.env.REACT_APP_API_URL;
  const [title, setTitle] = useState("");
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(false);

  if (!show) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title.trim() || !reason.trim()) {
      toast.warning("Please fill in all fields.");
      return;
    }

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
    <div className="fixed inset-0 z-[1055] flex items-center justify-center bg-black/50">
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

        <form onSubmit={handleSubmit} className="p-4">
          <div className="mb-3">
            <label className="form-label fw-semibold text-secondary small mb-1">
              Title
            </label>
            <input
              type="text"
              className="form-control border border-gray-300 rounded py-2 px-3"
              placeholder="Enter report title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div className="mb-3">
            <label className="form-label fw-semibold text-secondary small mb-1">
              Reason
            </label>
            <textarea
              rows="4"
              className="form-control border border-gray-300 rounded py-2 px-3"
              placeholder="Describe the issue"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
            ></textarea>
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
              className="btn p-3 border-t text-center text-white"
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

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}

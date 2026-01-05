import React from "react";
import Loader from "./Loader";

const ConfirmationDialog = ({ show, title, message, onConfirm, onCancel, loading = false, className = "" }) => {
  if (!show) return null;

  return (
    <div className={`fixed inset-0 bg-black/50 flex items-center justify-center z-[9999] px-2 ${className}`}>
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md">
        <div className="flex justify-between items-center px-4 py-3 border-b">
          <h3 className="text-lg font-semibold text-gray-800">
            {title || "Confirm"}
          </h3>
          <button
            onClick={onCancel}
            className="text-gray-500 hover:text-gray-700 text-xl"
          >
            ×
          </button>
        </div>

        <div className="px-4 py-4">
          <p className="text-gray-700">{message || "Are you sure?"}</p>
        </div>

        <div className="flex justify-end gap-3 px-4 py-3 border-t">
          <button
            onClick={onCancel}
            className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100"
          >
            Cancel
          </button>
          <button
            onClick={!loading ? onConfirm : undefined}
            disabled={loading}
            className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700"
          >
            {loading ? <Loader /> : "Confirm"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationDialog;

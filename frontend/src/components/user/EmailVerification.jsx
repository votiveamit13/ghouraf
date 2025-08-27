import { useState } from "react";
import { MdOutlineMarkEmailRead } from "react-icons/md";
import axios from "axios";
import { toast } from "react-toastify";

export default function EmailVerification({ email, onClose }) {
  const [loading, setLoading] = useState(false);

  const handleResend = async () => {
    try {
      setLoading(true);
      await axios.post(`http://216.10.243.87:3000/api/auth/resend-verification`, { email });
      toast.success("Verification email resent successfully");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to resend verification");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex justify-center items-center z-50 p-4">
      <div className="bg-white rounded-[17px] w-full max-w-lg relative shadow-lg p-6 text-center">
        <MdOutlineMarkEmailRead
          size={70}
          color="#A321A6"
          className="mx-auto mb-2"
        />
        <h2 className="text-bold text-lg text-[#565ABF]">
          Please verify your Email
        </h2>
        <p className="mb-4">Verification email sent to {email}.</p>

        <button
          onClick={handleResend}
          disabled={loading}
          className="mt-2 mr-2 px-4 py-2 bg-[#565ABF] text-white rounded-lg hover:bg-[#A321A6] disabled:opacity-50"
        >
          {loading ? "Resending..." : "Resend Verification Email"}
        </button>

        <button
          onClick={onClose}
          className="mt-4 px-4 py-2 border border-gray-400 rounded-lg text-gray-600 hover:bg-gray-100"
        >
          Close
        </button>
      </div>
    </div>
  );
}

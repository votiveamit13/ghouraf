import React, { useState } from "react";
import { PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { IoClose } from "react-icons/io5";
import { toast } from "react-toastify";

const PromotionPaymentModal = ({ clientSecret, onClose, onSuccess }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);

  const handleConfirm = async () => {
    if (!stripe || !elements) return;
    setLoading(true);

    try {
      const result = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/payment-success`,
        },
        redirect: 'if_required'
      });

      if (result.error) {
        console.error("Payment error:", result.error);
        toast.error(result.error.message || "Payment failed");
      } else {
        // Payment succeeded
        toast.success("Payment successful! Finalizing your promoted ad...");
        onSuccess();
      }
    } catch (err) {
      console.error("Confirm payment error:", err);
      toast.error("Payment error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="relative bg-white rounded-2xl shadow-lg w-[90%] max-w-md p-6">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-gray-800">
          <IoClose size={20} />
        </button>

        <h3 className="text-lg font-semibold mb-3">Complete Promotion Payment</h3>
        <p className="text-sm text-gray-600 mb-4">Enter your payment details to promote your ad.</p>

        <div className="mb-4">
          <PaymentElement />
        </div>

        <div className="flex justify-end gap-3">
          <button 
            onClick={onClose} 
            className="px-4 py-2 rounded border border-gray-300 hover:bg-gray-50"
            disabled={loading}
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            disabled={!stripe || loading}
            className="px-4 py-2 rounded bg-[#4E2DD2] text-white hover:bg-[#3c21aa] disabled:opacity-50"
          >
            {loading ? "Processing..." : "Pay Now"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PromotionPaymentModal;
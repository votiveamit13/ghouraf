import React, { useState } from "react";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { IoClose } from "react-icons/io5";
import { toast } from "react-toastify";

const cardStyle = {
  style: {
    base: {
      fontSize: "16px",
      color: "#32325d",
      "::placeholder": { color: "#a0aec0" },
      fontFamily: "Arial, sans-serif"
    },
    invalid: { color: "#fa755a" }
  }
};

const PromotionPaymentModal = ({ clientSecret, onClose, onSuccess }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);

  const handleConfirm = async () => {
    if (!stripe || !elements) return;
    setLoading(true);

    try {
      const cardElement = elements.getElement(CardElement);
      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: { card: cardElement }
      });

      if (result.error) {
        console.error("Payment error:", result.error);
        toast.error(result.error.message || "Payment failed");
      } else if (result.paymentIntent && result.paymentIntent.status === "succeeded") {
        toast.success("Payment successful! Finalizing your promoted ad...");
        onSuccess();
      } else {
        toast.warn("Payment processing. If this persists check your payments page.");
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
      <div className="relative bg-white rounded-2xl shadow-lg w-[90%] max-w-md p-4">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-gray-800">
          <IoClose size={20} />
        </button>

        <h3 className="text-lg font-semibold mb-3">Complete Promotion Payment</h3>
        <p className="text-sm text-gray-600 mb-4">Enter card details to pay and promote your ad.</p>

        <div className="mb-4 border p-3 rounded">
          <CardElement options={cardStyle} />
        </div>

        <div className="flex justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2 rounded border">Cancel</button>
          <button
            onClick={handleConfirm}
            disabled={!stripe || loading}
            className="px-4 py-2 rounded bg-[#4E2DD2] text-white"
          >
            {loading ? "Processing..." : "Pay"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PromotionPaymentModal;

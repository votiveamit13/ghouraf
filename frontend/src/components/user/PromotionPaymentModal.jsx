import React, { useState } from "react";
import { PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { IoClose } from "react-icons/io5";
import { toast } from "react-toastify";

const PromotionPaymentModal = ({ clientSecret, onClose, onSuccess }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  const handleConfirm = async () => {
    if (!stripe || !elements) {
      console.error("Stripe.js hasn't loaded yet.");
      return;
    }

    setLoading(true);
    setMessage(null);

    try {
      const { error, paymentIntent } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/payment-success`,
        },
        redirect: 'if_required'
      });

      if (error) {
        setMessage(error.message);
        toast.error(error.message || "An unexpected error occurred.");
      } else if (paymentIntent && paymentIntent.status === 'succeeded') {
        toast.success("Payment successful! Finalizing your promoted ad...");
        onSuccess();
      } else {
        setMessage("Payment processing...");
        toast.success("Payment processing... Your ad will be promoted shortly.");
        onSuccess();
      }
    } catch (err) {
      console.error("Confirm payment error:", err);
      setMessage("An unexpected error occurred.");
      toast.error("Payment error occurred");
    } finally {
      setLoading(false);
    }
  };

  const paymentElementOptions = {
    layout: "tabs",
    defaultValues: {
      billingDetails: {
        name: '',
        email: '',
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="relative bg-white rounded-2xl shadow-lg w-[90%] max-w-[90%] md:max-w-[60%] lg:max-w-[40%] overflow-scroll h-[550px] p-4 no-scrollbar">
        <button 
          onClick={onClose} 
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-800"
          disabled={loading}
        >
          <IoClose size={20} />
        </button>

        <h3 className="text-lg font-semibold mb-3 text-gray-900">Complete Promotion Payment</h3>
        <p className="text-sm text-gray-600 mb-3">Enter your payment details to promote your ad.</p>

        <div className="mb-4">
          <PaymentElement 
            id="payment-element"
            options={paymentElementOptions}
          />
        </div>

        {message && (
          <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg text-sm text-yellow-800">
            {message}
          </div>
        )}

        <div className="flex justify-end gap-3">
          <button 
            onClick={onClose}
            disabled={loading}
            className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            disabled={!stripe || !elements || loading}
            className="px-4 py-2 rounded-lg bg-[#4E2DD2] text-white hover:bg-[#3c21aa] disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
          >
            {loading ? (
              <span className="flex items-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing...
              </span>
            ) : (
              "Pay Now"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PromotionPaymentModal;
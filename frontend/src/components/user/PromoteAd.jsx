import React, { useState } from "react";
import { IoClose } from "react-icons/io5";
import promote from "../../assets/img/ghouraf/promote.png";
import { loadStripe } from "@stripe/stripe-js";
const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLIC_KEY);

const PromoteAdModal = ({ show, onClose, onPublishNormally, spaceId, formData }) => {
  const [selectedPlan, setSelectedPlan] = useState("10");

  if (!show) return null;

  const handlePromotionPayment = async () => {
    try {
      await onPublishNormally(true, parseInt(selectedPlan));
    } catch (err) {
      console.error("Promotion error:", err);
      alert("Failed to start promotion. Please try again.");
    }
  };

  const handleNormalPublish = async () => {
    try {
      await onPublishNormally(false);
      onClose();
    } catch (err) {
      console.error("Publish error:", err);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="relative bg-white rounded-2xl shadow-lg w-[90%] max-w-md p-4 text-center">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-800"
        >
          <IoClose size={22} />
        </button>

        <div className="mb-4 flex justify-center">
          <img
            src={promote}
            alt="Promote Ad"
            className="w-16 h-16"
          />
        </div>

        <h2 className="text-lg font-semibold mb-2 text-black">
          Promote Your Ad and Get Noticed First!
        </h2>

        <p className="text-gray-600 text-sm mb-4">
          Would you like to boost your listing's visibility?
          <br />
          Promoted ads appear at the top of search results and reach more
          interested users.
        </p>

        <div className="flex flex-col items-center gap-3 mb-4">
          <label className="flex items-center space-x-2">
            <input
              type="radio"
              name="plan"
              value="10"
              checked={selectedPlan === "10"}
              onChange={(e) => setSelectedPlan(e.target.value)}
              className="accent-purple-600"
            />
            <span className="text-sm text-gray-700">10 days for 15 USD</span>
          </label>

          <label className="flex items-center space-x-2">
            <input
              type="radio"
              name="plan"
              value="30"
              checked={selectedPlan === "30"}
              onChange={(e) => setSelectedPlan(e.target.value)}
              className="accent-purple-600"
            />
            <span className="text-sm text-gray-700">30 days for 20 USD</span>
          </label>
        </div>

        <div className="flex flex-col gap-3">
          <button
            onClick={handlePromotionPayment}
            className="bg-[#4E2DD2] hover:bg-[#3c21aa] text-white font-medium py-2.5 px-4 rounded-lg transition"
          >
            Proceed To Promotion Payment
          </button>

          <button
            onClick={handleNormalPublish}
            className="bg-black border border-gray-300 text-white font-medium py-2.5 px-4 rounded-lg hover:bg-gray-100 transition"
          >
            Publish Normally
          </button>
        </div>
      </div>
    </div>
  );
};

export default PromoteAdModal;

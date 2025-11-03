import React, { useState } from "react";
import { IoClose } from "react-icons/io5";
import promote from "../../../assets/img/ghouraf/promote.png";
import { loadStripe } from "@stripe/stripe-js";
const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLIC_KEY);

const PromoteAdModal = ({ show, onClose, onProceed,  loading }) => {
  const [selectedPlan, setSelectedPlan] = useState("10");

  if (!show) return null;

  
  const handleProceed = () => {
    onProceed(selectedPlan);
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
          Would you like to boost your listing’s visibility?
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
              value="20"
              checked={selectedPlan === "20"}
              onChange={(e) => setSelectedPlan(e.target.value)}
              className="accent-purple-600"
            />
            <span className="text-sm text-gray-700">30 days for 20 USD</span>
          </label>
        </div>

        <div className="flex flex-col gap-3">
          <button
            disabled={loading}
            onClick={handleProceed}
            className="bg-[#4E2DD2] hover:bg-[#3c21aa] text-white font-medium py-2.5 px-4 rounded-lg transition"
          >
            {loading ? "Processing..." : "Proceed To Promotion Payment"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PromoteAdModal;
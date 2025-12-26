import React, { useEffect, useState } from "react";
import { IoClose } from "react-icons/io5";
import promote from "../../assets/img/ghouraf/promote.png";
import { loadStripe } from "@stripe/stripe-js";
const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLIC_KEY);

const PromoteAdModal = ({ show, onClose, onPublishNormally, onProceedToPayment, loading }) => {
  const apiUrl = process.env.REACT_APP_API_URL;

  const [plans, setPlans] = useState([]);
  const [selectedPlanId, setSelectedPlanId] = useState(null);

   useEffect(() => {
    if (!show) return;

    axios.get(`${apiUrl}getplans`)
      .then(res => {
        setPlans(res.data);
        if (res.data.length) {
          setSelectedPlanId(res.data[0]._id);
        }
      })
      .catch(() => console.error("Failed to load promotion plans"));
  }, [show]);

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
  {plans.map(plan => (
    <label key={plan._id} className="flex items-center space-x-2">
      <input
        type="radio"
        name="plan"
        value={plan._id}
        checked={selectedPlanId === plan._id}
        onChange={() => setSelectedPlanId(plan._id)}
        className="accent-purple-600"
      />
      <span className="text-sm text-gray-700">
        {plan.plan} days for {plan.amountUSD} USD
      </span>
    </label>
  ))}
</div>


        <div className="flex flex-col gap-3">
<button
  disabled={loading || !selectedPlanId}
  onClick={() => onProceed(selectedPlanId)}
  className="bg-[#4E2DD2] text-white py-2.5 px-4 rounded-lg"
>
  {loading ? "Processing..." : "Proceed To Promotion Payment"}
</button>


          <button
            onClick={onPublishNormally}
            disabled={loading}
            className="bg-black border border-gray-300 text-white font-medium py-2.5 px-4 rounded-lg transition"
          >
            {loading ? "Posting..." : "Post without boost"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PromoteAdModal;
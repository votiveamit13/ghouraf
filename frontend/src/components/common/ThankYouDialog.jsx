import React from "react";
import { useNavigate } from "react-router-dom";
import thankyou from "../../assets/img/ghouraf/thankyou.png";

export default function ThankYouDialog({
  title = "Your ad was successfully published",
  subtitle = "Proin placerat risus non justo faucibus commodo. Nunc non neque sit amet magna aliquam condimentum.",
  goBackPath = "/",
  viewAdsPath = "/ads",
}) {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full text-center">
        <div className="flex justify-center mb-4">
          <div className="bg-purple-100 rounded-full p-4">
            <img src={thankyou} alt="ghouraf" className="text-purple-500 text-4xl" />
          </div>
        </div>

        <h2 className="text-2xl font-bold mb-2">{title}</h2>

        <p className="text-gray-500 mb-6 text-sm">{subtitle}</p>

        <div className="flex justify-center gap-4">
          <button
            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100"
            onClick={() => navigate(goBackPath)}
          >
            Go Back
          </button>
          <button
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
            onClick={() => navigate(viewAdsPath)}
          >
            View Ads
          </button>
        </div>
      </div>
    </div>
  );
}


{/* <ThankYouDialog
  title="Profile Updated Successfully"
  subtitle="Your profile changes have been saved."
  goBackPath="/dashboard"
  viewAdsPath="/my-ads"
/> */}

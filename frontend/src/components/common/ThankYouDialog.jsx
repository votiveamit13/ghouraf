import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import thankyou from "assets/img/ghouraf/thankyou.png";
import heroImage from "assets/img/ghouraf/hero-section.jpg";

export default function ThankYou() {
  const location = useLocation();
  const navigate = useNavigate();

  const {
    title = "Your ad was successfully published",
    subtitle = "Your listing has been created successfully.",
    goBackPath = "/",
  } = location.state || {};

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <div
        className="py-5 text-white text-center text-2xl font-semibold"
        style={{
          backgroundImage: `linear-gradient(90deg, #565ABF, #A321A6), url(${heroImage})`,
          backgroundBlendMode: "overlay",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        Thank You
      </div>
      <div className="m-auto bg-gray-50 flex items-center justify-center px-4">
        <div className="bg-white rounded-xl shadow-lg p-4 max-w-md w-full text-center">
          <div className="flex justify-center mb-4">
            <div>
              <img src={thankyou} alt="Success" className="w-16 h-16" />
            </div>
          </div>

          <h2 className="text-2xl font-bold mb-2 text-black">{title}</h2>
          <p className="text-black mb-4">{subtitle}</p>

          <div className="flex gap-4 justify-center">
            <button
              onClick={() => navigate(goBackPath)}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Go Back
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
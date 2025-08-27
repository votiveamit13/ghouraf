
import React from "react";

export default function AuthVerified() {
  return (
    <div className="flex items-center justify-center p-8 bg-gray-100">
      <div className="bg-white shadow-lg rounded-xl px-5 py-2 text-center max-w-md mb-20">
        <h1 className="text-2xl font-bold text-purple-600 mt-4 mb-3">
          Email Verified Successfully
        </h1>
        <p className="text-gray-600 mb-3">
          Thank you!<br/>You can now log in and start using <b>Ghouraf</b>.
        </p>
      </div>
    </div>
  );
}

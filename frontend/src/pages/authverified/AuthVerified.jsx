
import React from "react";
import { Link } from "react-router-dom";

export default function AuthVerified() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white shadow-lg rounded-xl p-8 text-center max-w-md">
        <h1 className="text-2xl font-bold text-purple-600 mb-4">
          Email Verified Successfully
        </h1>
        <p className="text-gray-600 mb-6">
          Thank you! Your email has been verified. You can now log in and start using <b>Ghouraf</b>.
        </p>
        <Link
          to="/login"
          className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
        >
          Go to Login
        </Link>
      </div>
    </div>
  );
}

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://216.10.243.87:3000/api/admin/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("authToken", data.token);
        navigate("/admin");
        toast.success("Login Successful");
      } else {
        setError(data.message || "Login failed");
      }
    } catch (err) {
      setError("An error occurred during login");
      console.log("error:", err);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="w-[500px] bg-white rounded-xl shadow-md overflow-hidden">
        <div className="p-2 text-center">
          <div className="flex justify-center">
            <img
              src={require("../../../assets/img/theme/Ghouraf.png")}
              alt="Logo"
              className="w-full h-auto px-6"
            />
          </div>
          <p className="text-gray-600 font-medium text-lg mb-4">
            Welcome Back! Login to Continue
          </p>
        </div>

        <div className="px-6 pb-4">
          <form onSubmit={handleSubmit}>
            {error && (
              <div className="text-red-500 mb-3 text-sm text-center">
                {error}
              </div>
            )}

            <div className="mb-4">
              <div className="flex items-center border border-gray-300 rounded-md px-3 py-2 bg-gray-50">
                <i className="ni ni-email-83 text-gray-500 mr-2" />
                <input
                  type="email"
                  placeholder="Email"
                  className="flex-1 bg-transparent outline-none text-gray-700"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="mb-4">
              <div className="flex items-center border border-gray-300 rounded-md px-3 py-2 bg-gray-50">
                <i className="ni ni-lock-circle-open text-gray-500 mr-2" />
                <input
                  type="password"
                  placeholder="Password"
                  className="flex-1 bg-transparent outline-none text-gray-700"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="text-center">
              <button
                type="submit"
                className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition duration-200"
              >
                Login
              </button>
            </div>
          </form>

          <div className="mt-4 text-center">
            <a
              href="#!"
              onClick={(e) => e.preventDefault()}
              className="text-sm text-gray-500 hover:text-gray-700"
            >
              Forgot password?
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;

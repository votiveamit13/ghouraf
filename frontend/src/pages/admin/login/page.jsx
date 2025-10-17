import React, { useState } from "react";
import { MdLockOutline, MdOutlineMail } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useAdminAuth } from "context/AdminAuthContext";

const LoginPage = () => {
  const { login } = useAdminAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const apiUrl = process.env.REACT_APP_API_URL;

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${apiUrl}/admin/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        login(data.token);
        navigate("/admin");
        toast.success("Login Successful");
      } else {
        setError(data.message || "Login failed");
      }
    } catch (err) {
      setError("An error occurred during login");
      console.log(err);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-[500px] bg-white rounded-xl shadow-md overflow-hidden">
        <div className="p-4 text-center">
          <img
            src={require("../../../assets/img/theme/Ghouraf.png")}
            alt="Logo"
            className="w-40 mx-auto mb-4"
          />
          <p className="text-gray-600 font-medium text-lg mb-4">
            Welcome Back! Login to Continue
          </p>
        </div>
        <div className="px-6 pb-6">
          <form onSubmit={handleSubmit}>
            {error && <div className="text-red-500 mb-3 text-sm text-center">{error}</div>}

            <div className="mb-4">
              <div className="flex items-center border border-gray-300 rounded-md px-2 py-2 bg-gray-50">
                <MdOutlineMail size={20} className="text-gray-500 mr-2" />
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
              <div className="flex items-center border border-gray-300 rounded-md px-2 py-2 bg-gray-50">
                <MdLockOutline size={20} className="text-gray-500 mr-2" />
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

            <button
              type="submit"
              className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition duration-200"
            >
              Login
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;

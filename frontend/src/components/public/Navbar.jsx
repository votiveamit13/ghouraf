import { useState } from "react";
import { NavLink } from "react-router-dom";
import { IoIosAddCircleOutline } from "react-icons/io";
import { HiMenu, HiX } from "react-icons/hi";
import { Img } from "react-image";
import { LuUserPen } from "react-icons/lu";
import { TfiEmail } from "react-icons/tfi";
import { GrLock } from "react-icons/gr";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { IoLogoFacebook } from "react-icons/io5";
import google from "assets/img/icons/google.png";
import { FaRegUser } from "react-icons/fa";
import { BsGenderMale } from "react-icons/bs";
import axios from "axios";
import { toast } from "react-toastify";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [loginDialog, setLoginDialog] = useState(false);
  const [registerDialog, setRegisterDialog] = useState(false);
  const [activeField, setActiveField] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const linkClass = "hover:text-[#A321A6]";
  const activeClass = "text-purple-600";
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    gender: "",
    dob: "",
    password: "",
    confirmPassword: "",
    termsAccepted: false,
  });

const handleChange = (e) => {
  const { name, type, value, checked } = e.target;
  setForm({
    ...form,
    [name]: type === "checkbox" ? checked : value,
  });
};


  const handleRegister = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    try {
      const res = await axios.post("http://127.0.0.1:3000/api/auth/register", {
        firstName: form.firstName,
        lastName: form.lastName,
        email: form.email,
        gender: form.gender,
        dob: form.dob,
        password: form.password,
        termsAccepted: form.termsAccepted,
      });

      localStorage.setItem("token", res.data.token);
      toast.success("Register Successful");
      setRegisterDialog(false);
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Registeration Failed");
    }
  };

  return (
    <nav className="bg-white fixed top-0 left-0 w-full z-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center">
          <div className="flex items-center space-x-2">
            <NavLink to="/" className="flex items-center">
              <Img
                src={require("../../assets/img/theme/Ghouraf.png")}
                className="lg:w-40 md:w-40 sm:w-80 w-60"
                loader={<p>Loading...</p>}
                unloader={<p>Failed to load</p>}
                alt="Logo"
              />
            </NavLink>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex space-x-8 mr--8">
            <NavLink
              to="/spaces"
              onClick={(e) => e.preventDefault()}
              className={({ isActive }) =>
                `font-semibold ${linkClass} ${
                  isActive ? activeClass : "text-[#565ABF]"
                }`
              }
            >
              Spaces
            </NavLink>
            <NavLink
              to="/place-wanted"
              onClick={(e) => e.preventDefault()}
              className={({ isActive }) =>
                `font-semibold ${linkClass} ${
                  isActive ? activeClass : "text-[#565ABF]"
                }`
              }
            >
              Place Wanted
            </NavLink>
            <NavLink
              to="/team-up"
              className={({ isActive }) =>
                `font-semibold ${linkClass} ${
                  isActive ? activeClass : "text-[#565ABF]"
                }`
              }
            >
              Team Up
            </NavLink>
            <NavLink
              to="/more-info"
              className={({ isActive }) =>
                `font-semibold ${linkClass} ${
                  isActive ? activeClass : "text-[#565ABF]"
                }`
              }
            >
              More Info
            </NavLink>
          </div>

          <div className="hidden md:flex items-center space-x-6">
            <div className="hidden md:flex items-center space-x-2">
              <NavLink
                className={({ isActive }) =>
                  `font-semibold flex items-center ${linkClass} ${
                    isActive ? activeClass : "text-[#565ABF]"
                  }`
                }
                onClick={() => setRegisterDialog(true)}
              >
                <LuUserPen size={30} className="mr-1" /> Register
              </NavLink>

              <span className="text-[#565ABF]">/</span>

              <NavLink
                className={({ isActive }) =>
                  `font-semibold flex items-center ${linkClass} ${
                    isActive ? activeClass : "text-[#565ABF]"
                  }`
                }
                onClick={() => setLoginDialog(true)}
              >
                Login
              </NavLink>
            </div>

            <button className="flex items-center px-4 py-3 bg-[#A321A6] text-white rounded-lg hover:bg-[#565ABF] transition font-semibold">
              <IoIosAddCircleOutline
                className="text-2xl font-bold"
                strokeWidth={2.5}
              />
              <span className="ml-2 pl-2 border-l border-white">Post Ad</span>
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-purple-600 text-2xl flex align-items-center"
            >
              {isOpen ? <HiX size={40} /> : <HiMenu size={40} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Dropdown */}
      {isOpen && (
        <div className="md:hidden bg-white shadow-lg px-4 pb-2 pt-4 space-y-4">
          <NavLink
            to="/spaces"
            className={({ isActive }) =>
              `block ${linkClass} ${isActive ? activeClass : "text-[#565ABF]"}`
            }
          >
            Spaces
          </NavLink>
          <NavLink
            to="/place-wanted"
            className={({ isActive }) =>
              `block ${linkClass} ${isActive ? activeClass : "text-[#565ABF]"}`
            }
          >
            Place Wanted
          </NavLink>
          <NavLink
            to="/team-up"
            className={({ isActive }) =>
              `block ${linkClass} ${isActive ? activeClass : "text-[#565ABF]"}`
            }
          >
            Team Up
          </NavLink>
          <NavLink
            to="/more-info"
            className={({ isActive }) =>
              `block ${linkClass} ${isActive ? activeClass : "text-[#565ABF]"}`
            }
          >
            More Info
          </NavLink>

          <span className="flex space-x-2">
            <NavLink
              className={({ isActive }) =>
                `flex items-center ${linkClass} ${
                  isActive ? activeClass : "text-[#565ABF]"
                }`
              }
              onClick={() => setRegisterDialog(true)}
            >
              <LuUserPen size={30} className="mr-1" /> Register
            </NavLink>
            /
            <NavLink
              className={({ isActive }) =>
                `flex items-center ${linkClass} ${
                  isActive ? activeClass : "text-[#565ABF]"
                }`
              }
              onClick={() => setLoginDialog(true)}
            >
              Login
            </NavLink>
          </span>

          <button className="w-full flex items-center justify-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition">
            <IoIosAddCircleOutline className="mr-1 text-lg" /> Post Ad
          </button>
        </div>
      )}
      {loginDialog && (
        <div className="fixed inset-0 bg-black/60 flex justify-center items-center z-50 p-4">
          <div className="bg-white rounded-[17px] w-full max-w-lg relative shadow-lg">
            <button
              className="absolute top-0 right-4 text-gray-600 hover:text-black text-xl mt-2"
              onClick={() => setLoginDialog(false)}
            >
              ✕
            </button>
            <form
              onSubmit={(e) => {
                e.preventDefault();
              }}
            >
              <div className="px-6 py-4">
                <h3 className="text-2xl font-semibold text-black mb-4">
                  Login
                </h3>
                <label className="text-sm font-medium text-gray-600">
                  Email
                </label>
                <div
                  className={`flex items-center mb-4 transition-all ${
                    activeField === "email"
                      ? "border-b-2 border-[#A321A6]"
                      : "border-b border-gray-300"
                  }`}
                >
                  <span className="text-gray-500 mr-2">
                    <TfiEmail color="black" />
                  </span>
                  <input
                    type="email"
                    placeholder="Enter your email address"
                    onFocus={() => setActiveField("email")}
                    className="flex-1 py-2 text-sm text-black placeholder:text-black outline-none"
                  />
                </div>

                <label className="text-sm font-medium text-gray-600">
                  Password
                </label>
                <div
                  className={`flex items-center mb-3 transition-all ${
                    activeField === "password"
                      ? "border-b-2 border-[#A321A6]"
                      : "border-b border-gray-300"
                  }`}
                >
                  <span className="text-gray-500 mr-2">
                    <GrLock color="black" />
                  </span>
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    onFocus={() => setActiveField("password")}
                    className="flex-1 py-2 text-sm text-black placeholder:text-black outline-none"
                  />
                  <button
                    type="button"
                    className="text-gray-500"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <AiOutlineEyeInvisible />
                    ) : (
                      <AiOutlineEye />
                    )}
                  </button>
                </div>

                <div className="flex justify-between items-center mb-4">
                  <label className="flex items-center space-x-2 text-sm text-[#1C1C1E]">
                    <input type="checkbox" className="w-4 h-4" />
                    <span>Remember me</span>
                  </label>
                  <a
                    href="/"
                    className="text-sm text-[#1C1C1E] hover:text-[#A321A6]"
                  >
                    Forgot Password ?
                  </a>
                </div>

                <button className="w-full bg-[#565ABF] hover:bg-indigo-700 text-white font-semibold py-3 rounded-lg shadow-md mb-4">
                  Login
                </button>

                <div className="flex gap-4 mb-4">
                  <button className="flex-1 flex items-center justify-center gap-2 bg-[#565ABF] hover:bg-indigo-700 text-white font-semibold py-2 rounded-lg shadow-md">
                    <img src={google} alt="Google" className="w-5 h-5" />
                    Google
                  </button>
                  <button className="flex-1 flex items-center justify-center gap-2 bg-[#565ABF] hover:bg-indigo-700 text-white font-semibold py-2 rounded-lg shadow-md">
                    <IoLogoFacebook size={25} />
                    Facebook
                  </button>
                </div>

                <p className="text-center text-sm text-[#000000]">
                  Don’t have an account?{" "}
                  <button
                    onClick={() => {
                      setRegisterDialog(true);
                      setLoginDialog(false);
                    }}
                    className="text-[#A321A6] hover:text-[#A321A6] font-semibold"
                  >
                    Register
                  </button>
                </p>
              </div>
            </form>
          </div>
        </div>
      )}

      {registerDialog && (
        <div className="fixed inset-0 bg-black/60 flex justify-center items-center z-50 p-4">
          <div className="bg-white rounded-[17px] w-full max-w-lg relative shadow-lg top-[12px]">
            <button
              className="absolute top-0 right-4 text-gray-600 hover:text-black text-xl mt-2"
              onClick={() => setRegisterDialog(false)}
            >
              ✕
            </button>
            <form onSubmit={handleRegister}>
              <div className="px-5 py-4">
                <h3 className="text-2xl font-semibold text-black mb-3">
                  Create Account
                </h3>
                <div className="d-flex justify-center align-center gap-5">
                  <div className="w-full">
                    <label className="text-sm font-medium text-gray-600 mb-0">
                      First Name
                    </label>
                    <div
                      className={`flex items-center mb-2 transition-all ${
                        activeField === "firstName"
                          ? "border-b-2 border-[#A321A6]"
                          : "border-b border-gray-300"
                      }`}
                    >
                      <span className="text-gray-500 mr-2">
                        <FaRegUser color="black" />
                      </span>
                      <input
                        type="text"
                        name="firstName"
                        value={form.firstName}
                        onChange={handleChange}
                        placeholder="First Name"
                        required
                        onFocus={() => setActiveField("firstName")}
                        className="flex-1 py-2 text-sm text-black placeholder:text-black outline-none"
                      />
                    </div>
                  </div>
                  <div className="w-full">
                    <label className="text-sm font-medium text-gray-600 mb-0">
                      Last Name
                    </label>
                    <div
                      className={`flex items-center mb-2 transition-all ${
                        activeField === "lastName"
                          ? "border-b-2 border-[#A321A6]"
                          : "border-b border-gray-300"
                      }`}
                    >
                      <span className="text-gray-500 mr-2">
                        <FaRegUser color="black" />
                      </span>
                      <input
                        type="text"
                        name="lastName"
                        value={form.lastName}
                        onChange={handleChange}
                        placeholder="Last Name"
                        required
                        onFocus={() => setActiveField("lastName")}
                        className="flex-1 py-2 text-sm text-black placeholder:text-black outline-none"
                      />
                    </div>
                  </div>
                </div>

                <div className="d-flex justify-center align-center gap-5">
                  <div className="w-full">
                    <label className="text-sm font-medium text-gray-600 mb-0">
                      Email
                    </label>
                    <div
                      className={`flex items-center mb-2 transition-all ${
                        activeField === "email"
                          ? "border-b-2 border-[#A321A6]"
                          : "border-b border-gray-300"
                      }`}
                    >
                      <span className="text-gray-500 mr-2">
                        <TfiEmail color="black" />
                      </span>
                      <input
                        type="email"
                        name="email"
                        value={form.email}
                        onChange={handleChange}
                        placeholder="Enter your email address"
                        required
                        onFocus={() => setActiveField("email")}
                        className="flex-1 py-2 text-sm text-black placeholder:text-black outline-none"
                      />
                    </div>
                  </div>
                  <div className="w-full">
                    <label className="text-sm font-medium text-gray-600 mb-0">
                      Gender
                    </label>
                    <div
                      className={`flex items-center mb-2 transition-all ${
                        activeField === "gender"
                          ? "border-b-2 border-[#A321A6]"
                          : "border-b border-gray-300"
                      }`}
                    >
                      <span className="text-gray-500 mr-2">
                        <BsGenderMale color="black" />
                      </span>
                      <select
                        name="gender"
                        value={form.gender}
                        onChange={handleChange}
                        onFocus={() => setActiveField("gender")}
                        required
                        className="flex-1 py-2 text-sm text-black placeholder:text-black outline-none"
                      >
                        <option value="">Select Gender</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                      </select>
                    </div>
                  </div>
                </div>

                <label className="text-sm font-medium text-gray-600 mb-0">
                  Date of Birth
                </label>
                <div
                  className={`flex items-center mb-2 transition-all ${
                    activeField === "dob"
                      ? "border-b-2 border-[#A321A6]"
                      : "border-b border-gray-300"
                  }`}
                >
                  <span className="text-gray-500 mr-2">
                    <FaRegUser color="black" />
                  </span>
                  <input
                    type="date"
                    name="dob"
                    value={form.dob}
                    onChange={handleChange}
                    placeholder="Enter your DOB"
                    required
                    onFocus={() => setActiveField("dob")}
                    className="flex-1 py-2 text-sm text-black placeholder:text-black outline-none"
                  />
                </div>

                <label className="text-sm font-medium text-gray-600 mb-0">
                  Password
                </label>
                <div
                  className={`flex items-center mb-2 transition-all ${
                    activeField === "password"
                      ? "border-b-2 border-[#A321A6]"
                      : "border-b border-gray-300"
                  }`}
                >
                  <span className="text-gray-500 mr-2">
                    <GrLock color="black" />
                  </span>
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    required
                    name="password"
                    value={form.password}
                    onChange={handleChange}
                    onFocus={() => setActiveField("password")}
                    className="flex-1 py-2 text-sm text-black placeholder:text-black outline-none"
                  />
                  <button
                    type="button"
                    className="text-gray-500"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <AiOutlineEyeInvisible />
                    ) : (
                      <AiOutlineEye />
                    )}
                  </button>
                </div>

                <label className="text-sm font-medium text-gray-600 mb-0">
                  Confirm Password
                </label>
                <div
                  className={`flex items-center mb-2 transition-all ${
                    activeField === "confirmPassword"
                      ? "border-b-2 border-[#A321A6]"
                      : "border-b border-gray-300"
                  }`}
                >
                  <span className="text-gray-500 mr-2">
                    <GrLock color="black" />
                  </span>
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Re enter your password"
                    name="confirmPassword"
                    value={form.confirmPassword}
                    onChange={handleChange}
                    onFocus={() => setActiveField("confirmPassword")}
                    className="flex-1 py-2 text-sm text-black placeholder:text-black outline-none"
                  />
                  <button
                    type="button"
                    className="text-gray-500"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? (
                      <AiOutlineEyeInvisible />
                    ) : (
                      <AiOutlineEye />
                    )}
                  </button>
                </div>

                <div className="flex justify-between items-center mb-4">
                  <label className="flex items-center space-x-2 text-sm text-[#1C1C1E]">
                    <input type="checkbox" name="termsAccepted" checked={form.termsAccepted} onChange={handleChange} className="w-4 h-4" />
                    <span>
                      Yes, I have read and agree to the{" "}
                      <a
                        href="/"
                        className="underline hover:underline hover:text-[#565ABF]"
                      >
                        Terms of Use
                      </a>{" "}
                      and{" "}
                      <a
                        href="/"
                        className="underline hover:underline hover:text-[#565ABF]"
                      >
                        Privacy Policy.
                      </a>
                    </span>
                  </label>
                </div>

                <button
                  type="submit"
                  className="w-full bg-[#565ABF] hover:bg-indigo-700 text-white font-semibold py-3 rounded-lg shadow-md mb-4"
                >
                  Register
                </button>

                <div className="flex gap-4 mb-4">
                  <button className="flex-1 flex items-center justify-center gap-2 bg-[#565ABF] hover:bg-indigo-700 text-white font-semibold py-2 rounded-lg shadow-md">
                    <img src={google} alt="Google" className="w-5 h-5" />
                    Google
                  </button>
                  <button className="flex-1 flex items-center justify-center gap-2 bg-[#565ABF] hover:bg-indigo-700 text-white font-semibold py-2 rounded-lg shadow-md">
                    <IoLogoFacebook size={25} />
                    Facebook
                  </button>
                </div>

                <p className="text-center text-sm text-[#000000]">
                  Don’t have an account?{" "}
                  <button
                    href="/"
                    onClick={() => {
                      setRegisterDialog(false);
                      setLoginDialog(true);
                    }}
                    className="text-[#A321A6] hover:text-[#A321A6] font-semibold"
                  >
                    Login
                  </button>
                </p>
              </div>
            </form>
          </div>
        </div>
      )}
    </nav>
  );
}

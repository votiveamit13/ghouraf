  import { useState } from "react";
  import { NavLink, useLocation, useNavigate } from "react-router-dom";
  import { IoIosAddCircleOutline } from "react-icons/io";
  import { HiMenu, HiX, HiOutlineMail } from "react-icons/hi";
  import { LuUserPen, LuUserRound, LuMessageSquareText, LuLogOut } from "react-icons/lu";
  import { TfiEmail } from "react-icons/tfi";
  import { GrLock, GrFavorite } from "react-icons/gr";
  import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
  import { IoLogoFacebook } from "react-icons/io5";
  import google from "assets/img/icons/google.png";
  import { FaRegUser } from "react-icons/fa";
  import { BsGenderMale } from "react-icons/bs";
  import axios from "axios";
  import { toast } from "react-toastify";
  import { signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
  import { auth } from "../../firebase";
  import { GoSync } from "react-icons/go";
  import { FiEdit, FiPlusCircle } from "react-icons/fi";
  import { useAuth } from "context/AuthContext";
  import Loader from "components/common/Loader";
  import EmailVerification from "components/user/EmailVerification";
  import { getErrorMessage } from "utils/errorHandler";
  import PostAdDialog from "components/common/PostAdDialog";

  export default function Navbar() {
    const apiUrl = process.env.REACT_APP_API_URL;
    const [open, setOpen] = useState(false);
    const navigate = useNavigate();
    const [isOpen, setIsOpen] = useState(false);
    const [loginDialog, setLoginDialog] = useState(false);
    const [registerDialog, setRegisterDialog] = useState(false);
    const [activeField, setActiveField] = useState(null);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const linkClass = "hover:text-[#A321A6]";
    const activeClass = "text-[#A321A6]";
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
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [mobileDropdownOpen, setMobileDropdownOpen] = useState(false);
    const { user, login, logout } = useAuth();
    const [showEmailVerification, setShowEmailVerification] = useState(false);
    const [pendingEmail, setPendingEmail] = useState("");
    const [loginLoading, setLoginLoading] = useState(false);
    const [registerLoading, setRegisterLoading] = useState(false);
    const location = useLocation()
    const [forgotDialog, setForgotDialog] = useState(false);
    const [forgotEmail, setForgotEmail] = useState("");
    const [forgotLoading, setForgotLoading] = useState(false);

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
      setRegisterLoading(true);
      try {
        await axios.post(`${apiUrl}/auth/register`, {
          firstName: form.firstName,
          lastName: form.lastName,
          email: form.email,
          gender: form.gender,
          dob: form.dob,
          password: form.password,
          termsAccepted: form.termsAccepted,
        });

        toast.success("Register successful. Please check your email for verification.");
        setRegisterDialog(false);
      } catch (err) {
        toast.error(err.response?.data?.message || "Registration Failed");
      } finally {
        setRegisterLoading(false);
      }
    };

    const handleLogin = async (e) => {
      e.preventDefault();
      setLoginLoading(true);

      try {
        const userCred = await signInWithEmailAndPassword(auth, form.email, form.password);
        const idToken = await userCred.user.getIdToken();

        const res = await login(idToken);

        if (res.emailVerified === false) {
          setPendingEmail(form.email);
          setShowEmailVerification(true);
          return;
        }

        if (res.inactive) {
          toast.error(res.message || "Your account is inactive.");
          return;
        }

        if (res.error) {
          toast.error(res.message || "Something went wrong. Try again later.");
          return;
        }

    if (res.user) {
      toast.success("Login Successful");
      setLoginDialog(false);
      if (!location.pathname.startsWith("/spaces/")) {
              navigate("/user");
      }
      return;
    }

        toast.error("Unexpected login response");
      } catch (err) {
        toast.error(getErrorMessage(err));
      } finally {
        setLoginLoading(false);
      }
    };

    const handleForgotPassword = async () => {
      if (!forgotEmail) {
        toast.error("Please enter your email");
        return;
      }
      setForgotLoading(true);
      try {
        const res = await axios.post(`${apiUrl}forgot-password`, { email: forgotEmail });
        toast.success(res.data.message || "Password reset email sent");
        setForgotDialog(false);
        setForgotEmail("");
      } catch (err) {
        if (err.response?.status === 404) {
          toast.error("Email not found");
        } else {
          toast.error(err.response?.data?.message || "Failed to send reset email");
        }
      } finally {
        setForgotLoading(false);
      }
    };

    const handleLogout = () => {
      logout();
      navigate("/");
      toast.info("Logout Successful");
    };

const handleGoogleLogin = async () => {
  try {
    const result = await signInWithPopup(auth, new GoogleAuthProvider());
    const idToken = await result.user.getIdToken();

    const res = await login(idToken);

    if (res.user) {
      toast.success("Login Successful");
      setLoginDialog(false);
      navigate("/user");
    } else if (res.error) {
      toast.error(res.message);
      await auth.signOut();
    }
  } catch (err) {
    toast.error(err.message || "Google login failed");
    await auth.signOut();
  }
};

    return (
      <nav className="bg-white fixed top-0 left-0 w-full z-20 p-[5px] shadow-lg">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-20 items-center">
            <NavLink to="/" className="flex items-center">
              <img
                src={require("../../assets/img/theme/Ghouraf.png")}
                className="lg:w-40 md:w-40 sm:w-80 w-60"
                alt="Logo"
              />
            </NavLink>

            {/* DESKTOP MENU */}
            <div className="hidden md:flex space-x-8">
              {["spaces", "place-wanted", "team-up", "more-info"].map((item) => (
                <NavLink
                  key={item}
                  to={`/${item}`}
                  className={({ isActive }) =>
                    `font-semibold ${linkClass} ${isActive ? activeClass : "text-[#565ABF]"
                    }`
                  }
                >
                  {item.replace("-", " ").replace(/\b\w/g, (c) => c.toUpperCase())}
                </NavLink>
              ))}

            </div>

            <div className="hidden md:flex items-center space-x-6">
              {!user ? (
                <>
                  <button
                    onClick={() => setRegisterDialog(true)}
                    className="font-semibold flex items-center hover:text-[#A321A6] text-[#565ABF] text-[15px]"
                  >
                    <LuUserPen size={30} className="mr-1" /> Register
                  </button>
                  <span className="text-[#565ABF] ml-1">/</span>
                  <button
                    onClick={() => setLoginDialog(true)}
                    className="font-semibold flex items-center hover:text-[#A321A6] text-[#565ABF] ml-1 text-[15px]"
                  >
                    Login
                  </button>

                  <button className="flex items-center px-[12px] py-[12px] bg-[#A321A6] text-white rounded-[10px] hover:bg-[#565ABF] transition font-semibold" onClick={() => setOpen(true)}>
                    <IoIosAddCircleOutline className="text-2xl font-bold" />
                    <span className="ml-2 pl-2 border-l border-white">Post Ad</span>
                  </button>
                </>
              ) : (
                <div className="flex items-center space-x-4">
                  <span className="font-semibold text-black">
                    Hi, {user.profile.firstName?.split(" ")[0] || "User"}
                  </span>
                  <a href="/user" className="text-black hover:text-[#A321A6]">
                    <HiOutlineMail size={22} />
                  </a>
                  <div className="relative">
                    <button
                      onClick={() => setDropdownOpen(!dropdownOpen)}
                      className="focus:outline-none"
                    >
                      <img
                        src={
                          user.profile?.photo ||
                          require("../../assets/img/ghouraf/default-avatar.png")
                        }
                        alt="Profile"
                        className="w-10 h-10 rounded-full border border-gray-300"
                      />
                    </button>

                    {dropdownOpen && (
                      <div className="absolute right-0 mt-2 w-52 bg-[#E7E7E7] rounded-lg shadow-lg py-2 z-50">
                        <a href="/user" className="flex items-center px-4 py-2 hover:text-[#565ABF]">
                          <LuUserRound className="mr-2" /> My Account
                        </a>
                        <a
                          href="#"
                          onClick={(e) => {
                            e.preventDefault();
                            setOpen(true);
                          }}
                          className="flex items-center px-4 py-2 hover:text-[#565ABF]"
                        >
                          <FiPlusCircle className="mr-2" /> Post an Ad
                        </a>
                        <a href="/user/my-ads" className="flex items-center px-4 py-2 hover:text-[#565ABF]">
                          <GoSync className="mr-2" /> My Ads
                        </a>
                        <a href="/user/saved-ads" className="flex items-center px-4 py-2 hover:text-[#565ABF]">
                          <GrFavorite className="mr-2" /> Saved Ads
                        </a>
                        <a href="/user/messages" className="flex items-center px-4 py-2 hover:text-[#565ABF]">
                          <LuMessageSquareText className="mr-2" /> Messages
                        </a>
                        <a href="/user/edit-my-details" className="flex items-center px-4 py-2 hover:text-[#565ABF]">
                          <FiEdit className="mr-2" /> Edit My Details
                        </a>
                        <button
                          onClick={handleLogout}
                          className="flex items-center w-full px-4 py-2 hover:text-[#565ABF]"
                        >
                          <LuLogOut className="mr-2" /> Logout
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            <div className="md:hidden">
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="text-purple-600 text-2xl"
              >
                {isOpen ? <HiX size={40} /> : <HiMenu size={40} />}
              </button>
            </div>
          </div>
        </div>

        {/* MOBILE MENU */}
        {isOpen && (
          <div className="md:hidden bg-white shadow-lg px-4 pb-4 pt-4 space-y-4">
            {["spaces", "place-wanted", "team-up", "more-info"].map((item) => (
              <NavLink
                key={item}
                to={`/${item}`}
                className={({ isActive }) =>
                  `block ${linkClass} ${isActive ? activeClass : "text-[#565ABF]"
                  }`
                }
              >
                {item.replace("-", " ").replace(/\b\w/g, (c) => c.toUpperCase())}
              </NavLink>
            ))}

            {!user ? (
              <>
                <span className="flex space-x-2">
                  <button
                    onClick={() => setRegisterDialog(true)}
                    className="flex items-center text-[#565ABF] hover:text-[#A321A6]"
                  >
                    <LuUserPen size={30} className="mr-1" /> Register
                  </button>
                  /
                  <button
                    onClick={() => setLoginDialog(true)}
                    className="text-[#565ABF] hover:text-[#A321A6]"
                  >
                    Login
                  </button>
                </span>
                <button className="w-full flex items-center justify-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition">
                  <IoIosAddCircleOutline className="mr-1 text-lg" /> Post Ad
                </button>
              </>
            ) : (
              <div className="border-t pt-3">
                <div
                  onClick={() => setMobileDropdownOpen(!mobileDropdownOpen)}
                  className="flex items-center justify-between cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={
                        user.profile?.photo ||
                        require("../../assets/img/ghouraf/default-avatar.png")
                      }
                      alt="Profile"
                      className="w-10 h-10 rounded-full border"
                    />
                    <span className="font-semibold">
                      Hi, {user.profile.firstName?.split(" ")[0] || "User"}
                    </span>
                    <a href="/user" className="text-black hover:text-[#A321A6]">
                      <HiOutlineMail size={22} />
                    </a>
                  </div>
                  <span>{mobileDropdownOpen ? "▲" : "▼"}</span>
                </div>

                {mobileDropdownOpen && (
                  <div className="mt-3 space-y-2 pl-2">
                    <a href="/user" className="flex items-center py-1 hover:text-[#565ABF]">
                      <LuUserRound className="mr-2" /> My Account
                    </a>
                    <a
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        setOpen(true);
                      }}
                      className="flex items-center px-4 py-2 hover:text-[#565ABF]"
                    >
                      <FiPlusCircle className="mr-2" /> Post an Ad
                    </a>

                    <a href="/user/my-ads" className="flex items-center py-1 hover:text-[#565ABF]">
                      <GoSync className="mr-2" /> My Ads
                    </a>
                    <a href="/user/saved-ads" className="flex items-center py-1 hover:text-[#565ABF]">
                      <GrFavorite className="mr-2" /> Saved Ads
                    </a>
                    <a href="/user/messages" className="flex items-center py-1 hover:text-[#565ABF]">
                      <LuMessageSquareText className="mr-2" /> Messages
                    </a>
                    <a href="/user/edit-my-details" className="flex items-center py-1 hover:text-[#565ABF]">
                      <FiEdit className="mr-2" /> Edit My Details
                    </a>
                    <button
                      onClick={handleLogout}
                      className="flex items-center w-full py-1 hover:text-[#565ABF]"
                    >
                      <LuLogOut className="mr-2" /> Logout
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
        {loginDialog && (
          <div className="fixed inset-0 bg-black/60 flex justify-center items-center z-50 p-4">
            <div className="bg-white rounded-[17px] w-full max-w-lg relative shadow-lg
        sm:max-w-md md:max-w-lg">
              <button
                className="absolute top-2 right-3 text-gray-600 hover:text-black text-xl"
                onClick={() => setLoginDialog(false)}
              >
                ✕
              </button>

              <form onSubmit={handleLogin}>
                <div className="px-6 py-4 sm:px-4 sm:py-3">
                  <h3 className="text-2xl font-semibold text-black mb-4 sm:text-xl sm:mb-3">
                    Login
                  </h3>

                  <label className="text-sm font-medium text-gray-600">Email</label>
                  <div
                    className={`flex items-center mb-4 transition-all ${activeField === "email"
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
                      onFocus={() => setActiveField("email")}
                      className="flex-1 py-2 text-sm text-black placeholder:text-black outline-none"
                    />
                  </div>
                  <label className="text-sm font-medium text-gray-600">Password</label>
                  <div
                    className={`flex items-center mb-3 transition-all ${activeField === "password"
                      ? "border-b-2 border-[#A321A6]"
                      : "border-b border-gray-300"
                      }`}
                  >
                    <span className="text-gray-500 mr-2">
                      <GrLock color="black" />
                    </span>
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={form.password}
                      onChange={handleChange}
                      placeholder="Enter your password"
                      onFocus={() => setActiveField("password")}
                      className="flex-1 py-2 text-sm text-black placeholder:text-black outline-none"
                    />
                    <button
                      type="button"
                      className="text-gray-500"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
                    </button>
                  </div>

                  <div className="flex justify-between items-center mb-4 flex-wrap gap-2">
                    <label className="flex items-center space-x-2 text-sm text-[#1C1C1E]">
                      <input type="checkbox" className="w-4 h-4" />
                      <span>Remember me</span>
                    </label>
                    <button
    type="button"
    className="text-sm text-[#1C1C1E] hover:text-[#A321A6]"
    onClick={() => setForgotDialog(true)}
  >
    Forgot Password?
  </button>

                  </div>

                  <button
                    type="submit"
                    disabled={loginLoading}
                    className="w-full bg-[#565ABF] hover:bg-indigo-700 text-white font-semibold py-3 rounded-lg shadow-md mb-4 flex items-center justify-center sm:py-2"
                  >
                    {loginLoading ? (
                      <div className="flex items-center justify-center w-6 h-6">
                        <div className="transform scale-70">
                          <Loader />
                        </div>
                      </div>
                    ) : (
                      "Login"
                    )}
                  </button>

                  <div className="flex gap-4 mb-4 flex-col sm:flex-row">
                    <button
                      type="button"
                      onClick={handleGoogleLogin} 
                      className="flex-1 flex items-center justify-center gap-2 bg-[#565ABF] hover:bg-indigo-700 text-white font-semibold py-2 rounded-lg shadow-md">
                      <img src={google} alt="Google" className="w-5 h-5" />
                      Google
                    </button>
                    <button className="flex-1 flex items-center justify-center gap-2 bg-[#565ABF] hover:bg-indigo-700 text-white font-semibold py-2 rounded-lg shadow-md">
                      <IoLogoFacebook size={22} />
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

        {forgotDialog && (
    <div className="fixed inset-0 bg-black/60 flex justify-center items-center z-50 p-4">
      <div className="bg-white rounded-[17px] w-full max-w-md p-6 relative shadow-lg">
        <button
          className="absolute top-2 right-3 text-gray-600 hover:text-black text-xl"
          onClick={() => setForgotDialog(false)}
        >
          ✕
        </button>
        <h3 className="text-2xl font-semibold mb-4">Reset Password</h3>
        <input
          type="email"
          placeholder="Enter your email"
          value={forgotEmail}
          onChange={(e) => setForgotEmail(e.target.value)}
          className="w-full border p-2 mb-4 rounded"
        />
        <button
          onClick={handleForgotPassword}
          disabled={forgotLoading}
          className="w-full bg-[#565ABF] text-white py-2 rounded"
        >
          {forgotLoading ? "Sending..." : "Send Reset Link"}
        </button>
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
                        className={`flex items-center mb-2 transition-all ${activeField === "firstName"
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
                        className={`flex items-center mb-2 transition-all ${activeField === "lastName"
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
                        className={`flex items-center mb-2 transition-all ${activeField === "email"
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
                        className={`flex items-center mb-2 transition-all ${activeField === "gender"
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
                    className={`flex items-center mb-2 transition-all ${activeField === "dob"
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
                    className={`flex items-center mb-2 transition-all ${activeField === "password"
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
                    className={`flex items-center mb-2 transition-all ${activeField === "confirmPassword"
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
                    disabled={registerLoading}
                    className="w-full bg-[#565ABF] hover:bg-indigo-700 text-white font-semibold py-3 rounded-lg shadow-md mb-4 flex items-center justify-center"
                  >
                    {registerLoading ? (
                      <div className="flex items-center justify-center w-6 h-6">
                        <div className="transform scale-70">
                          <Loader />
                        </div>
                      </div>
                    ) : (
                      "Register"
                    )}
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

        {showEmailVerification && (
          <EmailVerification
            email={pendingEmail}
            onClose={() => setShowEmailVerification(false)}
          />
        )}
        <PostAdDialog open={open} onClose={() => setOpen(false)} />
      </nav>
    );
  }

import { useEffect, useRef, useState } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { IoIosAddCircleOutline, IoMdNotificationsOutline } from "react-icons/io";
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
import { signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup, FacebookAuthProvider } from "firebase/auth";
import { auth } from "../../firebase";
import { GoSync } from "react-icons/go";
import { FiEdit, FiPlusCircle } from "react-icons/fi";
import { useAuth } from "context/AuthContext";
import Loader from "components/common/Loader";
import EmailVerification from "components/user/EmailVerification";
import { getErrorMessage } from "utils/errorHandler";
import PostAdDialog from "components/common/PostAdDialog";
import ConfirmationDialog from "components/common/ConfirmationDialog";
import NotificationPanel from "components/common/NotificationPanel";

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
  const [errors, setErrors] = useState({});
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
  const [showInvalidDialog, setShowInvalidDialog] = useState(false);
  const [showMoreInfoMobile, setShowMoreInfoMobile] = useState(false);
  const dropdownRef = useRef(null);
  const dropdownRefMoreInfo = useRef(null);
  const mobileDropdownRef = useRef(null);
  const [dropdownMoreInfo, setDropdownMoreInfo] = useState(false);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
      if (dropdownRefMoreInfo.current && !dropdownRefMoreInfo.current.contains(event.target)) {
        setDropdownMoreInfo(false);
      }
      if (mobileDropdownRef.current && !mobileDropdownRef.current.contains(event.target)) {
        setMobileDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleDropdownAction = (action) => {
    setDropdownOpen(false);
    setMobileDropdownOpen(false);
    if (action) action();
  };


  const handleChange = (e) => {
    const { name, type, value, checked } = e.target;
    const fieldValue = type === "checkbox" ? checked : value;

    setForm((prev) => ({
      ...prev,
      [name]: fieldValue,
    }));

    validateField(name, fieldValue);
  };
  const isAtLeast12YearsOld = (dobString) => {
    if (!dobString) return false;

    const [year, month, day] = dobString.split("-").map(Number);
    const dob = new Date(year, month - 1, day); // avoid timezone shift
    const today = new Date();

    let age = today.getFullYear() - dob.getFullYear();
    const monthDiff = today.getMonth() - dob.getMonth();
    const dayDiff = today.getDate() - dob.getDate();

    // adjust if birthday hasn’t happened yet this year
    if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
      age--;
    }

    return age >= 12;
  };

  const validateField = (name, value) => {
    let message = "";

    switch (name) {
      case "firstName":
        if (!value.trim()) message = "First name is required";
        break;

      case "lastName":
        if (!value.trim()) message = "Last name is required";
        break;

      case "email":
        if (!value) message = "Email is required";
        else if (!/\S+@\S+\.\S+/.test(value)) message = "Invalid email format";
        break;

      case "gender":
        if (!value) message = "Please select your gender";
        break;

      case "dob":
        if (!value) message = "Date of birth is required";
        else if (!isAtLeast12YearsOld(value))
          message = "You must be at least 12 years old to register";
        break;


      case "password":
        if (!value) message = "Password is required";
        else if (value.length < 6)
          message = "Password must be at least 6 characters";
        break;

      case "confirmPassword":
        if (!value) message = "Please confirm your password";
        else if (value !== form.password) message = "Passwords do not match";
        break;

      case "termsAccepted":
        if (!value)
          message = "You must accept terms and conditions";
        break;

      default:
        break;
    }

    setErrors((prev) => ({ ...prev, [name]: message }));
  };


  const validateForm = () => {
    const newErrors = {};

    if (!form.firstName.trim()) newErrors.firstName = "First name is required";
    if (!form.lastName.trim()) newErrors.lastName = "Last name is required";

    if (!form.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(form.email)) {
      newErrors.email = "Invalid email format";
    }

    if (!form.gender) newErrors.gender = "Please select your gender";
    if (!form.dob) {
      newErrors.dob = "Date of birth is required";
    } else if (!isAtLeast12YearsOld(form.dob)) {
      newErrors.dob = "You must be at least 12 years old to register";
    }


    if (!form.password) {
      newErrors.password = "Password is required";
    } else if (form.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    if (!form.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (form.password !== form.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    if (!form.termsAccepted)
      newErrors.termsAccepted = "You must accept terms and conditions";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };


  const handleRegister = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

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
        if (res.message?.toLowerCase().includes("invalid email or password")) {
          setShowInvalidDialog(true);
        } else {
          toast.error(res.message || "Something went wrong. Try again later.");
        }
        return;
      }

      if (res.user) {
        // toast.success("Login Successful");
        setLoginDialog(false);
        const allowedPaths = ["/spaces", "/spaces/", "/team-up", "/place-wanted"];
        const isAllowedPath = allowedPaths.some((path) => location.pathname.startsWith(path));
        if (!isAllowedPath) {
          navigate("/user");
        }
        return;
      }

      toast.error("Unexpected login response");
    } catch (err) {
      const errorCode = err.code || "";
      if (errorCode === "auth/invalid-credential" || errorCode === "auth/wrong-password" || errorCode === "auth/user-not-found") {
        setShowInvalidDialog(true);
      } else {
        toast.error(getErrorMessage(err));
      }
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
    // toast.info("Logout Successful");
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

  const handleFacebookLogin = async () => {
    try {
      const provider = new FacebookAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const idToken = await result.user.getIdToken();

      const res = await login(idToken);

      if (res.user) {
        toast.success("Login Successful");
        setLoginDialog(false);
        setRegisterDialog(false);
        navigate("/user");
      } else if (res.error) {
        toast.error(res.message || "Facebook login failed");
        await auth.signOut();
      }
    } catch (err) {
      toast.error(err.message || "Facebook login failed");
      await auth.signOut();
    }
  };


  return (
    <nav className="bg-white top-0 left-0 w-full z-20 p-[5px] shadow-lg">
      <div className="container mx-auto user-layout">
        <div className="flex justify-between h-20 items-center">
          <NavLink to="/" className="flex items-center">
            <img
              src={require("../../assets/img/theme/Ghouraf.png")}
              className="lg:w-40 md:w-40 sm:w-80 w-60 object-cover"
              alt="Logo"
            />
          </NavLink>

          {/* DESKTOP MENU */}
          <div className="hidden lg:flex space-x-8 relative">
            {["spaces", "place-wanted", "team-up", "more-info"].map((item) => {
              if (item === "more-info") {
                return (
                  <div key={item} className="relative" ref={dropdownRefMoreInfo}>
                    <button
                      onClick={() => setDropdownMoreInfo((prev) => !prev)}
                      className={`font-semibold ${linkClass} text-[#565ABF]`}
                    >
                      More Info
                    </button>

                    {dropdownMoreInfo && (
                      <div className="absolute left-0 mt-2 w-40 bg-white shadow-lg rounded-lg z-50">
                        <NavLink
                          to="/about-us"
                          className="block px-4 py-2 text-[#565ABF] hover:bg-gray-100"
                          onClick={() => setDropdownMoreInfo(false)}
                        >
                          About Us
                        </NavLink>
                        <NavLink
                          to="/contact-us"
                          className="block px-4 py-2 text-[#565ABF] hover:bg-gray-100"
                          onClick={() => setDropdownMoreInfo(false)}
                        >
                          Contact Us
                        </NavLink>
                        <NavLink
                          to="/faq"
                          className="block px-4 py-2 text-[#565ABF] hover:bg-gray-100"
                          onClick={() => setDropdownMoreInfo(false)}
                        >
                          FAQ
                        </NavLink>
                      </div>
                    )}
                  </div>
                );
              }

              // default nav items
              return (
                <NavLink
                  key={item}
                  to={`/${item}`}
                  className={({ isActive }) =>
                    `font-semibold ${linkClass} ${isActive ? activeClass : "text-[#565ABF]"}`
                  }
                >
                  {item.replace("-", " ").replace(/\b\w/g, (c) => c.toUpperCase())}
                </NavLink>
              );
            })}

          </div>

          <div className="hidden lg:flex items-center space-x-6">
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
                <NotificationPanel userId={user?._id} isMobile={false} />
                <div className="relative" ref={dropdownRef}>
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
                      className="w-10 h-10 rounded-full border border-gray-300 object-cover"
                    />
                  </button>

                  {dropdownOpen && (
                    <div className="absolute right-0 mt-2 w-52 bg-[#E7E7E7] rounded-lg shadow-lg py-2 z-[9999]">
                      <a href="/user"
                        className="flex items-center px-4 py-2 hover:text-[#565ABF]"
                        onClick={() => handleDropdownAction()}
                      >
                        <LuUserRound className="mr-2" /> My Account
                      </a>
                      <a
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          handleDropdownAction(() => setOpen(true));
                        }}
                        className="flex items-center px-4 py-2 hover:text-[#565ABF]"
                      >
                        <FiPlusCircle className="mr-2" /> Post an Ad
                      </a>
                      <a href="/user/my-ads"
                        className="flex items-center px-4 py-2 hover:text-[#565ABF]"
                        onClick={() => handleDropdownAction()}
                      >
                        <GoSync className="mr-2" /> My Ads
                      </a>
                      <a href="/user/saved-ads"
                        className="flex items-center px-4 py-2 hover:text-[#565ABF]"
                        onClick={() => handleDropdownAction()}
                      >
                        <GrFavorite className="mr-2" /> Saved Ads
                      </a>
                      <a href="/user/messages"
                        className="flex items-center px-4 py-2 hover:text-[#565ABF]"
                        onClick={() => handleDropdownAction()}
                      >
                        <LuMessageSquareText className="mr-2" /> Messages
                      </a>
                      <a href="/user/edit-my-details"
                        className="flex items-center px-4 py-2 hover:text-[#565ABF]"
                        onClick={() => handleDropdownAction()}
                      >
                        <FiEdit className="mr-2" /> Edit My Details
                      </a>
                      <button
                        onClick={() => handleDropdownAction(handleLogout)}
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

          <div className="lg:hidden flex items-center space-x-4">
            {user && (
              <>
                <NotificationPanel userId={user?._id} isMobile={true} />
              </>
            )}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-purple-600 text-2xl"
            >
              <HiMenu size={40} />
            </button>
          </div>
        </div>
      </div>

      {/* MOBILE MENU */}
      <div
        className={`
    fixed inset-0 z-[999] bg-white transform transition-transform duration-300 lg:hidden
    ${isOpen ? "translate-x-0" : "translate-x-full"}
  `}
      >
        <div className="px-4 py-2 space-y-4 h-full overflow-y-auto relative">
          <div className="flex items-center justify-between">
            <NavLink to="/" className="flex items-center">
              <img
                src={require("../../assets/img/theme/Ghouraf.png")}
                className="lg:w-40 md:w-40 sm:w-80 w-60 object-cover"
                alt="Logo"
              />
            </NavLink>

            {/* CLOSE BUTTON */}
            <button
              onClick={() => setIsOpen(false)}
              className="text-[#565ABF] text-3xl"
            >
              <HiX size={40} />
            </button>
          </div>
          {/* <div className="lg:hidden bg-white shadow-lg px-4 pb-4 pt-4 space-y-4"> */}
          {["spaces", "place-wanted", "team-up", "more-info"].map((item) => {
            if (item === "more-info") {
              return (
                <div key={item} className="space-y-1">
                  <button
                    onClick={() => setShowMoreInfoMobile((prev) => !prev)}
                    className={`flex justify-between items-center w-full text-left ${linkClass} text-[#565ABF]`}
                  >
                    <span>{item.replace("-", " ").replace(/\b\w/g, (c) => c.toUpperCase())}</span>
                    {/* <span>{showMoreInfoMobile ? "▲" : "▼"}</span> */}
                  </button>

                  {showMoreInfoMobile && (
                    <div className="pl-4 space-y-2">
                      <NavLink
                        to="/about-us"
                        onClick={() => setIsOpen(false)}
                        className="block text-[#565abf] hover:text-[#565ABF]"
                      >
                        About Us
                      </NavLink>
                      <NavLink
                        to="/contact-us"
                        onClick={() => setIsOpen(false)}
                        className="block text-[#565abf] hover:text-[#565ABF]"
                      >
                        Contact Us
                      </NavLink>
                      <NavLink
                        to="/faq"
                        onClick={() => setIsOpen(false)}
                        className="block text-[#565abf] hover:text-[#565ABF]"
                      >
                        FAQ
                      </NavLink>
                    </div>
                  )}
                </div>
              );
            }

            // Default links
            return (
              <NavLink
                key={item}
                to={`/${item}`}
                onClick={() => setIsOpen(false)}
                className={({ isActive }) =>
                  `block ${linkClass} ${isActive ? activeClass : "text-[#565ABF]"}`
                }
              >
                {item.replace("-", " ").replace(/\b\w/g, (c) => c.toUpperCase())}
              </NavLink>
            );
          })}


          {!user ? (
            <>
              <span className="flex items-center space-x-2">
                <button
                  onClick={() => { setIsOpen(false); setRegisterDialog(true); }}
                  className="flex items-center text-[#565ABF] hover:text-[#A321A6]"
                >
                  <LuUserPen size={30} className="mr-1" /> Register
                </button>
                <span>/</span>
                <button
                  onClick={() => { setIsOpen(false); setLoginDialog(true); }}
                  className="text-[#565ABF] hover:text-[#A321A6]"
                >
                  Login
                </button>
              </span>
              {/* <button className="w-full flex items-center justify-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition">
                <IoIosAddCircleOutline className="mr-1 text-lg" /> Post Ad
              </button> */}
              <button className="w-full flex items-center justify-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition" onClick={() => { setIsOpen(false); setOpen(true); }}>
                <IoIosAddCircleOutline className="mr-1 text-lg" />
                <span className="ml-2 pl-2 border-l border-white">Post Ad</span>
              </button>
            </>
          ) : (
            <div className="border-t pt-3" ref={mobileDropdownRef}>
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
                    className="w-10 h-10 rounded-full border object-cover"
                  />
                  <span className="font-semibold">
                    Hi, {user.profile.firstName?.split(" ")[0] || "User"}
                  </span>
                  {/* <NotificationPanel userId={user?._id} isMobile={true} /> */}
                </div>
                <span>{mobileDropdownOpen ? "▲" : "▼"}</span>
              </div>

              {mobileDropdownOpen && (
                <div className="mt-3 space-y-2 pl-2">
                  <a href="/user"
                    className="flex items-center py-1 hover:text-[#565ABF]"
                    onClick={() => { setIsOpen(false); handleDropdownAction(); }}
                  >
                    <LuUserRound className="mr-2" /> My Account
                  </a>
                  <a
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      setIsOpen(false);
                      handleDropdownAction(() => setOpen(true));
                    }}
                    className="flex items-center py-2 hover:text-[#565ABF]"
                  >
                    <FiPlusCircle className="mr-2" /> Post an Ad
                  </a>

                  <a href="/user/my-ads"
                    className="flex items-center py-1 hover:text-[#565ABF]"
                    onClick={() => { setIsOpen(false); handleDropdownAction(); }}
                  >
                    <GoSync className="mr-2" /> My Ads
                  </a>
                  <a href="/user/saved-ads"
                    className="flex items-center py-1 hover:text-[#565ABF]"
                    onClick={() => { setIsOpen(false); handleDropdownAction(); }}
                  >
                    <GrFavorite className="mr-2" /> Saved Ads
                  </a>
                  <a href="/user/messages"
                    className="flex items-center py-1 hover:text-[#565ABF]"
                    onClick={() => { setIsOpen(false); handleDropdownAction(); }}
                  >
                    <LuMessageSquareText className="mr-2" /> Messages
                  </a>
                  <a href="/user/edit-my-details"
                    className="flex items-center py-1 hover:text-[#565ABF]"
                    onClick={() => { setIsOpen(false); handleDropdownAction(); }}
                  >
                    <FiEdit className="mr-2" /> Edit My Details
                  </a>
                  <button
                    onClick={() => { setIsOpen(false); handleDropdownAction(handleLogout); }}
                    className="flex items-center w-full py-1 hover:text-[#565ABF]"
                  >
                    <LuLogOut className="mr-2" /> Logout
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      {loginDialog && (
        <div className="fixed inset-0 bg-black/60 flex justify-center items-center z-50 p-4">
          <div className="bg-white rounded-[17px] w-full max-w-lg relative shadow-lg">
            <button
              className="absolute top-2 right-3 text-gray-600 hover:text-black text-xl"
              onClick={() => setLoginDialog(false)}
            >
              ✕
            </button>

            <form onSubmit={handleLogin}>
              <div className="login-padding">
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

                <div className="flex gap-4 mb-4">
                  <button
                    type="button"
                    onClick={handleGoogleLogin}
                    className="flex-1 flex items-center justify-center gap-2 bg-[#565ABF] hover:bg-indigo-700 text-white font-semibold py-2 rounded-lg shadow-md">
                    <img src={google} alt="Google" className="w-5 h-5" />
                    Google
                  </button>
                  <button
                    type="button"
                    onClick={handleFacebookLogin}
                    className="flex-1 flex items-center justify-center gap-2 bg-[#565ABF] hover:bg-indigo-700 text-white font-semibold py-2 rounded-lg shadow-md">
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
        <div className="fixed inset-0 bg-black/60 flex justify-center items-center z-50">
          <div className="bg-white rounded-[17px] w-[90%] sm:w-[80%] md:w-[600px] lg:w-[500px] relative shadow-lg top-[12px] max-h-[90vh] overflow-y-auto no-scrollbar sm:p-1 md:p-4 lg:p-4">

            <button
              className="absolute top-0 right-4 text-gray-600 hover:text-black text-xl mt-2"
              onClick={() => setRegisterDialog(false)}
            >
              ✕
            </button>
            <form onSubmit={handleRegister}>
              <div className="px-5 py-4">
                <h3 className="text-2xl font-semibold text-black mb-2">
                  Create Account
                </h3>
                <div className="flex flex-col sm:flex-row lg:gap-5 md:gap-5">
                  <div className="w-full">
                    <label className="text-sm font-medium text-gray-600 mb-0">
                      First Name
                    </label>
                    <div
                      className={`flex items-center transition-all ${activeField === "firstName"
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
                        onFocus={() => setActiveField("firstName")}
                        className="flex-1 py-2 text-sm text-black placeholder:text-black outline-none"
                      />
                    </div>
                    {errors.firstName && (
                      <p className="text-red-500 text-xs">{errors.firstName}</p>
                    )}
                  </div>
                  <div className="w-full">
                    <label className="text-sm font-medium text-gray-600 mb-0">
                      Last Name
                    </label>
                    <div
                      className={`flex items-center transition-all ${activeField === "lastName"
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
                        onFocus={() => setActiveField("lastName")}
                        className="flex-1 py-2 text-sm text-black placeholder:text-black outline-none"
                      />
                    </div>
                    {errors.lastName && (
                      <p className="text-red-500 text-xs">{errors.lastName}</p>
                    )}

                  </div>
                </div>

                <div className="flex flex-col sm:flex-row lg:gap-5 md:gap-5">
                  <div className="w-full">
                    <label className="text-sm font-medium text-gray-600 mb-0">
                      Email
                    </label>
                    <div
                      className={`flex items-center transition-all ${activeField === "email"
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
                    {errors.email && (
                      <p className="text-red-500 text-xs">{errors.email}</p>
                    )}
                  </div>
                  <div className="w-full">
                    <label className="text-sm font-medium text-gray-600 mb-0">
                      Gender
                    </label>
                    <div
                      className={`flex items-center transition-all ${activeField === "gender"
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
                        className="flex-1 py-2 text-sm text-black placeholder:text-black outline-none"
                      >
                        <option value="">Select Gender</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                      </select>
                    </div>
                    {errors.gender && (
                      <p className="text-red-500 text-xs">{errors.gender}</p>
                    )}
                  </div>
                </div>

                <label className="text-sm font-medium text-gray-600 mb-0">
                  Date of Birth
                </label>
                <div
                  className={`flex items-center transition-all ${activeField === "dob"
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
                    onFocus={() => setActiveField("dob")}
                    max={new Date(new Date().setFullYear(new Date().getFullYear() - 12))
                      .toISOString()
                      .split("T")[0]}
                    className="flex-1 py-2 text-sm text-black placeholder:text-black outline-none"
                  />
                </div>
                {errors.dob && (
                  <p className="text-red-500 text-xs">{errors.dob}</p>
                )}

                <label className="text-sm font-medium text-gray-600 mb-0">
                  Password
                </label>
                <div
                  className={`flex items-center transition-all ${activeField === "password"
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
                {errors.password && (
                  <p className="text-red-500 text-xs">{errors.password}</p>
                )}

                <label className="text-sm font-medium text-gray-600 mb-0">
                  Confirm Password
                </label>
                <div
                  className={`flex items-center transition-all ${activeField === "confirmPassword"
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
                {errors.confirmPassword && (
                  <p className="text-red-500 text-xs">{errors.confirmPassword}</p>
                )}

                <div className="flex justify-between items-center mt-1">
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
                {errors.termsAccepted && (
                  <p className="text-red-500 text-xs mb-4">{errors.termsAccepted}</p>
                )}

                <button
                  type="submit"
                  disabled={registerLoading}
                  className="w-full bg-[#565ABF] hover:bg-indigo-700 text-white font-semibold py-2 rounded-lg shadow-md mb-2 flex items-center justify-center"
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


                <div className="flex gap-4 mb-2">
                  <button
                    type="button"
                    onClick={handleGoogleLogin}
                    className="flex-1 flex items-center justify-center gap-2 bg-[#565ABF] hover:bg-indigo-700 text-white font-semibold py-2 rounded-lg shadow-md">
                    <img src={google} alt="Google" className="w-5 h-5" />
                    Google
                  </button>
                  <button
                    type="button"
                    onClick={handleFacebookLogin}
                    className="flex-1 flex items-center justify-center gap-2 bg-[#565ABF] hover:bg-indigo-700 text-white font-semibold py-2 rounded-lg shadow-md">
                    <IoLogoFacebook size={25} />
                    Facebook
                  </button>
                </div>

                <p className="text-center text-sm text-[#000000]">
                  Already have an account?{" "}
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
      <ConfirmationDialog
        className="navbar-confirm-dialog"
        show={showInvalidDialog}
        title="Invalid Credentials"
        message="The email or password you entered is incorrect. Please try again."
        onConfirm={() => { }}
        onCancel={() => setShowInvalidDialog(false)}
      />
      <style>
        {`
    .navbar-confirm-dialog .bg-white button.bg-red-600 {
      display: none !important;
    }
  `}
      </style>

    </nav>
  );
}

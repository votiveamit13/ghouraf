import { useState } from "react";
import { FaFacebookF, FaTwitter, FaInstagram } from "react-icons/fa";
import { FiPhoneCall } from "react-icons/fi";
import { LuMailOpen } from "react-icons/lu";
import { IoIosArrowForward } from "react-icons/io";
import { FaArrowRightLong } from "react-icons/fa6";
import { NavLink } from "react-router-dom";

export default function Footer() {
    const apiUrl = process.env.REACT_APP_API_URL;
  const [email, setEmail] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubscribe = async () => {
    setError("");
    setSuccess("");

    if (!email) {
      setError("Email is required");
      return;
    }

    const emailRegex = /\S+@\S+\.\S+/;
    if (!emailRegex.test(email)) {
      setError("Invalid email format");
      return;
    }

    if (!agreed) {
      setError("You must agree to the terms & conditions");
      return;
    }

    try {
      const res = await fetch(`${apiUrl}subscribe`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, agreedToTerms: agreed }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Something went wrong");
      } else {
        setSuccess(data.message || "Subscribed successfully!");
        setEmail("");
        setAgreed(false);
      }
    } catch (err) {
      setError("Something went wrong");
    }
  };

  return (
    <footer className="bg-black text-gray-300 pt-12 pb-3">
      <div className="container mx-auto lg:px-6 md:px-6 sm:px-2 px-4 grid grid-cols-1 md:grid-cols-3 gap-10 mb-3">
        {/* Office Address */}
        <div>
          <NavLink to="/" className="flex items-center">
            <img
              src={require("../../assets/img/theme/Ghouraf.png")}
              className="lg:w-60 md:w-60 sm:w-80 w-60 object-cover"
              alt="Logo"
            />
          </NavLink>
          {/* <h3 className="text-white font-semibold mb-4">Office Address</h3>
          <p className="text-sm mb-1">Head office:</p>
          <p className="text-sm font-semibold">Address Will Goes Here</p> */}
        
                <div className="flex space-x-4">
          {/* <a href="/" className="w-8 h-8 flex items-center justify-center">
            <FaFacebookF />
          </a>
          <a href="/" className="w-8 h-8 flex items-center justify-center">
            <FaTwitter />
          </a> */}
          <a href="/" className="w-8 h-8 flex items-center justify-center">
            <FaInstagram />
          </a>
        </div>
        </div>
        {/* Contact */}
        {/* <div>
          <h3 className="text-white font-semibold mb-4">Contact</h3>
          <div className="mb-3 flex items-center gap-3">
            <FiPhoneCall size={32} />
            <div>
              <p className="text-sm">Hotline:</p>
              <p className="text-sm font-semibold">(+012) 345-67890</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <LuMailOpen size={32} />
            <div>
              <p className="text-sm">Email:</p>
              <p className="text-sm font-semibold">ghouraf@info.com</p>
            </div>
          </div>
        </div> */}

        {/* Our Company */}
        <div>
          <h3 className="text-white font-semibold mb-4">Our Company</h3>
          <ul className="space-y-2 text-sm">
            {[
              { href: "/", label: "Home" },
              { href: "/about-us", label: "About Us" },
              { href: "/faq", label: "FAQ" },
              { href: "/contact-us", label: "Contact Us" },
              { href: "/safety-tips", label: "Safety & Tips" },
              { href: "/advice", label: "Advice" },
              { href: "/privacy-policy", label: "Privacy Policy" },
              { href: "/terms-and-conditions", label: "Terms & Conditions" },
            ].map((item) => (
              <li key={item.href}>
                <a href={item.href} className="hover:text-white flex items-center gap-1">
                  <IoIosArrowForward color="#565ABF" /> {item.label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Newsletter */}
        <div>
          <h3 className="text-white font-semibold mb-4">Newsletter</h3>
          <p className="text-sm mb-3">Sign up to receive the latest articles</p>
          <input
            type="email"
            placeholder="Your email address"
            className="w-full p-3 rounded-md mb-2 text-black focus:outline-none"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <div className="flex items-center text-xs mb-2">
            <input
              type="checkbox"
              className="mr-2"
              checked={agreed}
              onChange={(e) => setAgreed(e.target.checked)}
            />
            <span>I have read and agree to the terms & conditions</span>
          </div>
          {error && <p className="text-red-500 text-xs mb-2">{error}</p>}
          {success && <p className="text-green-500 text-xs mb-2">{success}</p>}
          <button
            className="w-full hover:bg-gray-700 text-white p-3 border font-semibold rounded-md flex items-center justify-center gap-2"
            onClick={handleSubscribe}
          >
            Sign Up <FaArrowRightLong />
          </button>
        </div>
      </div>

      {/* Footer Bottom */}
      {/* <div className="pt-6 flex flex-row md:flex-row items-center justify-between max-w-7xl mx-auto lg:px-6 md:px-6 sm:px-2 px-4">
        <p className="text-white font-semibold"></p>
        <div className="flex space-x-4">
          <a href="/" className="w-8 h-8 flex items-center justify-center">
            <FaFacebookF />
          </a>
          <a href="/" className="w-8 h-8 flex items-center justify-center">
            <FaTwitter />
          </a>
          <a href="/" className="w-8 h-8 flex items-center justify-center">
            <FaInstagram />
          </a>
        </div>
      </div> */}
    </footer>
  );
}

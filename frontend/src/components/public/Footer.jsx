import { FaFacebookF, FaTwitter, FaInstagram } from "react-icons/fa";
import { FiPhoneCall } from "react-icons/fi";
import { LuMailOpen } from "react-icons/lu";
import { IoIosArrowForward } from "react-icons/io";

export default function Footer() {
  return (
    <footer className="bg-black text-gray-300 pt-12 pb-3">
      <div className="max-w-7xl mx-auto lg:px-6 md:px-6 sm:px-2 px-4 grid grid-cols-1 md:grid-cols-4 gap-10">
        <div>
          <h3 className="text-white font-semibold mb-4">Office Address</h3>
          <p className="text-sm mb-1">Head office:</p>
          <p className="text-sm font-semibold">Address Will Goes Here</p>
        </div>

        <div>
          <h3 className="text-white font-semibold mb-4">Contact</h3>
          <div className="mb-3 d-flex align-items-center gap-3">
            <div>
              <FiPhoneCall size={32} />
            </div>
            <div>
              <p className="text-sm">Hotline:</p>
              <p className="text-sm font-semibold">(+012) 345-67890</p>
            </div>
          </div>
          <div className="d-flex align-items-center gap-3">
            <div>
                <LuMailOpen size={32}/>
            </div>
            <div>
            <p className="text-sm">Email:</p>
            <p className="text-sm font-semibold">ghouraf@info.com</p>
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-white font-semibold mb-4">Our Company</h3>
          <ul className="space-y-2 text-sm">
            <li>
              <a href="/" className="hover:text-white d-flex align-items-center">
                <IoIosArrowForward color="#565ABF"/> Home
              </a>
            </li>
            <li>
              <a href="/" className="hover:text-white d-flex align-items-center">
                <IoIosArrowForward color="#565ABF"/> About
              </a>
            </li>
            <li>
              <a href="/" className="hover:text-white d-flex align-items-center">
                <IoIosArrowForward color="#565ABF"/> Services
              </a>
            </li>
            <li>
              <a href="/" className="hover:text-white d-flex align-items-center">
                <IoIosArrowForward color="#565ABF"/> Who We Are
              </a>
            </li>
            <li>
              <a href="/" className="hover:text-white d-flex align-items-center">
                <IoIosArrowForward color="#565ABF"/> Contact Us
              </a>
            </li>
            <li>
              <a href="/" className="hover:text-white d-flex align-items-center">
                <IoIosArrowForward color="#565ABF"/> Privacy Policy
              </a>
            </li>
            <li>
              <a href="/" className="hover:text-white d-flex align-items-center">
                <IoIosArrowForward color="#565ABF"/> Terms & Conditions
              </a>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="text-white font-semibold mb-4">Newsletter</h3>
          <p className="text-sm mb-3">Sign up to receive the latest articles</p>
          <input
            type="email"
            placeholder="Your email address"
            className="w-full p-3 rounded-md mb-3 text-black focus:outline-none"
          />
          <button className="w-full hover:bg-gray-700 text-white p-3 border font-semibold rounded-md mb-3 flex items-center justify-center">
            Sign Up →
          </button>
          <div className="flex items-center text-xs">
            <input type="checkbox" className="mr-2" />
            <span>I have read and agree to the terms & conditions</span>
          </div>
        </div>
      </div>

      <div className="pt-6 flex flex-row md:flex-row items-center justify-between  max-w-7xl mx-auto lg:px-6 md:px-6 sm:px-2 px-4">
        <p className="text-white font-semibold">Ghouraf</p>
        <div className="flex space-x-4">
          <a
            href="/"
            className="w-8 h-8 flex items-center justify-center"
          >
            <FaFacebookF />
          </a>
          <a
            href="/"
            className="w-8 h-8 flex items-center justify-center"
          >
            <FaTwitter />
          </a>
          <a
            href="/"
            className="w-8 h-8 flex items-center justify-center"
          >
            <FaInstagram />
          </a>
        </div>
      </div>
    </footer>
  );
}

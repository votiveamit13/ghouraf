import { useState } from "react";
import { NavLink } from "react-router-dom";
import { IoIosAddCircleOutline } from "react-icons/io";
import { HiMenu, HiX } from "react-icons/hi";
import { Img } from "react-image";
import { LuUserPen } from "react-icons/lu";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const linkClass = "hover:text-[#A321A6]";
  const activeClass = "text-purple-600";

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
              to="/browse"
              onClick={(e) => e.preventDefault()}
              className={({ isActive }) =>
                `font-semibold ${linkClass} ${isActive ? activeClass : "text-[#565ABF]"}`
              }
            >
              Browse
            </NavLink>
            <NavLink
              to="/place-wanted"
              onClick={(e) => e.preventDefault()}
              className={({ isActive }) =>
                `font-semibold ${linkClass} ${isActive ? activeClass : "text-[#565ABF]"}`
              }
            >
              Place Wanted
            </NavLink>
            <NavLink
              to="/team-up"
              className={({ isActive }) =>
                `font-semibold ${linkClass} ${isActive ? activeClass : "text-[#565ABF]"}`
              }
            >
              Team Up
            </NavLink>
            <NavLink
              to="/more-info"
              className={({ isActive }) =>
                `font-semibold ${linkClass} ${isActive ? activeClass : "text-[#565ABF]"}`
              }
            >
              More Info
            </NavLink>
          </div>

          <div className="hidden md:flex items-center space-x-6">
            <div className="hidden md:flex items-center space-x-2">
              <NavLink
                to="/register"
                className={({ isActive }) =>
                  `font-semibold flex items-center ${linkClass} ${
                    isActive ? activeClass : "text-[#565ABF]"
                  }`
                }
              >
                <LuUserPen size={30} className="mr-1" /> Register
              </NavLink>

              <span className="text-[#565ABF]">/</span>

              <NavLink
                to="/login"
                className={({ isActive }) =>
                  `font-semibold flex items-center ${linkClass} ${
                    isActive ? activeClass : "text-[#565ABF]"
                  }`
                }
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
            to="/browse"
            className={({ isActive }) =>
              `block ${linkClass} ${isActive ? activeClass : "text-[#565ABF]"}`
            }
          >
            Browse
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
              to="/register"
              className={({ isActive }) =>
                `flex items-center ${linkClass} ${
                  isActive ? activeClass : "text-[#565ABF]"
                }`
              }
            >
              <LuUserPen size={30} className="mr-1" /> Register
            </NavLink>
            /
            <NavLink
              to="/login"
              className={({ isActive }) =>
                `flex items-center ${linkClass} ${
                  isActive ? activeClass : "text-[#565ABF]"
                }`
              }
            >
              Login
            </NavLink>
          </span>

          <button className="w-full flex items-center justify-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition">
            <IoIosAddCircleOutline className="mr-1 text-lg" /> Post Ad
          </button>
        </div>
      )}
    </nav>
  );
}

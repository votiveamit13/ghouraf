import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { FiSearch } from "react-icons/fi";
import routes from "../../../routes";
import { useAdminAuth } from "context/AdminAuthContext";

const AdminNavbar = () => {
  const { admin } = useAdminAuth();
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const searchRef = useRef(null);
  const mobileMenuRef = useRef(null); // Separate ref for mobile menu

  const adminName =
    admin?.profile?.firstName && admin?.profile?.lastName
      ? `${admin.profile.firstName} ${admin.profile.lastName}`
      : "Admin User";

  const adminImage =
    admin?.profile?.photo && admin.profile.photo !== "/uploads/undefined"
      ? `${admin.profile.photo}`
      : require("../../../assets/img/theme/team-4-800x800.jpg");

  const getSidebarOptions = (routes) => {
    const options = [];

    const processRoute = (route) => {
      if (route.showInSidebar === false) return;

      if (route.subRoutes) {
        route.subRoutes.forEach((sub) => {
          if (sub.showInSidebar !== false) {
            options.push({
              name: sub.name,
              path: sub.layout + sub.path,
            });
          }
        });
      } else if (route.path) {
        options.push({
          name: route.name,
          path: route.layout + route.path,
        });
      }
    };

    routes.forEach(processRoute);
    return options;
  };

  const sidebarOptions = getSidebarOptions(routes);

  const filteredOptions = sidebarOptions.filter((opt) =>
    opt.name.toLowerCase().includes(query.toLowerCase())
  );

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    navigate("/admin/login");
    toast.success("Logout Successful");
  };

  const handleProfileClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsMenuOpen(false);
    navigate("/admin/profile");
  };

  const handleLogoutClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsMenuOpen(false);
    // Use setTimeout to ensure menu closes before navigation
    setTimeout(() => {
      handleLogout();
    }, 100);
  };

  const handleSearchOptionClick = (path) => {
    setQuery("");
    setShowDropdown(false);
    navigate(path);
  };

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      // Close user menu - check both mobile and desktop menu refs
      const isOutsideMobileMenu = mobileMenuRef.current && !mobileMenuRef.current.contains(event.target);
      const isOutsideDesktopMenu = menuRef.current && !menuRef.current.contains(event.target);
      
      if (isOutsideMobileMenu && isOutsideDesktopMenu) {
        setIsMenuOpen(false);
      }
      
      // Close search dropdown
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside);
    
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, []);

  return (
    <nav className="absolute top-0 left-0 w-full z-50 px-[20px] md:px-[40px] py-3">
      {/* Mobile Header */}
      <div className="flex items-center justify-between md:hidden mb-3">
        <h1 className="text-white font-semibold text-sm uppercase">Admin Panel</h1>

        <div
          className="relative flex items-center space-x-2 cursor-pointer"
          ref={mobileMenuRef} // Use separate ref for mobile
        >
          <div 
            className="flex items-center space-x-2"
            onClick={() => setIsMenuOpen((prev) => !prev)}
          >
            <img
              src={adminImage}
              alt="User"
              className="w-12 h-12 rounded-full object-cover"
              onError={(e) => {
                e.target.src = require("../../../assets/img/theme/team-4-800x800.jpg");
              }}
            />
            <span className="text-white text-sm font-medium">{adminName}</span>
          </div>

          {isMenuOpen && (
            <div className="absolute right-0 top-14 w-48 bg-white text-gray-700 rounded-md shadow-lg z-50">
              <Link 
                to="/admin/profile"
                onClick={(e) => {
                  e.preventDefault();
                  setIsMenuOpen(false);
                  navigate("/admin/profile");
                }}
                className="block px-4 py-2 hover:bg-gray-100 text-left w-full"
              >
                My Profile
              </Link>
              <hr />
              <button
                onClick={handleLogoutClick}
                className="w-full text-left px-4 py-2 hover:bg-gray-100"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Desktop Header */}
      <div className="hidden md:flex items-center justify-between">
        <h1 className="text-white font-semibold text-sm uppercase">Admin Panel</h1>

        <div className="relative w-80" ref={searchRef}>
          <div className="flex items-center bg-transparent border border-white/50 rounded-full px-3 py-2 text-white">
            <FiSearch className="mr-2 text-gray-200" />
            <input
              type="text"
              placeholder="Search Module"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setShowDropdown(e.target.value.length > 0);
              }}
              className="bg-transparent focus:outline-none text-sm flex-1 placeholder-gray-200 text-white"
            />
          </div>

          {showDropdown && filteredOptions.length > 0 && (
            <div className="absolute mt-1 w-full bg-white text-gray-900 rounded-md shadow-lg z-50 max-h-64 overflow-auto">
              {filteredOptions.map((opt) => (
                <button
                  key={opt.path}
                  onClick={() => handleSearchOptionClick(opt.path)}
                  className="w-full text-left px-4 py-2 hover:bg-gray-100"
                >
                  {opt.name}
                </button>
              ))}
            </div>
          )}
        </div>

        <div
          className="relative flex items-center space-x-2 cursor-pointer"
          ref={menuRef}
        >
          <div 
            className="flex items-center space-x-2"
            onClick={() => setIsMenuOpen((prev) => !prev)}
          >
            <img
              src={adminImage}
              alt="User"
              className="w-12 h-12 rounded-full object-cover"
              onError={(e) => {
                e.target.src = require("../../../assets/img/theme/team-4-800x800.jpg");
              }}
            />
            <span className="text-white text-sm font-medium">{adminName}</span>
          </div>

          {isMenuOpen && (
            <div className="absolute right-0 top-14 w-48 bg-white text-gray-700 rounded-md shadow-lg z-50">
              <Link 
                to="/admin/profile"
                onClick={(e) => {
                  e.preventDefault();
                  setIsMenuOpen(false);
                  navigate("/admin/profile");
                }}
                className="block px-4 py-2 hover:bg-gray-100"
              >
                My Profile
              </Link>
              <hr />
              <button
                onClick={handleLogoutClick}
                className="w-full text-left px-4 py-2 hover:bg-gray-100"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Search */}
      <div className="md:hidden" ref={searchRef}>
        <div className="relative w-full">
          <div className="flex items-center bg-transparent border border-white/50 rounded-full px-3 py-2 text-white">
            <FiSearch className="mr-2 text-gray-200" />
            <input
              type="text"
              placeholder="Search Module"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setShowDropdown(e.target.value.length > 0);
              }}
              className="bg-transparent focus:outline-none text-sm flex-1 placeholder-gray-200 text-white"
            />
          </div>

          {/* Mobile Search Dropdown */}
          {showDropdown && filteredOptions.length > 0 && (
            <div className="absolute mt-1 w-full bg-white text-gray-900 rounded-md shadow-lg z-50 max-h-64 overflow-auto">
              {filteredOptions.map((opt) => (
                <button
                  key={opt.path}
                  onClick={() => handleSearchOptionClick(opt.path)}
                  className="w-full text-left px-4 py-2 hover:bg-gray-100"
                >
                  {opt.name}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default AdminNavbar;
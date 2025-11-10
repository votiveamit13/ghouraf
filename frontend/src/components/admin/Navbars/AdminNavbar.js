import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { FiSearch } from "react-icons/fi";
import routes from "../../../routes";

const AdminNavbar = () => {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef(null);

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

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <nav className="absolute top-0 left-0 w-full z-50 px-[40px] py-3 flex items-center justify-between">
      <h1 className="text-white font-semibold text-sm uppercase">
        Admin Panel
      </h1>

      <div className="relative w-80">
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
                onClick={() => {
                  setQuery("");
                  setShowDropdown(false);
                  navigate(opt.path);
                }}
                className="w-full text-left px-4 py-2 hover:bg-gray-100"
              >
                {opt.name}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="relative" ref={menuRef}>
        <div
          className="flex items-center space-x-2 cursor-pointer"
          onClick={() => setIsMenuOpen((prev) => !prev)}
        >
          <img
            src={require("../../../assets/img/theme/team-4-800x800.jpg")}
            alt="User"
            className="w-8 h-8 rounded-full"
          />
          <span className="text-white text-sm font-medium">Admin User</span>
        </div>

        {isMenuOpen && (
          <div className="absolute right-0 top-10 w-48 bg-white text-gray-700 rounded-md shadow-lg z-50">
            <Link
              to="/admin/user-profile"
              className="block px-4 py-2 hover:bg-gray-100"
            >
              My Profile
            </Link>
            {/* <Link
              to="/admin/settings"
              className="block px-4 py-2 hover:bg-gray-100"
            >
              Settings
            </Link>
            <Link
              to="/admin/activity"
              className="block px-4 py-2 hover:bg-gray-100"
            >
              Activity
            </Link>
            <Link
              to="/admin/support"
              className="block px-4 py-2 hover:bg-gray-100"
            >
              Support
            </Link> */}
            <hr />
            <button
              onClick={handleLogout}
              className="w-full text-left px-4 py-2 hover:bg-gray-100"
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default AdminNavbar;

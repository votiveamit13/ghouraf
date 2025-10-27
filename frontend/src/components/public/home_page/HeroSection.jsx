import { useState } from "react";
import { FiSearch } from "react-icons/fi";
import heroImage from "assets/img/ghouraf/hero-section.jpg";
import { useNavigate } from "react-router-dom";
import { City } from "country-state-city";
import { getFullLocation } from "utils/locationHelper";

export default function HeroSection() {
  const [activeTab, setActiveTab] = useState("spaces");
  const [searchInput, setSearchInput] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState({
    city: "",
    stateCode: "",
    countryCode: "",
  });

  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const value = e.target.value;
    setSearchInput(value);

    if (!value || value.trim().length < 2) {
      setSuggestions([]);
      return;
    }

    const lower = value.toLowerCase();
    const matchedCities = City.getAllCities()
      .filter(
        (c) =>
          c.name.toLowerCase().includes(lower) ||
          c.stateCode?.toLowerCase().includes(lower) ||
          c.countryCode?.toLowerCase().includes(lower)
      )
      .slice(0, 10);

    const formatted = matchedCities.map((c) => ({
      city: c.name,
      stateCode: c.stateCode,
      countryCode: c.countryCode,
    }));

    setSuggestions(formatted);
    setShowDropdown(true);
  };

  const handleSelectSuggestion = (item) => {
    const fullLocation = getFullLocation(item.city, item.stateCode, item.countryCode);
    setSearchInput(fullLocation);
    setSelectedLocation(item);
    setShowDropdown(false);
  };

  const handleSearch = () => {
    if (!searchInput.trim()) return;

    const { city, stateCode, countryCode } = selectedLocation;

    if (activeTab === "spaces") {
      navigate(`/spaces?city=${city}&state=${stateCode}&country=${countryCode}`);
    } else if (activeTab === "place wanted") {
      navigate(`/place-wanted?city=${city}&state=${stateCode}&country=${countryCode}`);
    } else if (activeTab === "team up") {
      navigate(`/team-up?city=${city}&state=${stateCode}&country=${countryCode}`);
    }
  };

  return (
    <section
      className="relative bg-cover bg-center flex items-center justify-center"
      style={{
        backgroundImage: `url(${heroImage})`,
        height: "800px",
      }}
    >
      <div className="absolute inset-0 bg-black/40"></div>

      <div className="relative z-10 text-center px-4 max-w-3xl">
        <h1 className="text-white text-3xl sm:text-5xl font-bold mb-2">
          Welcome! Let’s get started
        </h1>
        <p className="text-white text-lg sm:text-xl mb-4">
          Find the right home for you
        </p>

        <div className="flex justify-center lg:h-[45px] md:h-[45px] h-[35px]">
          <div className="flex lg:w-[60%] md:w-[60%] w-[80%] rounded-tl-[12px] rounded-tr-[12px] overflow-hidden shadow-lg">
            {["spaces", "place wanted", "team up"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 whitespace-nowrap lg:py-4 md:py-4 lg:px-4 md:px-4 py-2 px-2 text-sm font-semibold transition border-l ${activeTab === tab
                    ? "bg-[#565ABF] text-white"
                    : "bg-black text-white"
                  } ${tab !== "spaces" ? "border-white/80" : "border-0"}`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>
        </div>

<div className="flex flex-col items-center">
  <div className="relative w-full max-w-3xl">
    <div className="flex items-center bg-white rounded-full overflow-hidden shadow-lg w-full">
      <input
        type="text"
        placeholder="Search by City"
        className="flex-grow px-4 text-[#A321A6] placeholder-[#A321A6] outline-none text-sm sm:text-base"
        value={searchInput}
        onChange={handleInputChange}
        onFocus={() => setShowDropdown(suggestions.length > 0)}
        onBlur={() => setTimeout(() => setShowDropdown(false), 150)}
      />
      <button
        onClick={handleSearch}
        className="bg-[#A321A6] hover:from-purple-700 hover:to-pink-700 p-3 rounded-full text-white transition m-1"
      >
        <FiSearch className="w-5 h-5" />
      </button>
    </div>

    {showDropdown && suggestions.length > 0 && (
      <ul className="absolute z-10 bg-white border border-gray-300 rounded-md shadow-md w-full max-h-[200px] overflow-y-auto mt-1">
        {suggestions.map((item, idx) => {
          const fullName = getFullLocation(item.city, item.stateCode, item.countryCode);
          return (
            <li
              key={idx}
              onMouseDown={() => handleSelectSuggestion(item)}
              className="text-left px-3 py-2 cursor-pointer hover:bg-gray-100"
            >
              {fullName}
            </li>
          );
        })}
      </ul>
    )}
  </div>
</div>
      </div>
    </section>
  );
}

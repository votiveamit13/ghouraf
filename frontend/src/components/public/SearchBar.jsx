import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { getFullLocation } from "utils/locationHelper";
import { Country, State, City } from "country-state-city";

export default function SearchBar() {
  const apiUrl = process.env.REACT_APP_API_URL;
  const navigate = useNavigate();
  const location = useLocation();
  const [selected, setSelected] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState({
  city: "",
  stateCode: "",
  countryCode: "",
});

  useEffect(() => {
    if (location.pathname === "/spaces") {
      setSelected("spaces");
    } else if (location.pathname === "/place-wanted") {
      setSelected("placewanted");
    } else if (location.pathname === "/team-up") {
      setSelected("teamup");
    } else {
      setSelected("");
    }
  }, [location.pathname]);

  const handleChange = (path, value) => {
    setSelected(value);
    navigate(path);
  };

const fetchLocations = async (query) => {
  if (!query || query.trim().length < 2) {
    setSuggestions([]);
    return;
  }

  try {
    const lower = query.toLowerCase();
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
  } catch (err) {
    console.error("Location search failed:", err);
  }
};

  const handleInputChange = (e) => {
    const value = e.target.value;
    setSearchInput(value);
    fetchLocations(value);
  };

const handleSelectSuggestion = (item) => {
  const fullLocation = getFullLocation(item.city, item.stateCode, item.countryCode);
  setSearchInput(fullLocation);
  setSelectedLocation(item);
  setShowDropdown(false);
};


  const handleSearch = () => {
    if (!searchInput.trim()) return;
    if (selected === "spaces") {
      navigate(
      `/spaces?city=${selectedLocation.city}&state=${selectedLocation.stateCode}&country=${selectedLocation.countryCode}`
    );
    } else if (selected === "placewanted") {
      navigate(`/place-wanted?city=${selectedLocation.city}&state=${selectedLocation.stateCode}&country=${selectedLocation.countryCode}`);
    } else if (selected === "teamup") {
      navigate(`/team-up?city=${selectedLocation.city}&state=${selectedLocation.stateCode}&country=${selectedLocation.countryCode}`);
    }
  };

  return (
    <div className="bg-white text-black rounded-[4px] shadow-xl border-[1px] border-[#D7D7D7] mb-4">
      <div className="px-3 py-2 border-b">
        <h2 className="font-medium text-black text-[18px]">Search</h2>
      </div>
      <div className="px-3 py-2 flex flex-col gap-3 text-[16px] text-black">
        <div className="space-y-1">
          <label className="flex items-center space-x-2 text-[16px] text-black">
            <input
              type="radio"
              name="searchType"
              value="spaces"
              className="w-4 h-4 accent-[#A321A6]"
              onChange={() => handleChange("/spaces", "spaces")}
              checked={selected === "spaces"}
            />
            <span>Space For Rent</span>
          </label>

          <label className="flex items-center space-x-2 text-[16px] text-black">
            <input
              type="radio"
              name="searchType"
              value="placewanted"
              className="w-4 h-4 accent-[#A321A6]"
              onChange={() => handleChange("/place-wanted", "placewanted")}
              checked={selected === "placewanted"}
            />
            <span>Space Wanted</span>
          </label>

          <label className="flex items-center space-x-2 text-[16px] text-black">
            <input
              type="radio"
              name="searchType"
              value="teamup"
              className="w-4 h-4 accent-[#A321A6]"
              onChange={() => handleChange("/team-up", "teamup")}
              checked={selected === "teamup"}
            />
            <span>Team Up</span>
          </label>
        </div>

        <label className="text-[16px] text-black mb-0">Search Location</label>
        <div className="relative">
          <input
            type="text"
            placeholder="Enter Search Location"
            value={searchInput}
            onChange={handleInputChange}
            className="w-full border rounded-[5px] px-3 py-2"
            onFocus={() => setShowDropdown(suggestions.length > 0)}
            onBlur={() => setTimeout(() => setShowDropdown(false), 150)}
          />

          {showDropdown && suggestions.length > 0 && (
            <ul className="absolute z-10 bg-white border border-gray-300 rounded-md shadow-md w-full max-h-[200px] overflow-y-auto mt-1">
    {suggestions.map((item, idx) => {
      const fullName = getFullLocation(item.city, item.stateCode, item.countryCode);
      return (
        <li
          key={idx}
          onMouseDown={() => handleSelectSuggestion(item)}
          className="px-3 py-2 cursor-pointer hover:bg-gray-100"
        >
          {fullName}
        </li>
      );
    })}
  </ul>
          )}
        </div>

        <button
          onClick={handleSearch}
          className="bg-[#565ABF] text-white py-2 rounded-[5px] mb-3 text-[14px] font-semibold"
        >
          Search
        </button>
      </div>
    </div>
  );
}

import React, { useState, useRef, useEffect } from "react";

export default function Filters({ filters, setFilters, setPage }) {
  const [showAmenities, setShowAmenities] = useState(false);
  const dropdownRef = useRef(null);
  const defaultFilters = {
    minValue: 0,
    maxValue: 100000,
    priceType: "",
    period: "",
    smoking: "",
    // roommatePref: "",
    amenities: [],
    occupationPreference: "",
    minAge: "",
    maxAge: "",
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowAmenities(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const min = 0;
  const max = 100000;

  const handleMinChange = (e) => {
    const value = Math.max(min, Number(e.target.value));
    handleFilterChange("minValue", Math.min(value, filters.maxValue));
  };

  const handleMaxChange = (e) => {
    const value = Math.max(min, Number(e.target.value));
    handleFilterChange("maxValue", Math.max(value, filters.minValue));
  };

  const handleReset = () => {
    setFilters(defaultFilters);
    setPage(1);
  };

  const handleFilterChange = (key, value) => {
    setFilters({ ...filters, [key]: value });
    setPage(1);
  };

  return (
    <div className="bg-white text-black rounded-[4px] border-[1px] border-[#D7D7D7] mb-4 shadow-xl">
      <div className="px-3 py-2 border-b flex justify-between items-center mb-3">
        <h2 className="font-medium text-black text-[18px]">Filters</h2>
        <button
          type="button"
          className="text-[18px] text-[#565ABF] underline"
          onClick={handleReset}
        >
          Reset
        </button>
      </div>

      <div className="mb-4 px-3 py-2 text-black border-b border-[#D7D7D7]">
        <label className="font-medium text-[18px]">Budget</label>
        <div className="ml-5 border border-[#D7D7D7] rounded-[7px] flex justify-between items-center w-[60%] px-2 py-2 mt-2 text-sm">
                     <input
              type="text"
              value={filters.minValue}
              onChange={(e) => {
                let value = e.target.value.replace(/\D/g, "");
                value = value === "" ? 0 : Number(value);
                value = Math.min(value, filters.maxValue, 100000);
                handleFilterChange("minValue", value);
              }} 
              className="w-16 outline-none text-start" 
            />
          <span>-</span>&nbsp;&nbsp;
          <input
            type="text"
            value={filters.maxValue}
            onChange={(e) => {
              let value = e.target.value.replace(/\D/g, ""); 
              value = value === "" ? 0 : Number(value);
              value = Math.min(100000, Math.max(value, filters.minValue)); 
              handleFilterChange("maxValue", value);
            }} 
            className="w-16 outline-none text-start" 
          />
        </div>

        <div className="flex justify-between text-sm text-[#333333] mt-3">
          <span>${min}</span>
          <span>${max}</span>
        </div>

        <div className="relative w-full mt-1 h-2">
          <div className="absolute top-1/2 transform -translate-y-1/2 w-full h-2 bg-gray-200 rounded-full"></div>
          <div
            className="absolute top-1/2 transform -translate-y-1/2 h-2 bg-[#565ABF] rounded-full"
            style={{
              left: `${(filters.minValue / max) * 100}%`,
              right: `${100 - (filters.maxValue / max) * 100}%`,
            }}
          ></div>
          <input
            type="range"
            min={min}
            max={max}
            value={filters.minValue}
            onChange={(e) => handleFilterChange("minValue", Number(e.target.value))}
            className="absolute w-full h-2 bg-transparent appearance-none pointer-events-none"
          />
          <input
            type="range"
            min={min}
            max={max}
            value={filters.maxValue}
            onChange={(e) => handleFilterChange("maxValue", Number(e.target.value))}
            className="absolute w-full h-2 bg-transparent appearance-none pointer-events-none"
          />

          <style jsx>{`
            input[type="range"] {
              -webkit-appearance: none;
            }
            input[type="range"]::-webkit-slider-thumb {
              -webkit-appearance: none;
              height: 20px;
              width: 20px;
              border-radius: 50%;
              background: white;
              border: 2px solid #565abf;
              cursor: pointer;
              pointer-events: auto;
              position: relative;
              z-index: 10;
            }
            input[type="range"]::-moz-range-thumb {
              height: 20px;
              width: 20px;
              border-radius: 50%;
              background: white;
              border: 2px solid #565abf;
              cursor: pointer;
              pointer-events: auto;
              position: relative;
              z-index: 10;
            }
          `}</style>
        </div>
        <div className="flex justify-center space-x-8 mt-3 mb-3">
          <label className="flex items-center space-x-2 cursor-pointer">
            <input type="radio" name="priceType" checked={filters.priceType === "Week"} onChange={() => handleFilterChange("priceType", "Week")} />
            <span className="text-black">Weekly</span>
          </label>
          <label className="flex items-center space-x-2 cursor-pointer">
            <input type="radio" name="priceType" checked={filters.priceType === "Month"} onChange={() => handleFilterChange("priceType", "Month")} />
            <span className="text-black">Monthly</span>
          </label>
        </div>
      </div>

      <div className="mb-4 px-3 py-2 text-black border-b border-[#D7D7D7]">
        <label className="font-medium text-[18px]">Duration of Stay</label>
        <div className="space-y-1 mt-1 mb-3">
          <select
            name="period"
            value={filters.period}
            onChange={(e) => handleFilterChange("period", e.target.value)}
            className="border-[1px] border-[#D1D5DB] px-2 py-[12px] w-full rounded-[10px] text-[#948E8E]"
          >
            <option value="">Select</option>
            <option value="Short Term">Short Term</option>
            <option value="Long Term">Long Term</option>
          </select>

        </div>
      </div>

      {/* <div className="mb-4 px-3 py-2 text-black border-b border-[#D7D7D7]">
        <label className="font-medium text-[18px]">Roommate Preference</label>
        <div className="space-y-1 mt-1 mb-3">
          {[
            { val: "any", label: "Any Gender" },
            { val: "male", label: "Male" },
            { val: "female", label: "Female" },
          ].map((opt) => (
            <label key={opt.val} className="flex items-center space-x-2">
              <input
                type="radio"
                name="roommatePref"
                checked={filters.roommatePref === opt.val}
                onChange={() => handleFilterChange("roommatePref", opt.val)}
              />
              <span>{opt.label}</span>
            </label>
          ))}
        </div>
      </div> */}

      <div className="mb-4 px-3 py-2 text-black border-b border-[#D7D7D7]">
        <label className="font-medium text-[18px]">Smoking</label>
        <div className="space-y-1 mt-1 mb-3">
          {[
            { val: "all", label: "All" },
            { val: "allowed", label: "Allowed" },
            { val: "no", label: "Not Allowed" },
          ].map((opt) => (
            <label key={opt.val} className="flex items-center space-x-2">
              <input
                type="radio"
                name="smoking"
                checked={filters.smoking === opt.val}
                onChange={() => handleFilterChange("smoking", opt.val)}
              />
              <span>{opt.label}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="mb-4 px-3 py-2 text-black border-b border-[#D7D7D7]">
        <label className="font-medium text-[18px]">Occupation</label>
        <div className="space-y-1 mt-1 mb-3">
          {[
            { val: "all", label: "All" },
            { val: "students", label: "Students" },
            { val: "professionals", label: "Professionals" },
          ].map((opt) => (
            <label key={opt.val} className="flex items-center space-x-2">
              <input
                type="radio"
                name="occupationPreference"
                checked={filters.occupationPreference === opt.val}
                onChange={() => handleFilterChange("occupationPreference", opt.val)}
              />
              <span>{opt.label}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="mb-4 px-3 py-2 text-black border-b border-[#D7D7D7]">
        <label className="font-medium text-[18px]">Age Range</label>
        <div className="flex space-x-2 mt-2 mb-3">
          <input
  type="number"
  value={filters.minAge || ""}
  onKeyDown={(e) => {
    if (["e", "E", "+", "-", "."].includes(e.key)) e.preventDefault();
  }}
  min="10"
  max="99"
  onChange={(e) => {
    let val = e.target.value.replace(/\D/g, "");
    if (val.length > 2) val = val.slice(0, 2); 
    handleFilterChange("minAge", val);
  }}
  placeholder="Min"
  className="border-[1px] border-[#D1D5DB] p-2 w-full rounded-[10px] text-[#948E8E]"
/>

<input
  type="number"
  value={filters.maxAge || ""}
  onKeyDown={(e) => {
    if (["e", "E", "+", "-", "."].includes(e.key)) e.preventDefault();
  }}
  min="10"
  max="99"
  onChange={(e) => {
    let val = e.target.value.replace(/\D/g, "");
    if (val.length > 2) val = val.slice(0, 2);
    handleFilterChange("maxAge", val);
  }}
  placeholder="Max"
  className="border-[1px] border-[#D1D5DB] p-2 w-full rounded-[10px] text-[#948E8E]"
/>
        </div>
      </div>


      <div className="mb-4 px-3 py-2 text-black border-[#D7D7D7] relative" ref={dropdownRef}>
        <label className="font-medium text-[18px]">Amenities</label>
        <div className="mt-2 w-full">
          <button
            type="button"
            className="border-[1px] border-[#D1D5DB] w-full text-start text-black font-medium bg-white p-2 rounded-[10px]"
            onClick={() => setShowAmenities(!showAmenities)}
          >
            {filters.amenities.length > 0
              ? filters.amenities.join(", ")
              : "Select amenities"}
          </button>

          {showAmenities && (
            <ul
              className="absolute z-50 w-full p-2 text-black bg-white border border-[#D7D7D7] rounded-[10px]"
              style={{ maxHeight: "200px", overflowY: "auto" }}
            >
              {[
                "Sports",
                "Music",
                "Movies & TV",
                "Reading",
                "Photography",
                "Going out",
                "Hiking & Nature",
                "Outdoor Activities & Adventures",
                "Fitness & Gym / Working out",
                "Walking Around Town/ Exploring the City",
                "Jogging / Running",
                "Science & Technology",
                "Art",
                "Traveling",
                "Cooking & Food",
                "Volunteering / Community Work",
              ].map((amenity) => (
                <li key={amenity} className="flex items-center py-1">
                  <input
                    type="checkbox"
                    className="form-check-input ml-1"
                    id={amenity}
                    checked={filters.amenities.includes(amenity)}
                    onChange={() => {
                      const selected = filters.amenities.includes(amenity)
                        ? filters.amenities.filter((a) => a !== amenity)
                        : [...filters.amenities, amenity];
                      handleFilterChange("amenities", selected);
                    }}
                  />
                  <label className="form-check-label ml-4 cursor-pointer" htmlFor={amenity}>
                    {amenity}
                  </label>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}

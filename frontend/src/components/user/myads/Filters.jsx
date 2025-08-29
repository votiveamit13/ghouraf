import React, { useState } from "react";

export default function Filters() {
  const defaultFilters = {
    minValue: 0,
    maxValue: 1300,
    priceType: "",
    minSize: "",
    maxSize: "",
    sizeUnit: "Sq ft",
    furnishing: "all",
    smoking: "all",
    propertyType: "all",
    roomAvailable: "any",
    bedrooms: "Any",
    moveInDate: "",
  };

  const [filters, setFilters] = useState(defaultFilters);

  const min = 0;
  const max = 1300;

  const handleMinChange = (e) => {
    const value = Math.min(Number(e.target.value), filters.maxValue - 10);
    setFilters({ ...filters, minValue: value });
  };

  const handleMaxChange = (e) => {
    const value = Math.max(Number(e.target.value), filters.minValue + 10);
    setFilters({ ...filters, maxValue: value });
  };

  const handleReset = () => {
    setFilters(defaultFilters);
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
        <label className="font-medium text-[18px]">Price</label>
        <div className="ml-5 border-[1px] border-[#D7D7D7] rounded-[7px] flex justify-between items-center w-[60%] px-4 py-2 mt-2 text-sm">
          <span>${filters.minValue}</span>
          <span>-</span>
          <span>${filters.maxValue}</span>
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
            onChange={handleMinChange}
            className="absolute w-full h-2 bg-transparent appearance-none pointer-events-none"
          />
          <input
            type="range"
            min={min}
            max={max}
            value={filters.maxValue}
            onChange={handleMaxChange}
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
            <input
              type="radio"
              name="priceType"
              checked={filters.priceType === "weekly"}
              onChange={() => setFilters({ ...filters, priceType: "weekly" })}
            />
            <span className="text-black">Weekly</span>
          </label>
          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="radio"
              name="priceType"
              checked={filters.priceType === "monthly"}
              onChange={() => setFilters({ ...filters, priceType: "monthly" })}
            />
            <span className="text-black">Monthly</span>
          </label>
        </div>
      </div>

      <div className="mb-4 px-3 py-2 text-black border-b border-[#D7D7D7]">
        <label className="font-medium text-[18px]">Size of Apartment</label>
        <div className="flex space-x-2 mt-2 mb-3">
          <input
            type="number"
            placeholder="Min"
            value={filters.minSize}
            onChange={(e) => setFilters({ ...filters, minSize: e.target.value })}
            className="border-[1px] border-[#D1D5DB] p-2 w-full rounded-[10px]"
          />
          <input
            type="number"
            placeholder="Max"
            value={filters.maxSize}
            onChange={(e) => setFilters({ ...filters, maxSize: e.target.value })}
            className="border-[1px] border-[#D1D5DB] p-2 w-full rounded-[10px]"
          />
          <select
            value={filters.sizeUnit}
            onChange={(e) => setFilters({ ...filters, sizeUnit: e.target.value })}
            className="border-[1px] border-[#D1D5DB] p-2 w-full rounded-[10px] text-[#948E8E]"
          >
            <option>Sq ft</option>
            <option>Sq m</option>
          </select>
        </div>
      </div>

      <div className="mb-4 px-3 py-2 text-black border-b border-[#D7D7D7]">
        <label className="font-medium text-[18px]">Furnishing</label>
        <div className="space-y-1 mt-1 mb-3">
          {["all", "unfurnished", "furnished"].map((val) => (
            <label key={val} className="flex items-center space-x-2">
              <input
                type="radio"
                name="furnishing"
                checked={filters.furnishing === val}
                onChange={() => setFilters({ ...filters, furnishing: val })}
              />
              <span>{val === "all" ? "All" : val.charAt(0).toUpperCase() + val.slice(1)}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="mb-4 px-3 py-2 text-black border-b border-[#D7D7D7]">
        <label className="font-medium text-[18px]">Smoking</label>
        <div className="space-y-1 mt-1 mb-3">
          {[
            { val: "all", label: "All" },
            { val: "no", label: "No Smoking" },
            { val: "allowed", label: "Allowed" },
          ].map((opt) => (
            <label key={opt.val} className="flex items-center space-x-2">
              <input
                type="radio"
                name="smoking"
                checked={filters.smoking === opt.val}
                onChange={() => setFilters({ ...filters, smoking: opt.val })}
              />
              <span>{opt.label}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="mb-4 px-3 py-2 text-black border-b border-[#D7D7D7]">
        <label className="font-medium text-[18px]">Property Type</label>
        <div className="space-y-1 mt-1 mb-3">
          {[
            { val: "all", label: "All" },
            { val: "apartment", label: "Whole Apartment" },
            { val: "flatshare", label: "Flatshare" },
          ].map((opt) => (
            <label key={opt.val} className="flex items-center space-x-2">
              <input
                type="radio"
                name="propertyType"
                checked={filters.propertyType === opt.val}
                onChange={() => setFilters({ ...filters, propertyType: opt.val })}
              />
              <span>{opt.label}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="mb-4 px-3 py-2 text-black border-b border-[#D7D7D7]">
        <label className="font-medium text-[18px]">Rooms Available For</label>
        <div className="space-y-1 mt-1 mb-3">
          {[
            { val: "any", label: "Any Gender" },
            { val: "male", label: "Male" },
            { val: "female", label: "Female" },
          ].map((opt) => (
            <label key={opt.val} className="flex items-center space-x-2">
              <input
                type="radio"
                name="roomAvailable"
                checked={filters.roomAvailable === opt.val}
                onChange={() => setFilters({ ...filters, roomAvailable: opt.val })}
              />
              <span>{opt.label}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="mb-4 px-3 py-2 text-black border-b border-[#D7D7D7]">
        <label className="font-medium text-[18px]">Number of bedrooms</label>
        <div className="space-y-1 mt-1 mb-3">
          <select
            value={filters.bedrooms}
            onChange={(e) => setFilters({ ...filters, bedrooms: e.target.value })}
            className="border-[1px] border-[#D1D5DB] p-2 w-full rounded-[10px] text-[#948E8E]"
          >
            <option>Any</option>
            <option>1</option>
            <option>2</option>
            <option>3+</option>
          </select>
        </div>
      </div>

      <div className="mb-4 px-3 py-2 text-black">
        <label className="font-medium text-[18px]">Move-In date</label>
        <div className="space-y-1 mt-1">
          <input
            type="date"
            value={filters.moveInDate}
            onChange={(e) =>
              setFilters({ ...filters, moveInDate: e.target.value })
            }
            className="border-[1px] border-[#D1D5DB] p-2 w-full rounded-[10px] text-[#948E8E]"
          />
        </div>
      </div>
    </div>
  );
}

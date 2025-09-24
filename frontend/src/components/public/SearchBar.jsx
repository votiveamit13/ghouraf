import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

export default function SearchBar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [selected, setSelected] = useState("");

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
        <input
          type="text"
          placeholder="Enter Search Location"
          className="w-full border rounded-[5px] px-3 py-2"
        />
        <button className="bg-[#565ABF] text-white py-2 rounded-[5px] mb-3 text-[14px] font-semibold">
          Search
        </button>
      </div>
    </div>
  );
}

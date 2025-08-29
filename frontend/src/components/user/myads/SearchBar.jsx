import React from "react";

export default function SearchBar() {
  return (
    <div className="bg-white text-black rounded-[4px] shadow-xl border-[1px] border-[#D7D7D7] mb-4">
      <div className="px-3 py-2 border-b">
          <h2 className="font-medium text-black text-[18px]">Search</h2>
      </div>
      <div className="px-3 py-2 flex flex-col gap-3 text-[16px] text-black">
        <div className="space-y-1">
          <label className="flex items-center space-x-2 text-[16px] text-black">
            <input type="radio" name="searchType" className="w-4 h-4"/>
            <span>Space For Rent</span>
          </label>
          <label className="flex items-center space-x-2 text-[16px] text-black">
            <input type="radio" name="searchType" className="w-4 h-4"/>
            <span>Space Wanted</span>
          </label>
          <label className="flex items-center space-x-2 text-[16px] text-black">
            <input type="radio" name="searchType" className="w-4 h-4"/>
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

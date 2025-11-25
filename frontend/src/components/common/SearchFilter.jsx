import React, { useState } from "react";

const SearchFilter = ({
  placeholder = "Search...",
  onSearch,
  className = "",
}) => {
  const [query, setQuery] = useState("");

  const handleChange = (e) => {
    const value = e.target.value;
    setQuery(value);
    onSearch(value);
  };

  return (
    <div className={`w-full sm:w-1/2 ${className}`}>
      <input
        type="text"
        value={query}
        onChange={handleChange}
        placeholder={placeholder}
        className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500"
      />
    </div>
  );
};

export default SearchFilter;

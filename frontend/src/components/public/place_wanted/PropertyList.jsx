import React from "react";
import PropertyCard from "./PropertyCard";

export default function PropertyList({ properties }) {
  if (!properties || properties.length === 0) {
    return (
      <div className="text-center py-20 text-gray-500 font-medium text-lg">
        No Place Wanted Found
      </div>
    );
  }

  return (
    <div>
      {properties.map((property, idx) => (
        <PropertyCard key={property._id || idx} property={property} />
      ))}
    </div>
  );
}

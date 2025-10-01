import React from "react";
import PropertyCard from "./PropertyCard";

export default function PropertyList({ properties, page, itemsPerPage }) {
  const startIndex = (page - 1) * itemsPerPage;
  const selectedProperties = properties.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  if (!selectedProperties || selectedProperties.length === 0) {
    return null;
  }

  return (
    <div>
      {selectedProperties.map((property, idx) => (
        <PropertyCard key={idx} property={property} />
      ))}
    </div>
  );
}

import React from "react";
import PropertyCard from "./PropertyCard";
import AdBanner from "../AdBanner";

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
        <React.Fragment key={property._id || idx}>
          <PropertyCard property={property} />
          {idx === 6 && <AdBanner />}
        </React.Fragment>
      ))}

      {properties.length <= 6 && <AdBanner />}
    </div>
  );
}

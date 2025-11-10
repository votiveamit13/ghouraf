import React from "react";
import PropertyCard from "./PropertyCard";
import AdBanner from "../AdBanner";

export default function PropertyList({ properties = [] }) {
  if (!properties || properties.length === 0) {
    return (
      <div className="text-center py-20 text-gray-500 font-medium text-lg">
        No Spaces Found
      </div>
    );
  }

  return (
    <div>
      {properties.map((item, idx) => (
        <React.Fragment key={item._id || `ad-${idx}`}>
          {item.isAd ? (
            <AdBanner ad={item.ad} />
          ) : (
            <PropertyCard property={item} />
          )}
        </React.Fragment>
      ))}
    </div>
  );
}

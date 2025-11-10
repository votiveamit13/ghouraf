import React from "react";
import PropertyCard from "./PropertyCard";
import AdBanner from "../AdBanner";

export default function PropertyList({ properties = [], ads = [] }) {
  if (!properties || properties.length === 0) {
    return (
      <div className="text-center py-20 text-gray-500 font-medium text-lg">
        No Spaces Found
      </div>
    );
  }

  // Promoted spaces always at top
  const promoted = properties.filter((p) => p?.promotion?.isPromoted);
  const normal = properties.filter((p) => !p?.promotion?.isPromoted);

  // Make a copy of normal spaces
  const propertiesWithAds = [...normal];
  const usedIndexes = new Set();

  // Insert ads randomly without overlapping positions
  ads.forEach((ad, i) => {
    if (propertiesWithAds.length === 0) return;

    // Random position in the normal spaces array
    let position = Math.floor(Math.random() * (propertiesWithAds.length + 1));

    // Avoid duplicate or adjacent positions
    while (
      usedIndexes.has(position) ||
      usedIndexes.has(position - 1) ||
      usedIndexes.has(position + 1)
    ) {
      position = (position + 1) % (propertiesWithAds.length + 1);
    }

    usedIndexes.add(position);
    propertiesWithAds.splice(position, 0, { isAd: true, ad });
  });

  // Final list: promoted first, then normal + ads
  const finalList = [...promoted, ...propertiesWithAds];

  return (
    <div>
      {finalList.map((item, idx) => (
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

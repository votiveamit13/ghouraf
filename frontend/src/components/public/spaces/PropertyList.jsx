import React, { useMemo } from "react";
import PropertyCard from "./PropertyCard";
import AdBanner from "../AdBanner";

export default function PropertyList({ properties = [], ads = [], currentPage }) {
  // Handle empty case *after* hook definitions, not before
  const promoted = properties.filter((p) => p?.promotion?.isPromoted);
  const normal = properties.filter((p) => !p?.promotion?.isPromoted);

  // Sort ads by latest first
  const sortedAds = useMemo(
    () => [...ads].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)),
    [ads]
  );

  // Pick a few random ads per page
  const randomAds = useMemo(() => {
    const shuffled = [...sortedAds].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, 3); // show 3 ads max
  }, [sortedAds, currentPage]);

  const propertiesWithAds = [...normal];
  const usedIndexes = new Set();

  randomAds.forEach((ad, i) => {
    if (propertiesWithAds.length === 0) return;

    let position = Math.floor(Math.random() * (propertiesWithAds.length + 1));

    // ensure no duplicate or adjacent positions
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

  const finalList = [...promoted, ...propertiesWithAds];

  // ✅ Now handle the empty render safely
  if (finalList.length === 0) {
    return (
      <div className="text-center py-20 text-gray-500 font-medium text-lg">
        No Spaces Found
      </div>
    );
  }

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

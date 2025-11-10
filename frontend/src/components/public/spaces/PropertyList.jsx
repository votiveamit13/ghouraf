import React from "react";
import PropertyCard from "./PropertyCard";
import AdBanner from "../AdBanner";

export default function PropertyList({ properties, ads, currentPage }) {
  if (!properties || properties.length === 0) {
    return (
      <div className="text-center py-20 text-gray-500 font-medium text-lg">
        No Spaces Found
      </div>
    );
  }

  const promoted = properties.filter((p) => p?.promotion?.isPromoted);
  const normal = properties.filter((p) => !p?.promotion?.isPromoted);

  const adsPerPage = 4;
  const start = (currentPage - 1) * adsPerPage;
  const end = start + adsPerPage;
  const adsForPage = ads.slice(start, end).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  const propertiesWithAds = [...normal];
  const usedIndexes = new Set();

  adsForPage.forEach((ad) => {
    if (propertiesWithAds.length === 0) return;

    let randomIndex;
    let attempts = 0;

    do {
      randomIndex = Math.floor(Math.random() * (propertiesWithAds.length + 1));
      attempts++;
    } while (
      usedIndexes.has(randomIndex) ||
      usedIndexes.has(randomIndex - 1) ||
      usedIndexes.has(randomIndex + 1)
    );

    usedIndexes.add(randomIndex);
    propertiesWithAds.splice(randomIndex, 0, { isAd: true, ad });
  });

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
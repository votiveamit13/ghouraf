import React from "react";
import PropertyCard from "./PropertyCard";
import AdBanner from "../AdBanner";

export default function PropertyList({
  properties = [],
  ads = [],
  savedPosts = [],
  onToggleSave,
  onShare
}) {
  // if ((!properties || properties.length === 0) && (!ads || ads.length === 0)) {
  //   return (
  //     <div className="text-center py-20 text-gray-500 font-medium text-lg">
  //       No Spaces Found
  //     </div>
  //   );
  // }

  const promoted = properties.filter(p => p?.promotion?.isPromoted);
  const normal = properties.filter(p => !p?.promotion?.isPromoted);

  const propertiesWithAds = [...normal];
  const orderedAds = [...ads];

  let adIndex = 0;
  let insertPosition = Math.floor(Math.random() * 6) + 2;

  while (adIndex < orderedAds.length) {
    if (insertPosition <= propertiesWithAds.length + adIndex) {
      const prevItemIsAd = propertiesWithAds[insertPosition - 1]?.isAd;
      if (!prevItemIsAd) {
        propertiesWithAds.splice(insertPosition, 0, {
          isAd: true,
          ad: orderedAds[adIndex],
        });
        adIndex++;
        insertPosition += Math.floor(Math.random() * 6) + 2;
      } else {
        insertPosition++;
      }
    } else {
      propertiesWithAds.push({ isAd: true, ad: orderedAds[adIndex] });
      adIndex++;
    }
  }

  const finalList = [...promoted, ...propertiesWithAds];

  return (
    <div>
      {finalList.map((item, idx) => (
        <React.Fragment key={item._id || `ad-${idx}`}>
          {item.isAd ? (
            <AdBanner ad={item.ad} />
          ) : (
            <PropertyCard
              property={item}
              savedPosts={savedPosts}
              onToggleSave={onToggleSave}
              onShare={onShare}
            />
          )}
        </React.Fragment>
      ))}
    </div>
  );
}

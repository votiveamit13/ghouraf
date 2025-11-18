import React from "react";
import PropertyCard from "./PropertyCard";
import AdBanner from "../AdBanner";

export default function PropertyList({ properties = [], ads = [] }) {
    if ((!properties || properties.length === 0) && (!ads || ads.length === 0)) {
        return (
            <div className="text-center py-20 text-gray-500 font-medium text-lg">
                No Place Wanted Found
            </div>
        );
    }

    const promoted = properties.filter(p => p?.promotion?.isPromoted);
    const normal = properties.filter(p => !p?.promotion?.isPromoted);

    const finalList = [...promoted];

    let adIndex = 0;
    let insertPosition = Math.floor(Math.random() * 6) + 2;
    const propertiesWithAds = [...normal];

    while (adIndex < ads.length) {
        if (insertPosition <= propertiesWithAds.length + adIndex) {
            const prevItemIsAd = propertiesWithAds[insertPosition - 1]?.isAd;
            if (!prevItemIsAd) {
                propertiesWithAds.splice(insertPosition, 0, { isAd: true, ad: ads[adIndex] });
                adIndex++;
                insertPosition += Math.floor(Math.random() * 6) + 2;
            } else {
                insertPosition++;
            }
        } else {
            propertiesWithAds.push({ isAd: true, ad: ads[adIndex] });
            adIndex++;
        }
    }

    finalList.push(...propertiesWithAds);

    return (
        <div>
            {finalList.map((item, idx) => (
                <React.Fragment key={item._id || `ad-${idx}`}>
                    {item.isAd ? <AdBanner ad={item.ad} /> : <PropertyCard property={item} />}
                </React.Fragment>
            ))}
        </div>
    );
}

import React, { useEffect, useRef, useState } from "react";
import { TfiLocationPin } from "react-icons/tfi";
import { GrFavorite } from "react-icons/gr";
import { GoShareAndroid } from "react-icons/go";
import defaultImage from "assets/img/ghouraf/default-avatar.png";
import { getFullLocation } from "utils/locationHelper";
import { Link } from "react-router-dom";

function PropertyCard({ property, savedPosts, onToggleSave, onShare }) {
  const saved = savedPosts?.includes(property._id);

  const image = property.photos?.[0]?.url || defaultImage;
  const avatar = property.user?.profile?.photo || defaultImage;
  const locationString = getFullLocation(property.city, property.state, property.country);
  const name = `${property.user?.profile?.firstName || ""} ${property.user?.profile?.lastName || ""}`;

  const imgRef = useRef(null);
  const [visible, setVisible] = useState(false);
  const [loaded, setLoaded] = useState(false);

  // lightweight lazy + blur
  useEffect(() => {
    const el = imgRef.current;
    if (!el) return;

    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        setVisible(true);
        observer.disconnect();
      }
    });

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div className="relative bg-white p-4 rounded-[12px] shadow-xl border border-[#D7D7D7] flex flex-col md:flex-row gap-4 mb-4">

      {property.promotion?.isPromoted && (
        <div className="absolute top-[-2px] left-[-2px] bg-[#565ABF] text-white text-xs font-semibold px-2 py-1 rounded">
          Sponsored
        </div>
      )}

      <Link to={`/place-wanted/${property._id}`}>
        <div className="w-full md:w-[200px] h-[260px] relative overflow-hidden rounded-[10px]">

          <img
            ref={imgRef}
            src={visible ? image : undefined}
            alt={property.title}
            loading="lazy"
            decoding="async"
            onLoad={() => setLoaded(true)}
            className={`w-full h-full object-cover transition-all duration-300 rounded-[10px]
              ${loaded ? "opacity-100 blur-0" : "opacity-50 blur-sm"}`}
          />
        </div>
      </Link>

      <div className="flex flex-col flex-grow w-full md:w-[450px]">
        <Link to={`/place-wanted/${property._id}`}>
          <h3 className="font-semibold text-[20px] text-black">{property.title}</h3>
        </Link>

        <p className="text-[16px] flex items-center gap-1"><TfiLocationPin />{locationString}</p>
        <p className="text-[16px]">{property.propertyType}</p>
        <p className="text-[15px] mt-1">{property.description}</p>

        <div className="flex items-center mt-2 gap-2">
          <img src={avatar} alt="avatar" className="w-12 h-12 rounded-full object-cover" />
          <div>
            <p className="text-sm">{name}</p>
            <p className="text-xs text-gray-400">{property.occupation}</p>
          </div>
        </div>
      </div>

      <div className="flex flex-col justify-between items-end">
        <span className="font-bold text-lg">${property.budget} / {property.budgetType?.toLowerCase()}</span>

        <div className="flex flex-row lg:flex-col gap-2 font-bold">

          <button
            onClick={(e) => { e.preventDefault(); onToggleSave(property._id); }}
            className={`border px-3 py-2 rounded-[4px] text-sm flex gap-2 items-center ${
              saved ? "bg-pink-500 text-white border-pink-500" : "border-[#565ABF] text-white bg-[#565ABF]"
            }`}
          >
            <GrFavorite /> {saved ? "Saved" : "Save"}
          </button>

          <button
            onClick={(e) => { e.preventDefault(); onShare(property); }}
            className="px-3 py-2 rounded-[4px] text-sm border border-[#565ABF] text-[#565ABF] flex gap-2 items-center"
          >
            <GoShareAndroid /> Share
          </button>
        </div>
      </div>
    </div>
  );
}

export default React.memo(PropertyCard);

import React from "react";
import { GrFavorite } from "react-icons/gr";
import { GoShareAndroid } from "react-icons/go";
import { getFullLocation } from "utils/locationHelper";
import defaultImage from "assets/img/ghouraf/default-avatar.png";
import { Link } from "react-router-dom";

function PropertyCard({ property, savedPosts, onToggleSave, onShare }) {
  const saved = savedPosts?.includes(property._id);
  const image = property.photos?.[0]?.url || defaultImage;
  const avatar = property.user?.profile?.photo || defaultImage;
  const locationString = getFullLocation(property.city, property.state, property.country);
  const name = `${property.user?.profile?.firstName} ${property.user?.profile?.lastName}`;

  return (
    <div className="relative bg-white p-4 rounded-[12px] shadow-xl border-[1px] border-[#D7D7D7] flex flex-col md:flex-row gap-4 mb-4">
      {property.promotion?.isPromoted && (
        <div className="absolute top-[-2px] left-[-2px] bg-[#565ABF] text-white text-xs font-semibold px-2 py-1 rounded mb-2">
          Sponsored
        </div>
      )}

      <Link to={`/team-up/${property._id}`}>
        <div className="w-full md:w-[200px] h-[260px]">
          <img
            src={image}
            alt={property.title}
            loading="lazy"
            decoding="async"
            className="w-full h-full object-cover rounded-[10px]"
          />
        </div>
      </Link>

      <div className="flex flex-col flex-grow text-black">
        <Link to={`/team-up/${property._id}`}>
          <h3 className="font-semibold text-[20px]">{property.title} in {locationString}</h3>
        </Link>

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
        <span className="font-bold text-lg">${property.budget} / {property.budgetType}</span>

        <div className="flex flex-row lg:flex-col gap-2 font-bold">
          <button
            onClick={(e) => { e.preventDefault(); onToggleSave(property._id); }}
            className={`border-[1px] px-3 py-2 rounded-[4px] text-sm flex gap-2 items-center ${
              saved ? "bg-pink-500 text-white border-pink-500" : "border-[#565ABF] text-white bg-[#565ABF]"
            }`}
          >
            <GrFavorite /> {saved ? "Saved" : "Save"}
          </button>

          <button
            onClick={(e) => { e.preventDefault(); onShare(property); }}
            className="border-[1px] border-[#565ABF] text-[#565ABF] px-3 py-2 rounded-[4px] text-sm flex gap-2 items-center"
          >
            <GoShareAndroid /> Share
          </button>
        </div>
      </div>
    </div>
  );
}

export default React.memo(PropertyCard);

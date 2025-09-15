import React from "react";
import { GrFavorite } from "react-icons/gr";
import { GoShareAndroid } from "react-icons/go";

export default function PropertyCard({ property }) {
    return (
        <div className="bg-white p-4 rounded-[12px] shadow-xl border-[1px] border-[#D7D7D7] flex gap-4 mb-4">
            <img
                src={property.image}
                alt={property.title}
                className="w-[200px] object-cover rounded-[10px]"
            />

            <div className="flex flex-col flex-grow text-[#000000]">
                <h3 className="font-semibold text-[24px] text-black">{property.title}</h3>
                <p className="text-[18px]">Roommate preference - <span className="text-[#565ABF]"> {property.gender}</span></p>
                <p className="text-[15px] mt-1">{property.description}</p>

                <div className="flex items-center mt-2 gap-2">
                    <div>
                        <img src={property.user.avatar} alt="avatar" className="w-12 h-12 rounded-full object-cover" />
                    </div>
                    <div>
                        <p className="text-sm">{property.user.name}</p>
                        <p className="text-xs text-gray-400">{property.user.role}</p>
                    </div>
                </div>
            </div>

            <div className="flex flex-col justify-between items-end text-black">
                <span className="font-bold text-lg">${property.price} / month</span>
                <div className="flex gap-2 font-bold">
                    <button className="border-[1px] border-[#565ABF] px-3 py-2 rounded-[4px] text-sm bg-[#565ABF] text-white  flex gap-2 items-center"><GrFavorite/>Save</button>
                    <button className="px-3 py-2 rounded-[4px] text-sm border-[1px] border-[#565ABF] text-[#565ABF] flex gap-2 items-center"><GoShareAndroid/>Share</button>
                </div>
            </div>
        </div>
    );
}

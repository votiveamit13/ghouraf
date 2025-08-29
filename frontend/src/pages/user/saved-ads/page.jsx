import React, { useState } from "react";
import UserPagination from "../../../components/common/UserPagination";
import { MdFavorite } from "react-icons/md";
import property from "../../../assets/img/ghouraf/property.jpg";
import property1 from "../../../assets/img/ghouraf/property1.png";
import property2 from "../../../assets/img/ghouraf/property2.png";
import property3 from "../../../assets/img/ghouraf/property3.jpg";
import property4 from "../../../assets/img/ghouraf/property4.jpg";
import property5 from "../../../assets/img/ghouraf/property5.jpg";
import property6 from "../../../assets/img/ghouraf/property6.jpg";
import property7 from "../../../assets/img/ghouraf/property7.png";
import property8 from "../../../assets/img/ghouraf/property8.jpg";
import { TfiLocationPin } from "react-icons/tfi";

const adsData = [
    {
        id: 1,
        type: "Spaces",
        title: "1bed/1bath fully furnished UES",
        location: "location",
        available: "Available 8 july",
        price: "$2300 / month",
        desc: "Spacious and fully furnished 1-bedroom apartment located in the heart of the Upper East Side.",
        img: `${property}`,
    },
    {
        id: 2,
        type: "Spaces",
        title: "Modern Studio Downtown",
        location: "location",
        available: "Available 12 july",
        price: "$1800 / month",
        desc: "Compact and modern studio near the city center.",
        img: `${property1}`,
    },
    {
        id: 3,
        type: "Space Wanted",
        title: "Looking for Shared Room",
        location: "location",
        available: "From 15 july",
        price: "$900 / month",
        desc: "Student looking for a shared apartment in midtown.",
        img: `${property2}`,
    },
    {
        id: 4,
        type: "Team Up",
        title: "Seeking Roommate for 2BHK",
        location: "location",
        available: "Available now",
        price: "$1200 / month",
        desc: "Looking for a roommate to share a spacious 2BHK in Brooklyn.",
        img: `${property3}`
    },
    {
        id: 5,
        type: "Spaces",
        title: "1bed/1bath fully furnished UES",
        location: "location",
        available: "Available 8 july",
        price: "$2300 / month",
        desc: "Spacious and fully furnished 1-bedroom apartment located in the heart of the Upper East Side.",
        img: `${property4}`,
    },
    {
        id: 6,
        type: "Spaces",
        title: "Modern Studio Downtown",
        location: "location",
        available: "Available 12 july",
        price: "$1800 / month",
        desc: "Compact and modern studio near the city center.",
        img: `${property5}`,
    },
    {
        id: 7,
        type: "Space Wanted",
        title: "Looking for Shared Room",
        location: "location",
        available: "From 15 july",
        price: "$900 / month",
        desc: "Student looking for a shared apartment in midtown.",
        img: `${property6}`,
    },
    {
        id: 8,
        type: "Team Up",
        title: "Seeking Roommate for 2BHK",
        location: "location",
        available: "Available now",
        price: "$1200 / month",
        desc: "Looking for a roommate to share a spacious 2BHK in Brooklyn.",
        img: `${property7}`
    },
    {
        id: 9,
        type: "Team Up",
        title: "Seeking Roommate for 2BHK",
        location: "location",
        available: "Available now",
        price: "$1200 / month",
        desc: "Looking for a roommate to share a spacious 2BHK in Brooklyn.",
        img: `${property8}`
    },
    {
        id: 10,
        type: "Team Up",
        title: "Seeking Roommate for 2BHK",
        location: "location",
        available: "Available now",
        price: "$1200 / month",
        desc: "Looking for a roommate to share a spacious 2BHK in Brooklyn.",
        img: `${property8}`
    },
];

export default function SavedAds() {
    const [filter, setFilter] = useState("All");
    const [search, setSearch] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const adsPerPage = 9;

    const filteredAds = adsData.filter(
        (ad) =>
            (filter === "All" || ad.type === filter) &&
            ad.title.toLowerCase().includes(search.toLowerCase())
    );

    const totalPages = Math.ceil(filteredAds.length / adsPerPage);
    const startIndex = (currentPage - 1) * adsPerPage;
    const displayedAds = filteredAds.slice(startIndex, startIndex + adsPerPage);

    return (
        <div className="container px-4 mt-5 mb-8">
            <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-3 mb-5">
                <div className="flex flex-wrap gap-2 text-[14px] font-semibold w-full md:max-w-xl text-black">
                    {["All", "Spaces", "Space Wanted", "Team Up"].map((btn) => (
                        <button
                            key={btn}
                            onClick={() => {
                                setFilter(btn);
                                setCurrentPage(1);
                            }}
                            className={`flex-1 min-w-[120px] py-2 rounded-[2px] border-[1px] border-[#AACCEE] ${filter === btn ? "bg-[#565ABF] text-white" : "bg-white"
                                }`}
                        >
                            {btn}
                        </button>
                    ))}
                </div>

                <div className="w-full md:w-auto">
                    <input
                        type="text"
                        placeholder="Search Ads"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full md:w-[250px] border-[1px] border-[#D1D5DB] rounded-[5px] py-2 px-4"
                    />
                </div>
            </div>

            <div className="flex flex-wrap gap-6 justify-start">
                {displayedAds.length > 0 ? (
                    displayedAds.map((ad) => (
                        <div
                            key={ad.id}
                            className="w-full sm:w-[48%] lg:w-[32%] border-[1px] border-[#D7D7D7] rounded-[12px] shadow-lg overflow-hidden flex flex-col p-4"
                        >
                            <div className="relative">
                                <img
                                    src={ad.img}
                                    alt={ad.title}
                                    className="w-full h-[220px] sm:h-[260px] lg:h-[280px] object-cover rounded-[10px]"
                                />
                                <span className="absolute top-4 right-4 bg-[#FF015E] text-white text-[13px] sm:text-[15px] font-semibold px-[12px] py-2 rounded-[4px] flex items-center gap-1">
                                    <MdFavorite size={18} /> Saved
                                </span>
                            </div>
                            <div className="flex flex-col flex-grow text-black p-1 mt-2">
                                <h3 className="font-semibold text-[18px] sm:text-[20px] text-black">{ad.title}</h3>
                                <p className="text-[16px] sm:text-[18px] flex items-center gap-1">
                                    <TfiLocationPin /> {ad.location}
                                </p>
                                <p className="text-[16px] sm:text-[18px]">
                                    1 bed apartment - <span className="text-[#565ABF]">{ad.available}</span>
                                </p>
                                <p className="font-semibold text-[18px] sm:text-[20px]">{ad.price}</p>
                                <p className="text-[16px] sm:text-[18px]">{ad.desc}</p>
                            </div>
                        </div>
                    ))
                ) : (
                    <p className="text-gray-500">No ads found.</p>
                )}
            </div>

            <div className="mt-6 flex justify-center md:justify-end">
                <UserPagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={setCurrentPage}
                />
            </div>
        </div>

    );
}

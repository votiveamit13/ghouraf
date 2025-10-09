import React, { useEffect, useState } from "react";
import UserPagination from "../../../components/common/UserPagination";
import { MdFavorite } from "react-icons/md";
import { TfiLocationPin } from "react-icons/tfi";
import { toast } from "react-toastify";
import axios from "axios";
import Loader from "components/common/Loader";
import { getFullLocation } from "utils/locationHelper";

export default function SavedAds() {
    const [ads, setAds] = useState([]);
    const [filter, setFilter] = useState("All");
    const [search, setSearch] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [loading, setLoading] = useState(false);

    const adsPerPage = 9;

    useEffect(() => {
        const fetchSavedPosts = async () => {
            setLoading(true);
            try {
                const token = localStorage.getItem("token");
                const res = await axios.get(`${process.env.REACT_APP_API_URL}save/list`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setAds(res.data.data || []);
            } catch (err) {
                console.error(err);
                toast.error("Failed to fetch saved posts");
            } finally {
                setLoading(false);
            }
        };

        fetchSavedPosts();
    }, []);

    const filteredAds = ads.filter(
        (ad) =>
            (filter === "All" || ad.postCategory === filter) &&
            ad.snapshot?.title?.toLowerCase().includes(search.toLowerCase())
    );


    const totalPages = Math.ceil(filteredAds.length / adsPerPage);
    const startIndex = (currentPage - 1) * adsPerPage;
    const displayedAds = filteredAds.slice(startIndex, startIndex + adsPerPage);

    const filters = [
        { key: "All", label: "All Posts" },
        { key: "Space", label: "Spaces" },
        { key: "Spacewanted", label: "Space Wanted" },
        { key: "Teamup", label: "Team Up" },
    ];

    return (
        <div className="container px-4 mt-5 mb-8">
            <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-3 mb-5">
                <div className="flex flex-wrap gap-2 text-[14px] font-semibold w-full md:max-w-xl text-black">
                    {filters.map(({ key, label }) => (
                        <button
                            key={key}
                            onClick={() => {
                                setFilter(key);
                                setCurrentPage(1);
                            }}
                            className={`flex-1 min-w-[120px] py-2 rounded-[2px] border-[1px] border-[#AACCEE] ${filter === key ? "bg-[#565ABF] text-white" : "bg-white"
                                }`}
                        >
                            {label}
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

            {loading ? (
                <Loader />
            ) : displayedAds.length > 0 ? (
                <div className="flex flex-wrap gap-6 justify-start">
                    {displayedAds.map((ad) => {
                        const post = ad.snapshot;
                        const locationString = getFullLocation(post.city, post.state, post.country);
                        return (
                            <div
                                key={ad._id}
                                className="w-full sm:w-[48%] lg:w-[32%] border-[1px] border-[#D7D7D7] rounded-[12px] shadow-lg overflow-hidden flex flex-col p-4"
                            >
                                <div className="relative">
                                    <img
                                        src={`${post?.photo?.[0]?.url || post?.photo}`}
                                        alt={post?.title}
                                        className="w-full h-[220px] sm:h-[260px] lg:h-[280px] object-cover rounded-[10px]"
                                    />
                                    <span className="absolute top-4 right-4 bg-[#FF015E] text-white text-[13px] sm:text-[15px] font-semibold px-[12px] py-2 rounded-[4px] flex items-center gap-1">
                                        <MdFavorite size={18} /> Saved
                                    </span>
                                </div>
                                <div className="flex flex-col flex-grow text-black p-1 mt-2">
                                    <h3 className="font-semibold text-[16px] sm:text-[18px] text-black">
                                        {post?.title}
                                    </h3>
                                    <p className="text-[15px] sm:text-[18px] flex items-center gap-1">
                                        <TfiLocationPin /> {locationString}
                                    </p>
                                    <p className="font-semibold text-[15px] sm:text-[18px]">
                                        ₹{post?.budget} / {post?.budgetType}
                                    </p>
                                    <p className="text-[15px] sm:text-[18px] leading-[1.7rem]">{post?.description}</p>
                                </div>
                            </div>
                        );
                    })}

                </div>
            ) : (
                <p className="text-gray-500">No saved ads found.</p>
            )}

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
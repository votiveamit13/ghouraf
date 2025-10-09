import React, { useEffect, useState } from "react";
import UserPagination from "../../../components/common/UserPagination";
import { TfiLocationPin } from "react-icons/tfi";
import { CiSearch } from "react-icons/ci";
import Loader from "components/common/Loader";
import axios from "axios";

export default function MyAds() {
    const apiUrl = process.env.REACT_APP_API_URL;
    const [ads, setAds] = useState([]);
    const [filter, setFilter] = useState("All Category");
    const [search, setSearch] = useState("");
    const [sort, setSort] = useState("Recently posted");
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(false);
    const adsPerPage = 9;

    const fetchAds = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem("token");

            const params = {
                page: currentPage,
                limit: adsPerPage,
                search,
                sort,
            };

            if (filter !== "All Category") {
                params.category = filter;
            }

            const response = await axios.get(`${apiUrl}my-ads`, {
                headers: { Authorization: `Bearer ${token}` },
                params,
            });

            setAds(response.data.data || []);
            setTotalPages(response.data.totalPages || 1);
        } catch (error) {
            console.error("Error fetching ads:", error.response?.data || error.message);
        } finally {
            setLoading(false);
        }
    };



    useEffect(() => {
        fetchAds();
    }, [filter, search, sort, currentPage]);

    return (
        <div className="container px-4 mt-5 mb-8">
            <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-3 mb-5">
                <div className="w-full md:w-auto relative">
                    <input
                        type="text"
                        placeholder="Ads title, location"
                        value={search}
                        onChange={(e) => {
                            setSearch(e.target.value);
                            setCurrentPage(1);
                        }}
                        className="w-full md:w-[250px] border-[1px] border-[#D1D5DB] rounded-[5px] py-2 px-[35px]"
                    />
                    <CiSearch size={20} color="#565ABF" className="absolute top-[10px] left-[10px]" />
                </div>
                <div className="w-full md:w-auto flex gap-4">
                    <select
                        value={filter}
                        onChange={(e) => {
                            setFilter(e.target.value);
                            setCurrentPage(1);
                        }}
                        className="w-full md:w-[155px] h-[42px] border-[1px] border-[#D1D5DB] rounded-[5px] py-2 px-2"
                    >
                        {[
                            { label: "All Category", value: "All Category" },
                            { label: "Space", value: "Space" },
                            { label: "Space Wanted", value: "Spacewanted" },
                            { label: "Team Up", value: "Teamup" },
                        ].map((option) => (
                            <option key={option.value} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </select>

                    <select
                        value={sort}
                        onChange={(e) => {
                            setSort(e.target.value);
                            setCurrentPage(1);
                        }}
                        className="w-full md:w-[155px] h-[42px] border-[1px] border-[#D1D5DB] rounded-[5px] py-2 px-2">
                        {["Recently posted", "Newest First", "Oldest First"].map((option) => (
                            <option key={option} value={option}>
                                {option}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            {loading ? (
                <div className="flex justify-center mt-10">
                    <Loader />
                </div>
            ) : (
                <div className="flex flex-wrap gap-6 justify-start">
                    {ads.length > 0 ? (
                        ads.map((ad) => (
                            <div
                                key={ad._id}
                                className="w-full sm:w-[48%] lg:w-[32%] border-[1px] border-[#D7D7D7] rounded-[12px] shadow-lg overflow-hidden flex flex-col p-4"
                            >
                                <div className="relative">
                                    <img
                                        src={ad.featuredImage || (ad.photos?.[0]?.url ?? "/assets/img/default.jpg")}
                                        alt={ad.title}
                                        className="w-full h-[220px] sm:h-[260px] lg:h-[280px] object-cover rounded-[10px]"
                                    />
                                </div>

                                <div className="flex flex-col flex-grow text-black p-1 mt-2">
                                    <h3 className="font-semibold text-[16px] sm:text-[18px] text-black">{ad.title}</h3>
                                    <p className="text-[15px] sm:text-[18px] flex items-center gap-1">
                                        <TfiLocationPin /> {ad.location || ad.city || "Unknown"}
                                    </p>
                                    <p className="text-[15px] sm:text-[18px]">
                                        {ad.propertyType || "Listing"} –{" "}
                                        <span className="text-[#565ABF]">
                                            {ad.available ? "Available" : "Unavailable"}
                                        </span>
                                    </p>
                                    <p className="font-semibold text-[15px] sm:text-[18px]">
                                        ${ad.budget} / {ad.budgetType}
                                    </p>
                                    <p className="text-[15px] sm:text-[18px]">{ad.description}</p>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p className="text-gray-500">No ads found.</p>
                    )}
                </div>
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

import React, { useEffect, useState } from "react";
import UserPagination from "../../../components/common/UserPagination";
import { TfiLocationPin } from "react-icons/tfi";
import { CiSearch } from "react-icons/ci";
import Loader from "components/common/Loader";
import axios from "axios";
import { BsThreeDots } from "react-icons/bs";
import ViewPost from "components/user/myads/ViewPost";
import EditPost from "components/user/myads/EditPost";
import { getFullLocation } from "utils/locationHelper";
import { toast } from "react-toastify";

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
    const [openMenu, setOpenMenu] = useState(null);
    const [selectedAd, setSelectedAd] = useState(null);
    const [showViewPost, setShowViewPost] = useState(false);
    const [showEditPost, setShowEditPost] = useState(false);

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

    const handleEdit = (id) => {
        const ad = ads.find((a) => a._id === id);
        setSelectedAd(ad);
        setShowEditPost(true);
    };


    const handleView = (id) => {
        const ad = ads.find((a) => a._id === id);
        setSelectedAd(ad);
        setShowViewPost(true);
    };


const handleStatus = async (id, status) => {
  try {
    const token = localStorage.getItem("token");
    const available = status === "Available";

    await axios.put(
      `${apiUrl}ad-availability/${id}`,
      { available },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    toast.success(`Marked as ${status}`);
    fetchAds();
  } catch (error) {
    console.error("Error updating status:", error);
    toast.error("Failed to update status");
  }
};


    const handlePromote = (id) => {
        console.log("Promote ad:", id);
    };

    const handleDelete = async (id) => {

    };

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
                        className="w-full md:w-[155px] h-[42px] border-[1px] border-[#D1D5DB] rounded-[5px] py-2 px-2"
                    >
                        {["Recently posted", "Oldest First"].map((option) => (
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
                        ads.map((ad) => {
                            const city = ad.city === "NA" ? "" : ad.city;
                            const locationString = getFullLocation(city, ad.state, ad.country);

                            return (
                                <div
                                    key={ad._id}
                                    className="relative w-full sm:w-[48%] lg:w-[32%] border border-[#D7D7D7] rounded-[12px] shadow-lg  flex flex-col p-4"
                                >
                                    <div className="absolute top-3 right-3 z-999">
                                        <div className="relative">
                                            <button
                                                onClick={() => setOpenMenu(openMenu === ad._id ? null : ad._id)}
                                                className="p-2 rounded-full bg-black text-white shadow-md"
                                            >
                                                <BsThreeDots />
                                            </button>

                                            {openMenu === ad._id && (
                                                <div className="absolute right-0 mt-2 w-44 bg-white border border-gray-200 rounded-[15px] shadow-lg z-10">
                                                    <button
                                                        className="w-full text-left px-4 py-2 hover:bg-gray-100 border-b"
                                                        onClick={() => handleEdit(ad._id)}
                                                    >
                                                        Edit
                                                    </button>
                                                    <button
                                                        className="w-full text-left px-4 py-2 hover:bg-gray-100 border-b"
                                                        onClick={() => handleView(ad._id)}
                                                    >
                                                        View
                                                    </button>

                                                    <div className="relative group">
                                                        <button className="w-full text-left px-4 py-2 hover:bg-gray-100 flex justify-between items-center border-b">
                                                            Status
                                                            <svg
                                                                xmlns="http://www.w3.org/2000/svg"
                                                                fill="none"
                                                                viewBox="0 0 24 24"
                                                                strokeWidth={1.5}
                                                                stroke="currentColor"
                                                                className="w-4 h-4 ml-2"
                                                            >
                                                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                                                            </svg>
                                                        </button>
                                                        <div className="hidden group-hover:block absolute left-full top-0 w-36 bg-white border border-gray-200 rounded-lg shadow-lg">
                                                            <button
                                                                className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                                                                onClick={() => handleStatus(ad._id, "Available")}
                                                            >
                                                                Available
                                                            </button>
                                                            <button
                                                                className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                                                                onClick={() => handleStatus(ad._id, "Unavailable")}
                                                            >
                                                                Unavailable
                                                            </button>
                                                        </div>
                                                    </div>

                                                    <button
                                                        className="w-full text-left px-4 py-2 hover:bg-gray-100 border-b"
                                                        onClick={() => handlePromote(ad._id)}
                                                    >
                                                        Promote Ad
                                                    </button>
                                                    <button
                                                        className="w-full text-left px-4 py-2 text-red-500 hover:bg-gray-100"
                                                        onClick={() => handleDelete(ad._id)}
                                                    >
                                                        Delete
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    <img
                                        src={ad.featuredImage || ad.photos?.[0]?.url || "/assets/img/default.jpg"}
                                        alt={ad.title}
                                        className="w-full h-[220px] sm:h-[260px] lg:h-[280px] object-cover rounded-[10px]"
                                    />

                                    <div className="flex flex-col flex-grow text-black p-1 mt-2">
                                        <h3 className="font-semibold text-[16px] sm:text-[18px] text-black">{ad.title}</h3>
                                        <p className="text-[15px] sm:text-[18px] flex items-center gap-1">
                                            <TfiLocationPin /> {locationString}
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
                                        <p className="text-[15px] sm:text-[18px] line-clamp-2">{ad.description}</p>
                                    </div>
                                </div>
                            );
                        })
                    ) : (
                        <p className="text-gray-500">No ads found.</p>
                    )}
                </div>
            )}

            {showEditPost && (
                <EditPost
                    show={showEditPost}
                    onClose={() => setShowEditPost(false)}
                    ad={selectedAd}
                    onUpdated={fetchAds}
                />
            )}


            {showViewPost && (
                <ViewPost
                    show={showViewPost}
                    onClose={() => setShowViewPost(false)}
                    ad={selectedAd}
                />
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

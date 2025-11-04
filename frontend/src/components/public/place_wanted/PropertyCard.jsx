import React, { useEffect, useState } from "react";
import { TfiLocationPin } from "react-icons/tfi";
import { GrFavorite } from "react-icons/gr";
import { GoShareAndroid } from "react-icons/go";
import defaultImage from "assets/img/ghouraf/default-avatar.png";
import { getFullLocation } from "utils/locationHelper";
import axios from "axios";
import { toast } from "react-toastify";
import { useAuth } from "context/AuthContext";
import { Link } from "react-router-dom";

export default function PropertyCard({ property }) {
    const locationString = getFullLocation(property.city, property.state, property.country);
    const image = property.photos?.[0]?.url || defaultImage;
    const name = `${property.user?.profile?.firstName || ""} ${property.user?.profile?.lastName || ""}`;
    const avatar = property.user?.profile?.photo || defaultImage;
    const apiUrl = process.env.REACT_APP_API_URL;
    const [saved, setSaved] = useState(false);
    const { user, token } = useAuth();
    const userId = user?._id;

    useEffect(() => {
        if (!userId) return;

        const checkSaved = async () => {
            try {
                const res = await axios.get(`${apiUrl}save/list`, {
                    params: { postCategory: "Spacewanted" },
                    headers: {
                        Authorization: `Bearer ${token}`,
                    }
                });

                const savedPosts = res.data.data;
                const isSaved = savedPosts.some(p => p.postId === property._id);
                setSaved(isSaved);
            } catch (err) {
                console.error("Error fetching saved posts:", err);
            }
        };
        checkSaved();
    }, [property._id, apiUrl, userId]);

    const handleSaveToggle = async (e) => {
        e.preventDefault();

        if (!userId) {
            toast.info("Please login first to save posts.");
            return;
        }

        try {
            const listingPage = "Spacewanted";
            const res = await axios.post(`${apiUrl}save`, {
                postId: property._id,
                postCategory: listingPage,
                listingPage: listingPage
            }, {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            });

            setSaved(res.data.saved);
            toast.success(res.data.message);
        } catch (err) {
            console.error("Error saving post:", err);
            toast.error("Failed to save post");
        }
    };

    const handleShare = async (e) => {
        e.preventDefault();

        const shareData = {
            title: property.title,
            text: `Check out this in ${locationString}!`,
            url: `${window.location.origin}/place-wanted/${property._id}`,
        };

        try {
            if (navigator.share) {
                await navigator.share(shareData);
            } else {
                await navigator.clipboard.writeText(shareData.url);
                toast.info("Link copied to clipboard!");
            }
        } catch (err) {
            console.error("Error sharing:", err);
            toast.error("Failed to share this property.");
        }
    };

    return (
        <div className="bg-white p-4 rounded-[12px] shadow-xl border-[1px] border-[#D7D7D7] flex gap-4 mb-4">
            <Link to={`/place-wanted/${property._id}`}>
                <div className="w-[200px] h-[260px]">
                    <img
                        src={image}
                        alt={property.title}
                        className="w-full h-full object-cover rounded-[10px]"
                    />
                </div>
            </Link>


            <div className="flex flex-col flex-grow text-[#000000]">
                <Link to={`/place-wanted/${property._id}`}>
                    <h3 className="font-semibold text-[24px] text-black">{property.title}</h3>
                </Link>
                <p className="text-[18px] flex items-center gap-1"><TfiLocationPin />{locationString}</p>
                <p className="text-[18px]">{property.propertyType}</p>
                <p className="text-[15px] mt-1">{property.description}</p>

                <div className="flex items-center mt-2 gap-2">
                    <div>
                        <img src={avatar} alt="avatar" className="w-12 h-12 rounded-full object-cover" />
                    </div>
                    <div>
                        <p className="text-sm">{name}</p>
                        <p className="text-xs text-gray-400">{property.occupation}</p>
                    </div>
                </div>
            </div>

            <div className="flex flex-col justify-between items-end text-black">
                <span className="font-bold text-lg">${property.budget} / {property.budgetType?.toLowerCase()}</span>
                <div className="flex gap-2 font-bold">
                    <button
                        onClick={handleSaveToggle}
                        className={`border-[1px] px-3 py-2 rounded-[4px] text-sm flex gap-2 items-center  
                                                                        ${saved ? "bg-pink-500 text-white border-pink-500" : "border-[#565ABF] text-white bg-[#565ABF]"}`}
                    >
                        <GrFavorite />
                        {saved ? "Saved" : "Save"}
                    </button>
                    <button
                        onClick={handleShare}
                        className="px-3 py-2 rounded-[4px] text-sm border-[1px] border-[#565ABF] text-[#565ABF] flex gap-2 items-center"><GoShareAndroid />Share</button>
                </div>
            </div>
        </div>
    );
}

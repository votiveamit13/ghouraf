import React, { useEffect, useState } from "react";
import { TfiLocationPin } from "react-icons/tfi";
import { GrFavorite } from "react-icons/gr";
import { GoShareAndroid } from "react-icons/go";
import { getFullLocation } from "utils/locationHelper";
import { Link } from "react-router-dom";
import defaultImage from "assets/img/ghouraf/default-avatar.png";
import axios from "axios";
import { toast } from "react-toastify";
import { useAuth } from "context/AuthContext";

export default function PropertyCard({ property, savedPosts, onToggleSave }) {
    const locationString = getFullLocation(property.city, property.state, property.country);
    const apiUrl = process.env.REACT_APP_API_URL;
    const saved = savedPosts?.includes(property._id);
    const { user, token } = useAuth();
    const userId = user?._id;

    const handleSaveToggle = async (e) => {
        e.preventDefault();

        if (!userId) {
            toast.info("Please login first to save posts.");
            return;
        }

        try {
            const listingPage = "Space";
            const res = await axios.post(`${apiUrl}save`, {
                postId: property._id,
                postCategory: listingPage,
                listingPage: listingPage
            }, {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            });

            // setSaved(res.data.saved);
            onToggleSave(property._id, res.data.saved);
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
            text: `Check out this property in ${locationString}!`,
            url: `${window.location.origin}/spaces/${property._id}`,
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

        <div className="relative bg-white p-4 rounded-[12px] shadow-xl border-[1px] border-[#D7D7D7] flex flex-col md:flex-row gap-4 mb-4">
            {property.promotion?.isPromoted && (
                <div className="absolute top-[-2px] left-[-2px] bg-[#565ABF] text-white text-xs font-semibold px-2 py-1 rounded mb-2 inline-block">
                    Sponsored
                </div>
            )}

            <Link to={`/spaces/${property._id}`}>
                <div className="w-full md:w-[200px] h-[260px]">
                    <img
                        src={property.featuredImage}
                        alt={property.title}
                        className="w-full h-full object-cover rounded-[10px]"
                    />
                </div>
            </Link>
            <div className="flex flex-col flex-grow w-full md:w-[450px] text-[#000000]">
                <Link to={`/spaces/${property._id}`}>
                    <h3 className="font-semibold text-[20px] text-black">{property.title}</h3>
                </Link>
                <p className="text-[16px] flex items-center gap-1"><TfiLocationPin />{locationString}</p>
                <p className="text-[16px]">Property Type - {property.propertyType}</p>
                <p className="text-[15px] mt-1">{property.description}</p>

                <div className="flex items-center mt-2 gap-2">
                    <div>
                        <img src={property.user.profile.photo || defaultImage} alt="avatar" className="w-12 h-12 rounded-full object-cover" />
                    </div>
                    <div>
                        <p className="text-sm">{property.user.profile.firstName} {property.user.profile.lastName}</p>
                        <p className="text-xs text-gray-400">{property.personalInfo}</p>
                    </div>
                </div>
            </div>

            <div className="flex flex-col justify-between items-end text-black">
                <span className="font-bold text-lg">${property.budget} / {property.budgetType}</span>
                <div className="flex flex-row lg:flex-col gap-2 font-bold">
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

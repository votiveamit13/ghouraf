import React, { useEffect, useState } from "react";
import axios from "axios";

export default function AdBanner({ ad }) {
if (!ad) return null;

    return (

        <div className="relative mb-4 p-4 bg-white border rounded-[12px] shadow-xl">
            <div className="absolute top-[-2px] left-[-2px] bg-yellow-300 text-black text-xs font-semibold px-2 py-1 rounded mb-2 inline-block">
                Advertisement
            </div>

            <a
                href={ad.url}
                target="_blank"
                rel="noreferrer"
                className="text-blue-600 break-all"
            >
                <div>
                    <h4 className="font-semibold text-[24px] text-black mb-2">{ad.title}</h4>

                </div>
                <div className="">
                    <img
                        src={ad.image}
                        alt={ad.title}
                        className="w-[100%] h-[300px] object-cover rounded-md border"
                    />
                </div>
            </a>
        </div>
    );
}

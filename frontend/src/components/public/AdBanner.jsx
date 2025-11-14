import axios from "axios";
import React, { useEffect, useRef } from "react";
import { getSession } from "utils/sessionManager";

export default function AdBanner({ ad }) {
const apiUrl = process.env.REACT_APP_API_URL;
  const ref = useRef();

  useEffect(() => {
    const sessionId = getSession();
    const viewKey = `ad_viewed_${sessionId}_${ad._id}`;

    const hasAlreadyViewed = sessionStorage.getItem(viewKey);

    if (hasAlreadyViewed) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          sessionStorage.setItem(viewKey, "true");

          axios.post(`${apiUrl}ads/${ad._id}/view`).catch(() => {});

          observer.disconnect();
        }
      },
      { threshold: 0.6 }
    );

    if (ref.current) observer.observe(ref.current);

    return () => observer.disconnect();
  }, [ad]);

  const handleClick = () => {
    axios.post(`${apiUrl}ads/${ad._id}/click`).catch(() => {});
  };

    if (!ad) return null;
    
    return (

        <div ref={ref} className="relative mb-4 p-4 bg-white border h-[310px] rounded-[12px] shadow-xl">
            <div className="absolute top-[-2px] left-[-2px] bg-yellow-300 text-black text-xs font-semibold px-2 py-1 rounded mb-2 inline-block">
                Advertisement
            </div>

            <a
                href={ad.url}
                target="_blank"
                rel="noreferrer"
                className="text-blue-600 break-all"
                onClick={handleClick}
            >
                <div>
                    <h4 className="font-semibold text-[24px] text-black mb-2">{ad.title}</h4>

                </div>
                <div className="">
                    <img
                        src={ad.image}
                        alt={ad.title}
                        className="w-[100%] h-[220px] object-cover rounded-md border"
                    />
                </div>
            </a>
        </div>
    );
}

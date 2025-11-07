import React, { useEffect, useState } from "react";
import axios from "axios";

export default function AdBanner() {
  const apiUrl = process.env.REACT_APP_API_URL;
  const [ad, setAd] = useState(null);

  useEffect(() => {
    const fetchAds = async () => {
      try {
        const { data } = await axios.get(`${apiUrl}ads?status=active`);
        if (data?.data?.length > 0) {
          const randomAd = data.data[Math.floor(Math.random() * data.data.length)];
          setAd(randomAd);
        }
      } catch (err) {
        console.error("Failed to load ads:", err);
      }
    };
    fetchAds();
  }, [apiUrl]);

  if (!ad) return null;

  return (
    <div className="my-6 p-4 bg-white border rounded-lg shadow-md flex flex-col md:flex-row items-center justify-between">
      <div className="flex items-center gap-4">
        <img
          src={ad.image}
          alt={ad.title}
          className="w-[120px] h-[120px] object-cover rounded-md border"
        />
        <div>
          <h4 className="font-semibold text-lg text-black">{ad.title}</h4>
          <a
            href={ad.url}
            target="_blank"
            rel="noreferrer"
            className="text-blue-600 hover:underline break-all"
          >
            {ad.url}
          </a>
        </div>
      </div>
    </div>
  );
}

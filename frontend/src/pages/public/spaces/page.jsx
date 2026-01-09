import UserPagination from "components/common/UserPagination";
import Filters from "components/public/spaces/Filters";
import PropertyList from "components/public/spaces/PropertyList";
import SearchBar from "components/public/SearchBar";
import { useCallback, useEffect, useRef, useState } from "react";
import axios from 'axios';
import Loader from "components/common/Loader";
import { useLocation } from "react-router-dom";
import queryString from "query-string";
import { useAuth } from "context/AuthContext";
import { toast } from "react-toastify";

export default function Spaces() {
  const apiUrl = process.env.REACT_APP_API_URL;
  const locationHook = useLocation();
  const [sortBy, setSortBy] = useState("Newest Ads");
  const [page, setPage] = useState(1);
  const [spaces, setSpaces] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [ads, setAds] = useState([]);
  const [savedPosts, setSavedPosts] = useState([]);
  const { user, token } = useAuth();
  const userId = user?._id;

  const [filters, setFilters] = useState({
    minValue: 0,
    maxValue: 100000,
    priceType: "",
    minSize: "",
    maxSize: "",
    furnishing: "all",
    smoking: "all",
    propertyType: "all",
    roomAvailable: "any",
    bedrooms: "Any",
    moveInDate: "",
    location: "",
    adPostedBy: "",
    amenities: [],
  });
  const [debouncedFilters, setDebouncedFilters] = useState(filters);

  const itemsPerPage = 20;
  const adsPerPage = 4;

  useEffect(() => {
    const parsed = queryString.parse(locationHook.search);

    setFilters((prev) => ({
      ...prev,
      city: parsed.city || "",
      state: parsed.state || "",
      country: parsed.country || "",
    }));

    setPage(1);
  }, [locationHook.search]);

  const prevFilters = useRef(filters);

  useEffect(() => {
    const handler = setTimeout(() => {
      if (JSON.stringify(prevFilters.current) !== JSON.stringify(filters)) {
        setPage(1);
        prevFilters.current = filters;
      }
      setDebouncedFilters(filters);
    }, 400);

    return () => clearTimeout(handler);
  }, [filters]);


  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const spaceParams = {
          page,
          limit: itemsPerPage,
          sortBy,
          ...debouncedFilters,
          amenities: debouncedFilters.amenities.join(',')
        };

        Object.keys(spaceParams).forEach((key) => {
          if (spaceParams[key] === "all" || spaceParams[key] === "any" || spaceParams[key] === "" || spaceParams[key] === 0) {
            delete spaceParams[key];
          }
        });

        const spaceReq = axios.get(`${apiUrl}spaces`, { params: spaceParams });

        const adsReq = axios.get(`${apiUrl}ads`, {
          params: { status: "active", page, limit: adsPerPage }
        });

        const [spaceRes, adsRes] = await Promise.all([spaceReq, adsReq]);

        setSpaces(spaceRes.data.data);
        setTotalPages(spaceRes.data.pages);
        setAds(adsRes.data.data);
      } catch (err) {
        console.error("Failed to fetch spaces or ads:", err);
        setSpaces([]);
        setAds([]);
        setTotalPages(1);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [page, debouncedFilters, sortBy, apiUrl]);

  useEffect(() => {
  if (!userId) return;

  axios.get(`${apiUrl}save/list`, {
    params: { postCategory: "Space" },
    headers: { Authorization: `Bearer ${token}` }
  }).then(res => {
    setSavedPosts(res.data.data.map(p => p.postId));
  }).catch(console.error);
}, [userId, token]);

const handleToggleSave = useCallback(async (id) => {
  if (!userId) {
    toast.info("Please login first to save posts.");
    return;
  }

  try {
    const res = await axios.post(`${apiUrl}save`, {
      postId: id,
      postCategory: "Space",
      listingPage: "Space",
    }, {
      headers: { Authorization: `Bearer ${token}` }
    });

    const { saved, message } = res.data;

    setSavedPosts(prev =>
      saved ? [...prev, id] : prev.filter(x => x !== id)
    );

    toast.success(message);

  } catch (err) {
    console.error("Error saving:", err);
    toast.error("Failed to save post");
  }
}, [userId, token]);

    const handleShare = useCallback((property) => {
  const locationString = `${property.city || ""}, ${property.state || ""}, ${property.country || ""}`;

  const shareData = {
    title: property.title,
    text: `Check out this in ${locationString}!`,
    url: `${window.location.origin}/spaces/${property._id}`,
  };

  if (navigator.share) {
    navigator.share(shareData);
  } else {
    navigator.clipboard.writeText(shareData.url);
    toast.info("Link copied to clipboard!");
  }
}, []);

  return (
    <div className="container user-layout mt-5 mb-8 grid grid-cols-1 lg:grid-cols-4 gap-0 lg:gap-6">
      <div className="col-span-1">
        <SearchBar />
        <Filters filters={filters} setFilters={setFilters} setPage={setPage} />
      </div>

      <div className="col-span-3">
        <div className="flex items-center justify-end text-black mb-2 gap-2">
          <div>Sort by:</div>
          <div>
            <select
              name="sortBy"
              value={sortBy}
              onChange={(e) => {
                setSortBy(e.target.value);
                setPage(1);
              }}
              className="border-[1px] border-[#D1D5DB] px-2 py-[12px] w-[130px] rounded-[10px] text-[#948E8E]"
            >
              <option value="Newest Ads">Newest Ads</option>
              <option value="Lowest First">Budget (Lowest First)</option>
              <option value="Highest First">Budget (Highest First)</option>
            </select>
          </div>
        </div>
          {loading ? (
          <Loader fullScreen={false} />
        ) : (
          <>
            <PropertyList
              properties={spaces}
              ads={ads}
              savedPosts={savedPosts}
              onToggleSave={handleToggleSave}
              onShare={handleShare}
            />
            {spaces.length > 0 && (
              <div className="text-end flex justify-end mt-5">
                <UserPagination
                  currentPage={page}
                  totalPages={totalPages}
                  onPageChange={setPage}
                />
              </div>
            )}
            {spaces.length === 0 && (
              <div className="text-center py-20 text-gray-500 font-medium text-lg">
                No Spaces Found
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
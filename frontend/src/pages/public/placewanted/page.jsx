import UserPagination from "components/common/UserPagination";
import Filters from "components/public/place_wanted/Filters";
import PropertyList from "components/public/place_wanted/PropertyList";
import { useCallback, useEffect, useRef, useState } from "react";
import SearchBar from "components/public/SearchBar";
import { toast } from "react-toastify";
import axios from "axios";
import Loader from "components/common/Loader";
import { useLocation, useNavigate } from "react-router-dom";
import queryString from "query-string";
import { useAuth } from "context/AuthContext";
import ConfirmationDialog from "components/common/ConfirmationDialog";

export default function PlaceWanted() {
    const { user, loading: authLoading, token } = useAuth();
    const apiUrl = process.env.REACT_APP_API_URL;
    const [properties, setProperties] = useState([]);
    const [page, setPage] = useState(1);
    const [sortBy, setSortBy] = useState("Newest Ads");
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(false);
    const [filters, setFilters] = useState({});
    const [ads, setAds] = useState([]);
    const locationHook = useLocation();
    const itemsPerPage = 20;
    const adsPerPage = 4;
    const navigate = useNavigate();
    const [showInvalidDialog, setShowInvalidDialog] = useState(false);
    const [debouncedFilters, setDebouncedFilters] = useState(filters);
    const prevFilters = useRef(filters);
    const [savedPosts, setSavedPosts] = useState([]);

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
        if (!authLoading && !user) {
            setShowInvalidDialog(true);
        }
    }, [user, authLoading]);

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

    useEffect(() => {
        fetchData();
    }, [page, sortBy, debouncedFilters]);


   const fetchData = async () => {
        setLoading(true);
        try {
            const propertyParams = {
                page,
                limit: itemsPerPage,
                sortBy,
                ...debouncedFilters,
                amenities: debouncedFilters.amenities ? debouncedFilters.amenities.join(',') : undefined,
            };

            Object.keys(propertyParams).forEach((key) => {
                if (
                    propertyParams[key] === "" ||
                    propertyParams[key] === "all" ||
                    propertyParams[key] === "any" ||
                    propertyParams[key] === 0
                ) {
                    delete propertyParams[key];
                }
            });

            const propertiesReq = axios.get(`${apiUrl}spacewanted`, { params: propertyParams });
            const adsReq = axios.get(`${apiUrl}ads`, {
                params: { status: "active", page, limit: adsPerPage }
            });

            const [propertiesRes, adsRes] = await Promise.all([propertiesReq, adsReq]);

            setProperties(propertiesRes.data.data || []);
            setTotalPages(propertiesRes.data.pages || 1);
            setAds(adsRes.data.data || []);
        } catch (err) {
            console.error("Failed to fetch properties or ads:", err);
            setProperties([]);
            setAds([]);
            setTotalPages(1);
            toast.error("Failed to fetch listings");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
    if (!user?._id) return;

    axios.get(`${apiUrl}save/list`, {
        params: { postCategory: "Spacewanted" },
        headers: { Authorization: `Bearer ${token}` }
    }).then(res => {
        setSavedPosts(res.data.data.map(p => p.postId));
    }).catch(console.error);
    }, [user, token]);

    const handleToggleSave = useCallback(async (id) => {
  if (!user?._id) {
    toast.info("Please login first to save posts.");
    return;
  }

  try {
    const res = await axios.post(`${apiUrl}save`, {
      postId: id,
      postCategory: "Spacewanted",
      listingPage: "Spacewanted",
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
}, [user, token]);

    const handleShare = useCallback((property) => {
  const locationString = `${property.city || ""}, ${property.state || ""}, ${property.country || ""}`;

  const shareData = {
    title: property.title,
    text: `Check out this in ${locationString}!`,
    url: `${window.location.origin}/place-wanted/${property._id}`,
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
                <Filters setFilters={setFilters} setPage={setPage} />
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
                {!user ? (
                    <ConfirmationDialog
                        className="navbar-confirm-dialog"
                        show={showInvalidDialog}
                        title="Place Wanted"
                        message="Please login or create an account to view the posts."
                        onConfirm={() => { }}
                        onCancel={() => {
                            setShowInvalidDialog(false);
                            navigate("/");
                        }}
                    />

                ) : (
                    <>
                        {loading ? (
                            <Loader fullScreen={false} />
                        ) : (
                            <PropertyList
                                properties={properties}
                                ads={ads}
                                savedPosts={savedPosts}
                                onToggleSave={handleToggleSave}
                                onShare={handleShare}
                            />
                        )}

                        {properties.length > 0 && !loading && (
                            <div className="text-end flex justify-end mt-5">
                                <UserPagination
                                    currentPage={page}
                                    totalPages={totalPages}
                                    onPageChange={setPage}
                                />
                            </div>
                        )}

                        {properties.length === 0 && !loading && (
                            <div className="text-center py-20 text-gray-500 font-medium text-lg">
                                No Space Wanted Found
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}

import UserPagination from "components/common/UserPagination";
import Filters from "components/public/place_wanted/Filters";
import PropertyList from "components/public/place_wanted/PropertyList";
import { useEffect, useState } from "react";
import SearchBar from "components/public/SearchBar";
import { toast } from "react-toastify";
import axios from "axios";
import Loader from "components/common/Loader";
import { useLocation, useNavigate } from "react-router-dom";
import queryString from "query-string";
import { useAuth } from "context/AuthContext";
import ConfirmationDialog from "components/common/ConfirmationDialog";

export default function PlaceWanted() {
    const { user, loading: authLoading } = useAuth();
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
     const [userHasPosted, setUserHasPosted] = useState(true);
    const [showInvalidDialog, setShowInvalidDialog] = useState(false);
    const [showNoPostDialog, setShowNoPostDialog] = useState(false);

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
        const checkHasPosted = async () => {
            if (!user?._id) return;

            try {
                const res = await axios.get(`${apiUrl}spacewanted`, {
                    params: { userId: user._id }
                });

                const userPosts = res.data.data.filter(
                    (item) => item.user?._id === user._id
                );

                if (userPosts.length === 0) {
                    setUserHasPosted(false);
                    setShowNoPostDialog(true); // show popup
                } else {
                    setUserHasPosted(true);
                }
            } catch (err) {
                setUserHasPosted(false);
                setShowNoPostDialog(true);
            }
        };

        if (user) checkHasPosted();
    }, [user]);

useEffect(() => {
        if (!userHasPosted) return;
        fetchData();
    }, [page, sortBy, filters, userHasPosted]);

    const fetchData = async () => {
        setLoading(true);
        try {
            const propertyParams = {
                page,
                limit: itemsPerPage,
                sortBy,
                ...filters,
                amenities: filters.amenities ? filters.amenities.join(',') : undefined,
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
               {!user && (
                    <ConfirmationDialog
                        className="navbar-confirm-dialog"
                        show={showInvalidDialog}
                        title="⚠️ Place Wanted"
                        message="Please login or create an account to view the posts."
                        onConfirm={() => {}}
                        onCancel={() => {
                            setShowInvalidDialog(false);
                            navigate("/");
                        }}
                    />
                )}

                {user && (
                    <ConfirmationDialog
                        // className="navbar-confirm-dialog"
                        show={showNoPostDialog}
                        title="⚠️ Place Wanted"
                        message="You haven’t posted any Place Wanted yet. Please post first. Want to post?"
                        onConfirm={() => navigate("/user/place-wanted-ad")}
                        onCancel={() => {
                            setShowNoPostDialog(false);
                            navigate("/");
                        }}
                    />
                )}

                {user && userHasPosted && (
                    <>
                        {loading ? (
                            <Loader fullScreen={false} />
                        ) : (
                            <PropertyList properties={properties} ads={ads} />
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

import UserPagination from "components/common/UserPagination";
import Filters from "components/public/place_wanted/Filters";
import PropertyList from "components/public/place_wanted/PropertyList";
import { useEffect, useState } from "react";
import SearchBar from "components/public/SearchBar";
import { toast } from "react-toastify";
import axios from "axios";
import Loader from "components/common/Loader";
import { useLocation } from "react-router-dom";
import queryString from "query-string";
import { useAuth } from "context/AuthContext";

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
    }, [page, sortBy, filters]);

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
                            className="border-[1px] border-[#D1D5DB] px-2 py-[12px] w-full rounded-[10px] text-[#948E8E]"
                        >
                            <option value="Newest Ads">Newest Ads</option>
                            <option value="Lowest First">Budget (Lowest First)</option>
                            <option value="Highest First">Budget (Highest First)</option>
                        </select>
                    </div>
                </div>
                {!user ? (
                    <div className="text-center py-20 text-gray-500 font-medium text-lg">
                        Please login first to show the posts.
                    </div>
                ) : (
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

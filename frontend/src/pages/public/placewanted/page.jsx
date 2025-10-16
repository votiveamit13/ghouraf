import UserPagination from "components/common/UserPagination";
import Filters from "components/public/place_wanted/Filters";
import PropertyList from "components/public/place_wanted/PropertyList";
import { useEffect, useState } from "react";
import SearchBar from "components/public/SearchBar";
import { toast } from "react-toastify";
import axios from "axios";
import Loader from "components/common/Loader";

export default function PlaceWanted() {
    const apiUrl = process.env.REACT_APP_API_URL;
    const [properties, setProperties] = useState([]);
    const [page, setPage] = useState(1);
    const [sortBy, setSortBy] = useState("Newest Ads");
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(false);
    const [filters, setFilters] = useState({});

    const itemsPerPage = 10;

    useEffect(() => {
        fetchProperties();
    }, [page, sortBy, filters]);

    const fetchProperties = async () => {
        setLoading(true);
        try {
            const params = {
                page,
                limit: itemsPerPage,
                sortBy,
                ...filters,
                amenities: filters.amenities,
            };

            const queryString = new URLSearchParams({
                ...filters,
                page,
                limit: itemsPerPage,
                sortBy,
            }).toString();

            let finalUrl = `${apiUrl}spacewanted?${queryString}`;
            if (filters.amenities && filters.amenities.length > 0) {
                const amenitiesQuery = filters.amenities
                    .map(a => `amenities=${encodeURIComponent(a)}`)
                    .join("&");
                finalUrl += `&${amenitiesQuery}`;
            }

            const { data } = await axios.get(finalUrl);

            if (data.success) {
                setProperties(data.data || []);
                setTotalPages(data.pages || 1);
            } else {
                toast.error("Failed to fetch listings");
            }
        } catch (error) {
            console.error("Error fetching properties:", error);
            toast.error("Something went wrong while fetching data");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container px-4 mt-5 mb-8 grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="col-span-1 space-y-4">
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

                {loading ? (
                    <Loader fullScreen={false} />
                ) : properties.length === 0 ? (
                    <p className="text-center mt-5">No Space Wanted found</p>
                ) : (
                    <>
                        <PropertyList properties={properties} page={1} itemsPerPage={itemsPerPage} />
                        <div className="text-end flex justify-end mt-5">
                            <UserPagination
                                currentPage={page}
                                totalPages={totalPages}
                                onPageChange={setPage}
                            />
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}

import { useAuth } from "context/AuthContext";
import { useEffect, useState } from "react";
import axios from "axios";
import UserPagination from "components/common/UserPagination";
import Filters from "components/public/team_up/Filters";
import PropertyList from "components/public/team_up/PropertyList";
import SearchBar from "components/public/SearchBar";
import Loader from "components/common/Loader";
import { useLocation } from "react-router-dom";
import queryString from "query-string";

export default function TeamUp() {
  const apiUrl = process.env.REACT_APP_API_URL;
  const locationHook = useLocation();
  const { user } = useAuth();
  const userId = user?._id;

  const [page, setPage] = useState(1);
  const [teamups, setTeamups] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [sortBy, setSortBy] = useState("Newest Ads");
  const [userHasPosted, setUserHasPosted] = useState(true);
  const [loading, setLoading] = useState(false);
  const itemsPerPage = 10;

  const [filters, setFilters] = useState({
    minValue: 0,
    maxValue: 100000,
    priceType: "",
    smoking: "all",
    amenities: [],
    location: "",
    period: "",
    occupationPreference: "all",
    minAge: "",
    maxAge: "",
  });

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
  const fetchTeamups = async () => {
    setLoading(true);
    try {
      const params = { page, limit: itemsPerPage, sortBy, ...filters };

      Object.keys(params).forEach((key) => {
        if (
          params[key] === "all" ||
          params[key] === "any" ||
          params[key] === "" ||
          params[key] === 0 ||
          (Array.isArray(params[key]) && params[key].length === 0)
        ) {
          delete params[key];
        }
      });

      const res = await axios.get(`${apiUrl}teamups`, { params });
      const data = res.data.data || [];

      const hasPosted = data.some((item) => item.user?._id === userId);
      setUserHasPosted(hasPosted);

      setTeamups(data);
      setTotalPages(res.data.pages || 1);
    } catch (err) {
      console.error("Failed to fetch team-ups:", err);
      setTeamups([]);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  };

  if (userId) fetchTeamups();
}, [page, filters, sortBy, apiUrl, userId]);


  return (
    <div className="container px-4 mt-5 mb-8 grid grid-cols-1 md:grid-cols-4 gap-6">
      <div className="col-span-1 space-y-4">
        <SearchBar />
        <Filters filters={filters} setFilters={setFilters} setPage={setPage} />
      </div>

      <div className="col-span-3">
        {loading ? (
          <Loader fullScreen={false} />
        ) : !userHasPosted ? (
          <div className="text-center py-20 text-gray-500 font-medium text-lg">
            You haven’t posted any Team Up yet.<br/>Please post first to view other members posts
          </div>
        ) : teamups.length > 0 ? (
          <>
            <PropertyList
              properties={teamups}
              page={page}
              itemsPerPage={itemsPerPage}
            />
            <div className="text-end flex justify-end mt-5">
              <UserPagination
                currentPage={page}
                totalPages={totalPages}
                onPageChange={setPage}
              />
            </div>
          </>
        ) : (
          <div className="text-center py-20 text-gray-500 font-medium text-lg">
            No Team Ups Found! Please login first
          </div>
        )}
      </div>
    </div>
  );
}

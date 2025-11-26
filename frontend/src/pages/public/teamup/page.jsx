import { useAuth } from "context/AuthContext";
import { useEffect, useState } from "react";
import axios from "axios";
import UserPagination from "components/common/UserPagination";
import Filters from "components/public/team_up/Filters";
import PropertyList from "components/public/team_up/PropertyList";
import SearchBar from "components/public/SearchBar";
import Loader from "components/common/Loader";
import { useLocation, useNavigate } from "react-router-dom";
import queryString from "query-string";
import ConfirmationDialog from "components/common/ConfirmationDialog";

export default function TeamUp() {
  const apiUrl = process.env.REACT_APP_API_URL;
  const locationHook = useLocation();
  const { user, loading: authLoading } = useAuth();
  const userId = user?._id;
  const [showNoPostDialog, setShowNoPostDialog] = useState(false);
  const [page, setPage] = useState(1);
  const [teamups, setTeamups] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [sortBy, setSortBy] = useState("Newest Ads");
  const [userHasPosted, setUserHasPosted] = useState(true);
  const [loading, setLoading] = useState(false);
  const [ads, setAds] = useState([]);
  const itemsPerPage = 20;
  const adsPerPage = 4;
  const [showInvalidDialog, setShowInvalidDialog] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!authLoading && !user) {
      setShowInvalidDialog(true);
    }
  }, [user, authLoading]);

  const [filters, setFilters] = useState({
    minValue: 0,
    maxValue: 100000,
    priceType: "",
    smoking: "all",
    amenities: [],
    location: "",
    period: "",
    occupationPreference: "all",
    occupation: "all",
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
    const checkHasPosted = async () => {
      if (!userId) return;
      try {
        const res = await axios.get(`${apiUrl}teamups`, { params: { userId } });
        const userPosts = res.data.data.filter(item => item.user?._id === userId);
        setUserHasPosted(userPosts.length > 0);
        setShowNoPostDialog(true);
      } catch (err) {
        setUserHasPosted(false);
        setShowNoPostDialog(true);
      }
    };
    checkHasPosted();
  }, [userId]);


  useEffect(() => {
    const fetchData = async () => {
      // if (!userId) return;
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

        const teamupsReq = axios.get(`${apiUrl}teamups`, { params });
        const adsReq = axios.get(`${apiUrl}ads`, { params: { status: "active", page, limit: adsPerPage } });

        const [teamupsRes, adsRes] = await Promise.all([teamupsReq, adsReq]);

        setTeamups(teamupsRes.data.data || []);
        setTotalPages(teamupsRes.data.pages || 1);
        setAds(adsRes.data.data || []);
      } catch (err) {
        console.error("Failed to fetch team-ups or ads:", err);
        setTeamups([]);
        setAds([]);
        setTotalPages(1);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [page, filters, sortBy, apiUrl, userId]);


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
        {!user ? (
          <ConfirmationDialog
            className="navbar-confirm-dialog"
            show={showInvalidDialog}
            title="Team Up"
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
            ) : !userHasPosted ? (
              <ConfirmationDialog
                // className="navbar-confirm-dialog"
                show={showNoPostDialog}
                title="Team Up"
                message="You haven’t posted any Team Up yet. Please post first. Want to post?"
                onConfirm={() => navigate("/user/team-up-post")}
                onCancel={() => {
                  setShowNoPostDialog(false);
                  navigate("/");
                }}
              />
            ) : (
              <>
                <PropertyList properties={teamups} ads={ads} />
                {teamups.length > 0 && (
                  <div className="text-end flex justify-end mt-5">
                    <UserPagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
                  </div>
                )}
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
}
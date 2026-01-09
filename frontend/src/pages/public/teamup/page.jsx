import { useAuth } from "context/AuthContext";
import { useCallback, useEffect, useRef, useState } from "react";
import axios from "axios";
import UserPagination from "components/common/UserPagination";
import Filters from "components/public/team_up/Filters";
import PropertyList from "components/public/team_up/PropertyList";
import SearchBar from "components/public/SearchBar";
import Loader from "components/common/Loader";
import { useLocation, useNavigate } from "react-router-dom";
import queryString from "query-string";
import ConfirmationDialog from "components/common/ConfirmationDialog";
import { toast } from "react-toastify";

export default function TeamUp() {
  const apiUrl = process.env.REACT_APP_API_URL;
  const locationHook = useLocation();
  const { user, loading: authLoading, token } = useAuth();
  const navigate = useNavigate();

  const userId = user?._id;
  const [teamups, setTeamups] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [sortBy, setSortBy] = useState("Newest Ads");
  const [loading, setLoading] = useState(false);
  const [showInvalidDialog, setShowInvalidDialog] = useState(false);
  const [showNoPostDialog, setShowNoPostDialog] = useState(false);
  const [userHasPosted, setUserHasPosted] = useState(true);
  const [ads, setAds] = useState([]);
  const [savedPosts, setSavedPosts] = useState([]);

  const itemsPerPage = 20;
  const adsPerPage = 4;

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

  const [debouncedFilters, setDebouncedFilters] = useState(filters);
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
    const parsed = queryString.parse(locationHook.search);
    setFilters(prev => ({
      ...prev,
      city: parsed.city || "",
      state: parsed.state || "",
      country: parsed.country || "",
    }));
    setPage(1);
  }, [locationHook.search]);


  useEffect(() => {
    if (!authLoading && !user) setShowInvalidDialog(true);
  }, [user, authLoading]);


  useEffect(() => {
    const checkHasPosted = async () => {
      if (!userId) return;
      try {
        const { data } = await axios.get(`${apiUrl}teamups`, { params: { userId } });
        const userPosts = data.data.filter(item => item.user?._id === userId);
        setUserHasPosted(userPosts.length > 0);
        setShowNoPostDialog(true);
      } catch {
        setUserHasPosted(false);
        setShowNoPostDialog(true);
      }
    };
    checkHasPosted();
  }, [userId]);


  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const params = { page, limit: itemsPerPage, sortBy, ...debouncedFilters };

        if (Array.isArray(params.amenities) && params.amenities.length > 0) {
          params.amenities = params.amenities.join(",");
        } else {
          delete params.amenities;
        }

        Object.keys(params).forEach(key => {
          if (
            params[key] === "all" ||
            params[key] === "any" ||
            params[key] === "" ||
            params[key] === 0
          ) delete params[key];
        });

        const [teamupsRes, adsRes] = await Promise.all([
          axios.get(`${apiUrl}teamups`, { params }),
          axios.get(`${apiUrl}ads`, { params: { status: "active", page, limit: adsPerPage } })
        ]);

        setTeamups(teamupsRes.data.data || []);
        setTotalPages(teamupsRes.data.pages || 1);
        setAds(adsRes.data.data || []);
      } catch (err) {
        console.error("Failed:", err);
        setTeamups([]);
        setAds([]);
        setTotalPages(1);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [page, debouncedFilters, sortBy, userId]);


  // Load saved list
  useEffect(() => {
    if (!userId) return;
    axios.get(`${apiUrl}save/list`, {
      params: { postCategory: "Teamup" },
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => setSavedPosts(res.data.data.map(p => p.postId)))
      .catch(console.error);
  }, [userId, token]);


  const handleToggleSave = useCallback(async (id) => {
    if (!userId) {
      toast.info("Please login first to save posts.");
      return;
    }

    try {
      const { data } = await axios.post(`${apiUrl}save`, {
        postId: id,
        postCategory: "Teamup",
        listingPage: "Teamup",
      }, { headers: { Authorization: `Bearer ${token}` } });

      const { saved, message } = data;

      setSavedPosts(prev =>
        saved ? [...prev, id] : prev.filter(x => x !== id)
      );

      toast.success(message);
    } catch (err) {
      console.error(err);
      toast.error("Failed to save post");
    }
  }, [userId, token]);


  const handleShare = useCallback((property) => {
    const locationString = `${property.city || ""}, ${property.state || ""}, ${property.country || ""}`;

    const shareData = {
      title: property.title,
      text: `Check out this in ${locationString}!`,
      url: `${window.location.origin}/team-up/${property._id}`,
    };

    if (navigator.share) navigator.share(shareData);
    else {
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
          <select
            name="sortBy"
            value={sortBy}
            onChange={(e) => { setSortBy(e.target.value); setPage(1); }}
            className="border-[1px] border-[#D1D5DB] px-2 py-[12px] w-[130px] rounded-[10px] text-[#948E8E]"
          >
            <option value="Newest Ads">Newest Ads</option>
            <option value="Lowest First">Budget (Lowest First)</option>
            <option value="Highest First">Budget (Highest First)</option>
          </select>
        </div>

        {!user ? (
          <ConfirmationDialog
            show={showInvalidDialog}
            title="Team Up"
            message="Please login or create an account to view the posts."
            onCancel={() => { setShowInvalidDialog(false); navigate("/"); }}
          />
        ) : (
          <>
            {loading ? (
              <Loader fullScreen={false} />
            ) : !userHasPosted ? (
              <ConfirmationDialog
                show={showNoPostDialog}
                title="Team Up"
                message="You haven’t posted any Team Up yet. Please post first. Want to post?"
                onConfirm={() => navigate("/user/team-up-post")}
                onCancel={() => { setShowNoPostDialog(false); navigate("/"); }}
              />
            ) : (
              <>
                <PropertyList
                  properties={teamups}
                  ads={ads}
                  savedPosts={savedPosts}
                  onToggleSave={handleToggleSave}
                  onShare={handleShare}
                />

                {teamups.length > 0 && (
                  <div className="flex justify-end mt-5">
                    <UserPagination
                      currentPage={page}
                      totalPages={totalPages}
                      onPageChange={setPage}
                    />
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

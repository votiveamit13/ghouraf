import React, { useEffect, useState, useRef, useCallback } from "react";
import UserPagination from "../../../components/common/UserPagination";
import { TfiLocationPin } from "react-icons/tfi";
import { CiSearch } from "react-icons/ci";
import Loader from "components/common/Loader";
import axios from "axios";
import { BsThreeDots } from "react-icons/bs";
import ViewPost from "components/user/myads/ViewPost";
import EditPost from "components/user/myads/EditPost";
import { getFullLocation } from "utils/locationHelper";
import { toast } from "react-toastify";
import ConfirmationDialog from "components/common/ConfirmationDialog";
import { loadStripe } from "@stripe/stripe-js";
import PromoteAdModal from "components/user/myads/PromoteAd";
import { useAuth } from "context/AuthContext";

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLIC_KEY);

export default function MyAds() {
  const apiUrl = process.env.REACT_APP_API_URL;
  const [ads, setAds] = useState([]);
  const [filter, setFilter] = useState("All Category");
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [sort, setSort] = useState("Recently posted");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);

  const adsPerPage = 9;

  const [openMenu, setOpenMenu] = useState(null);
  const [selectedAd, setSelectedAd] = useState(null);
  const [showViewPost, setShowViewPost] = useState(false);
  const [showEditPost, setShowEditPost] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [deleteAdId, setDeleteAdId] = useState(null);

  const [showPromoteModal, setShowPromoteModal] = useState(false);
  const [promotingAd, setPromotingAd] = useState(null);
  const [loadingPayment, setLoadingPayment] = useState(false);

  const { user, token } = useAuth();
  const menuRefs = useRef({});
  const [openLeftMenu, setOpenLeftMenu] = useState({});

  // -----------------------------------------------------
  // CLICK OUTSIDE CLOSE MENU
  // -----------------------------------------------------
  useEffect(() => {
    const handleClickOutside = (event) => {
      const refs = Object.values(menuRefs.current);
      if (!refs.some((ref) => ref?.contains(event.target))) {
        setOpenMenu(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // -----------------------------------------------------
  // DEBOUNCE SEARCH
  // -----------------------------------------------------
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedSearch(search), 350);
    return () => clearTimeout(handler);
  }, [search]);

  // -----------------------------------------------------
  // FETCH ADS
  // -----------------------------------------------------
  const fetchAds = useCallback(async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      const params = {
        page: currentPage,
        limit: adsPerPage,
        search: debouncedSearch,
        sort,
      };

      if (filter !== "All Category") params.category = filter;

      const response = await axios.get(`${apiUrl}my-ads`, {
        headers: { Authorization: `Bearer ${token}` },
        params,
      });

      setAds(response.data.data || []);
      setTotalPages(response.data.totalPages || 1);
    } catch (err) {
      console.error("Error fetching ads:", err);
    } finally {
      setLoading(false);
    }
  }, [apiUrl, currentPage, debouncedSearch, filter, sort]);

  useEffect(() => {
    fetchAds();
  }, [fetchAds]);

  // -----------------------------------------------------
  // ACTION HANDLERS
  // -----------------------------------------------------

  const handleView = useCallback(
    (id) => {
      const ad = ads.find((a) => a._id === id);
      setSelectedAd(ad);
      setShowViewPost(true);
    },
    [ads]
  );

  const handleEdit = useCallback(
    (id) => {
      const ad = ads.find((a) => a._id === id);
      setSelectedAd(ad);
      setShowEditPost(true);
    },
    [ads]
  );

  const handleStatus = useCallback(
    async (id, status) => {
      try {
        const token = localStorage.getItem("token");
        await axios.put(
          `${apiUrl}ad-availability/${id}`,
          { available: status === "Available" },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        toast.success("Updated the status");
        fetchAds();
      } catch {
        toast.error("Failed to update status");
      }
    },
    [apiUrl, fetchAds]
  );

  const handlePromote = useCallback(
    (id) => {
      const ad = ads.find((a) => a._id === id);
      setPromotingAd(ad);
      setShowPromoteModal(true);
    },
    [ads]
  );

  const handleProceedToPayment = async (planId) => {
    try {
      setLoadingPayment(true);
      const res = await axios.post(
        `${apiUrl}stripe/webhooks/create-promotion-session`,
        {
          adId: promotingAd._id,
          postCategory: promotingAd.postCategory,
          plan: planId,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      window.location.href = res.data.url;
    } finally {
      setLoadingPayment(false);
    }
  };

  const handleDelete = useCallback((id) => {
    setDeleteAdId(id);
    setShowConfirmDialog(true);
  }, []);

  const confirmDelete = useCallback(async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `${apiUrl}ad-delete/${deleteAdId}`,
        { is_deleted: true },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Ad deleted successfully");
      fetchAds();
    } finally {
      setShowConfirmDialog(false);
      setDeleteAdId(null);
    }
  }, [apiUrl, deleteAdId, fetchAds]);

  // -----------------------------------------------------
  // IMAGE CARD COMPONENT (Optimized)
  // -----------------------------------------------------
  const AdCard = React.memo(({ ad }) => {
    const [visible, setVisible] = useState(false);
    const [loaded, setLoaded] = useState(false);
    const imgRef = useRef(null);

    const city = ad.city === "NA" ? "" : ad.city;
    const locationString = getFullLocation(city, ad.state, ad.country);

    useEffect(() => {
      const el = imgRef.current;
      if (!el) return;
      const observer = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      });
      observer.observe(el);
      return () => observer.disconnect();
    }, []);

    return (
      <div
        ref={(el) => (menuRefs.current[ad._id] = el)}
        className="relative w-full sm:w-[48%] lg:w-[31.8%] border border-[#D7D7D7] rounded-[12px] shadow-lg flex flex-col p-4"
      >
        {/* MENU BUTTONS (UNCHANGED) */}
        <div className="absolute top-3 right-3 z-999">
          <div className="relative">
            <button
              onClick={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                const shouldOpenLeft = rect.right > window.innerWidth - 180;
                setOpenLeftMenu((prev) => ({
                  ...prev,
                  [ad._id]: shouldOpenLeft,
                }));
                setOpenMenu(openMenu === ad._id ? null : ad._id);
              }}
              className="relative z-[999] p-2 rounded-full bg-black text-white shadow-md"
            >
              <BsThreeDots />
            </button>

            {openMenu === ad._id && (
              <div className="absolute right-0 mt-2 w-44 bg-white border border-gray-200 rounded-[15px] shadow-lg z-10">
                <button
                  className="w-full text-left px-4 py-2 hover:bg-gray-100 border-b"
                  onClick={() => {
                    handleView(ad._id);
                    setOpenMenu(null);
                  }}
                >
                  View
                </button>

                <div className="relative group">
                  <button className="w-full text-left px-4 py-2 hover:bg-gray-100 flex justify-between items-center border-b">
                    Status
                  </button>
                  <div
                    className={`hidden group-hover:block absolute top-0 ${
                      openLeftMenu[ad._id] ? "right-full" : "left-full"
                    } w-36 bg-white border border-gray-200 rounded-lg shadow-lg`}
                  >
                    <button
                      disabled={ad.available === true}
                      onClick={() => {
                        if (!ad.available) handleStatus(ad._id, "Available");
                        setOpenMenu(null);
                      }}
                      className={`block w-full text-left px-4 py-2 border-b ${
                        ad.available
                          ? "bg-green-100 text-green-600 font-medium cursor-not-allowed"
                          : "hover:bg-gray-100 text-gray-700"
                      }`}
                    >
                      Resume
                    </button>

                    <button
                      disabled={ad.available === false}
                      onClick={() => {
                        if (ad.available) handleStatus(ad._id, "Unavailable");
                        setOpenMenu(null);
                      }}
                      className={`block w-full text-left px-4 py-2 ${
                        !ad.available
                          ? "bg-red-100 text-red-600 font-medium cursor-not-allowed"
                          : "hover:bg-gray-100 text-gray-700"
                      }`}
                    >
                      Pause
                    </button>
                  </div>
                </div>

                <button
                  className={`w-full text-left px-4 py-2 border-b ${
                    ad?.promotion?.isPromoted
                      ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                      : "hover:bg-gray-100"
                  }`}
                  onClick={() =>
                    !ad?.promotion?.isPromoted && handlePromote(ad._id)
                  }
                  disabled={ad?.promotion?.isPromoted === true}
                >
                  Promote Ad
                </button>

                <button
                  className="w-full text-left px-4 py-2 text-red-500 hover:bg-gray-100"
                  onClick={() => handleDelete(ad._id)}
                >
                  Delete
                </button>
              </div>
            )}
          </div>
        </div>

        {/* IMAGE */}
        <div ref={imgRef} className="relative w-full">
          {visible && (
            <img
              src={
                ad.featuredImage ||
                ad.photos?.[0]?.url ||
                "/assets/img/default.jpg"
              }
              loading="lazy"
              decoding="async"
              onLoad={() => setLoaded(true)}
              alt={ad.title}
              className={`w-full h-[220px] sm:h-[260px] lg:h-[280px] object-cover rounded-[10px] transition-all duration-300 ${
                loaded ? "opacity-100 blur-0" : "opacity-60 blur-sm"
              }`}
            />
          )}

          {ad.status === "inactive" && (
            <span className="absolute top-0 left-0 bg-yellow-500 text-white text-sm font-semibold py-1 px-3 rounded-md shadow">
              Under Review
            </span>
          )}

          {ad.status === "active" && ad?.promotion?.isPromoted && (
            <span className="absolute top-0 left-0 bg-[#565ABF] text-white text-sm font-semibold py-1 px-3 rounded-md shadow">
              Sponsored
            </span>
          )}
        </div>

        {/* FOOTER INFO */}
        <div className="flex flex-col flex-grow text-black p-1 mt-2">
          <h3 className="font-semibold text-[16px] sm:text-[18px] text-black">
            {ad.title}
          </h3>
          <p className="text-[15px] sm:text-[18px] flex items-center gap-1">
            <TfiLocationPin /> {locationString}
          </p>
          <p className="text-[15px] sm:text-[18px]">
            {ad.propertyType || "Listing"}
          </p>
          <p className="font-semibold text-[15px] sm:text-[18px]">
            ${ad.budget} / {ad.budgetType}
          </p>
          <p className="text-[15px] sm:text-[18px] line-clamp-2">
            {ad.description}
          </p>
        </div>
      </div>
    );
  });

  // -----------------------------------------------------
  // PAYMENT QUERY CHECK
  // -----------------------------------------------------
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const paymentStatus = urlParams.get("payment");

    if (paymentStatus === "success") {
      toast.success("Your ad was successfully promoted!");
      fetchAds();
    } else if (paymentStatus === "cancel") {
      toast.info("Payment was cancelled.");
    }

    if (paymentStatus) {
      const newUrl = window.location.pathname;
      window.history.replaceState({}, "", newUrl);
    }
  }, []);

  // -----------------------------------------------------
  // RENDER
  // -----------------------------------------------------
  return (
    <div className="container user-layout mt-5 mb-8">
      {/* HEADER CONTROLS (UNCHANGED) */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-3 mb-5">
        <div className="w-full md:w-auto relative">
          <input
            type="text"
            placeholder="Ads title, location"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full md:w-[250px] border-[1px] border-[#D1D5DB] rounded-[5px] py-2 px-[35px]"
          />
          <CiSearch
            size={20}
            color="#565ABF"
            className="absolute top-[10px] left-[10px]"
          />
        </div>

        <div className="w-full md:w-auto flex gap-4">
          <select
            value={filter}
            onChange={(e) => {
              setFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full md:w-[155px] h-[42px] border-[1px] border-[#D1D5DB] rounded-[5px] py-2 px-2"
          >
            {[
              { label: "All Category", value: "All Category" },
              { label: "Space", value: "Space" },
              { label: "Space Wanted", value: "Spacewanted" },
              { label: "Team Up", value: "Teamup" },
            ].map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>

          <select
            value={sort}
            onChange={(e) => {
              setSort(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full md:w-[155px] h-[42px] border-[1px] border-[#D1D5DB] rounded-[5px] py-2 px-2"
          >
            {["Recently posted", "Oldest First"].map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* MAIN CONTENT */}
      {loading ? (
        <div className="flex justify-center mt-10">
          <Loader />
        </div>
      ) : (
        <div className="flex flex-wrap gap-3 justify-start">
          {ads.length > 0 ? (
            ads.map((ad) => <AdCard key={ad._id} ad={ad} />)
          ) : (
            <p className="text-gray-500">No ads found.</p>
          )}
        </div>
      )}

      {/* MODALS */}
      {showEditPost && (
        <EditPost
          show={showEditPost}
          onClose={() => setShowEditPost(false)}
          ad={selectedAd}
          onUpdated={fetchAds}
        />
      )}

      {showViewPost && (
        <ViewPost
          show={showViewPost}
          onClose={() => setShowViewPost(false)}
          ad={selectedAd}
        />
      )}

      <ConfirmationDialog
        show={showConfirmDialog}
        title="Delete Ad"
        message="Are you sure you want to delete this ad? This action cannot be undone."
        onConfirm={confirmDelete}
        onCancel={() => setShowConfirmDialog(false)}
      />

      <PromoteAdModal
        show={showPromoteModal}
        onClose={() => setShowPromoteModal(false)}
        onProceed={handleProceedToPayment}
        loading={loadingPayment}
      />

      <div className="mt-6 flex justify-center md:justify-end">
        <UserPagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </div>
    </div>
  );
}

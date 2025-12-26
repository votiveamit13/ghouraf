import { useState, useEffect } from "react";
import PaginationComponent from "components/common/Pagination";
import { toast } from "react-toastify";
import SearchFilter from "components/common/SearchFilter";
import Header from "components/admin/Headers/Header";
import axios from "axios";
import ExportData from "components/admin/export-data/ExportData";

export default function PromotedList() {
  const apiUrl = process.env.REACT_APP_API_URL;
  const authToken = localStorage.getItem("authToken");

  const [loading, setLoading] = useState(false);
  const [promotions, setPromotions] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

const fetchPromotedPosts = async () => {
  try {
    const token = localStorage.getItem("authToken");

    console.log("🔐 Admin Token:", token);
    console.log("📤 Fetching promoted posts with params:", {
      page: currentPage,
      search: searchTerm,
    });

    setLoading(true);

    const res = await axios.get(`${apiUrl}admin/promotions`, {
      headers: { Authorization: `Bearer ${token}` },
      params: {
        page: currentPage,
        limit: 10,
        search: searchTerm,
      },
    });

    console.log("✅ API Response:", res.data);

    console.log("📦 Promotions Data:", res.data?.data);
    console.log("📄 Pagination:", res.data?.pagination);

    setPromotions(res.data.data || []);
    setTotalPages(res.data.pagination?.totalPages || 1);
  } catch (err) {
    console.error("❌ Failed to fetch promoted posts");

    if (err.response) {
      console.error("🔴 Status:", err.response.status);
      console.error("🔴 Response Data:", err.response.data);
    } else {
      console.error("🔴 Error:", err.message);
    }

    toast.error("Failed to load promoted posts");
  } finally {
    setLoading(false);
  }
};

useEffect(() => {
  console.log("🚀 PromotedList mounted");
}, []);


  useEffect(() => {
    fetchPromotedPosts();
  }, [currentPage, searchTerm]);

  const handleRemovePromotion = async (post) => {
    try {
      setLoading(true);

      await axios.patch(
        `${apiUrl}admin/${post.postCategory.toLowerCase()}/${post._id}/promotion`,
        { promote: false },
        { headers: { Authorization: `Bearer ${authToken}` } }
      );

      toast.success("Promotion removed");
      fetchPromotedPosts();
    } catch (err) {
      console.error("Remove promotion failed", err);
      toast.error("Failed to remove promotion");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Header hideStatsOnMobile />

      <div className="px-[20px] md:px-[40px] mt-[-12%] md:mt-[-8%] w-full mb-4">
        <div className="bg-white shadow rounded-lg overflow-hidden">

          {/* Header */}
          <div className="px-3 py-3 border-b flex justify-between">
            <h3 className="text-lg font-semibold">Promotion Management</h3>

            <div className="flex items-center gap-2">
              <ExportData
                data={promotions}
                filename="Promoted_Posts"
                columns={[
                  { label: "Title", key: "title" },
                  { label: "Category", key: "postCategory" },
                  { label: "Plan", key: "promotion.plan" },
                  { label: "Amount", key: "promotion.amountUSD" },
                  {
                    label: "Start Date",
                    key: "promotion.startDate",
                    format: (v) => new Date(v).toLocaleDateString(),
                  },
                  {
                    label: "End Date",
                    key: "promotion.endDate",
                    format: (v) => new Date(v).toLocaleDateString(),
                  },
                ]}
              />

              <SearchFilter
                placeholder="Search by title..."
                onSearch={setSearchTerm}
              />
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm text-gray-700">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-3 py-3">S. No.</th>
                  <th className="px-3 py-3 text-left">Post Title</th>
                  <th className="px-3 py-3">Category</th>
                  <th className="px-3 py-3">Plan</th>
                  <th className="px-3 py-3">Amount</th>
                  <th className="px-3 py-3">Start</th>
                  <th className="px-3 py-3">End</th>
                  <th className="px-3 py-3">Count</th>
                  <th className="px-3 py-3 text-center">Action</th>
                </tr>
              </thead>

              <tbody>
                {promotions.length === 0 && !loading && (
                  <tr>
                    <td colSpan="9" className="text-center py-6 text-gray-400">
                      No promoted posts found
                    </td>
                  </tr>
                )}

                {promotions.map((post, index) => (
                  <tr key={post._id} className="border-t">
                    <td className="px-3 py-2">
                      {(currentPage - 1) * 10 + index + 1}
                    </td>
                    <td className="px-3 py-2 font-medium">
                      {post.title}
                    </td>
                    <td className="px-3 py-2 text-center">
                      {post.postCategory}
                    </td>
                    <td className="px-3 py-2 text-center">
                      {post.promotion?.plan || "-"}
                    </td>
                    <td className="px-3 py-2 text-center">
                      ${post.promotion?.amountUSD || 0}
                    </td>
                    <td className="px-3 py-2 text-center">
                      {new Date(post.promotion.startDate).toLocaleDateString()}
                    </td>
                    <td className="px-3 py-2 text-center">
                      {new Date(post.promotion.endDate).toLocaleDateString()}
                    </td>
                    <td className="px-3 py-2 text-center">
                      {post.promotion?.promotionCount}
                    </td>
                    <td className="px-3 py-2 text-center">
                      <button
                        disabled={loading}
                        onClick={() => handleRemovePromotion(post)}
                        className="text-red-600 hover:underline"
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="px-6 py-4 border-t">
            <PaginationComponent
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </div>
        </div>
      </div>
    </>
  );
}

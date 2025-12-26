import { useState, useEffect, useMemo } from "react";
import PaginationComponent from "components/common/Pagination";
import { toast } from "react-toastify";
import SearchFilter from "components/common/SearchFilter";
import Header from "components/admin/Headers/Header";
import axios from "axios";
import ConfirmationDialog from "components/common/ConfirmationDialog";

export default function PromotedList() {
  const apiUrl = process.env.REACT_APP_API_URL;
  const authToken = localStorage.getItem("authToken");

  const [loading, setLoading] = useState(false);
  const [promotions, setPromotions] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showConfirm, setShowConfirm] = useState(false);
  const [promotionToRemove, setPromotionToRemove] = useState(null);

  const pageSize = 10;

  const fetchPromotedPosts = async () => {
    try {
      setLoading(true);

      const res = await axios.get(`${apiUrl}admin/promotions`, {
        headers: { Authorization: `Bearer ${authToken}` },
      });

      const data = res.data.data || [];
      setPromotions(data);

      setTotalPages(Math.ceil(data.length / pageSize));
    } catch (err) {
      console.error("❌ Failed to fetch promoted posts", err);
      toast.error("Failed to load promoted posts");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPromotedPosts();
  }, []);

  const filteredPromotions = useMemo(() => {
    const term = searchTerm.toLowerCase();
    return promotions.filter((p) => p.title?.toLowerCase().includes(term));
  }, [promotions, searchTerm]);

  const startIndex = (currentPage - 1) * pageSize;
  const paginatedPromotions = filteredPromotions.slice(
    startIndex,
    startIndex + pageSize
  );

  const handleRemovePromotion = async (post) => {
    try {
      setLoading(true);

      await axios.patch(
        `${apiUrl}admin/${post.postCategory.toLowerCase()}/${post._id}/promotion`,
        { promote: false },
        { headers: { Authorization: `Bearer ${authToken}` } }
      );

      toast.success("Promotion removed");

      setPromotions((prev) => prev.filter((p) => p._id !== post._id));
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
          <div className="px-3 py-3 border-b flex justify-between">
            <h3 className="text-lg font-semibold">Promotion Management</h3>

            <div className="flex items-center gap-2 w-50 justify-end">
              <SearchFilter
                placeholder="Search by title..."
                onSearch={setSearchTerm}
              />
            </div>
          </div>

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
                  <th className="px-3 py-3">Promoted By</th>
                  <th className="px-3 py-3 text-center">Action</th>
                </tr>
              </thead>

              <tbody>
                {paginatedPromotions.length === 0 && !loading && (
                  <tr>
                    <td
                      colSpan="10"
                      className="text-center py-6 text-gray-400"
                    >
                      No promoted posts found
                    </td>
                  </tr>
                )}

                {paginatedPromotions.map((post, index) => (
                  <tr key={post._id} className="border-t">
                    <td className="px-3 py-2">
                      {startIndex + index + 1}
                    </td>
                    <td className="px-3 py-2 font-medium">{post.title}</td>
                    <td className="px-3 py-2 text-left">{post.postCategory}</td>
                    <td className="px-3 py-2 text-center">
                      {post.promotion?.plan || "-"}
                    </td>
                    <td className="px-3 py-2 text-center">
                      ${post.promotion?.amountUSD || 0}
                    </td>
                    <td className="px-3 py-2 text-center">
                      {post.promotion?.startDate
                        ? new Date(post.promotion.startDate).toLocaleDateString()
                        : "-"}
                    </td>
                    <td className="px-3 py-2 text-center">
                      {post.promotion?.endDate
                        ? new Date(post.promotion.endDate).toLocaleDateString()
                        : "No Expiry"}
                    </td>
                    <td className="px-3 py-2 text-center">
                      {post.promotion?.promotionCount}
                    </td>
                    <td className="px-3 py-2 text-center capitalize">
                      {post.promotion?.promotionType || "user"}
                    </td>
                    <td className="px-3 py-2 text-center">
                      <button
                        disabled={loading}
                        onClick={() => {
                          setPromotionToRemove(post);
                          setShowConfirm(true);
                        }}
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

          <div className="px-6 py-4 border-t">
            <PaginationComponent
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </div>

          <ConfirmationDialog
            show={showConfirm}
            title="Remove Promotion"
            message="Are you sure you want to remove promotion?"
            onCancel={() => {
              setShowConfirm(false);
              setPromotionToRemove(null);
            }}
            onConfirm={async () => {
              if (!promotionToRemove) return;

              await handleRemovePromotion(promotionToRemove);

              setShowConfirm(false);
              setPromotionToRemove(null);
            }}
          />
        </div>
      </div>
    </>
  );
}

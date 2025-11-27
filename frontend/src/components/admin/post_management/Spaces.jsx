import { useState, useMemo, useEffect } from "react";
import Header from "../Headers/Header";
import PaginationComponent from "components/common/Pagination";
import { IoEyeOutline } from "react-icons/io5";
import { RiDeleteBinLine } from "react-icons/ri";
import SearchFilter from "components/common/SearchFilter";
import axios from "axios";
import PhotoSlider from "components/common/Slider";
import { toast } from "react-toastify";
import ConfirmationDialog from "components/common/ConfirmationDialog";
import ExportData from "../export-data/ExportData";
import Loader from "components/common/Loader";
import { getFullLocation } from "utils/locationHelper";

export default function Spaces() {
  const apiUrl = process.env.REACT_APP_API_URL;
  const [spaces, setSpaces] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedPost, setSelectedPost] = useState(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [spaceToDelete, setSpaceToDelete] = useState(null);
  const [loading, setLoading] = useState(false);
  const locationString = selectedPost
    ? getFullLocation(selectedPost.city === "NA" ? "" : selectedPost.city, selectedPost.state, selectedPost.country)
    : "";


  useEffect(() => {
    const fetchSpaces = async () => {
      try {
        const token = localStorage.getItem("authToken");
        const res = await axios.get(`${apiUrl}admin/spaces`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const sortedSpaces = res.data.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
        setSpaces(sortedSpaces);
      } catch (err) {
        console.error("Error fetching spaces:", err);
      }
    };
    fetchSpaces();
  }, [apiUrl]);

  const pageSize = 10;
  const startIndex = (currentPage - 1) * pageSize;
  const pageData = spaces.slice(startIndex, startIndex + pageSize);

  const filteredPosts = useMemo(() => {
    const term = searchTerm.toLowerCase();
    return pageData.filter(
      (post) =>
        post.title?.toLowerCase().includes(term) ||
        `${post.user?.profile?.firstName || ""} ${post.user?.profile?.lastName || ""}`
          .toLowerCase()
          .includes(term)
    );
  }, [searchTerm, pageData]);

  const totalPages = Math.ceil(spaces.length / pageSize);
  const paginatedPosts = filteredPosts;


  return (
    <>
      <Header hideStatsOnMobile={true} />
      <div className="px-[20px] md:px-[40px] mt-[-12%] md:mt-[-8%] w-full fluid position-relative mb-4">
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="px-3 py-3 border-b border-gray-200 d-flex flex-col md:flex-row gap-2 md:gap-0 justify-between">
            <div className="w-50">
              <h3 className="text-lg font-semibold text-gray-800">
                Spaces Management
              </h3>
            </div>

            <div className="flex items-center gap-2 w-50 justify-end">
              <ExportData
                data={spaces}
                filename="Spaces"
                columns={[
                  { label: "Title", key: "title" },
                  { label: "Property Type", key: "propertyType" },

                  {
                    label: "Budget",
                    key: ["budget", "budgetType"],
                    format: (v) => `$${v[0]} ${v[1]}`
                  },

                  {
                    label: "Posted By",
                    key: ["user.profile.firstName", "user.profile.lastName"],
                    format: (v) => `${v[0]} ${v[1]}`
                  },

                  {
                    label: "Availability",
                    key: "available",
                    format: (v) => (v ? "Available" : "Not Available")
                  },

                  {
                    label: "Promotion",
                    key: "promotion.isPromoted",
                    format: (v) => (v ? "Promoted" : "Not Promoted")
                  },

                  { label: "Status", key: "status" },
                ]}
              />


              <SearchFilter
                placeholder="Search by title or posted by..."
                onSearch={setSearchTerm}
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full text-sm text-gray-700 table-fixed">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-3 py-3 text-left font-semibold whitespace-nowrap">S. No.</th>
                  <th className="px-3 py-3 text-left font-semibold">Title</th>
                  <th className="px-3 py-3 text-left font-semibold">Property Type</th>
                  <th className="px-3 py-3 text-left font-semibold">Budget</th>
                  <th className="px-3 py-3 text-left font-semibold">Posted By</th>
                  <th className="px-3 py-3 text-left font-semibold">Availability</th>
                  <th className="px-3 py-3 text-left font-semibold">Promotion</th>
                  <th className="px-3 py-3 text-left font-semibold">Status</th>
                  <th className="px-3 py-3 text-left font-semibold">Action</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100">
                {paginatedPosts.map((post, index) => (
                  <tr key={post._id}>
                    <td className="px-3 py-3">{startIndex + index + 1}</td>
                    <td className="px-3 py-3">{post.title}</td>
                    <td className="px-3 py-3">{post.propertyType}</td>
                    <td className="px-3 py-3">
                      ${post.budget} {post.budgetType}
                    </td>
                    <td className="px-3 py-3">
                      {post.user?.profile?.firstName} {post.user?.profile?.lastName}
                    </td>
                    <td className="px-3 py-3">
                      {post.available ? "Available" : "Not Available"}
                    </td>
                    <td className="px-3 py-3">
                      <select
                        className="border px-2 py-1 rounded"
                        value={post.promotion?.isPromoted ? "true" : "false"}
                        onChange={async (e) => {
                          const promote = e.target.value === "true";
                          setLoading(true);
                          try {
                            const token = localStorage.getItem("authToken");
                            await axios.patch(
                              `${apiUrl}admin/space/${post._id}/promotion`,
                              { promote },
                              { headers: { Authorization: `Bearer ${token}` } }
                            );

                            setSpaces((prev) =>
                              prev.map((p) =>
                                p._id === post._id
                                  ? {
                                    ...p,
                                    promotion: {
                                      ...p.promotion,
                                      isPromoted: promote,
                                      promotionType: "admin",
                                      startDate: promote ? new Date() : null,
                                      endDate: promote ? null : null,
                                    },
                                  }
                                  : p
                              )
                            );

                            toast.success(promote ? "Ad promoted" : "Promotion removed");
                          } catch (err) {
                            console.error("Failed to update promotion:", err);
                            toast.error("Failed to update promotion. Try again.");
                          } finally {
                            setLoading(false);
                          }
                        }}
                      >
                        <option value="true">Promote</option>
                        <option value="false">Remove</option>
                      </select>

                    </td>
                    <td className="px-3 py-3">
                      <select
                        value={post.status}
                        onChange={async (e) => {
                          const newStatus = e.target.value;
                          setLoading(true);
                          try {
                            const token = localStorage.getItem("authToken");
                            await axios.patch(
                              `${apiUrl}admin/spaces/${post._id}/status`,
                              { status: newStatus },
                              { headers: { Authorization: `Bearer ${token}` } }
                            );

                            setSpaces((prev) =>
                              prev.map((p) =>
                                p._id === post._id ? { ...p, status: newStatus } : p
                              )
                            );

                            toast.success(`Space status updated to "${newStatus}"`);
                          } catch (err) {
                            console.error("Failed to update status:", err);
                            toast.error("Failed to update status. Try again.");
                          } finally {
                            setLoading(false);
                          }
                        }}
                        className="border px-2 py-1 rounded"
                      >
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                      </select>
                    </td>
                    <td className="px-3 py-3 ">
                      <div className="flex items-center justify-center gap-2">
                        <IoEyeOutline
                          size={20}
                          className="cursor-pointer"
                          color="#A321A6"
                          onClick={() => setSelectedPost(post)}
                        />
                        <RiDeleteBinLine
                          size={20}
                          className="cursor-pointer"
                          color="red"
                          onClick={() => {
                            setSpaceToDelete(post);
                            setShowConfirm(true);
                          }}
                        />
                      </div>

                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <ConfirmationDialog
            show={showConfirm}
            title="Delete Space"
            message="Are you sure you want to delete this space?"
            onCancel={() => {
              setShowConfirm(false);
              setSpaceToDelete(null);
            }}
            onConfirm={async () => {
              try {
                const token = localStorage.getItem("authToken");
                await axios.patch(
                  `${apiUrl}admin/spaces/${spaceToDelete._id}/delete`,
                  {},
                  { headers: { Authorization: `Bearer ${token}` } }
                );

                setSpaces((prev) => prev.filter((p) => p._id !== spaceToDelete._id));

                toast.success("Space deleted successfully");
              } catch (err) {
                console.error("Failed to delete space:", err);
                toast.error("Failed to delete space. Try again.");
              } finally {
                setShowConfirm(false);
                setSpaceToDelete(null);
              }
            }}
          />

          <div className="px-6 py-4 border-t border-gray-200">
            <PaginationComponent
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={(page) => setCurrentPage(page)}
            />
          </div>
        </div>
      </div>

      {selectedPost && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 px-2">
          <div className="bg-white w-[700px] max-h-[90vh] rounded-2xl shadow-2xl overflow-hidden flex flex-col">
            <div className="flex justify-between items-center px-3 py-3 border-b bg-gray-50">
              <h2 className="text-xl font-bold text-gray-800">{selectedPost.title}</h2>
              <button
                className="text-gray-400 hover:text-gray-700 text-xl"
                onClick={() => setSelectedPost(null)}
              >
                ✕
              </button>
            </div>

            <div className="overflow-y-auto p-4 space-y-6">
              {(selectedPost.photos?.length > 0 || selectedPost.featuredImage) && (
                <PhotoSlider
                  featuredImage={selectedPost.featuredImage}
                  photos={selectedPost.photos || []}
                />
              )}


              <div className="grid grid-cols-2 gap-4 text-sm">
                <p><span className="text-black">Property Type:</span> {selectedPost.propertyType}</p>
                <p><span className="text-black">Budget:</span> ${selectedPost.budget} {selectedPost.budgetType}</p>
                <p><span className="text-black">Posted By:</span> {selectedPost.user?.profile?.firstName} {selectedPost.user?.profile?.lastName}</p>
                <p>
                  <span className="text-black">Availability:</span>{" "}
                  <span className={`px-2 py-1 rounded-full text-xs font-medium text-black ${selectedPost.available ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                    }`}>
                    {selectedPost.available ? "Available" : "Not Available"}
                  </span>
                </p>
                <p><span className=" text-black">Status:</span> {selectedPost.status}</p>
                <p><span className=" text-black">Size:</span> {selectedPost.size} sqft</p>
                <p><span className=" text-black">Furnishing:</span> {selectedPost.furnishing ? "Yes" : "No"}</p>
                <p><span className=" text-black">Smoking:</span> {selectedPost.smoking ? "Allowed" : "Not Allowed"}</p>
                <p><span className=" text-black">Number of bedrooms:</span> {selectedPost.bedrooms}</p>
                <p><span className=" text-black">Location:</span> {locationString}</p>
              </div>

              {selectedPost.amenities?.length > 0 && (
                <div>
                  <h3 className=" mb-2 text-black">Amenities</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedPost.amenities.map((a, i) => (
                      <span
                        key={i}
                        className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs"
                      >
                        {a}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {selectedPost.description && (
                <div>
                  <h3 className=" mb-2 text-black">Description</h3>
                  <p className="text-gray-600">{selectedPost.description}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {loading && <Loader fullScreen={true} />}

    </>
  );
}

import { useState, useMemo, useEffect } from "react";
import Header from "../Headers/Header";
import PaginationComponent from "components/common/Pagination";
import { IoEyeOutline } from "react-icons/io5";
import { RiDeleteBinLine } from "react-icons/ri";
import SearchFilter from "components/common/SearchFilter";
import axios from "axios";

export default function Spaces() {
  const apiUrl = process.env.REACT_APP_API_URL;
  const [spaces, setSpaces] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedPost, setSelectedPost] = useState(null);

  useEffect(() => {
    const fetchSpaces = async () => {
      try {
        const token = localStorage.getItem("authToken");
        const res = await axios.get(`${apiUrl}admin/spaces`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setSpaces(res.data);
      } catch (err) {
        console.error("Error fetching spaces:", err);
      }
    };
    fetchSpaces();
  }, []);

  const filteredPosts = useMemo(() => {
    return spaces.filter(
      (post) =>
        post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        `${post.user?.profile?.firstName} ${post.user?.profile?.lastName}`
          .toLowerCase()
          .includes(searchTerm.toLowerCase())
    );
  }, [searchTerm, spaces]);

  const pageSize = 10;
  const totalPages = Math.ceil(filteredPosts.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const paginatedPosts = filteredPosts.slice(startIndex, startIndex + pageSize);

  return (
    <>
      <Header />
      <div className="px-[40px] mt-[-8%] w-full fluid position-relative">
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="px-3 py-3 border-b border-gray-200 d-flex justify-between">
            <h3 className="text-lg font-semibold text-gray-800">
              Spaces Management
            </h3>
            <SearchFilter
              placeholder="Search by title or posted by..."
              onSearch={setSearchTerm}
            />
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full text-sm text-gray-700 table-fixed">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-3 py-3 text-left font-semibold">S. No.</th>
                  <th className="px-3 py-3 text-left font-semibold">Title</th>
                  <th className="px-3 py-3 text-left font-semibold">Property Type</th>
                  <th className="px-3 py-3 text-left font-semibold">Budget</th>
                  <th className="px-3 py-3 text-left font-semibold">Posted By</th>
                  <th className="px-3 py-3 text-left font-semibold">Availability</th>
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
                        value={post.status}
                        onChange={(e) => {
                          console.log("Update status", e.target.value);
                        }}
                        className="border px-2 py-1 rounded"
                      >
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                      </select>
                    </td>
                    <td className="px-3 py-3 flex gap-2">
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
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white w-[600px] max-h-[80vh] rounded-lg shadow-lg overflow-y-auto">
            <div className="flex justify-between items-center p-4 border-b">
              <h2 className="text-lg font-semibold">{selectedPost.title}</h2>
              <button
                className="text-gray-500 hover:text-gray-800"
                onClick={() => setSelectedPost(null)}
              >
                ✕
              </button>
            </div>

            <div className="p-4 space-y-4">
              <p><strong>Property Type:</strong> {selectedPost.propertyType}</p>
              <p><strong>Budget:</strong> ${selectedPost.budget} {selectedPost.budgetType}</p>
              <p><strong>Posted By:</strong> {selectedPost.user?.profile?.firstName} {selectedPost.user?.profile?.lastName}</p>
              <p><strong>Availability:</strong> {selectedPost.available ? "Available" : "Not Available"}</p>
              <p><strong>Status:</strong> {selectedPost.status}</p>
              <p><strong>Description:</strong> {selectedPost.description}</p>
              <p><strong>Size:</strong> {selectedPost.size} sqft</p>
              <p><strong>Furnishing:</strong> {selectedPost.furnishing ? "Yes" : "No"}</p>
              <p><strong>Smoking:</strong> {selectedPost.smoking ? "Allowed" : "Not Allowed"}</p>
              <p><strong>Amenities:</strong> {selectedPost.amenities?.join(", ")}</p>
              {selectedPost.featuredImage && (
                <img src={selectedPost.featuredImage} alt="Featured" className="rounded-lg" />
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

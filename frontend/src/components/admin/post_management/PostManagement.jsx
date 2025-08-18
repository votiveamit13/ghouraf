import { useState, useMemo } from "react";
import Header from "../Headers/Header";
import PaginationComponent from "components/common/Pagination";
import { IoEyeOutline } from "react-icons/io5";
import { RiDeleteBinLine } from "react-icons/ri";
import SearchFilter from "components/common/SearchFilter";

  const posts = [
    {
      id: 1,
      postName: "Post1",
      postType: "Type1",
      postDate: "10/07/2025",
      postedBy: "Naman",
      description: "This is a sample description for Post1",
      media: [
        { type: "image", url: "https://via.placeholder.com/150" },
        { type: "video", url: "https://www.w3schools.com/html/mov_bbb.mp4" },

      ],
    },
    {
      id: 2,
      postName: "Post2",
      postType: "Type2",
      postDate: "18/07/2025",
      postedBy: "Suman",
      description: "This is a sample description for Post2",
      media: [{ type: "image", url: "https://via.placeholder.com/200" }],
    },
    {
      id: 3,
      postName: "Post3",
      postType: "Type1",
      postDate: "1/08/2025",
      postedBy: "Jignesh",
      description: "This is a sample description for Post3",
    },
    {
      id: 4,
      postName: "Post4",
      postType: "Type3",
      postDate: "1/08/2025",
      postedBy: "Dinesh",
    },
    {
      id: 5,
      postName: "Post5",
      postType: "Type3",
      postDate: "4/08/2025",
      postedBy: "Jignesh",
    },
    {
      id: 6,
      postName: "Post6",
      postType: "Type2",
      postDate: "9/08/2025",
      postedBy: "Naman",
    },
    {
      id: 7,
      postName: "Post7",
      postType: "Type2",
      postDate: "10/08/2025",
      postedBy: "Naman",
    },
    {
      id: 8,
      postName: "Post8",
      postType: "Type1",
      postDate: "10/08/2025",
      postedBy: "Jignesh",
    },
  ];

export default function PostManagement() {


  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedPost, setSelectedPost] = useState(null);
  const filteredPosts = useMemo(() => {
    return posts.filter(
      (post) =>
        post.postName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.postedBy.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm]);
  const pageSize = 10;
  const totalPages = Math.ceil(filteredPosts.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const paginatedPosts = filteredPosts.slice(startIndex, startIndex + pageSize);

  return (
    <>
      <Header />
      <div className="px-[40px] mt-[-8%] w-full fluid position-relative">
        <div className="bg-white shadow rounded-lg overflow-hidden">
          {/* Header */}
          <div className="px-3 py-3 border-b border-gray-200 d-flex justify-between">
            <h3 className="text-lg font-semibold text-gray-800">
              Post Management
            </h3>
                        <SearchFilter
                          placeholder="Search by name or posted by..."
                          onSearch={setSearchTerm}
                        />
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 text-sm text-gray-700">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-3 py-3 text-left font-semibold">S. No.</th>
                  <th className="px-3 py-3 text-left font-semibold">
                    Post Name
                  </th>
                  <th className="px-3 py-3 text-left font-semibold">
                    Post Type
                  </th>
                  <th className="px-3 py-3 text-left font-semibold">
                    Post Date
                  </th>
                  <th className="px-3 py-3 text-left font-semibold">
                    Posted By
                  </th>
                  <th className="px-3 py-3 text-left font-semibold">Action</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100">
                {paginatedPosts.map((post, index) => (
                  <tr key={post.id}>
                    <td className="px-3 py-3">{startIndex + index + 1}</td>
                    <td className="px-3 py-3">{post.postName}</td>
                    <td className="px-3 py-3">{post.postType}</td>
                    <td className="px-3 py-3">{post.postDate}</td>
                    <td className="px-3 py-3">{post.postedBy}</td>
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

          {/* Pagination */}
          <div className="px-6 py-4 border-t border-gray-200">
            <PaginationComponent
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={(page) => setCurrentPage(page)}
            />
          </div>
        </div>
      </div>

      {/* Modal */}
      {selectedPost && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white w-[600px] max-h-[80vh] rounded-lg shadow-lg overflow-y-auto">
            <div className="flex justify-between items-center p-4 border-b">
              <h2 className="text-lg font-semibold">{selectedPost.postName}</h2>
              <button
                className="text-gray-500 hover:text-gray-800"
                onClick={() => setSelectedPost(null)}
              >
                ✕
              </button>
            </div>

            <div className="p-4 space-y-4">
              <p>
                <strong>Type:</strong> {selectedPost.postType}
              </p>
              <p>
                <strong>Date:</strong> {selectedPost.postDate}
              </p>
              <p>
                <strong>Posted By:</strong> {selectedPost.postedBy}
              </p>
              {selectedPost.description && (
                <p>
                  <strong>Description:</strong> {selectedPost.description}
                </p>
              )}

              {/* Media */}
              {selectedPost.media && selectedPost.media.length > 0 && (
                <div className="grid grid-cols-2 gap-4">
                  {selectedPost.media.map((m, i) =>
                    m.type === "image" ? (
                      <img
                        key={i}
                        src={m.url}
                        alt="post-media"
                        className="rounded-lg"
                      />
                    ) : (
                      <video
                        key={i}
                        src={m.url}
                        controls
                        className="rounded-lg"
                      />
                    )
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

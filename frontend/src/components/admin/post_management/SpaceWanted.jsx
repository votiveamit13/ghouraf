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

export default function SpaceWanted() {
    const apiUrl = process.env.REACT_APP_API_URL;
    const [spaceWanted, setSpaceWanted] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedPost, setSelectedPost] = useState(null);
    const [showConfirm, setShowConfirm] = useState(false);
    const [spaceToDelete, setSpaceToDelete] = useState(null);


    useEffect(() => {
        const fetchSpaceWanted = async () => {
            try {
                const token = localStorage.getItem("authToken");
                const res = await axios.get(`${apiUrl}admin/spacewanted`, {
                    headers: { Authorization: `Bearer ${token}` },
                });

                const sortedSpaceWanted = res.data.sort(
                    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
                );
                setSpaceWanted(sortedSpaceWanted);
            } catch (err) {
                console.error("Error fetching team up:", err);
            }
        };
        fetchSpaceWanted();
    }, [apiUrl]);

    const filteredPosts = useMemo(() => {
        return spaceWanted.filter(
            (post) =>
                post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                `${post.user?.profile?.firstName} ${post.user?.profile?.lastName}`
                    .toLowerCase()
                    .includes(searchTerm.toLowerCase())
        );
    }, [searchTerm, spaceWanted]);

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
                            Space Wanted Management
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
                                    <th className="px-3 py-3 text-left font-semibold">Room Sizes</th>
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
                                        <td className="px-3 py-3">{post.roomSize}</td>
                                        <td className="px-3 py-3">
                                            ${post.budget} {post.budgetType}
                                        </td>
                                        <td className="px-3 py-3">
                                            {post.name}
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
                                                    try {
                                                        const token = localStorage.getItem("authToken");
                                                        await axios.patch(
                                                            `${apiUrl}admin/spacewanted/${post._id}/promotion`,
                                                            { promote },
                                                            { headers: { Authorization: `Bearer ${token}` } }
                                                        );

                                                        setSpaceWanted((prev) =>
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
                                                    try {
                                                        const token = localStorage.getItem("authToken");
                                                        await axios.patch(
                                                            `${apiUrl}admin/spacewanted/${post._id}/status`,
                                                            { status: newStatus },
                                                            { headers: { Authorization: `Bearer ${token}` } }
                                                        );

                                                        setSpaceWanted((prev) =>
                                                            prev.map((p) =>
                                                                p._id === post._id ? { ...p, status: newStatus } : p
                                                            )
                                                        );

                                                        toast.success(`Space Wanted status updated to "${newStatus}"`);
                                                    } catch (err) {
                                                        console.error("Failed to update status:", err);
                                                        toast.error("Failed to update status. Try again.");
                                                    }
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
                                                onClick={() => {
                                                    setSpaceToDelete(post);
                                                    setShowConfirm(true);
                                                }}
                                            />
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
                                    `${apiUrl}admin/spacewanted/${spaceToDelete._id}/delete`,
                                    {},
                                    { headers: { Authorization: `Bearer ${token}` } }
                                );

                                setSpaceWanted((prev) => prev.filter((p) => p._id !== spaceToDelete._id));

                                toast.success("Space Wanted deleted successfully");
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
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
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
                            <div className="flex items-start gap-4 w-full">
                                <div className="w-1/2">
                                    {selectedPost.photos?.length > 0 && (
                                        <PhotoSlider photos={selectedPost.photos} />
                                    )}
                                </div>
                                <div className="w-1/2">
                                    <h3 className="mb-2 text-black">Description</h3>
                                    <p className="text-gray-600">
                                        {selectedPost.description || "No description provided"}
                                    </p>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4 text-sm">
                                <p><span className="text-black">Country:</span> {selectedPost.country}</p>
                                <p><span className="text-black">State:</span> {selectedPost.state}</p>
                                <p><span className="text-black">City:</span> {selectedPost.city}</p>
                                {/* <p><span className="text-black">Zip:</span> {selectedPost.zip}</p> */}
                                <p><span className="text-black">Property Type:</span> {selectedPost.propertyType}</p>
                                <p><span className="text-black">Room Size:</span> {selectedPost.roomSize}</p>
                                <p>
                                    <span className="text-black">Budget:</span> ${selectedPost.budget} {selectedPost.budgetType}
                                </p>
                                <p>
                                    <span className="text-black">Move-in Date:</span>{" "}
                                    {selectedPost.moveInDate ? new Date(selectedPost.moveInDate).toLocaleDateString() : "N/A"}
                                </p>
                                <p><span className="text-black">Period:</span> {selectedPost.period}</p>
                                <p>
                                    <span className="text-black">Availability:</span>{" "}
                                    <span
                                        className={`px-2 py-1 rounded-full text-xs font-medium ${selectedPost.available ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                                            }`}
                                    >
                                        {selectedPost.available ? "Available" : "Not Available"}
                                    </span>
                                </p>
                                <p><span className="text-black">Status:</span> {selectedPost.status}</p>
                            </div>

                            <div className="grid grid-cols-2 gap-4 text-sm">
                                <p><span className="text-black">Name:</span> {selectedPost.name}</p>
                                <p><span className="text-black">Age:</span> {selectedPost.age}</p>
                                <p><span className="text-black">Gender:</span> {selectedPost.gender}</p>
                                <p><span className="text-black">Occupation:</span> {selectedPost.occupation}</p>
                                <p><span className="text-black">Smokes:</span> {selectedPost.smoke || "N/A"}</p>
                                <p><span className="text-black">Pets:</span> {selectedPost.pets || "N/A"}</p>
                                {/* <p><span className="text-black">Language:</span> {selectedPost.language || "N/A"}</p> */}
                                {/* <p><span className="text-black">Roommate Preference:</span> {selectedPost.roommatePref}</p> */}
                            </div>

                            {selectedPost.amenities?.length > 0 && (
                                <div>
                                    <h3 className="mb-2 text-black">Amenities</h3>
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

                            <div className="grid grid-cols-2 gap-4 text-sm">
                                <p>
                                    <span className="text-black">Buddy Up:</span>{" "}
                                    {selectedPost.teamUp ? "Yes" : "No"}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            )}

        </>
    );
}

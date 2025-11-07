import { useState, useEffect } from "react";
import Header from "components/admin/Headers/Header";
import { IoEyeOutline } from "react-icons/io5";
import { RiDeleteBin6Line } from "react-icons/ri";
import { IoMdAdd } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FaRegEdit } from "react-icons/fa";
import { toast } from "react-toastify";
import ConfirmationDialog from "components/common/ConfirmationDialog";
import PaginationComponent from "components/common/Pagination"; 

export default function AdManagement() {
  const navigate = useNavigate();
  const apiUrl = process.env.REACT_APP_API_URL;

  const [ads, setAds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ page: 1, pages: 1 });

  const [selectedAd, setSelectedAd] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const [showConfirm, setShowConfirm] = useState(false);
  const [adToDelete, setAdToDelete] = useState(null);

  const getAllAds = async (page = 1) => {
    try {
      setLoading(true);
      const token = localStorage.getItem("authToken");
      const { data } = await axios.get(`${apiUrl}admin/getAllAds?page=${page}&limit=10`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setAds(data?.data || []);
      setPagination(data?.pagination || { page: 1, pages: 1 });
    } catch (error) {
      console.error("Failed to fetch ads:", error);
      toast.error("Failed to load ads");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getAllAds(pagination.page);
  }, [pagination.page]);

  const handlePageChange = (newPage) => {
    if (newPage !== pagination.page) {
      setPagination((prev) => ({ ...prev, page: newPage }));
    }
  };

  const handleDeleteClick = (ad) => {
    setAdToDelete(ad);
    setShowConfirm(true);
  };

  const handleConfirmDelete = async () => {
    if (!adToDelete) return;
    try {
      const token = localStorage.getItem("authToken");
      await axios.delete(`${apiUrl}admin/deleteAd/${adToDelete._id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Ad deleted successfully!");
      getAllAds(pagination.page);
    } catch (error) {
      console.error("Failed to delete ad:", error);
      toast.error("Failed to delete ad.");
    } finally {
      setShowConfirm(false);
      setAdToDelete(null);
    }
  };

  const handleView = (ad) => {
    setSelectedAd(ad);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedAd(null);
  };

  const handleStatusChange = async (adId, newStatus) => {
  try {
    const token = localStorage.getItem("authToken");
    await axios.put(
      `${apiUrl}admin/updateAdStatus/${adId}`,
      { status: newStatus },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    toast.success("Ad status updated!");
    getAllAds(pagination.page);
  } catch (error) {
    console.error("Failed to update status:", error);
    toast.error("Failed to update ad status.");
  }
};


  return (
    <>
      <Header />
      <div className="px-[40px] mt-[-8%] w-full fluid position-relative">
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="px-3 py-3 border-b border-gray-200 flex justify-between">
            <h3 className="text-lg font-semibold text-gray-800">Ad Management</h3>
            <button
              onClick={() => navigate("/admin/ad-management/add")}
              className="flex items-center justify-center gap-2 px-3 py-2 border border-[#565ABF] text-[#565ABF] rounded-lg hover:bg-[#565ABF] hover:text-white transition"
            >
              Create Ad <IoMdAdd size={18} />
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full text-sm text-gray-700 table-fixed">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-3 py-3 text-left font-semibold w-[60px]">S.No</th>
                  <th className="px-3 py-3 text-left font-semibold">Title</th>
                  <th className="px-3 py-3 text-left font-semibold">URL</th>
                  <th className="px-3 py-3 text-left font-semibold">Image</th>
                  <th className="px-3 py-3 text-left font-semibold">Status</th>
                  <th className="px-3 py-3 text-center font-semibold w-[100px]">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={5} className="text-center py-4">
                      Loading...
                    </td>
                  </tr>
                ) : ads.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="text-center py-4">
                      No ads found.
                    </td>
                  </tr>
                ) : (
                  ads.map((ad, index) => (
                    <tr key={ad._id} className="border-t">
                      <td className="px-3 py-3">
                        {(pagination.page - 1) * 10 + (index + 1)}
                      </td>
                      <td className="px-3 py-3">{ad.title}</td>
                      <td className="px-3 py-3">
                        <a
                          href={ad.url}
                          target="_blank"
                          rel="noreferrer"
                          className="text-blue-600 hover:underline break-all"
                        >
                          {ad.url}
                        </a>
                      </td>
                      <td className="px-3 py-3">
                        <img
                          src={ad.image}
                          alt={ad.title}
                          className="rounded border"
                          style={{ width: 80, height: 80, objectFit: "cover" }}
                        />
                      </td>
<td className="px-3 py-3">
  <select
    value={ad.status}
    onChange={(e) => handleStatusChange(ad._id, e.target.value)}
    className="block w-[75%] px-2 py-1 border-[1px] border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500"
  >
    <option value="active">Active</option>
    <option value="inactive">Inactive</option>
  </select>
</td>

                      <td className="px-3 py-3">
                        <div className="flex items-center gap-3 justify-center">
                          <FaRegEdit
                            size={18}
                            className="cursor-pointer text-gray-600"
                            onClick={() =>
                              navigate("/admin/ad-management/edit", { state: { ad } })
                            }
                          />
                          <IoEyeOutline
                            size={20}
                            className="cursor-pointer text-purple-600"
                            onClick={() => handleView(ad)}
                          />
                          <RiDeleteBin6Line
                            size={20}
                            className="cursor-pointer text-red-600"
                            onClick={() => handleDeleteClick(ad)}
                          />
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <div className="p-4 border-t border-gray-200 flex justify-end">
            <PaginationComponent
              currentPage={pagination.page}
              totalPages={pagination.pages}
              onPageChange={handlePageChange}
            />
          </div>
        </div>
      </div>

      {showModal && selectedAd && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-xl w-full px-4 py-4 relative">
            <button
              onClick={closeModal}
              className="absolute top-2 right-3 text-gray-500 hover:text-gray-700 text-xl"
            >
              ×
            </button>
            <div className="flex flex-col items-center text-center gap-3">
              <img
                src={selectedAd.image}
                alt={selectedAd.title}
                className="rounded border"
                style={{ width: 150, height: 150, objectFit: "cover" }}
              />
              <h4 className="text-lg text-black font-semibold break-all">
                {selectedAd.title}
              </h4>
              <p className="text-black text-left break-all">
                <strong>URL:</strong>&nbsp;
                <a
                  href={selectedAd.url}
                  target="_blank"
                  rel="noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  {selectedAd.url}
                </a>
              </p>
              <button
                onClick={closeModal}
                className="mt-3 px-5 py-2 bg-gray-100 text-gray-800 rounded-lg hover:bg-gray-200"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      <ConfirmationDialog
        show={showConfirm}
        title="Delete Confirmation"
        message={`Are you sure you want to delete "${adToDelete?.title}"?`}
        onConfirm={handleConfirmDelete}
        onCancel={() => setShowConfirm(false)}
      />
    </>
  );
}

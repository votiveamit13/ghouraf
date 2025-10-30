import axios from "axios";
import Header from "components/admin/Headers/Header";
import ConfirmationDialog from "components/common/ConfirmationDialog";
import PaginationComponent from "components/common/Pagination";
import { useEffect, useState } from "react";
import { FaRegEdit } from "react-icons/fa";
import { IoMdAdd } from "react-icons/io";
import { RiDeleteBin6Line } from "react-icons/ri";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export default function PolicyManagement() {
  const navigate = useNavigate();
  const [policies, setPolicies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [selectedPolicy, setSelectedPolicy] = useState(null);

  const pageSize = 10;
  const apiUrl = process.env.REACT_APP_API_URL;
  const token = localStorage.getItem("authToken");

  useEffect(() => {
    fetchPolicies();
  }, []);

  const fetchPolicies = async () => {
    try {
      const res = await axios.get(`${apiUrl}admin/policies`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPolicies(res.data);
    } catch (err) {
      console.error("Error fetching policies:", err);
      toast.error("Failed to load policies");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedPolicy) return;
    try {
      await axios.delete(`${apiUrl}admin/policies/${selectedPolicy._id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Policy deleted successfully!");
      setConfirmOpen(false);
      fetchPolicies();
    } catch (err) {
      console.error("Error deleting policy:", err);
      toast.error("Failed to delete policy");
    }
  };

  const totalPages = Math.ceil(policies.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const paginatedPolicies = policies.slice(startIndex, startIndex + pageSize);

  return (
    <>
      <Header />
      <div className="px-[40px] mt-[-8%] w-full fluid position-relative">
                <div className="bg-white shadow rounded-lg overflow-hidden">
                    <div className="px-3 py-3 border-b border-gray-200 d-flex justify-between">
                        <h3 className="text-lg font-semibold text-gray-800">
              Policy Management
            </h3>
            <button
              onClick={() => navigate("/admin/policy-management/add")}
              className="flex items-center justify-center gap-2 px-3 py-2 border-[1px] border-[#565ABF] rounded-[10px]"
            >
              Add Policy <IoMdAdd size={18} />
            </button>
          </div>

          <div className="overflow-x-auto">
                        <table className="min-w-full text-sm text-gray-700 table-fixed">
                            <thead className="bg-gray-50">
                <tr>
                  <th className="px-3 py-3 text-left font-semibold w-[60px]">S.No</th>
                  <th className="px-3 py-3 text-left font-semibold">Title</th>
                  <th className="px-3 py-3 text-left font-semibold">Policy Category</th>
                  <th className="px-3 py-3 text-left font-semibold">Slug</th>
                  <th className="px-3 py-3 text-left font-semibold">Last Updated</th>
                  <th className="px-3 py-3 text-center font-semibold w-[100px]">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {loading ? (
                  <tr>
                    <td colSpan="6" className="text-center py-6 text-gray-500">
                      Loading...
                    </td>
                  </tr>
                ) : paginatedPolicies.length > 0 ? (
                  paginatedPolicies.map((policy, index) => (
                    <tr key={policy._id} className="hover:bg-gray-50">
                      <td className="px-3 py-3">{startIndex + index + 1}</td>
                      <td className="px-3 py-3">{policy.title}</td>
                                            <td className="px-3 py-3 text-gray-600">
                        {policy.policycategory || "-"}
                      </td>
                      <td className="px-3 py-3 text-gray-600">{policy.slug}</td>
                      <td className="px-3 py-3 text-gray-600">
                        {new Date(policy.updatedAt).toLocaleDateString()}
                      </td>
                      <td className="px-3 py-3 text-center">
                        <div className="flex items-center justify-center gap-3">
                          <FaRegEdit
                            size={18}
                            className="cursor-pointer text-blue-600 hover:text-blue-800"
                            onClick={() =>
                              navigate("/admin/policy-management/edit", {
                                state: { policy },
                              })
                            }
                          />
                          <RiDeleteBin6Line
                            size={18}
                            className="cursor-pointer text-red-500 hover:text-red-700"
                            onClick={() => {
                              setSelectedPolicy(policy);
                              setConfirmOpen(true);
                            }}
                          />
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="6"
                      className="text-center py-6 text-gray-500 italic"
                    >
                      No policies found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="px-6 py-4 border-t border-gray-200">
            {totalPages > 1 && (
              <PaginationComponent
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={(page) => setCurrentPage(page)}
              />
            )}
          </div>
        </div>
      </div>

      <ConfirmationDialog
        show={confirmOpen}
        title="Delete Policy"
        message={`Are you sure you want to delete this policy?`}
        onConfirm={handleDelete}
        onCancel={() => setConfirmOpen(false)}
      />
    </>
  );
}

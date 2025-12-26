import { useState, useEffect } from "react";
import PaginationComponent from "components/common/Pagination";
import { RiDeleteBin6Line } from "react-icons/ri";
import { toast } from "react-toastify";
import SearchFilter from "components/common/SearchFilter";
import ConfirmationDialog from "components/common/ConfirmationDialog";
import Header from "components/admin/Headers/Header";
import axios from "axios";
import ExportData from "components/admin/export-data/ExportData";
import { IoMdAdd } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import { FaRegEdit } from "react-icons/fa";

export default function PaymentOptions() {
  const navigate = useNavigate();
  const apiUrl = process.env.REACT_APP_API_URL;
  const authToken = localStorage.getItem("authToken");

  const [plans, setPlans] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, pages: 1 });
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);

  const [showConfirm, setShowConfirm] = useState(false);
  const [planToDelete, setPlanToDelete] = useState(null);

  const fetchPlans = async (page = 1) => {
    try {
      setLoading(true);
      const { data } = await axios.get(
        `${apiUrl}/admin?page=${page}&limit=10&search=${searchTerm}`,
        {
          headers: { Authorization: `Bearer ${authToken}` },
        }
      );

      setPlans(data?.data || []);
      setPagination(data?.pagination || { page: 1, pages: 1 });
    } catch (err) {
      toast.error("Failed to load promotion plans");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlans(currentPage);
  }, [currentPage, searchTerm]);

  const handleDelete = async () => {
    if (!planToDelete) return;

    try {
      await axios.delete(
        `${apiUrl}/admin/${planToDelete._id}`,
        {
          headers: { Authorization: `Bearer ${authToken}` },
        }
      );

      toast.success("Plan deleted successfully");
      setShowConfirm(false);
      fetchPlans(currentPage);
    } catch (err) {
      toast.error("Failed to delete plan");
    }
  };

  return (
    <>
      <Header hideStatsOnMobile />

      <div className="px-[20px] md:px-[40px] mt-[-12%] md:mt-[-8%] w-full mb-4">
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="px-3 py-3 border-b border-gray-200 flex flex-col md:flex-row gap-2 justify-between">
            <h3 className="text-lg font-semibold text-gray-800">
              Promotion Management
            </h3>

            <button
              className="flex items-center gap-2 px-3 py-2 border border-[#565ABF] rounded-[10px]"
              onClick={() => navigate("/admin/promotion-management/add")}
            >
              Add Payment Options <IoMdAdd />
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full text-sm text-gray-700 table-fixed">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-3 py-3 text-left">S. No.</th>
                  <th className="px-3 py-3 text-left">Plan Type</th>
                  <th className="px-3 py-3 text-left">Amount</th>
                  <th className="px-3 py-3 text-center">Action</th>
                </tr>
              </thead>

              <tbody className="bg-white divide-y">
                {loading ? (
                  <tr>
                    <td colSpan="4" className="text-center py-4">
                      Loading...
                    </td>
                  </tr>
                ) : plans.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="text-center py-4">
                      No plans found
                    </td>
                  </tr>
                ) : (
                  plans.map((plan, index) => (
                    <tr key={plan._id}>
                      <td className="px-3 py-3">
                        {(currentPage - 1) * 10 + index + 1}
                      </td>
                      <td className="px-3 py-3">
                        {plan.plan}_days
                      </td>
                      <td className="px-3 py-3">
                        {plan.amountUSD} USD
                      </td>
                      <td className="px-3 py-3 text-center">
                        <div className="flex justify-center gap-2">
                          <FaRegEdit
                            size={18}
                            className="cursor-pointer"
                            onClick={() =>
                              navigate("/admin/promotion-management/edit", {
                                state: { plan },
                              })
                            }
                          />
                          <RiDeleteBin6Line
                            size={18}
                            color="red"
                            className="cursor-pointer"
                            onClick={() => {
                              setPlanToDelete(plan);
                              setShowConfirm(true);
                            }}
                          />
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <div className="px-6 py-4 border-t">
            <PaginationComponent
              currentPage={currentPage}
              totalPages={pagination.pages}
              onPageChange={setCurrentPage}
            />
          </div>
        </div>
      </div>

      <ConfirmationDialog
        show={showConfirm}
        onClose={() => setShowConfirm(false)}
        onConfirm={handleDelete}
        title="Delete Plan"
        message="Are you sure you want to delete this promotion plan?"
      />
    </>
  );
}

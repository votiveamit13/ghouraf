import { useState, useEffect, useMemo } from "react";
import PaginationComponent from "components/common/Pagination";
import { RiDeleteBinLine } from "react-icons/ri";
import SearchFilter from "components/common/SearchFilter";
import { toast } from "react-toastify";
import ConfirmationDialog from "components/common/ConfirmationDialog";
import Header from "components/admin/Headers/Header";
import axios from "axios";

export default function Newsletter() {
  const apiUrl = process.env.REACT_APP_API_URL;
  const authToken = localStorage.getItem("authToken");

  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [newsletters, setNewsletters] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [newsletterToDelete, setNewsletterToDelete] = useState(null);

  const fetchNewsletters = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${apiUrl}admin/newsletter`, {
        headers: { Authorization: `Bearer ${authToken}` },
        params: { search: searchTerm, page: currentPage, limit: 10 },
      });

      setNewsletters(res.data.newsletters || []);
      setLoading(false);
    } catch (err) {
      setLoading(false);
      toast.error(err.response?.data?.error || "Failed to fetch newsletters");
    }
  };

  useEffect(() => {
    fetchNewsletters();
  }, [searchTerm, currentPage]);

  const handleDelete = async () => {
    if (!newsletterToDelete) return;

    try {
      await axios.delete(`${apiUrl}admin/newsletter/${newsletterToDelete._id}`, {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      toast.success("Newsletter deleted successfully");
      setShowConfirm(false);
      setNewsletterToDelete(null);
      fetchNewsletters();
    } catch (err) {
      toast.error(err.response?.data?.error || "Failed to delete newsletter");
    }
  };
  const pageSize = 10;
  const filteredNewsletters = useMemo(() => {
    const term = searchTerm.toLowerCase();
    return newsletters.filter((n) => n.email.toLowerCase().includes(term));
  }, [searchTerm, newsletters]);

  const totalPages = Math.ceil(filteredNewsletters.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const paginatedNewsletters = filteredNewsletters.slice(
    startIndex,
    startIndex + pageSize
  );

  return (
    <>
      <Header hideStatsOnMobile={true}/>
      <div className="px-[20px] md:px-[40px] mt-[-12%] md:mt-[-8%] w-full fluid position-relative mb-4">
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="px-3 py-3 border-b border-gray-200 flex flex-col md:flex-row gap-2 md:gap-0 justify-between">
            <h3 className="text-lg font-semibold text-gray-800">Newsletter Management</h3>
            <SearchFilter placeholder="Search by email..." onSearch={setSearchTerm} />
          </div>

          {loading ? (
            <div className="p-6 text-center text-gray-500">Loading...</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm text-gray-700 table-fixed">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-3 py-3 text-left font-semibold whitespace-nowrap">S. No.</th>
                    <th className="px-3 py-3 text-left font-semibold">Email Id</th>
                    <th className="px-3 py-3 text-center font-semibold">Action</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-100">
                  {newsletters.length === 0 ? (
                    <tr>
                      <td colSpan={3} className="text-center py-3 text-gray-500">
                        No Newsletter Found
                      </td>
                    </tr>
                  ) : (
                    newsletters.map((item, index) => (
                      <tr key={item._id}>
                        <td className="px-3 py-3">{startIndex + index + 1}</td>
                        <td className="px-3 py-3">{item.email}</td>
                        <td className="px-3 py-3 flex gap-2 justify-center">
                          <RiDeleteBinLine
                            size={20}
                            className="cursor-pointer"
                            color="red"
                            onClick={() => {
                              setNewsletterToDelete(item);
                              setShowConfirm(true);
                            }}
                          />
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}

          <ConfirmationDialog
            show={showConfirm}
            title="Delete Email"
            message="Are you sure you want to delete this email?"
            onCancel={() => {
              setShowConfirm(false);
              setNewsletterToDelete(null);
            }}
            onConfirm={handleDelete}
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
    </>
  );
}

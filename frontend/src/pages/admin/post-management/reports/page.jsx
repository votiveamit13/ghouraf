import { useState, useEffect, useMemo } from "react";
import Header from "components/admin/Headers/Header";
import { IoEyeOutline } from "react-icons/io5";
import { RiDeleteBinLine } from "react-icons/ri";
import SearchFilter from "components/common/SearchFilter";
import PaginationComponent from "components/common/Pagination";
import ConfirmationDialog from "components/common/ConfirmationDialog";
import { toast } from "react-toastify";
import axios from "axios";
import ViewPostModal from "components/admin/post_management/report-management/ViewPost";

export default function ReportList() {
  const apiUrl = process.env.REACT_APP_API_URL;
  const [reports, setReports] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedReport, setSelectedReport] = useState(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [reportToDelete, setReportToDelete] = useState(null);
  const [viewModal, setViewModal] = useState({ show: false, report: null });


  useEffect(() => {
    const fetchReports = async () => {
      try {
        const token = localStorage.getItem("authToken");
        const res = await axios.get(`${apiUrl}admin/reports`, {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        });

        const sorted = res.data.reports.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
        setReports(sorted);
      } catch (err) {
        console.error("Error fetching reports:", err);
      }
    };
    fetchReports();
  }, [apiUrl]);


  const filteredReports = useMemo(() => {
    return reports.filter(
      (r) =>
        r.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.reason.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.userId?.profile?.firstName
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        r.userId?.profile?.lastName
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase())
    );
  }, [searchTerm, reports]);

  const pageSize = 10;
  const totalPages = Math.ceil(filteredReports.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const paginatedReports = filteredReports.slice(
    startIndex,
    startIndex + pageSize
  );

  const handleDelete = async () => {
    if (!reportToDelete) return;
    try {
      const token = localStorage.getItem("authToken");
      await axios.delete(`${apiUrl}admin/report/${reportToDelete._id}`, {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      });

      setReports((prev) =>
        prev.filter((r) => r._id !== reportToDelete._id)
      );
      toast.success("Report deleted successfully");
    } catch (err) {
      console.error("Failed to delete report:", err);
      toast.error("Failed to delete report");
    } finally {
      setShowConfirm(false);
      setReportToDelete(null);
    }
  };

  return (
    <>
      <Header />
      <div className="px-[40px] mt-[-8%] w-full fluid position-relative">
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="px-3 py-3 border-b border-gray-200 d-flex justify-between">
            <h3 className="text-lg font-semibold text-gray-800">
              Reports Management
            </h3>
            <SearchFilter
              placeholder="Search by title, reason or user..."
              onSearch={setSearchTerm}
            />
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full text-sm text-gray-700 table-fixed">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-3 py-3 text-left font-semibold">S. No.</th>
                  <th className="px-3 py-3 text-left font-semibold">Post Title</th>
                  <th className="px-3 py-3 text-left font-semibold">Post Category</th>
                  <th className="px-3 py-3 text-left font-semibold">Report Data</th>
                  <th className="px-3 py-3 text-left font-semibold">Reported By</th>
                  <th className="px-3 py-3 text-left font-semibold">Date</th>
                  <th className="px-3 py-3 text-left font-semibold">Post Action</th>
                  <th className="px-3 py-3 text-left font-semibold">Report Action</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100">
                {paginatedReports.length > 0 ? (
                  paginatedReports.map((report, index) => (
                    <tr key={report._id}>
                      <td className="px-3 py-3">{startIndex + index + 1}</td>
                      <td className="px-3 py-3">{report.postId.title}</td>
                      <td className="px-3 py-3">{report.postType}</td>
                      <td className="px-3 py-3">{report.title}</td>
                      <td className="px-3 py-3">
                        {report.user?.profile
                          ? `${report.user?.profile?.firstName} ${report.user?.profile?.lastName}`
                          : "—"}
                      </td>
                      <td className="px-3 py-3">
                        {new Date(report.createdAt).toLocaleDateString()}
                      </td>
<td className="px-3 py-3">
  <div
    className={`relative inline-block ${
      report.postId.is_deleted ? "opacity-70 cursor-not-allowed" : ""
    }`}
  >
    <select
      className={`border px-2 py-1 rounded appearance-none w-[150px] ${
        report.postId.is_deleted ? "pointer-events-none bg-gray-100" : "cursor-pointer"
      }`}
      value={
        report.postId.is_deleted
          ? "Deleted"
          : "Select Action"
      }
      onChange={async (e) => {
        const value = e.target.value;
        e.target.value = "Select Action";

        if (report.postId.is_deleted) {
          toast.info("This post has been deleted.");
          return;
        }

        if (value === "View Post") {
          setViewModal({ show: true, report });
          return;
        }

        let action;
        if (value === "Inactive") action = "deactivate";
        else if (value === "Active") action = "activate";
        else if (value === "Delete Post") action = "delete";
        else return;

        try {
          const token = localStorage.getItem("authToken");
          const res = await axios.patch(
            `${apiUrl}admin/post-action/${report.postType}/${report.postId._id}`,
            { action },
            { headers: { Authorization: `Bearer ${token}` } }
          );

          toast.success(res.data.message);

          setReports((prev) =>
            prev.map((r) =>
              r.postId._id === report.postId._id
                ? { ...r, postId: { ...r.postId, ...res.data.post } }
                : r
            )
          );
        } catch (err) {
          console.error("Failed to update post:", err);
          toast.error("Failed to perform action.");
        }
      }}
    >
      {report.postId.is_deleted ? (
        <option disabled className="text-red-600 font-semibold bg-red-50">
          Deleted
        </option>
      ) : (
        <option>Select Action</option>
      )}

      <option>View Post</option>

      {!report.postId.is_deleted && (
        <option
          disabled={report.postId.status === "active"}
          className={`${
            report.postId.status === "active"
              ? "text-green-600 font-semibold bg-green-50"
              : ""
          }`}
        >
          Active
        </option>
      )}

      <option
        disabled={
          report.postId.status === "inactive" || report.postId.is_deleted
        }
        className={`${
          report.postId.status === "inactive"
            ? "text-red-600 font-semibold bg-red-50"
            : report.postId.is_deleted
            ? "text-gray-400 opacity-60"
            : ""
        }`}
      >
        Inactive
      </option>

      <option
        disabled={report.postId.is_deleted}
        className={`${
          report.postId.is_deleted ? "text-gray-400 opacity-60" : ""
        }`}
      >
        Delete Post
      </option>
    </select>

    {report.postId.is_deleted && (
      <div className="absolute inset-0 cursor-not-allowed"></div>
    )}
  </div>
</td>

                      <ViewPostModal
                        show={viewModal.show}
                        report={viewModal.report}
                        onClose={() => setViewModal({ show: false, report: null })}
                      />


                      <td className="px-3 py-3 flex gap-2">
                        <IoEyeOutline
                          size={20}
                          className="cursor-pointer"
                          color="#A321A6"
                          onClick={() => setSelectedReport(report)}
                        />
                        <RiDeleteBinLine
                          size={20}
                          className="cursor-pointer"
                          color="red"
                          onClick={() => {
                            setReportToDelete(report);
                            setShowConfirm(true);
                          }}
                        />
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="text-center py-4 text-gray-500">
                      No reports found.
                    </td>
                  </tr>
                )}
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

      <ConfirmationDialog
        show={showConfirm}
        title="Delete Report"
        message="Are you sure you want to delete this report?"
        onCancel={() => {
          setShowConfirm(false);
          setReportToDelete(null);
        }}
        onConfirm={handleDelete}
      />

      {selectedReport && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white w-[600px] max-h-[85vh] rounded-2xl shadow-2xl overflow-hidden flex flex-col">
            <div className="flex justify-between items-center px-3 py-3 border-b bg-gray-50">
              <h2 className="text-xl font-bold text-gray-800">
                Report Details
              </h2>
              <button
                className="text-gray-400 hover:text-gray-700 text-xl"
                onClick={() => setSelectedReport(null)}
              >
                ✕
              </button>
            </div>

            <div className="overflow-y-auto p-4 space-y-4 text-sm">
              <p><strong>{selectedReport.title}</strong></p>
              <p><strong>Description:</strong> {selectedReport.reason}</p>
              <p><strong>Post Category:</strong> {selectedReport.postType}</p>
              <p><strong>Reported By:</strong> {selectedReport.user?.profile
                ? `${selectedReport.user?.profile?.firstName} ${selectedReport.user?.profile?.lastName}`
                : "N/A"}
              </p>
              <p><strong>Date:</strong> {new Date(selectedReport.createdAt).toLocaleString()}</p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

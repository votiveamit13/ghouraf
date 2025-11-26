import { useState, useEffect } from "react";
import PaginationComponent from "components/common/Pagination";
import { RiDeleteBinLine } from "react-icons/ri";
import { toast } from "react-toastify";
import SearchFilter from "components/common/SearchFilter";
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

  // Delete modal states
  const [showConfirm, setShowConfirm] = useState(false);
  const [newsletterToDelete, setNewsletterToDelete] = useState(null);

  // Send newsletter modal
  const [showSendModal, setShowSendModal] = useState(false);
  const [subject, setSubject] = useState("");
  const [htmlMessage, setHtmlMessage] = useState("");
  const [singleEmail, setSingleEmail] = useState(null); // if null → send all

  // Fetch newsletters
  const fetchNewsletters = async () => {
    try {
      setLoading(true);

      const res = await axios.get(`${apiUrl}admin/newsletter`, {
        headers: { Authorization: `Bearer ${authToken}` },
        params: { search: searchTerm, page: currentPage, limit: 20 },
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

  // Delete newsletter
  const handleDelete = async () => {
    try {
      await axios.delete(`${apiUrl}admin/newsletter/${newsletterToDelete._id}`, {
        headers: { Authorization: `Bearer ${authToken}` },
      });

      toast.success("Email deleted successfully");
      setShowConfirm(false);
      fetchNewsletters();

    } catch (err) {
      toast.error("Failed to delete");
    }
  };

  // Send newsletter (single or bulk)
  const handleSendNewsletter = async () => {
    if (!subject || !htmlMessage) {
      return toast.error("Subject & message are required");
    }

    try {
      if (singleEmail) {
        // Send to single user
        await axios.post(
          `${apiUrl}admin/newsletter/send-single`,
          { email: singleEmail, subject, html: htmlMessage },
          { headers: { Authorization: `Bearer ${authToken}` } }
        );
        toast.success(`Newsletter sent to ${singleEmail}`);
      } else {
        // Send to all
        await axios.post(
          `${apiUrl}admin/newsletter/send-bulk`,
          { subject, html: htmlMessage },
          { headers: { Authorization: `Bearer ${authToken}` } }
        );
        toast.success("Newsletter sent to all subscribers");
      }

      setShowSendModal(false);
      setSubject("");
      setHtmlMessage("");
      setSingleEmail(null);

    } catch (err) {
      toast.error("Failed to send newsletter");
    }
  };

  return (
    <>
      <Header hideStatsOnMobile={true} />

      <div className="px-[20px] md:px-[40px] mt-[-12%] md:mt-[-8%] w-full mb-4">
        <div className="bg-white shadow rounded-lg overflow-hidden">

          {/* Header Section */}
          <div className="px-3 py-3 border-b flex justify-between">
            <h3 className="text-lg font-semibold">Newsletter Management</h3>

            <div className="flex gap-3">
              {/* Bulk Send Button */}
              <button
                className="bg-blue-600 text-white px-3 py-2 rounded"
                onClick={() => {
                  setSingleEmail(null);
                  setShowSendModal(true);
                }}
              >
                Send Bulk Newsletter
              </button>

              <SearchFilter
                placeholder="Search by email..."
                onSearch={setSearchTerm}
              />
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm text-gray-700 table-fixed">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-3 py-3 text-left">S. No.</th>
                  <th className="px-3 py-3 text-left">Email</th>
                  <th className="px-3 py-3 text-center">Action</th>
                </tr>
              </thead>

              <tbody className="bg-white divide-y">
                {loading ? (
                  <tr>
                    <td colSpan={3} className="text-center py-3">Loading...</td>
                  </tr>
                ) : newsletters.length === 0 ? (
                  <tr>
                    <td colSpan={3} className="text-center py-3">No Newsletter Found</td>
                  </tr>
                ) : (
                  newsletters.map((item, index) => (
                    <tr key={item._id}>
                      <td className="px-3 py-3">{index + 1}</td>
                      <td className="px-3 py-3">{item.email}</td>

                      <td className="px-3 py-3 flex justify-center gap-3">

                        {/* Send single newsletter */}
                        <button
                          className="px-3 py-1 bg-green-600 text-white rounded text-xs"
                          onClick={() => {
                            setSingleEmail(item.email);
                            setShowSendModal(true);
                          }}
                        >
                          Send Newsletter
                        </button>

                        {/* Delete */}
                        <RiDeleteBinLine
                          size={20}
                          color="red"
                          className="cursor-pointer"
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

          <div className="px-6 py-4 border-t">
            <PaginationComponent
              currentPage={currentPage}
              totalPages={1}
              onPageChange={setCurrentPage}
            />
          </div>
        </div>
      </div>

      {showSendModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center p-4">
          <div className="bg-white w-full max-w-md p-4 rounded shadow-lg">

            <h2 className="text-xl text-black font-semibold mb-4">
              {singleEmail ? `Send Newsletter to ${singleEmail}` : "Send Bulk Newsletter"}
            </h2>

            <label className="font-medium">Subject</label>
            <input
              className="w-full border p-2 rounded mb-3"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
            />

            <label className="font-medium">Message (HTML Allowed)</label>
            <textarea
              className="w-full border p-2 rounded h-32 mb-4"
              value={htmlMessage}
              onChange={(e) => setHtmlMessage(e.target.value)}
            ></textarea>

            <div className="flex justify-end gap-3">
              <button
                className="px-4 py-2 bg-gray-300 rounded"
                onClick={() => setShowSendModal(false)}
              >
                Cancel
              </button>

              <button
                className="px-4 py-2 bg-blue-600 text-white rounded"
                onClick={handleSendNewsletter}
              >
                Send
              </button>
            </div>
          </div>
        </div>
      )}

      <ConfirmationDialog
        show={showConfirm}
        title="Delete Email"
        message="Are you sure you want to delete this email?"
        onCancel={() => setShowConfirm(false)}
        onConfirm={handleDelete}
      />
    </>
  );
}

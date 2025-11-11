import axios from "axios";
import Header from "components/admin/Headers/Header";
import ConfirmationDialog from "components/common/ConfirmationDialog";
import PaginationComponent from "components/common/Pagination";
import SearchFilter from "components/common/SearchFilter";
import { useEffect, useMemo, useState } from "react";
import { IoEyeOutline } from "react-icons/io5";
import { RiDeleteBinLine } from "react-icons/ri";
import { toast } from "react-toastify";

export default function ContactForm() {
    const [messages, setMessages] = useState([]);
    const apiUrl = process.env.REACT_APP_API_URL;
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
      const [confirmOpen, setConfirmOpen] = useState(false);
    const [previewMessage, setPreviewMessage] = useState(null);
const [selectedMessage, setSelectedMessage] = useState(null);
    const pageSize = 10;

    const token = localStorage.getItem("authToken");


    useEffect(() => {
        const fetchMessages = async () => {
      try {
        const res = await axios.get(`${apiUrl}/admin/messages`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setMessages(res.data);
      } catch (err) {
        console.error("Error fetching users", err);
      }
    };
    fetchMessages();
  }, [token, apiUrl]);

const startIndex = (currentPage - 1) * pageSize;

const pageData = messages.slice(startIndex, startIndex + pageSize);

const filteredMessages = useMemo(() => {
  const term = searchTerm.toLowerCase();
  return pageData.filter((message) => {
    const fullName = message.fullName?.toLowerCase() || "";
    const email = message.email?.toLowerCase() || "";

    return (
      fullName.includes(term) ||
      email.includes(term)
    );
  });
}, [pageData, searchTerm]);

const totalPages = Math.ceil(messages.length / pageSize);
const paginatedmessages = filteredMessages;


    const handleDelete = async () => {
      try {
        await axios.delete(`${apiUrl}/admin/message/${selectedMessage._id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setMessages(prev => prev.filter(u => u._id !== selectedMessage._id));
        toast.success("Message deleted successfully");
      } catch (err) {
        console.error("Error deleting message", err);
        toast.error("Failed to delete message");
      } finally {
        setConfirmOpen(false);
        setSelectedMessage(null);
      }
    };


    return (
        <>
            <Header />
            <div className="px-[40px] mt-[-8%] w-full fluid position-relative">
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="px-3 py-3 border-b border-gray-200 d-flex justify-between">
            <h3 className="text-lg font-semibold text-gray-800">
                            Contact Form
                        </h3>
                        <SearchFilter
                            placeholder="Search by name or email..."
                            onSearch={setSearchTerm}
                        />
                    </div>
                     <div className="overflow-x-auto">
            <table className="min-w-full text-sm text-gray-700">
              <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-3 py-3 text-left font-semibold">S. No.</th>
                                    <th className="px-3 py-3 text-left font-semibold">
                                        Name
                                    </th>
                                    <th className="px-3 py-3 text-left font-semibold">
                                        Email
                                    </th>
                                    <th className="px-3 py-3 text-left font-semibold">
                                        Subject
                                    </th>
                                    <th className="px-3 py-3 text-left font-semibold">Action</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-100">
                                {paginatedmessages.map((message, index) => (
                                    <tr key={message.id}>
                                        <td className="px-3 py-3">{startIndex + index + 1}</td>
                                        <td className="px-3 py-3">{message.fullName}</td>
                                        <td className="px-3 py-3">{message.email}</td>
                                        <td className="px-3 py-3">{message.subject}</td>
                                        <td className="px-3 py-3 flex gap-2">
                                            <IoEyeOutline
                                                size={20}
                                                className="cursor-pointer"
                                                color="#A321A6"
                                                onClick={() => setPreviewMessage(message)}
                                            />
                                            <RiDeleteBinLine
                                                size={20}
                                                className="cursor-pointer"
                                                color="red"
                                                onClick={() => {
                                                    setSelectedMessage(message);
                                                    setConfirmOpen(true);
                                                }}
                                            />
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                              <ConfirmationDialog
                                show={confirmOpen}
                                title="Delete Message"
                                message={`Are you sure you want to delete the message`}
                                onConfirm={handleDelete}
                                onCancel={() => setConfirmOpen(false)}
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

            {previewMessage && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
                    <div className="bg-white w-[600px] max-h-[80vh] rounded-lg shadow-lg overflow-y-auto">
                        <div className="flex justify-between items-center p-4 border-b">
                            <h2 className="text-lg font-semibold">{previewMessage.fullName}</h2>
                            <button
                                className="text-gray-500 hover:text-gray-800"
                                onClick={() => setPreviewMessage(null)}
                            >
                                ✕
                            </button>
                        </div>

                        <div className="p-4 space-y-4">
                            <p>
                                <strong>Email:</strong> {previewMessage.email}
                            </p>
                            <p>
                                <strong>Subject:</strong> {previewMessage.subject}
                            </p>
                            <p>
                                <strong>Message:</strong> {previewMessage.message}
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
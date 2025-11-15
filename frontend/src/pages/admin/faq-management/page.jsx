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

export default function FaqManagement() {
    const navigate = useNavigate();
    const [faqs, setFaqs] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 10;
    const apiUrl = process.env.REACT_APP_API_URL;
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [selectedFaq, setSelectedFaq] = useState(null);

    const token = localStorage.getItem("authToken");
    useEffect(() => {
        const fetchFaqs = async () => {
            try {
                const res = await axios.get(`${apiUrl}/admin/faqs`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setFaqs(res.data);
            } catch (err) {
                console.error("Error fetching faqs", err);
            }
        };
        fetchFaqs();
    }, [token, apiUrl]);

    const handleActionChange = async (mongoId, value) => {
        const status = value === "active" ? "active" : "inactive";
        try {
            const res = await axios.patch(`${apiUrl}/admin/faq/${mongoId}/status`,
                { status },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            setFaqs(prev =>
                prev.map(u => (u._id === mongoId ? res.data.faq : u))
            );
            if (status === "inactive") {
                toast.info("FAQ is inactive");
            } else {
                toast.success("FAQ is active");
            }
        } catch (err) {
            console.error("Error updating status", err);
        }
    };

    const handleDelete = async () => {
    if (!selectedFaq) return;
    try {
        await axios.delete(`${apiUrl}/admin/faq/${selectedFaq._id}`, {
            headers: { Authorization: `Bearer ${token}` },
        });

        setFaqs(prev => prev.filter(f => f._id !== selectedFaq._id));
        toast.success("FAQ deleted successfully");
    } catch (err) {
        console.error("Error deleting FAQ", err);
        toast.error(err.response?.data?.message || "Failed to delete FAQ");
    } finally {
        setConfirmOpen(false);
        setSelectedFaq(null);
    }
};


    const totalPages = Math.ceil(faqs.length / pageSize);
    const startIndex = (currentPage - 1) * pageSize;
    const paginatedfaqs = faqs.slice(startIndex, startIndex + pageSize);
    return (
        <>
      <Header hideStatsOnMobile={true}/>
      <div className="px-[20px] md:px-[40px] mt-[-12%] md:mt-[-8%] w-full fluid position-relative mb-4">
                <div className="bg-white shadow rounded-lg overflow-hidden">
                    <div className="px-3 py-3 border-b border-gray-200 d-flex flex-col md:flex-row gap-2 md:gap-0 justify-between">
                        <h3 className="text-lg font-semibold text-gray-800">
                            FAQ Management
                        </h3>
                        <button className="flex items-center justify-center gap-2 px-3 py-2 border-[1px] border-[#565ABF] rounded-[10px]" onClick={() => navigate("/admin/faq-management/add")}>Add FAQ <IoMdAdd /></button>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="min-w-full text-sm text-gray-700 table-fixed">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-3 py-3 w-12 text-left font-semibold whitespace-nowrap">S. No.</th>
                                    <th className="px-3 py-3 w-1/4 text-left font-semibold">
                                        Question
                                    </th>
                                    <th className="px-3 py-3 w-1/3 text-left font-semibold">
                                        Answer
                                    </th>
                                    <th className="px-3 py-3 w-24 text-left font-semibold">Status</th>
                                    <th className="px-3 py-3 w-20 text-left font-semibold">Action</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-100">
                                {paginatedfaqs.map((faq, index) => (
                                    <tr key={faq._id}>
                                        <td className="px-3 py-3">{startIndex + index + 1}</td>
                                        <td className="px-3 py-3">{faq.question}</td>
                                        <td className="px-3 py-3">{faq.answer}</td>
                                        <td className="px-3 py-3">
                                            <select
                                                value={faq.status === "active" ? "active" : "inactive"}
                                                onChange={(e) =>
                                                    handleActionChange(faq._id, e.target.value)
                                                }
                                                className="block w-[100px] max-w-[100px] px-2 py-1 border-[1px] border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500"
                                            >
                                                <option value="active">Active</option>
                                                <option value="inactive">Inactive</option>
                                            </select>
                                        </td>
                                        <td className="px-3 py-3">
                                            <div className="d-flex items-center gap-1 cursor-pointer">
                                                <FaRegEdit size={20} onClick={() => navigate("/admin/faq-management/edit", { state: { faq } })} />
                                                <RiDeleteBin6Line
                                                    size={20}
                                                    color="red"
                                                    onClick={() => {
                                                        setSelectedFaq(faq);
                                                        setConfirmOpen(true);
                                                    }}
                                                />

                                            </div>
                                        </td>
                                    </tr>
                                ))}

                            </tbody>
                        </table>
                    </div>
<ConfirmationDialog
    show={confirmOpen}
    title="Delete FAQ"
    message={`Are you sure you want to delete this FAQ?`}
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
        </>
    );
}
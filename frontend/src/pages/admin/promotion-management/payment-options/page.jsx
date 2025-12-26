import { useState, useEffect } from "react";
import PaginationComponent from "components/common/Pagination";
import { RiDeleteBin6Line, RiDeleteBinLine } from "react-icons/ri";
import { toast } from "react-toastify";
import SearchFilter from "components/common/SearchFilter";
import ConfirmationDialog from "components/common/ConfirmationDialog";
import Header from "components/admin/Headers/Header";
import axios from "axios";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import ExportData from "components/admin/export-data/ExportData";
import { IoMdAdd } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import { FaRegEdit } from "react-icons/fa";

export default function PaymentOptions() {
    const navigate = useNavigate();
  const apiUrl = process.env.REACT_APP_API_URL;
  const authToken = localStorage.getItem("authToken");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const [loading, setLoading] = useState(false);

  // Delete modal
  const [showConfirm, setShowConfirm] = useState(false);
  const [newsletterToDelete, setNewsletterToDelete] = useState(null);

  return (
    <>
      <Header hideStatsOnMobile={true} />

      <div className="px-[20px] md:px-[40px] mt-[-12%] md:mt-[-8%] w-full mb-4">
        <div className="bg-white shadow rounded-lg overflow-hidden">

            <div className="px-3 py-3 border-b border-gray-200 d-flex flex-col md:flex-row gap-2 md:gap-0 justify-between">
            <h3 className="text-lg font-semibold text-gray-800">
                Promotion Management
            </h3>
            <button className="flex items-center justify-center gap-2 px-3 py-2 border-[1px] border-[#565ABF] rounded-[10px]" onClick={() => navigate("/admin/promotion-management/add")}>Add Payment Options <IoMdAdd /></button>
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
                <td className="px-3 py-3">
                    <div className="d-flex items-center gap-1 cursor-pointer">
                        <FaRegEdit size={20} onClick={() => navigate("/admin/promotion-management/edit", { state: {  } })} />
                        <RiDeleteBin6Line
                            size={20}
                            color="red"

                        />

                    </div>
                </td>
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

    </>
  );
}

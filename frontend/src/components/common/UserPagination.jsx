import React from "react";
import { HiOutlineChevronRight, HiOutlineChevronLeft } from "react-icons/hi2";

export default function UserPagination({ currentPage, totalPages, onPageChange }) {
  if (totalPages <= 1) return null;

  const handlePageClick = (page) => {
    if (page >= 1 && page <= totalPages) {
      onPageChange(page);
    }
  };

  return (
    <div className="flex items-center justify-center space-x-2 text-black">
      <button
        onClick={() => handlePageClick(currentPage - 1)}
        disabled={currentPage === 1}
        className={`px-3 py-2 border-[1px] border-[#E9E9E9] rounded-[4px] text-black ${
          currentPage === 1
            ? "text-gray-400 border-gray-300 cursor-not-allowed flex items-center gap-2"
            : "hover:bg-gray-100 flex items-center gap-2"
        }`}
      >
        <HiOutlineChevronLeft/> Back
      </button>

      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
        <button
          key={page}
          onClick={() => handlePageClick(page)}
          className={`px-3 py-2 border-[1px] border-[#E9E9E9] rounded-[4px] text-black ${
            page === currentPage
              ? "bg-[#565ABF] text-white border-[#565ABF]"
              : "hover:bg-gray-100"
          }`}
        >
          {page}
        </button>
      ))}

      <button
        onClick={() => handlePageClick(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={`px-3 py-2 border-[1px] border-[#E9E9E9] rounded-[4px] text-black ${
          currentPage === totalPages
            ? "text-gray-400 border-gray-300 cursor-not-allowed flex items-center gap-2"
            : "hover:bg-gray-100 flex items-center gap-2"
        }`}
      >
        Next <HiOutlineChevronRight/>
      </button>
    </div>
  );
}

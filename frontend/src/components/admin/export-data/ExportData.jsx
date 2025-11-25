import React from "react";
import { FaFileExcel, FaFilePdf } from "react-icons/fa";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { toast } from "react-toastify";

const ExportData = ({ data = [], columns = [], filename = "data" }) => {

  function getValue(item, col) {
    let rawValue;

    // Handle array keys: ["user.first", "user.last"]
    if (Array.isArray(col.key)) {
      rawValue = col.key.map(path => resolvePath(item, path));
    } else {
      rawValue = resolvePath(item, col.key);
    }

    // If formatting function exists
    if (col.format) return col.format(rawValue);

    // Join array values by space
    if (Array.isArray(rawValue)) return rawValue.join(" ");

    return rawValue ?? "";
  }

  function resolvePath(obj, path) {
    if (!path) return ""; // safeguard
    return path.split(".").reduce((acc, part) => acc?.[part], obj) ?? "";
  }

  const exportExcel = () => {
    if (!data.length) return toast.error("No data to export");

    const excelRows = data.map((item) => {
      const row = {};

      columns.forEach((col) => {
        row[col.label] = getValue(item, col);   // ✅ FIXED
      });

      return row;
    });

    const ws = XLSX.utils.json_to_sheet(excelRows);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Sheet1");

    XLSX.writeFile(wb, `${filename}.xlsx`);
  };

  const exportPdf = () => {
    if (!data.length) return toast.error("No data to export");

    const doc = new jsPDF();

    doc.setFontSize(14);
    doc.text(`${filename} Data`, 14, 15);

    const tableHeaders = columns.map((col) => col.label);

    const tableRows = data.map((item) =>
      columns.map((col) => getValue(item, col))  // ✅ FIXED
    );

    autoTable(doc, {
      head: [tableHeaders],
      body: tableRows,
      startY: 25,
      styles: { fontSize: 10 },
      headStyles: { fillColor: [66, 66, 66] },
    });

    doc.save(`${filename}.pdf`);
  };

  return (
    <div className="flex items-center gap-2">
      <FaFileExcel
        size={26}
        className="cursor-pointer text-green-600 hover:text-green-700"
        onClick={exportExcel}
      />

      <FaFilePdf
        size={26}
        className="cursor-pointer text-red-600 hover:text-red-700"
        onClick={exportPdf}
      />
    </div>
  );
};

export default ExportData;

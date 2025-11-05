import Header from "components/admin/Headers/Header";
import { IoMdAdd } from "react-icons/io";

export default function AdManagement() {
    return (
        <>
            <Header />
            <div className="px-[40px] mt-[-8%] w-full fluid position-relative">
                <div className="bg-white shadow rounded-lg overflow-hidden">
                    <div className="px-3 py-3 border-b border-gray-200 d-flex justify-between">
                        <h3 className="text-lg font-semibold text-gray-800">
                            Ad Management
                        </h3>
                        <button
                            onClick={() => navigate("/admin/ad-management/add")}
                            className="flex items-center justify-center gap-2 px-3 py-2 border-[1px] border-[#565ABF] rounded-[10px]"
                        >
                            Create Ad <IoMdAdd size={18} />
                        </button>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="min-w-full text-sm text-gray-700 table-fixed">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-3 py-3 text-left font-semibold w-[60px]">S.No</th>
                                    <th className="px-3 py-3 text-left font-semibold">Title</th>
                                    <th className="px-3 py-3 text-left font-semibold">URL</th>
                                    <th className="px-3 py-3 text-left font-semibold">Image</th>
                                    <th className="px-3 py-3 text-center font-semibold w-[100px]">Action</th>
                                </tr>
                            </thead>
                            <tbody>

                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </>
    )
}
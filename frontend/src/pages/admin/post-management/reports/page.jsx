import Header from "components/admin/Headers/Header";

export default function ReportList() {
    return (
        <>
            <Header />
            <div className="px-[40px] mt-[-8%] w-full fluid position-relative">
                <div className="bg-white shadow rounded-lg overflow-hidden">
                    <div className="px-3 py-3 border-b border-gray-200 d-flex justify-between">
                        <h3 className="text-lg font-semibold text-gray-800">
                            Reports Management
                        </h3>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="min-w-full text-sm text-gray-700 table-fixed">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-3 py-3 text-left font-semibold">S. No.</th>
                                    <th className="px-3 py-3 text-left font-semibold">Post Category</th>
                                    <th className="px-3 py-3 text-left font-semibold">Title</th>
                                    <th className="px-3 py-3 text-left font-semibold">Description</th>
                                    <th className="px-3 py-3 text-left font-semibold">Report Date</th>
                                    <th className="px-3 py-3 text-left font-semibold">Reported By</th>
                                    <th className="px-3 py-3 text-left font-semibold">Action</th>
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
import { useState, useEffect } from "react";
import Header from "components/admin/Headers/Header";
import { IoEyeOutline } from "react-icons/io5";
import { RiDeleteBinLine } from "react-icons/ri";
import { IoMdAdd } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function AdManagement() {
  const navigate = useNavigate();
  const apiUrl = process.env.REACT_APP_API_URL;
  const [ads, setAds] = useState([]);
  const [loading, setLoading] = useState(true);

  const getAllAds = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("adminToken");
      const { data } = await axios.get(`${apiUrl}admin/getAllAds`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAds(data?.ads || []);
    } catch (error) {
      console.error("Failed to fetch ads:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getAllAds();
  }, []);

  return (
    <>
      <Header />
      <div className="px-[40px] mt-[-8%] w-full fluid position-relative">
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="px-3 py-3 border-b border-gray-200 d-flex justify-between">
            <h3 className="text-lg font-semibold text-gray-800">Ad Management</h3>
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
                  <th className="px-3 py-3 text-center font-semibold w-[100px]">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={5} className="text-center py-4">
                      Loading...
                    </td>
                  </tr>
                ) : ads.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="text-center py-4">
                      No ads found.
                    </td>
                  </tr>
                ) : (
                  ads.map((ad, index) => (
                    <tr key={ad._id} className="border-t">
                      <td className="px-3 py-3">{index + 1}</td>
                      <td className="px-3 py-3">{ad.title}</td>
                      <td className="px-3 py-3">{ad.url}</td>
                      <td className="px-3 py-3">
                        <img
                          src={`${apiUrl}/${ad.image}`}
                          alt={ad.title}
                          className="rounded border"
                          style={{ width: 80, height: 80, objectFit: "cover" }}
                        />
                      </td>
                      <td className="px-3 py-3 text-center">
                        <button
                          onClick={() =>
                            navigate("/admin/ad-management/edit", { state: { ad } })
                          }
                          className="btn btn-sm btn-outline-primary me-2"
                        >
                          <IoEyeOutline />
                        </button>
                        <button
                          onClick={() => console.log("TODO: delete logic")}
                          className="btn btn-sm btn-outline-danger"
                        >
                          <RiDeleteBinLine />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}

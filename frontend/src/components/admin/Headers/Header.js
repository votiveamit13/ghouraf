import { useEffect, useState } from "react";
import axios from "axios";
import { FaUsers } from "react-icons/fa6";
import { TiUserAdd } from "react-icons/ti";
import { BsPostcardFill } from "react-icons/bs";
import { TbMessageReportFilled } from "react-icons/tb";
import { RiAdvertisementFill } from "react-icons/ri";

const Header = ({ hideStatsOnMobile = false }) => {
  const apiUrl = process.env.REACT_APP_API_URL;
  const [stats, setStats] = useState({
    totalUsers: 0,
    newUsers: 0,
    totalPosts: 0,
    reportsCount: 0,
  });

  const [loading, setLoading] = useState(true);

   useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem("authToken");
        const { data } = await axios.get(`${apiUrl}admin/stats`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (data.success) setStats(data.data);
      } catch (error) {
        console.error("Error fetching dashboard stats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="bg-gradient-to-r from-cyan-500 to-blue-500 pb-[65px] md:pb-[100px] lg:pb-[115px] pt-[140px] md:pt-[85px]">
      <div className="px-[20px] md:px-[40px] mx-auto max-w-7xl">
        <div className={`grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4 
            ${hideStatsOnMobile ? "hidden sm:grid" : ""}`}>
          <div className="bg-white shadow rounded-lg p-4 flex justify-between items-center">
            <div>
              <h5 className="text-xs font-semibold text-gray-500 uppercase">
                Total Users
              </h5>
              <span className="text-2xl font-bold text-gray-800">
                {loading ? "..." : stats.totalUsers.toLocaleString()}
              </span>
            </div>
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-red-500 text-white shadow">
              <FaUsers size={20}/>
            </div>
          </div>

          <div className="bg-white shadow rounded-lg p-4 flex justify-between items-center">
            <div>
              <h5 className="text-xs font-semibold text-gray-500 uppercase">
                Total Ads
              </h5>
              <span className="text-2xl font-bold text-gray-800">
                {loading ? "..." : stats.adPosts.toLocaleString()}
              </span>
            </div>
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-yellow-500 text-white shadow">
              <RiAdvertisementFill size={20}/>
            </div>
          </div>

          <div className="bg-white shadow rounded-lg p-4 flex justify-between items-center">
            <div>
              <h5 className="text-xs font-semibold text-gray-500 uppercase">
                Total Posts
              </h5>
              <span className="text-2xl font-bold text-gray-800">
                {loading ? "..." : stats.totalPosts.toLocaleString()}
              </span>
            </div>
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-yellow-400 text-white shadow">
              <BsPostcardFill size={20}/>
            </div>
          </div>

          <div className="bg-white shadow rounded-lg p-4 flex justify-between items-center">
            <div>
              <h5 className="text-xs font-semibold text-gray-500 uppercase">
                Reports Count
              </h5>
              <span className="text-2xl font-bold text-gray-800">
                {loading ? "..." : stats.reportsCount.toLocaleString()}
              </span>
            </div>
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-blue-500 text-white shadow">
              <TbMessageReportFilled size={20}/>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;

import { useEffect, useState } from "react";
import axios from "axios";

const Header = () => {
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
        const { data } = await axios.get(`${apiUrl}admin/stats`);
        if (data.success) {
          setStats(data.data);
        }
      } catch (error) {
        console.error("Error fetching dashboard stats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="bg-gradient-to-r from-cyan-500 to-blue-500 pb-8 pt-7">
      <div className="px-[40px] mx-auto max-w-7xl">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
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
              <i className="fas fa-chart-bar" />
            </div>
          </div>

          <div className="bg-white shadow rounded-lg p-4 flex justify-between items-center">
            <div>
              <h5 className="text-xs font-semibold text-gray-500 uppercase">
                New Users
              </h5>
              <span className="text-2xl font-bold text-gray-800">
                {loading ? "..." : stats.newUsers.toLocaleString()}
              </span>
            </div>
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-yellow-500 text-white shadow">
              <i className="fas fa-chart-pie" />
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
              <i className="fas fa-users" />
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
              <i className="fas fa-percent" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;

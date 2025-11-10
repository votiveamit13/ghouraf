import { useEffect, useState } from "react";
import Header from "components/admin/Headers/Header";
import ActivityChart from "components/admin/charts/ActivityChart";
import axios from "axios";

const Dashboard = () => {
  const apiUrl = process.env.REACT_APP_API_URL;
 const [activeTab, setActiveTab] = useState("month");
  const [userActivity, setUserActivity] = useState([]);
  const [postsActivity, setPostsActivity] = useState([]);

   useEffect(() => {
    const fetchChartData = async () => {
      try {
        const token = localStorage.getItem("token");
        const { data } = await axios.get(`${apiUrl}admin/charts?period=${activeTab}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (data.success) {
          setUserActivity(data.data.userActivity);
          setPostsActivity(data.data.postsActivity);
        }
      } catch (err) {
        console.error("Error fetching chart data:", err);
      }
    };

    fetchChartData();
  }, [activeTab]);

  const labels = userActivity.map((u) => u.label);
  const signups = userActivity.map((u) => u.count);

  return (
    <>
      <Header />
<div className="px-[40px] mt-[-8%] w-full fluid position-relative">
        <div className="bg-gradient-to-r from-[#565ABF] to-[#A321A6] rounded-xl shadow p-4 w-full">
          <div className="flex justify-between items-center mb-3">
            <h2 className="text-white text-xl font-semibold">Overview</h2>
            <div className="flex space-x-2">
              {["month", "week"].map((tab) => (
                <button
                  key={tab}
                  className={`px-3 py-1 rounded ${
                    activeTab === tab
                      ? "bg-white text-indigo-600"
                      : "bg-indigo-500 text-white"
                  }`}
                  onClick={() => setActiveTab(tab)}
                >
                  {tab === "month" ? "Month" : "Week"}
                </button>
              ))}
            </div>
          </div>

          <div className="d-flex gap-5">
            <ActivityChart
              title="User Activity"
              subtitle={
                activeTab === "month"
                  ? "Signups (last 4 weeks)"
                  : "Signups (last 7 days)"
              }
              labels={labels}
              series={[
                {
                  label: "Signups",
                  data: signups,
                  type: "bar",
                  backgroundColor: "#4F46E5",
                },
              ]}
              yLabel="Users"
              height={200}
            />

            <ActivityChart
              title="Posts Created"
              subtitle={
                activeTab === "month"
                  ? "By Category (last 4 weeks)"
                  : "By Category (last 7 days)"
              }
              labels={postsActivity.map((p) => p.label)}
              series={[
                {
                  label: "Space Wanted",
                  data: [postsActivity[0]?.count || 0],
                  type: "bar",
                  backgroundColor: "#6366F1",
                },
                {
                  label: "Spaces",
                  data: [postsActivity[1]?.count || 0],
                  type: "bar",
                  backgroundColor: "#EC4899",
                },
                {
                  label: "Team Up",
                  data: [postsActivity[2]?.count || 0],
                  type: "bar",
                  backgroundColor: "#10B981",
                },
              ]}
              yLabel="Posts"
              height={200}
            />
          </div>
        </div>
        </div>
    </>
  );
};

export default Dashboard;

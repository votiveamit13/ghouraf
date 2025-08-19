import { useState } from "react";
import Header from "components/admin/Headers/Header";
import ActivityChart from "components/admin/charts/ActivityChart";

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState("month");

  const weeklyLabels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const weeklySignups = [30, 28, 35, 40, 38, 42, 50];

  const monthlyLabels = ["Week 1", "Week 2", "Week 3", "Week 4"];
  const monthlySignups = [210, 250, 230, 280];

  const labels = activeTab === "month" ? monthlyLabels : weeklyLabels;
  const signups = activeTab === "month" ? monthlySignups : weeklySignups;

  return (
    <>
      <Header />
      <div className="px-[40px] mt-[-8%] w-full fluid position-relative">
        <div className="bg-gradient-to-r from-[#565ABF] to-[#A321A6] rounded-xl shadow p-4 w-full">
          <div className="flex justify-between items-center mb-3">
            <div>
              <h2 className="text-white text-xl font-semibold">Overview</h2>
            </div>
            <div className="flex space-x-2">
              <button
                className={`px-3 py-1 rounded ${
                  activeTab === "month"
                    ? "bg-white text-indigo-600"
                    : "bg-indigo-500 text-white"
                }`}
                onClick={() => setActiveTab("month")}
              >
                Month
              </button>
              <button
                className={`px-3 py-1 rounded ${
                  activeTab === "week"
                    ? "bg-white text-indigo-600"
                    : "bg-indigo-500 text-white"
                }`}
                onClick={() => setActiveTab("week")}
              >
                Week
              </button>
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
              onPointClick={(ctx) => console.log("Clicked point:", ctx)}
            />

            <ActivityChart
              title="Posts Created"
              subtitle={
                activeTab === "month"
                  ? "By Category (last 4 weeks)"
                  : "By Category (last 7 days)"
              }
              labels={labels}
              series={[
                {
                  label: "Looking for Room",
                  data: [18, 20, 22, 24, 25, 26, 30],
                  type: "bar",
                  backgroundColor: "#6366F1",
                },
                {
                  label: "Offering Room/Apartment",
                  data: [10, 12, 11, 14, 15, 13, 16],
                  type: "bar",
                  backgroundColor: "#EC4899",
                },
                {
                  label: "Team Up",
                  data: [6, 8, 7, 9, 10, 9, 12],
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

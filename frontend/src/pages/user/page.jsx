import { useAuth } from "context/AuthContext";
import { FiEdit, FiPlusCircle } from "react-icons/fi";
import { LuMessageSquareText } from "react-icons/lu";
import { GoSync } from "react-icons/go";
import { GrFavorite } from "react-icons/gr";
import Loader from "components/common/Loader";
import { Navigate, useNavigate } from "react-router-dom";
import PostAdDialog from "components/common/PostAdDialog";
import { useState } from "react";

export default function UserDashboard() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  if (loading) return <Loader fullScreen />;
   if (!user) return <Navigate to="/" replace />;
  return (
    <div className="container px-4 mt-5 mb-8">
      <h1 className="text-[25px] font-bold text-black">
        Welcome <span className="text-[#A321A6]">{user.profile?.firstName}</span>
      </h1>
      <div className="bg-[#E9E8E8] rounded-[10px] d-flex md:w-[25%] w-full px-4 py-3 mt-3 align-center">
        <span className="text-[15px] text-black">Your account is a basic account
        </span>
      </div>
      <div className="p-5 grid grid-cols-1 md:grid-cols-4 gap-5 mt-5 rounded-[12px] border border-[#D7D7D7] shadow-[0px_12px_48px_0px_#0022330F]">
        <button className="align-left text-left">
          <div className="p-4 rounded-[10px] border-[1px] border-[#D7D7D7] bg-[#F5F5F5]">
            <div className="d-flex justify-between align-center">
              <div className="text-[20px] font-[500] text-black mb-3">
                <span>Messages</span>
              </div>
              <div>
                <LuMessageSquareText size={28} color="#565ABF" />
              </div>
            </div>
            <div className="text-[15px] text-black" >
              <span>Check and manage your latest messages</span>
            </div>
          </div>
        </button>
        <button className="align-left text-left" onClick={() => setOpen(true)}>
          <div className="p-4 rounded-[10px] border-[1px] border-[#D7D7D7] bg-[#F5F5F5]">
            <div className="d-flex justify-between align-center">
              <div className="text-[20px] font-[500] text-black mb-3">
                <span>Post an Ad</span>
              </div>
              <div>
                <FiPlusCircle size={28} color="#565ABF" />
              </div>
            </div>
            <div className="text-[15px] text-black" >
              <span>Create an Ad post here. Spaces, Space Wanted, Team up</span>
            </div>
          </div>
        </button>
          <PostAdDialog open={open} onClose={() => setOpen(false)} />
        <button className="align-left text-left" onClick={() => navigate("/user/my-ads")}>
          <div className="p-4 rounded-[10px] border-[1px] border-[#D7D7D7] bg-[#F5F5F5]">
            <div className="d-flex justify-between align-center">
              <div className="text-[20px] font-[500] text-black mb-3">
                <span>My ads</span>
              </div>
              <div>
                <GoSync size={28} color="#565ABF" />
              </div>
            </div>
            <div className="text-[15px] text-black" >
              <span>Manage your ads. Edit, upgrade, deactivate.</span>
            </div>
          </div>
        </button>
        <button className="align-left text-left" onClick={() => navigate("/user/saved-ads")}>
          <div className="p-4 rounded-[10px] border-[1px] border-[#D7D7D7] bg-[#F5F5F5]">
            <div className="d-flex justify-between align-center">
              <div className="text-[20px] font-[500] text-black mb-3">
                <span>Saved ads</span>
              </div>
              <div>
                <GrFavorite size={28} color="#565ABF" />
              </div>
            </div>
            <div className="text-[15px] text-black" >
              <span>View and manage your saved ads</span>
            </div>
          </div>
        </button>
                <button className="align-left text-left" onClick={() => navigate("/user/edit-my-details")}>
          <div className="p-4 rounded-[10px] border-[1px] border-[#D7D7D7] bg-[#F5F5F5]">
            <div className="d-flex justify-between align-center">
              <div className="text-[20px] font-[500] text-black mb-3">
                <span>Edit my details</span>
              </div>
              <div>
                <FiEdit size={28} color="#565ABF" />
              </div>
            </div>
            <div className="text-[15px] text-black" >
              <span>Manage your account information here</span>
            </div>
          </div>
        </button>
      </div>
    </div>
  );
}
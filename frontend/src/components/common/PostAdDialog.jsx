
import rentIcon from "assets/img/ghouraf/rent.png"; 
import buyIcon from "assets/img/ghouraf/buy.png";
import teamIcon from "assets/img/ghouraf/team.png"; 
import { BsArrowUpRight } from "react-icons/bs";
import { useNavigate } from "react-router-dom";

export default function PostAdDialog({ open, onClose }) {
    const navigate = useNavigate();
    if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
    onClick={onClose}
    >
      <div className="relative bg-white rounded-2xl shadow-lg p-4 w-[90%] max-w-4xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-3 right-3 w-8 h-8 flex items-center justify-center bg-gray-200 rounded-full text-gray-600 hover:bg-gray-300"
        >
          ✕
        </button>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex flex-col items-center gap-6 border border-gray-200 rounded-xl p-4 shadow-sm hover:shadow-md transition">
            <h5 className="text-lg font-semibold text-black text-center">
              Post Place for Rent
            </h5>
            <img src={rentIcon} alt="Rent Icon" className="w-16 h-18" />
            <button className="bg-black text-white px-4 py-3 rounded-[12px] flex items-center gap-2 hover:bg-gray-800"
                onClick={() => {
                  onClose();
                  navigate("/user/post-an-space");
                }}
            >
              Post an Ad <span><BsArrowUpRight/></span>
            </button>
          </div>

          <div className="flex flex-col items-center gap-6 border border-gray-200 rounded-xl p-4 shadow-sm hover:shadow-md transition">
            <h5 className="text-lg font-semibold text-black text-center">
              Post Place Wanted
            </h5>
            <img src={buyIcon} alt="Buy Icon" className="w-16 h-18"/>
            <button className="bg-black text-white px-4 py-3 rounded-[12px] flex items-center gap-2 hover:bg-gray-800"
                onClick={() => {
                  onClose();
                  navigate("/user/place-wanted-ad");
                }}
            >
              Post an Ad <span><BsArrowUpRight/></span>
            </button>
          </div>

                    <div className="flex flex-col items-center gap-6 border border-gray-200 rounded-xl p-4 shadow-sm hover:shadow-md transition">
            <h5 className="text-lg font-semibold text-black text-center">
              Team Up
            </h5>
            <img src={teamIcon} alt="Buy Icon" className="w-16 h-18"/>
            <button className="bg-black text-white px-4 py-3 rounded-[12px] flex items-center gap-2 hover:bg-gray-800"
                onClick={() => {
                  onClose();
                  navigate("/user/team-up-post");
                }}
            >
              Post an Ad <span><BsArrowUpRight/></span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

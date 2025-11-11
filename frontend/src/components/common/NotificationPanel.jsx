import { useEffect, useState, useRef } from "react";
import { collection, onSnapshot, query, orderBy } from "firebase/firestore";
import { db } from "../../firebase";
import { IoMdNotificationsOutline } from "react-icons/io";
import { IoClose } from "react-icons/io5";
import defaultAvatar from "assets/img/ghouraf/default-avatar.png";

export default function NotificationPanel({ userId, isMobile }) {
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const dropdownRef = useRef(null);

  const timeAgo = (timestamp) => {
    if (!timestamp?.toDate) return "";
    const now = new Date();
    const diffMs = now - timestamp.toDate();
    const seconds = Math.floor(diffMs / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (seconds < 60) return "just now";
    if (minutes < 60) return `${minutes} min${minutes > 1 ? "s" : ""} ago`;
    if (hours < 24) return `${hours} hour${hours > 1 ? "s" : ""} ago`;
    if (days < 7) return `${days} day${days > 1 ? "s" : ""} ago`;
    return timestamp.toDate().toLocaleDateString();
  };

  useEffect(() => {
    if (!userId) return;

    const q = query(
      collection(db, "notifications", userId, "items"),
      orderBy("createdAt", "desc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const notifs = [];
      snapshot.forEach((doc) => notifs.push({ id: doc.id, ...doc.data() }));
      setNotifications(notifs);
    });

    return () => unsubscribe();
  }, [userId]);

  useEffect(() => {
    if (isMobile) return;
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isMobile]);

  const renderNotifications = () => {
    if (notifications.length === 0)
      return (
        <p className="text-center text-gray-500 py-4">
          No notifications yet
        </p>
      );

    return notifications.map((n) => (
      <div
        key={n.id}
        className={`px-4 py-3 border-b last:border-0 hover:bg-gray-50 cursor-pointer ${
          !n.read ? "bg-purple-50" : "bg-white"
        }`}
        onClick={() => {
          // Optional: navigate to related page or mark as read
          setOpen(false);
        }}
      >
        <div className="flex items-start gap-3">
          <img
            src={n.meta?.photo || defaultAvatar}
            alt="user"
            className="w-8 h-8 rounded-full"
          />
          <div className="flex-1">
            <p className="text-sm text-gray-800 font-medium">{n.title}</p>
            <p className="text-xs text-gray-600">{n.body}</p>
            <span className="text-[11px] text-gray-400">
              {timeAgo(n.createdAt)}
            </span>
          </div>
        </div>
      </div>
    ));
  };

  if (isMobile) {
    return (
      <>
        <button
          className="relative text-black hover:text-[#A321A6]"
          onClick={() => setOpen(true)}
        >
          <IoMdNotificationsOutline size={24} />
          {notifications.some((n) => !n.read) && (
            <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-red-500 rounded-full"></span>
          )}
        </button>

        {open && (
          <div className="fixed inset-0 bg-black/60 flex justify-center items-center z-50 p-4">
            <div className="bg-white rounded-[15px] w-full max-w-sm relative shadow-lg">
              <button
                className="absolute top-2 right-3 text-gray-600 hover:text-black text-xl"
                onClick={() => setOpen(false)}
              >
                <IoClose />
              </button>
              <h3 className="text-lg font-semibold text-center text-black py-3 border-b">
                Notifications
              </h3>
              <div className="max-h-[400px] overflow-y-auto">
                {renderNotifications()}
              </div>
            </div>
          </div>
        )}
      </>
    );
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="relative text-black hover:text-[#A321A6]"
      >
        <IoMdNotificationsOutline size={24} />
        {notifications.some((n) => !n.read) && (
          <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-red-500 rounded-full"></span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-100 z-50">
          <div className="flex justify-between items-center border-b px-4 py-2">
            <h3 className="text-sm font-semibold text-gray-700">
              Notifications
            </h3>
            <button
              onClick={() => setOpen(false)}
              className="text-gray-400 hover:text-gray-600 text-sm"
            >
              Close
            </button>
          </div>
          <div className="max-h-[350px] overflow-y-auto">
            {renderNotifications()}
          </div>
        </div>
      )}
    </div>
  );
}

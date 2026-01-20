import { useEffect, useState, useRef } from "react";
import { collection, doc, setDoc, updateDoc, onSnapshot, query, where, orderBy } from "firebase/firestore";
import { db } from "../../firebase";
import { IoMdNotificationsOutline } from "react-icons/io";
import { IoClose } from "react-icons/io5";
import defaultAvatar from "assets/img/ghouraf/default-avatar.png";
import { useAuth } from "context/AuthContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { MdNotificationsActive } from "react-icons/md";

export default function NotificationPanel({ userId, isMobile }) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const dropdownRef = useRef(null);
  const [hasNewNotification, setHasNewNotification] = useState(false);
  const isInitialLoad = useRef(true);

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

  const markAllAsRead = async () => {
    try {
      const unread = notifications.filter(n => !n.read);

      await Promise.all(
        unread.map(n =>
          updateDoc(doc(db, "notifications", n.id), { read: true })
        )
      );

      setNotifications(prev =>
        prev.map(n => ({ ...n, read: true }))
      );

      setHasNewNotification(false);
    } catch (err) {
      console.error("Failed to mark all as read", err);
    }
  };

  const handleNotificationClick = async (notif) => {
    try {
      setNotifications((prev) =>
        prev.map((item) =>
          item.id === notif.id ? { ...item, read: true } : item
        )
      );
      const notifRef = doc(db, "notifications", notif.id);
      await updateDoc(notifRef, { read: true });

      setOpen(false);

      if (notif.chatId && notif.senderId) {
        navigate(`/user/messages/${notif.chatId}?receiverId=${notif.senderId}`);
        setTimeout(() => {
          navigate("/user/messages", { replace: true });
        }, 50);
      }
      if (notif.meta?.postCategory && notif.meta?.postId) {
        const { postCategory, postId } = notif.meta;

        if (postCategory === "Space") {
          navigate(`/spaces/${postId}`);
        } else if (postCategory === "Spacewanted") {
          navigate(`/place-wanted/${postId}`);
        } else if (postCategory === "Teamup") {
          navigate(`/team-up/${postId}`);
        }
      }
    } catch (error) {
      console.error("Error updating notification:", error);
    }
  };


  useEffect(() => {
  if (!userId) return;

  const q = query(
  collection(db, "notifications"),
  where("userId", "==", userId),
  orderBy("createdAt", "desc")
);


  const unsub = onSnapshot(q, async (snapshot) => {
    const changes = snapshot.docChanges();

    // ✅ Only show red dot for REAL new unread notifications
    if (!isInitialLoad.current) {
      const hasRealNew = changes.some(
        (change) =>
          change.type === "added" &&
          change.doc.data()?.read === false
      );

      if (hasRealNew) {
        setHasNewNotification(true);
      }
    }

    isInitialLoad.current = false;

    const notifs = await Promise.all(
      snapshot.docs.map(async (docSnap) => {
        const notif = { id: docSnap.id, ...docSnap.data() };

        if (notif.senderId && !notif.meta) {
          try {
            const res = await axios.get(
              `${process.env.REACT_APP_API_URL}/users/${notif.senderId}`
            );
            notif.meta = res.data;
          } catch (err) {
            console.error("Failed to fetch sender info", err);
          }
        }

        return notif;
      })
    );

    setNotifications(notifs);
  });

  return () => unsub();
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

    return notifications.map((n) => {
      const isPostNotif = !n.chatId;

      return (
        <div
          key={n.id}
          className={`px-2 py-2 border-b last:border-0 hover:bg-gray-50 cursor-pointer ${!n.read ? "bg-purple-50" : "bg-white"
            }`}
          onClick={() => {
            handleNotificationClick(n);
            setOpen(false);
          }}
        >
          <div className="flex items-start gap-3">
            {isPostNotif ? (
              <div className="w-8 h-8 flex items-center justify-center bg-gray-100 rounded-full">
                <MdNotificationsActive className="text-[#A321A6]" size={20} />
              </div>
            ) : (
              <img
                src={n.meta?.photo || defaultAvatar}
                alt={n.meta?.firstName || "user"}
                className="w-8 h-8 rounded-full object-cover"
              />
            )}

            <div className="flex-1">
              <p className="text-sm font-medium text-gray-800">
                {n.title}
              </p>
              {isPostNotif && (
                <p className="text-xs text-gray-600 mt-1">{n.body}</p>
              )}
              <span className="text-[11px] text-gray-400 block mt-1">
                {timeAgo(n.createdAt)}
              </span>
            </div>
          </div>
        </div>
      );
    });
  };

  if (isMobile) {
    return (
      <>
        <button
          onClick={async () => {
            await markAllAsRead();
            setOpen(prev => !prev);
          }}
          className="relative text-black hover:text-[#A321A6]"
        >
          <IoMdNotificationsOutline size={24} />
          {hasNewNotification && (
            <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-red-500 rounded-full"></span>
          )}

        </button>

        {open && (
          <div className="fixed inset-0 bg-black/60 flex justify-center items-center z-[9999] p-4">
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
        onClick={async () => {
          await markAllAsRead();
          setOpen(prev => !prev);
        }}
        className="relative text-black hover:text-[#A321A6]"
      >
        <IoMdNotificationsOutline size={24} />
        {hasNewNotification && (
          <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-red-500 rounded-full"></span>
        )}

      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-100 z-[9999]">
          <div className="flex justify-between items-center border-b px-2 py-2">
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
          <div className="max-h-[400px] overflow-y-auto">
            {renderNotifications()}
          </div>
        </div>
      )}
    </div>
  );
}

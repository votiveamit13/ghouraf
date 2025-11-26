import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useAuth } from "context/AuthContext";
import { clearUserActiveChat } from "utils/firebaseChatHelper";

export function ActiveChatManager() {
  const location = useLocation();
  const { user } = useAuth();

  useEffect(() => {
    if (!user?._id) return;

    // Check if current path is a messages page
    const isMessagesPage = location.pathname.includes('/user/messages');
    
    if (!isMessagesPage) {
      // User navigated away from messages - clear active chat
      clearUserActiveChat(user._id);
    }
  }, [location.pathname, user?._id]);

  return null;
}
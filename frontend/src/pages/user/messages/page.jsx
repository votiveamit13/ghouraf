import React, { useEffect, useRef, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { AiOutlinePlus } from "react-icons/ai";
import { RiArrowLeftLine } from "react-icons/ri";
import { CiSearch } from "react-icons/ci";
import { GoDotFill } from "react-icons/go";
import { RiDeleteBinLine } from "react-icons/ri";
import { TbSend2 } from "react-icons/tb";
import { useAuth } from "context/AuthContext";
import {
  listenChats,
  listenMessages,
  listenChatMeta,
  sendMessage,
  getChatId,
  setUserActiveChat,
  deleteChat,
  markChatNotificationsAsRead,
  clearUserActiveChat // Add this import
} from "utils/firebaseChatHelper";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "../../../firebase";
import defaultImage from "assets/img/ghouraf/default-avatar.png";
import Loader from "components/common/Loader";
import { MdAddAPhoto } from "react-icons/md";
import { BiSolidVideoPlus } from "react-icons/bi";
import { HiMiniDocumentPlus } from "react-icons/hi2";
import ConfirmationDialog from "components/common/ConfirmationDialog";

export default function Messages() {
  const apiUrl = process.env.REACT_APP_API_URL;
  const { chatId: paramChatId } = useParams();
  const [searchParams] = useSearchParams();
  const receiverIdFromQuery = searchParams.get("receiverId");
  const { user } = useAuth();
  const [chats, setChats] = useState([]);
  const [chatId, setChatId] = useState(paramChatId || null);
  const [receiverId, setReceiverId] = useState(receiverIdFromQuery || null);
  const [messages, setMessages] = useState([]);
  const [chatMeta, setChatMeta] = useState({});
  const [text, setText] = useState("");
  const [userMap, setUserMap] = useState({});
  const [loadingChats, setLoadingChats] = useState(true);
  const [showAttach, setShowAttach] = useState(false);
  const messagesEndRef = useRef(null);
  const [userStatusMap, setUserStatusMap] = useState({});
  const [showConfirm, setShowConfirm] = useState(false);
  const [selectedChatId, setSelectedChatId] = useState(null);
  const photoInputRef = useRef(null);
  const videoInputRef = useRef(null);
  const docInputRef = useRef(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isMobileView, setIsMobileView] = useState(false);
  const [showChatList, setShowChatList] = useState(true);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 768) {
        setIsMobileView(true);
      } else {
        setIsMobileView(false);
        setShowChatList(true);
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    return () => {
      if (user?._id) {
        clearUserActiveChat(user._id);
      }
    };
  }, [user?._id]);

  useEffect(() => {
    if (!user?._id) return;

    const handleVisibilityChange = () => {
      if (document.hidden) {
        clearUserActiveChat(user._id);
      } else if (chatId) {
        setUserActiveChat(user._id, chatId);
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [user?._id, chatId]);

  const filteredChats = chats.filter(chat => {
    const otherUserId = chat.participants.find(uid => uid !== user._id);
    const otherUser = userMap[otherUserId];
    if (!otherUser) return false;

    const fullName = `${otherUser.profile?.firstName || ""} ${otherUser.profile?.lastName || ""}`.toLowerCase();
    return fullName.includes(searchQuery.toLowerCase());
  });

  useEffect(() => {
    setLoadingChats(true);

    const unsubscribe = listenChats(user._id, (fetchedChats) => {
      setChats(fetchedChats);
      setLoadingChats(false);
    });

    return () => {
      unsubscribe && unsubscribe();
    };
  }, [user]);

  useEffect(() => {
    if (!user || chats.length === 0) return;

    const selectChat = async () => {
      if (receiverIdFromQuery) {
        if (!userMap[receiverIdFromQuery]) return;

        let existingChat = chats.find(chat =>
          chat.participants.includes(receiverIdFromQuery)
        );

        if (!existingChat) {
          const newChatId = await getChatId(user._id, receiverIdFromQuery);
          setChatId(newChatId);
          setReceiverId(receiverIdFromQuery);
          await setUserActiveChat(user._id, newChatId);
        } else {
          handleSelectChat(existingChat);
        }
      }
    };

    selectChat();
  }, [chats, user, receiverIdFromQuery, userMap]);

  useEffect(() => {
    if (!chatId) return;

    const unsubscribeMsgs = listenMessages(chatId, setMessages);
    const unsubscribeMeta = listenChatMeta(chatId, setChatMeta);

    return () => {
      unsubscribeMsgs();
      unsubscribeMeta();
    };
  }, [chatId]);

  useEffect(() => {
    if (!chatId || !user?._id) return;

    const markNotificationsAsRead = async () => {
      await markChatNotificationsAsRead(user._id, chatId);
    };

    markNotificationsAsRead();
  }, [chatId, user?._id]);

  useEffect(() => {
    if (!chats || chats.length === 0) return;

    const unsubscribes = chats.map(chat => {
      if (!chat?.participants) return () => { };

      const otherUserId = chat.participants.find(uid => uid !== user._id);
      if (!otherUserId) return () => { };

      const statusRef = doc(db, "userStatus", otherUserId);
      return onSnapshot(statusRef, (docSnap) => {
        if (docSnap.exists()) {
          setUserStatusMap(prev => ({
            ...prev,
            [otherUserId]: docSnap.data().online
          }));
        }
      });
    }).filter(Boolean);

    return () => unsubscribes.forEach(u => u());
  }, [chats, user]);

  useEffect(() => {
    const fetchUsers = async () => {
      const idsToFetch = new Set();
      chats.forEach(chat => {
        chat.participants.forEach(uid => {
          if (uid !== user._id && !userMap[uid]) idsToFetch.add(uid);
        });
      });

      for (const uid of idsToFetch) {
        try {
          const res = await fetch(`${apiUrl}auth/${uid}`);
          const data = await res.json();
          if (data.success) {
            setUserMap(prev => ({ ...prev, [uid]: data.user }));
          }
        } catch (err) {
          console.error("Error fetching user from API:", err);
        }
      }
    };

    if (chats.length > 0) fetchUsers();
  }, [chats, user, userMap, apiUrl]);

  const handleSelectChat = async (chat) => {
    await setUserActiveChat(user._id, chat.id);
    setChatId(chat.id);
    const otherUser = chat.participants.find(uid => uid !== user._id);
    setReceiverId(otherUser);
    if (isMobileView) setShowChatList(false);
  };

  const handleBackToList = async () => {
    setShowChatList(true);
    setChatId(null);
    setReceiverId(null);
    await clearUserActiveChat(user._id);
  };

  const handleSend = async () => {
    if (!text.trim() || !chatId || !receiverId) return;
    await sendMessage(chatId, user._id, receiverId, text, null, null, {
      firstName: user.profile?.firstName,
      lastName: user.profile?.lastName,
      photo: user.profile?.photo,
    });
    setText("");
  };

  useEffect(() => {
    if (!messagesEndRef.current) return;

    messagesEndRef.current.scrollTo({
      top: messagesEndRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages]);

  const handleDeleteClick = (chatId) => {
    setSelectedChatId(chatId);
    setShowConfirm(true);
  };

  const handleConfirmDelete = async () => {
    if (!selectedChatId || !user?._id) return;

    const success = await deleteChat(selectedChatId, user._id);

    if (success) {
      setChats(prev => prev.filter(chat => chat.id !== selectedChatId));

      if (chatId === selectedChatId) {
        setChatId(null);
        setReceiverId(null);
        setMessages([]);
        await clearUserActiveChat(user._id);
      }
    }

    setShowConfirm(false);
    setSelectedChatId(null);
  };

  const handleCancelDelete = () => {
    setShowConfirm(false);
    setSelectedChatId(null);
  };

  const handleFileSelect = async (e, type) => {
    const file = e.target.files[0];
    if (!file || !chatId || !receiverId) return;

    await sendMessage(chatId, user._id, receiverId, "", file, type, {
      firstName: user.profile?.firstName,
      lastName: user.profile?.lastName,
      photo: user.profile?.photo,
    });
    setShowAttach(false);
  };

  return (
    <div className="container user-layout">
      {loadingChats ? (
        <div className="h-[600px]">
          <Loader fullScreen={true} />
        </div>
      ) : (
        <div className="mt-5 mb-8 h-[550px] w-full bg-white flex border rounded-lg shadow-sm">
          {/* Left panel */}
          <div className={`border-r flex flex-col w-full md:w-1/4 transition-all duration-300
              ${isMobileView ? (showChatList ? "block" : "hidden") : "block"}`}>
            <div className="p-3 border-b">
              <h1 className="mb-3 text-black font-semibold text-[20px]">
                Messages
              </h1>
              <div className="relative w-full">
                <input
                  type="text"
                  placeholder="Search"
                  className="w-full px-3 py-2 pr-10 rounded-[5px] border-[1px] border-[#A1A1A1] text-sm bg-white"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <CiSearch
                  size={25}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-black"
                />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto no-scrollbar">
              {filteredChats.map((chat) => {
                const otherUserId = chat.participants.find(uid => uid !== user._id);
                const unread = chat.unreadCount?.[user._id] || 0;
                const otherUser = userMap[otherUserId];

                return (
                  <div
                    key={chat.id}
                    onClick={() => handleSelectChat(chat)}
                    className={`flex items-center gap-3 px-4 py-3 cursor-pointer ${chat.id === chatId ? "bg-black" : ""}`}
                  >
                    <div className="relative">
                      <img
                        src={otherUser?.profile?.photo || defaultImage}
                        alt={otherUser?.firstName || "User"}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                      <GoDotFill
                        fill={userStatusMap[otherUserId] ? "#27C200" : "#A1A1A1"}
                        className="absolute right-[-3px] bottom-[-4px]"
                      />
                    </div>
                    <div className={`flex-1`}>
                      <h4 className={`text-sm font-medium ${chat.id === chatId ? "text-white" : ""}`}>
                        {otherUser?.profile?.firstName || "User"} {otherUser?.profile?.lastName || ""}
                      </h4>
                      <p className="text-xs truncate w-40 text-gray-500">{chat.lastMessage}</p>
                    </div>
                    <span className="text-xs text-gray-400">{unread > 0 ? unread : ""}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right panel */}
          <div className={`flex-1 flex flex-col w-full transition-all duration-300
              ${isMobileView ? (showChatList ? "hidden" : "block") : "block"}`}>
            {chatId && receiverId ? (
              <>
                <div className="flex justify-between items-center px-3 border-b">
                  <div className="flex items-center py-3">
                    {isMobileView && (
                      <RiArrowLeftLine
                        size={25}
                        className="mr-3 cursor-pointer text-black"
                        onClick={handleBackToList}
                      />
                    )}
                    <img
                      src={userMap[receiverId]?.profile?.photo || defaultImage}
                      alt="Receiver"
                      className="w-10 h-10 rounded-full mr-3 object-cover"
                    />
                    <div>
                      <h3 className="font-medium text-gray-800">
                        {userMap[receiverId]?.profile?.firstName || "User"} {userMap[receiverId]?.profile?.lastName || ""}
                      </h3>
                      <p className="text-xs text-[#636A80] flex items-center gap-1">
                        <GoDotFill
                          size={20}
                          fill={userStatusMap[receiverId] ? "#27C200" : "#A1A1A1"}
                        />
                        {userStatusMap[receiverId] ? "Active Now" : "Offline"}
                      </p>
                    </div>
                  </div>
                  <div>
                    <RiDeleteBinLine size={25} fill="black"
                      className="text-red-500 cursor-pointer"
                      onClick={() => handleDeleteClick(chatId)}
                    />
                  </div>
                </div>

                <ConfirmationDialog
                  show={showConfirm}
                  title="Delete Chat"
                  message="Are you sure you want to delete this chat?"
                  onConfirm={handleConfirmDelete}
                  onCancel={handleCancelDelete}
                />

                <div className="flex-1 overflow-y-auto no-scrollbar px-3 py-2 space-y-6 bg-gray-50"
                  ref={messagesEndRef}
                >
                  {messages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`flex items-start gap-3 ${msg.senderId === user._id ? "justify-end" : ""}`}
                    >
                      {msg.senderId !== user._id && (
                        <img
                          src={userMap[msg.senderId]?.profile?.photo || defaultImage}
                          alt="Sender"
                          className="w-8 h-8 rounded-full object-cover"
                        />
                      )}
                      <div className={msg.senderId === user._id ? "text-right" : ""}>
                        <div className={`px-3 py-1 rounded-lg text-sm max-w-md ${msg.senderId === user._id ? "bg-[#F3F6FF] text-gray-800" : "bg-[#D7D7D740] text-gray-700"}`}>
                          <p className="font-semibold">{msg.senderId === user._id ? "You" : userMap[msg.senderId]?.profile?.firstName || "User"}</p>
                          {msg.fileType === "image" && (
                            <img src={msg.fileUrl} alt="Attachment" className="max-w-[250px] rounded-md mt-2 object-cover" />
                          )}
                          {msg.fileType === "video" && (
                            <video src={msg.fileUrl} controls className="max-w-[250px] rounded-md mt-2" />
                          )}
                          {msg.fileType === "document" && (
                            <a
                              href={msg.fileUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 underline mt-2 inline-block"
                            >
                              View Document
                            </a>
                          )}
                          <p className="leading-[20px]">{msg.text}</p>
                        </div>
                        <span className="text-xs text-gray-400">
                          {msg.timestamp?.toDate &&
                            msg.timestamp.toDate().toLocaleString([], {
                              day: "2-digit",
                              month: "short",
                              year: "numeric",
                              hour: "numeric",
                              minute: "2-digit",
                              hour12: true,
                            })
                          }
                        </span>

                      </div>
                      {msg.senderId === user._id && (
                        <img
                          src={user.profile?.photo || defaultImage}
                          alt="You"
                          className="w-8 h-8 rounded-full object-cover"
                        />
                      )}
                    </div>
                  ))}
                </div>

                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSend();
                  }}
                  className="flex items-center border-t p-3 gap-2"
                >
                  <div className="relative flex-1">
                    <AiOutlinePlus
                      size={30}
                      onClick={() => setShowAttach(!showAttach)}
                      className="absolute left-0 top-1/2 -translate-y-1/2 text-gray-400 cursor-pointer"
                    />

                    {showAttach && (
                      <div className="absolute bottom-12 left-0 bg-white shadow-md rounded-md z-10 w-40">
                        <button
                          type="button"
                          className="w-full text-left px-3 py-2 hover:bg-gray-100 flex items-center gap-2"
                          onClick={() => photoInputRef.current.click()}
                        >
                          <MdAddAPhoto size={20} />Photos
                        </button>
                        <button
                          type="button"
                          className="w-full text-left px-3 py-2 hover:bg-gray-100 flex items-center gap-2"
                          onClick={() => videoInputRef.current.click()}
                        >
                          <BiSolidVideoPlus size={20} />Videos
                        </button>
                        <button
                          type="button"
                          className="w-full text-left px-3 py-2 hover:bg-gray-100 flex items-center gap-2"
                          onClick={() => docInputRef.current.click()}
                        >
                          <HiMiniDocumentPlus size={20} />Document
                        </button>
                      </div>
                    )}

                    <input
                      type="file"
                      accept="image/*"
                      ref={photoInputRef}
                      onChange={(e) => handleFileSelect(e, "image")}
                      style={{ display: "none" }}
                    />
                    <input
                      type="file"
                      accept="video/*"
                      ref={videoInputRef}
                      onChange={(e) => handleFileSelect(e, "video")}
                      style={{ display: "none" }}
                    />
                    <input
                      type="file"
                      accept=".pdf,.doc,.docx,.xls,.xlsx,.txt"
                      ref={docInputRef}
                      onChange={(e) => handleFileSelect(e, "document")}
                      style={{ display: "none" }}
                    />

                    <input
                      type="text"
                      placeholder="Type your message..."
                      value={text}
                      onChange={(e) => setText(e.target.value)}
                      className="w-full pl-[35px] pr-4 py-2 text-[15px]"
                    />
                  </div>
                  <button
                    type="submit"
                    className="bg-black text-white px-3 py-2 rounded-[5px] flex items-center justify-center"
                  >
                    <TbSend2 size={28} />
                  </button>
                </form>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center text-gray-500">
                {isMobileView ? "Select a chat to start messaging" : "Select a chat to start messaging"}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
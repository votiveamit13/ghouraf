import { db } from "../firebase";
import { collection, query, where, addDoc, orderBy, onSnapshot, doc, setDoc, increment, updateDoc, serverTimestamp, getDocs, deleteDoc } from "firebase/firestore";

export const getChatId = async (userId1, userId2) => {
  const chatsRef = collection(db, "chats");
  const q = query(chatsRef, where("participants", "array-contains", userId1));
  const snapshot = await getDocs(q);

  let chatDoc = null;
  snapshot.forEach((doc) => {
    const data = doc.data();
    if (data.participants.includes(userId2)) {
      chatDoc = doc;
    }
  });

  if (chatDoc) return chatDoc.id; 

  const newChat = await addDoc(chatsRef, {
  participants: [userId1, userId2],
  lastMessage: "",
  lastMessageTime: serverTimestamp(),
  unreadCount: { [userId1]: 0, [userId2]: 0 },
  createdAt: serverTimestamp(),
});


  return newChat.id;
};

export const sendMessage = async (chatId, senderId, receiverId, text) => {
  const messagesRef = collection(db, "messages", chatId, "chatMessages");
  await addDoc(messagesRef, {
    senderId,
    receiverId,
    text,
    timestamp: serverTimestamp(),
    read: false
  });

  const chatRef = doc(db, "chats", chatId);
await updateDoc(chatRef, {
  lastMessage: text,
  lastMessageTime: serverTimestamp(),
  [`unreadCount.${receiverId}`]: increment(1),
});
};

export const listenMessages = (chatId, callback) => {
  const messagesRef = collection(db, "messages", chatId, "chatMessages");
  const q = query(messagesRef, orderBy("timestamp", "asc"));
  return onSnapshot(q, (snapshot) => {
    const msgs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    callback(msgs);
  });
};

export const listenChatMeta = (chatId, callback) => {
  const chatDocRef = doc(db, "chats", chatId);
  return onSnapshot(chatDocRef, (docSnap) => {
    if (docSnap.exists()) callback(docSnap.data());
  });
};

export const listenChats = (userId, callback) => {
  // console.log("listenChats called with userId =", userId);

  const q = query(
    collection(db, "chats"),
    where("participants", "array-contains", userId)
  );

  return onSnapshot(
    q,
    (snapshot) => {
      // console.log("listenChats snapshot.size =", snapshot.size);
      const chats = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
      // console.log("listenChats docs:", chats);
      callback(chats);
    },
    (error) => {
      console.error("listenChats onSnapshot error:", error);
    }
  );
};

export const setUserOnlineStatus = async (userId, isOnline) => {
  const statusRef = doc(db, "userStatus", userId);
  await setDoc(statusRef, {
    online: isOnline,
    lastSeen: serverTimestamp()
  }, { merge: true });
};

export const deleteChat = async (chatId) => {
  try {
    const messagesRef = collection(db, "chats", chatId, "messages");
    const messagesSnapshot = await getDocs(messagesRef);
    const deletePromises = messagesSnapshot.docs.map(msg => deleteDoc(doc(db, "chats", chatId, "messages", msg.id)));
    await Promise.all(deletePromises);

    await deleteDoc(doc(db, "chats", chatId));

    console.log("Chat deleted successfully!");
    return true;
  } catch (err) {
    console.error("Failed to delete chat:", err);
    return false;
  }
};

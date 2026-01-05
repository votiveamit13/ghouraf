import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { db, storage } from "../firebase";
import { collection, query, where, addDoc, orderBy, onSnapshot, doc, setDoc, increment, updateDoc, serverTimestamp, getDocs, deleteDoc, getDoc, arrayUnion } from "firebase/firestore";

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

export const sendMessage = async (chatId, senderId, receiverId, text, file = null, fileType = null, senderProfile = {}) => {
  let fileUrl = null;

  if (file) {
    const fileRef = ref(storage, `chats/${chatId}/${Date.now()}_${file.name}`);
    await uploadBytes(fileRef, file);
    fileUrl = await getDownloadURL(fileRef);
  }

  const messagesRef = collection(db, "messages", chatId, "chatMessages");
  await addDoc(messagesRef, {
    senderId,
    receiverId,
    text: text || "",
    timestamp: serverTimestamp(),
    read: false,
    fileUrl: fileUrl || null,
    fileType: fileType || null,
  });

  const statusRef = doc(db, "userStatus", receiverId);
  const statusSnap = await getDoc(statusRef);
  
  const chatRef = doc(db, "chats", chatId);
  
  // Only increment unread count if receiver is NOT viewing this chat
  if (statusSnap.exists()) {
    const { currentChat } = statusSnap.data();
    
    if (currentChat === chatId) {
      // Receiver is viewing this chat - update last message but don't increment unread count
      await updateDoc(chatRef, {
        lastMessage: text || (fileType ? `${fileType} sent` : ""),
        lastMessageTime: serverTimestamp(),
        timestamp: serverTimestamp(), 
        deletedFor: [],
      });
      return; // Exit early, no notification needed
    }
  }

  // Receiver is NOT viewing this chat - increment unread count and send notification
  await updateDoc(chatRef, {
    lastMessage: text || (fileType ? `${fileType} sent` : ""),
    lastMessageTime: serverTimestamp(),
    timestamp: serverTimestamp(), 
    [`unreadCount.${receiverId}`]: increment(1),
    deletedFor: [],
  });

  const notificationsRef = collection(db, "notifications");
  const existingNotifQuery = query(
    notificationsRef,
    where("userId", "==", receiverId),
    where("senderId", "==", senderId),
    where("chatId", "==", chatId),
    where("read", "==", false)
  );

  const existingNotifSnapshot = await getDocs(existingNotifQuery);

  if (!existingNotifSnapshot.empty) {
    const existingNotif = existingNotifSnapshot.docs[0];
    await updateDoc(doc(db, "notifications", existingNotif.id), {
      text: text || (fileType ? `${fileType} sent` : ""),
      title: `New message from ${senderProfile.firstName || "User"}`,
      body: text || (fileType ? `${fileType} sent` : ""),
      createdAt: serverTimestamp(),
    });
  } else {
    await addDoc(notificationsRef, {
      userId: receiverId,
      senderId,
      chatId,
      title: `New message from ${senderProfile.firstName || "User"}`,
      body: text || (fileType ? `${fileType} sent` : ""),
      meta: {
        firstName: senderProfile.firstName || "",
        lastName: senderProfile.lastName || "",
        photo: senderProfile.photo || "",
      },
      read: false,
      createdAt: serverTimestamp(),
    });
  }
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

 return onSnapshot(q, async (snapshot) => {
          const updates = [];

    snapshot.docs.forEach((docSnap) => {
      const data = docSnap.data();
      if (!data.lastMessageTime) {
        updates.push(
          updateDoc(docSnap.ref, { lastMessageTime: data.createdAt || serverTimestamp() })
        );
      }
    });

    if (updates.length > 0) await Promise.all(updates);
      // console.log("listenChats snapshot.size =", snapshot.size);
      const chats = snapshot.docs
        .map((d) => ({ id: d.id, ...d.data() }))
        .filter((chat) => !chat.deletedFor?.includes(userId));
      // console.log("listenChats docs:", chats);
      const sorted = chats.sort((a, b) => {
      const timeA = a.lastMessageTime?.toMillis?.() || 0;
      const timeB = b.lastMessageTime?.toMillis?.() || 0;
      return timeB - timeA;
    });

    callback(sorted);
  });
};

export const setUserOnlineStatus = async (userId) => {
  if (!userId) return;

  const statusRef = doc(db, "userStatus", userId);

  await setDoc(
    statusRef,
    {
      online: true,
      lastSeen: serverTimestamp()
    },
    { merge: true }
  );
};

export const deleteChat = async (chatId, userId) => {
  try {
    const chatRef = doc(db, "chats", chatId);
    const chatSnap = await getDoc(chatRef);

    if (!chatSnap.exists()) {
      console.warn("Chat not found");
      return false;
    }

    const chatData = chatSnap.data();
    const deletedFor = chatData.deletedFor || [];

    if (deletedFor.includes(userId)) return true;

    await updateDoc(chatRef, {
      deletedFor: arrayUnion(userId),
    });

    const allDeleted = chatData.participants.every(u =>
      [...deletedFor, userId].includes(u)
    );

    if (allDeleted) {
      const messagesRef = collection(db, "messages", chatId, "chatMessages");
      const messagesSnapshot = await getDocs(messagesRef);
      const deletePromises = messagesSnapshot.docs.map(msg =>
        deleteDoc(doc(db, "messages", chatId, "chatMessages", msg.id))
      );
      await Promise.all(deletePromises);

      await deleteDoc(chatRef);

      console.log("Chat & all messages permanently deleted!");
    } else {
      console.log("Chat hidden for current user only");
    }

    return true;
  } catch (err) {
    console.error("Failed to delete chat:", err);
    return false;
  }
};

export const setUserActiveChat = async (userId, chatId) => {
  const statusRef = doc(db, "userStatus", userId);
  await setDoc(
    statusRef,
    {
      currentChat: chatId || null,
    },
    { merge: true }
  );

  // Only mark notifications as read if user is actively viewing a chat
  if (chatId) {
    await markChatNotificationsAsRead(userId, chatId);
  }
};

export const markChatNotificationsAsRead = async (userId, chatId) => {
  try {
    const notificationsRef = collection(db, "notifications");
    const unreadNotifsQuery = query(
      notificationsRef,
      where("userId", "==", userId),
      where("chatId", "==", chatId),
      where("read", "==", false)
    );

    const unreadNotifsSnapshot = await getDocs(unreadNotifsQuery);
    
    const markAsReadPromises = unreadNotifsSnapshot.docs.map(docSnap =>
      updateDoc(doc(db, "notifications", docSnap.id), { read: true })
    );

    await Promise.all(markAsReadPromises);

    // Reset unread count for this chat
    const chatRef = doc(db, "chats", chatId);
    await updateDoc(chatRef, {
      [`unreadCount.${userId}`]: 0
    });
  } catch (error) {
    console.error("Error marking chat notifications as read:", error);
  }
};

export const markMessageAsRead = async (messageId, chatId, userId) => {
  try {
    const messageRef = doc(db, "messages", chatId, "chatMessages", messageId);
    await updateDoc(messageRef, {
      read: true
    });

    // Also update the unread count
    const chatRef = doc(db, "chats", chatId);
    await updateDoc(chatRef, {
      [`unreadCount.${userId}`]: increment(-1)
    });
  } catch (error) {
    console.error("Error marking message as read:", error);
  }
};

// Add this function to your existing firebaseChatHelper.js
export const clearUserActiveChat = async (userId) => {
  try {
    const statusRef = doc(db, "userStatus", userId);
    await setDoc(
      statusRef,
      {
        currentChat: null,
      },
      { merge: true }
    );
    console.log(`Cleared active chat for user: ${userId}`);
  } catch (error) {
    console.error("Error clearing active chat:", error);
  }
};
import { dbAdmin } from "../config/firebase.mjs";
import User from "../models/User.mjs";

export const sendNotification = async (req, res) => {
  try {
    const { userId, senderId, title, body } = req.body;

    if (!userId || !senderId || !title || !body)
      return res.status(400).json({ error: "Missing required fields" });

    const sender = await User.findById(senderId).select("profile.firstName profile.lastName profile.photo");
    const senderMeta = sender
      ? {
          firstName: sender.profile?.firstName || "",
          lastName: sender.profile?.lastName || "",
          photo: sender.profile?.photo || "",
        }
      : {};

    await dbAdmin.collection("notifications").add({
      userId,
      senderId,
      title,
      body,
      meta: senderMeta,
      read: false,
      createdAt: new Date(),
    });

    res.status(200).json({ success: true, message: "Notification sent" });
  } catch (err) {
    console.error("Error sending notification:", err);
    res.status(500).json({ error: "Failed to send notification" });
  }
};

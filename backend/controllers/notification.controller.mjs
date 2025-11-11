// import { dbAdmin, messagingAdmin } from "../config/firebase.mjs";

// export const sendNotification = async (req, res) => {
//   try {
//     const { userId, title, body } = req.body;

//     if (!userId || !title || !body)
//       return res.status(400).json({ error: "Missing required fields" });

//     await dbAdmin
//       .collection("notifications")
//       .doc(userId)
//       .collection("items")
//       .add({
//         title,
//         body,
//         createdAt: new Date(),
//         read: false,
//       });

//     res.status(200).json({ success: true, message: "Notification sent" });
//   } catch (err) {
//     console.error("Error sending notification:", err);
//     res.status(500).json({ error: "Failed to send notification" });
//   }
// };

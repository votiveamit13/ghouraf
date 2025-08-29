import { authAdmin } from "../config/firebase.mjs";
import User from "../models/User.mjs";

export const auth = async (req, res, next) => {
  try {
    const hdr = req.headers.authorization || "";
    const token = hdr.startsWith("Bearer ") ? hdr.slice(7) : null;
    if (!token) return res.status(401).json({ message: "Missing bearer token" });

    const decoded = await authAdmin.verifyIdToken(token);

    const user = await User.findOne({ firebaseUid: decoded.uid });
    if (!user) return res.status(404).json({ message: "User profile not found" });

    if (user.status === "inactive") {
      return res.status(403).json({
        message: "Your account has banned. Contact support.",
        inactive: true,
      });
    }

    req.user = user;
    req.firebase = decoded;
    next();
  } catch (err) {
    console.error("Auth error:", err);
    return res.status(401).json({ message: "Unauthorized", error: err.message });
  }
};

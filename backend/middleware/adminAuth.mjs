import jwt from "jsonwebtoken";
import User from "../models/User.mjs";

export const adminAuth = async (req, res, next) => {
    try {
        const hdr = req.headers.authorization || "";
        const token = hdr.startsWith("Bearer") ? hdr.slice(7) : null;
        if(!token) return res.status(401).json({message: "Missing Bearer Token"});

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const admin = await User.findById(decoded.id);
        if (!admin || !admin.isAdmin) {
            return res.status(403).json({message: "Access denied: Admins Only"});
        }

        req.admin = admin;
        next();
    } catch (err) {
        console.error("Admin auth error:", err);
    return res.status(401).json({ message: "Unauthorized", error: err.message });
    }
}
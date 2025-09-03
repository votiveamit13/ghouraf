import express from "express";
import { login, getAllUsers, updateUserStatus, updateUserDetails, deleteUser, getAllMessage, deleteMessage } from "../controllers/admin/admin.controller.mjs";
import { adminAuth } from "../middleware/adminAuth.mjs";
import { upload } from "../middleware/upload.mjs";

const router = express.Router();

router.post("/login", login);
router.get("/users", adminAuth, getAllUsers);
router.patch("/users/:id/status", adminAuth, updateUserStatus);
router.patch("/users/:id", adminAuth, upload.single("photo"), updateUserDetails);
router.delete("/user/:id", adminAuth, deleteUser);
router.get("/messages", adminAuth, getAllMessage);
router.delete("/message/:id", adminAuth, deleteMessage);

export default router;

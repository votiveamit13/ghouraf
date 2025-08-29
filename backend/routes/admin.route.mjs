import express from "express";
import { login, getAllUsers, updateUserStatus } from "../controllers/admin/admin.controller.mjs";
import { adminAuth } from "../middleware/adminAuth.mjs";

const router = express.Router();

router.post("/login", login);
router.get("/users", adminAuth, getAllUsers);
router.patch("/users/:id/status", adminAuth, updateUserStatus);

export default router;

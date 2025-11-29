import express from "express";
import { sendChatEmail } from "../controllers/chatEmail.controller.mjs";

const router = express.Router();

router.post("/chat-message", sendChatEmail);

export default router;

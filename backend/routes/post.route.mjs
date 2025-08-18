import express from "express";
import { create } from "../controllers/post.controller.mjs";
import { auth } from "../middleware/auth.mjs";

const router = express.Router();



router.post("/", auth, create);

export default router
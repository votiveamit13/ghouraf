import express from "express";
import { login } from "../controllers/admin/admin.controller.mjs";


const router = express.Router();

router.post("/login", login);

export default router;

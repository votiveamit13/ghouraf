import express from "express";
import { login } from "../controllers/admin.controller.mjs";
import { loginValidation } from "../validations/login.request.mjs";

const router = express.Router();

router.post("/login", loginValidation, login);

export default router;

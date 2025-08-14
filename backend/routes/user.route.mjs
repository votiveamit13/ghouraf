import express from "express";
import { signup } from "../controllers/auth.controller.mjs";
import { signupValidation } from "../validations/signup.request.mjs";

const router = express.Router();

router.post("/signup", signupValidation, signup);

export default router;

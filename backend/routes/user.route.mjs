import express from "express";
import { signup, login, updateProfile, getProfile, resendVerificationEmail, getUserById } from "../controllers/auth.controller.mjs";

import postRoutes from "./post.route.mjs";
import { auth } from "../middleware/auth.mjs";
import { signupValidator } from "../validations/signup.request.mjs";
import { validate } from "../middleware/validate.mjs";
import { loginValidator } from "../validations/login.request.mjs";
import { upload } from "../middleware/upload.mjs";

const router = express.Router();

router.post("/auth/register", validate(signupValidator), signup);

router.post("/auth/login", validate(loginValidator), login);

router.post("/auth/resend-verification", resendVerificationEmail);

router.put("/auth/profile", auth, upload.single("photo"), updateProfile);

router.get("/auth/me", auth, getProfile);

router.get("/auth/:id", getUserById);

router.use("/posts", postRoutes)

export default router;

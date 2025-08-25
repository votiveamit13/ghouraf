import express from "express";
import { signup, login, updateProfile, getProfile, resendVerificationEmail } from "../controllers/auth.controller.mjs";

import postRoutes from "./post.route.mjs";
import { auth } from "../middleware/auth.mjs";
import { signupValidator } from "../validations/signup.request.mjs";
import { validate } from "../middleware/validate.mjs";
import { loginValidator } from "../validations/login.request.mjs";

const router = express.Router();

router.post("/auth/register", validate(signupValidator), signup);

router.post("/auth/login", validate(loginValidator), login);

router.post("/auth/resend-verification", (req, res, next) => next(), resendVerificationEmail);

router.put("/auth/profile", auth, updateProfile);

router.get("/auth/me", auth, getProfile);


router.use("/posts", postRoutes)

export default router;

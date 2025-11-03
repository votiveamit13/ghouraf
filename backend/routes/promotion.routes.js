import express from "express";
import {
  createPromotionCheckout,
  handleStripeWebhook,
} from "../controllers/promotion.controller.js";
import { auth } from "../middleware/auth.mjs";


const router = express.Router();

router.post("/create-promotion-session", auth, createPromotionCheckout);

router.post(
  "/stripe/webhooks",
  express.raw({ type: "application/json" }),
  handleStripeWebhook
);

export default router;

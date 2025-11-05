import express from "express";
import {
  createPromotionCheckout,
  handleStripeWebhook,
} from "../controllers/promotion.controller.mjs";
import { auth } from "../middleware/auth.mjs";


const router = express.Router();

router.post("/create-promotion-session", auth, createPromotionCheckout);

router.post("/", handleStripeWebhook);

export default router;

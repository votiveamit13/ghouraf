import express from "express";
import Stripe from "stripe";
import Space from "../models/Space.mjs";

const router = express.Router();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

router.post(
  "/webhook",
  express.raw({ type: "application/json" }),
  async (req, res) => {
    const sig = req.headers["stripe-signature"];

    let event;
    try {
      event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
    } catch (err) {
      console.error("⚠️ Stripe webhook signature verification failed:", err.message);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    if (event.type === "payment_intent.succeeded") {
      const paymentIntent = event.data.object;
      const { spaceId, planId, durationDays } = paymentIntent.metadata;

      try {
        const startDate = new Date();
        const endDate = new Date();
        endDate.setDate(startDate.getDate() + Number(durationDays || 30));

        await Space.findByIdAndUpdate(
          spaceId,
          {
            $set: {
              "promotion.isPromoted": true,
              "promotion.plan": planId,
              "promotion.amountUSD": paymentIntent.amount / 100,
              "promotion.paymentStatus": "success",
              "promotion.paymentId": paymentIntent.id,
              "promotion.startDate": startDate,
              "promotion.endDate": endDate,
            },
            $inc: {
              "promotion.promotionCount": 1, // ✅ FIX
            },
          },
          { new: true }
        );

        console.log(`✅ Promotion updated for space ${spaceId}`);
      } catch (error) {
        console.error("❌ Error updating promoted space:", error);
      }
    }

    res.status(200).json({ received: true });
  }
);

export default router;

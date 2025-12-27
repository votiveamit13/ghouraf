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

    // Handle payment_intent.succeeded
    if (event.type === "payment_intent.succeeded") {
      const paymentIntent = event.data.object;
      const { spaceId, planId, durationDays } = paymentIntent.metadata;

      try {
        const space = await Space.findById(spaceId);
        if (!space) throw new Error(`Space not found: ${spaceId}`);

        const startDate = new Date();
        const endDate = new Date();
        endDate.setDate(startDate.getDate() + Number(durationDays || 30)); // default 30 days

        space.promotion = {
          isPromoted: true,
          plan: planId,
          amountUSD: paymentIntent.amount / 100,
          paymentStatus: "success",
          paymentId: paymentIntent.id,
          startDate,
          endDate,
        };

        await space.save();
        console.log(`✅ Promotion updated for space ${spaceId} after successful payment`);
      } catch (error) {
        console.error("❌ Error updating promoted space:", error);
      }
    } else {
      console.log(`⚠️ Unhandled event type: ${event.type}`);
    }

    res.status(200).json({ received: true });
  }
);

export default router;

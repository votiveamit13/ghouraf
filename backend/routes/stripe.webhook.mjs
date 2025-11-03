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
      const { userId, plan, spaceData } = paymentIntent.metadata;

      try {
        const parsedData = JSON.parse(spaceData);

        const days = plan === "30_days" ? 30 : 10;
        const startDate = new Date();
        const endDate = new Date();
        endDate.setDate(startDate.getDate() + days);

        const space = new Space({
          user: userId,
          ...parsedData,
          promotion: {
            isPromoted: true,
            plan,
            amountUSD: paymentIntent.amount / 100,
            paymentStatus: "success",
            paymentId: paymentIntent.id,
            startDate,
            endDate,
          },
          status: "inactive",
        });

        await space.save();
        console.log("✅ Promoted space created successfully after payment");
      } catch (error) {
        console.error("❌ Error creating promoted space:", error);
      }
    } else {
      console.log(`⚠️ Unhandled event type: ${event.type}`);
    }

    res.status(200).json({ received: true });
  }
);

export default router;

import express from "express";
import Stripe from "stripe";
import Space from "../models/Space.mjs";
import SpaceWanted from "../models/SpaceWanted.mjs";
import TeamUp from "../models/TeamUp.mjs";

const router = express.Router();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

const PLAN_PRICES = {
  "10_days": 1500,
  "30_days": 2000,
};

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

router.post("/create-promotion-payment", async (req, res) => {
  try {
     const userId = req.user?._id;
    const { plan, adData } = req.body;

    if (!PLAN_PRICES[plan]) {
      return res.status(400).json({ message: "Invalid plan selected" });
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: PLAN_PRICES[plan],
      currency: "usd",
      metadata: {
        userId,
        plan,
        spaceData: JSON.stringify(adData),
      },
      automatic_payment_methods: { enabled: true },
    });

    res.json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
    });
  } catch (error) {
    console.error("Error creating promotion payment:", error);
    res.status(500).json({ message: "Payment creation failed", error: error.message });
  }
});


export default router;

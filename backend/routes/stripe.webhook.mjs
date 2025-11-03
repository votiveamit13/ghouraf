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

router.post("/create-promotion-payment", express.json(), async (req, res) => {
  try {
    const userId = req.user._id;
    const { plan, adData } = req.body;

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: `Promote ${adData.title}`,
            },
            unit_amount: plan === "30_days" ? 3000 : 1000,
          },
          quantity: 1,
        },
      ],
      metadata: {
        userId: userId.toString(),
        plan,
        adId: adData._id.toString(),
        postCategory: adData.postCategory,
      },
      success_url: `${process.env.CLIENT_URL}/promotion-success`,
      cancel_url: `${process.env.CLIENT_URL}/promotion-failed`,
    });

    res.json({ id: session.id, url: session.url });
  } catch (err) {
    console.error("Payment creation failed:", err);
    res
      .status(500)
      .json({ message: "Payment creation failed", error: err.message });
  }
});


export default router;

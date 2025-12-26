import Stripe from "stripe";
import Space from "../models/Space.mjs";
import SpaceWanted from "../models/SpaceWanted.mjs";
import TeamUp from "../models/TeamUp.mjs";
import PromotionOption from "../models/PromotionOption.mjs";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const modelMap = {
  Space: Space,
  Spacewanted: SpaceWanted,
  Teamup: TeamUp,
};

export const createPromotionCheckout = async (req, res) => {
  try {
    const { adId, plan, postCategory } = req.body;
    const userId = req.user._id;

    if (!adId || !plan || !postCategory)
      return res.status(400).json({ message: "Missing required fields" });

    const Model = modelMap[postCategory];
    if (!Model) return res.status(400).json({ message: "Invalid post category" });

    const ad = await Model.findById(adId);
    if (!ad) return res.status(404).json({ message: "Ad not found" });

    if (
      ad.promotion?.isPromoted &&
      ad.promotion?.endDate &&
      new Date(ad.promotion.endDate) > new Date()
    ) {
      return res.status(400).json({
        message: `This post is already promoted until ${new Date(
          ad.promotion.endDate
        ).toLocaleDateString()}`,
      });
    }

    const promotionPlan = await PromotionOption.findById(plan);
if (!promotionPlan) {
  return res.status(400).json({ message: "Invalid promotion plan" });
}

const amountUSD = promotionPlan.amountUSD;
const durationDays = promotionPlan.plan;


    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: `Promote ${postCategory} Ad (${durationDays} days)`
            },

            unit_amount: amountUSD * 100,
          },
          quantity: 1,
        },
      ],
      metadata: {
        adId,
        postCategory,
        planDays: promotionPlan.plan.toString(),
        amountUSD: promotionPlan.amountUSD.toString(),
        userId: userId.toString(),
      }
      success_url: `${process.env.FRONTEND_URL}/user/my-ads?payment=success`,
      cancel_url: `${process.env.FRONTEND_URL}/user/my-ads?payment=cancel`,
    });

    ad.promotion = {
      ...ad.promotion,
      isPromoted: false,
      plan: `${promotionPlan.plan}_days`,
      amountUSD,
      paymentStatus: "pending",
    };

    await ad.save();

    res.json({ id: session.id, url: session.url });
  } catch (error) {
    console.error("Stripe checkout error:", error);
    res.status(500).json({ message: "Payment initiation failed", error: error.message });
  }
};

export const handleStripeWebhook = async (req, res) => {
  const sig = req.headers["stripe-signature"];
  let event;

  try {
  event = stripe.webhooks.constructEvent(
    req.rawBody || req.body,
    sig,
    process.env.STRIPE_PROMOTION_WEBHOOK_SECRET
  );

  } catch (err) {
    console.error("⚠️  Webhook signature verification failed.", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    const { adId, postCategory, durationDays, amountUSD } = session.metadata;

    const Model = modelMap[postCategory];
    if (!Model) return res.status(400).send("Invalid post category in metadata");

    const ad = await Model.findById(adId);
    if (!ad) return res.status(404).send("Ad not found");

    const startDate = new Date();
const endDate = new Date(startDate);
endDate.setDate(startDate.getDate() + Number(durationDays));

    ad.promotion.promotionCount =
      (ad.promotion.promotionCount || 0) + 1;

    ad.promotion = {
      ...ad.promotion,
      isPromoted: true,
      plan: `${durationDays}_days`,
      amountUSD: parseFloat(amountUSD),
      paymentStatus: "success",
      paymentId: session.payment_intent,
      startDate,
      endDate,
    };

    await ad.save();

    console.log(`Promotion activated for Ad ${ad._id}`);
  }

  if (event.type === "checkout.session.expired" || event.type === "checkout.session.async_payment_failed") {
    const session = event.data.object;
    const { adId, postCategory } = session.metadata;

    const Model = modelMap[postCategory];
    if (!Model) return;

    const ad = await Model.findById(adId);
    if (ad) {
      ad.promotion.paymentStatus = "failed";
      ad.promotion.isPromoted = false;
      await ad.save();
    }
  }

  res.json({ received: true });
};

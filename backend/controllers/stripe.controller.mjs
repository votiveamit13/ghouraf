import Stripe from "stripe";


const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const createPromotionSession = async (req, res) => {
  try {
    const { id } = req.params;
    const { days } = req.body;
    const price = days === 10 ? 1500 : 2000;

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: `Promote Space Ad - ${days} Days`,
            },
            unit_amount: price,
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${process.env.CLIENT_URL}/payment-success?spaceId=${id}&days=${days}`,
      cancel_url: `${process.env.CLIENT_URL}/payment-cancel`,
    });

    res.json({ url: session.url });
  } catch (err) {
    console.error("Stripe session error:", err);
    res.status(500).json({ message: "Failed to create Stripe session" });
  }
};

export const markSpacePromoted = async (req, res) => {
  try {
    const { spaceId, days } = req.query;

    const promotedUntil = new Date();
    promotedUntil.setDate(promotedUntil.getDate() + Number(days));

    await Space.findByIdAndUpdate(spaceId, {
      isPromoted: true,
      promotionDays: Number(days),
      promotedUntil,
      promotedAt: new Date(),
    });

    res.redirect(`${process.env.CLIENT_URL}/promotion-success`);
  } catch (err) {
    console.error("Promotion update error:", err);
    res.status(500).json({ message: "Failed to mark promoted" });
  }
};

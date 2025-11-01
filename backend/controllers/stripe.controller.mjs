import Stripe from "stripe";


const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const createPromotionSession = async (req, res) => {
  try {
    const { days, formData } = req.body; 
    const userId = req.user.id; 
    
    const price = days === 10 ? 1500 : 2000;

    const tempSpace = new Space({
      ...formData,
      user: userId,
      isPromoted: true, 
      promotionDays: Number(days),
      status: "inactive" 
    });

    const savedSpace = await tempSpace.save();

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
      success_url: `${process.env.CLIENT_URL}/payment-success?session_id={CHECKOUT_SESSION_ID}&spaceId=${savedSpace._id}`,
      cancel_url: `${process.env.CLIENT_URL}/payment-cancel?spaceId=${savedSpace._id}`,
    });

    res.json({ url: session.url, spaceId: savedSpace._id });
  } catch (err) {
    console.error("Stripe session error:", err);
    res.status(500).json({ message: "Failed to create Stripe session" });
  }
};

export const handleSuccessfulPayment = async (req, res) => {
  try {
    const { session_id, spaceId } = req.query;

    const session = await stripe.checkout.sessions.retrieve(session_id);
    
    if (session.payment_status === 'paid') {
      const promotedUntil = new Date();
      promotedUntil.setDate(promotedUntil.getDate() + Number(session.metadata.days));

      await Space.findByIdAndUpdate(spaceId, {
        isPromoted: true,
        promotionDays: Number(session.metadata.days),
        promotedUntil,
        promotedAt: new Date(),
      });

      res.redirect(`${process.env.CLIENT_URL}/promotion-success?spaceId=${spaceId}`);
    } else {
      await Space.findByIdAndDelete(spaceId);
      res.redirect(`${process.env.CLIENT_URL}/payment-failed`);
    }
  } catch (err) {
    console.error("Payment verification error:", err);
    res.status(500).json({ message: "Failed to verify payment" });
  }
};

export const handleFailedPayment = async (req, res) => {
  try {
    const { spaceId } = req.query;
    
    if (spaceId) {
      await Space.findByIdAndDelete(spaceId);
    }
    
    res.redirect(`${process.env.CLIENT_URL}/payment-cancel`);
  } catch (err) {
    console.error("Cleanup error:", err);
    res.redirect(`${process.env.CLIENT_URL}/payment-cancel`);
  }
};

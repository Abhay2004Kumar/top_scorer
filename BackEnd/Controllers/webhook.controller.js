// controllers/stripeWebhook.controller.js
import Stripe from "stripe";
import { Subscriber } from "../Models/subscriber.model.js";
import { User } from "../Models/user.model.js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const stripeWebhook = async (req, res) => {
  const sig = req.headers["stripe-signature"];

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.rawBody,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error("Webhook Error:", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;

    const user = await User.findOne({ email: session.customer_email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const existing = await Subscriber.findOne({ user: user._id });
    if (!existing) {
      await Subscriber.create({
        user: user._id,
        stripeCustomerId: session.customer,
        stripeSubscriptionId: session.subscription,
      });
    }
  }

  res.status(200).json({ received: true });
};

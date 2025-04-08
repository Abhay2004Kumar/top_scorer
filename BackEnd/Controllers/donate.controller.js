import dotenv from "dotenv";
dotenv.config();

import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const createDonateSession = async (req, res) => {
    const { amount } = req.body;
    if (!amount || amount < 50) {
        return res.status(400).json({ error: "Amount must be at least ₹50" });
      }
  
    try {
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        mode: "payment",
        line_items: [
          {
            price_data: {
              currency: "inr",
              product_data: {
                name: "Support Top Scorer",
              },
              unit_amount: amount * 100, 
            },
            quantity: 1,
          },
        ],
        success_url: "https://top-scorer-ecru.vercel.app",
        cancel_url: "https://top-scorer-ecru.vercel.app/cancel",
      });
  
      res.status(200).json({ url: session.url });
    } catch (error) {
      console.error("Stripe Checkout Error:", error.message);
      res.status(500).json({ error: "Unable to create Stripe session" });
    }
  };

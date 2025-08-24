import { Router } from "express";
import { createPaymentIntent, confirmPayment, getPaymentHistory, createSubscription, cancelSubscription, getPaymentStats } from "../Controllers/payment.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const paymentRouter = Router()

// Payment routes
paymentRouter.route("/create-payment-intent").post(verifyJWT, createPaymentIntent);
paymentRouter.route("/confirm-payment").post(verifyJWT, confirmPayment);
paymentRouter.route("/payment-history").get(verifyJWT, getPaymentHistory);
paymentRouter.route("/payment-stats").get(verifyJWT, getPaymentStats);

// Subscription routes
paymentRouter.route("/create-subscription").post(verifyJWT, createSubscription);
paymentRouter.route("/cancel-subscription/:subscriptionId").delete(verifyJWT, cancelSubscription);

export default paymentRouter;
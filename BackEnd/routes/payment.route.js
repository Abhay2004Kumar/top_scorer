import { Router } from "express";
import { createCheckoutSession } from "../Controllers/payment.controller.js";

const paymentRouter = Router()

paymentRouter.route("/create-checkout-session").post(createCheckoutSession);
export default paymentRouter;
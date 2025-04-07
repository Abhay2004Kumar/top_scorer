
import { Router } from "express";
import { raw } from "express";
import { stripeWebhook } from "../Controllers/webhook.controller.js";

const stripeRouter = Router();

// Use raw body parser for stripe
stripeRouter.post(
  "/stripe/webhook",
  raw({ type: "application/json" }),
  stripeWebhook
);

export default stripeRouter;

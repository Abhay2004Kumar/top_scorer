import { Router } from "express";
import { createFeedback, getAllFeedback } from "../Controllers/Feedback.controller.js";

const FeedbackRouter = Router()

FeedbackRouter.route("/postFeedback").post(createFeedback)
FeedbackRouter.route("/getFeedback").get(getAllFeedback)

export default FeedbackRouter
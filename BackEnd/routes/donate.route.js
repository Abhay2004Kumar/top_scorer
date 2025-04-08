import express from "express";
import { createDonateSession } from "../Controllers/donate.controller.js";

const DonateRouter = express.Router();

DonateRouter.route("/create-donate-session").post(createDonateSession)

export default DonateRouter;

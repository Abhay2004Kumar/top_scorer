import { OAuth2Client } from "google-auth-library";
import { User } from "../Models/user.model.js";
import { generateAccessAndRefreshTokens } from "./User.controller.js"; // Ensure this function is accessible
import dotenv from 'dotenv'

dotenv.config()

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export const googleLogin = async (req, res) => {
    try {
        const { credential } = req.body;
        if (!credential) {
            return res.status(400).json({ success: false, message: "Google token missing" });
        }

        const ticket = await client.verifyIdToken({
            idToken: credential,
            audience: process.env.GOOGLE_CLIENT_ID
        });

        const payload = ticket.getPayload();

        let user = await User.findOne({ email: payload.email });

        if (!user) {
            user = await User.create({
                username: payload.email.split("@")[0],
                email: payload.email,
                fullname: payload.name,
                password: "google-auth", // Placeholder, as we don't store actual password
            });
        }

        const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(user._id);

        res.status(200).json({
            success: true,
            message: "Google login successful",
            data: {
                user,
                accessToken,
                refreshToken,
            },
        });
    } catch (error) {
        console.error("Google Login Error:", error);
        res.status(500).json({ success: false, message: "Google login failed" });
    }
};

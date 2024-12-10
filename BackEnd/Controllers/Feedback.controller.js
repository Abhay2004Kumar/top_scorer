import { Feedback } from "../Models/Feedback.model.js";

export const createFeedback = async (req, res) => {
    try {
        const { name, email, message } = req.body;

        if (!name || !email || !message) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        const feedback = new Feedback({
            name,
            email,
            message
        });

        await feedback.save();

        res.status(201).json({
            message: 'Feedback submitted successfully',
            feedback
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getAllFeedback = async (req, res) => {
    try {
        const feedbacks = await Feedback.find().sort({ createdAt: -1 }); // Sort feedback by creation date

        res.status(200).json({
            message: 'Feedback fetched successfully',
            feedbacks
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
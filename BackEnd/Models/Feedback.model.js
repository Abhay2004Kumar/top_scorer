import mongoose, {Schema} from "mongoose";

const feedbackSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required:true
    },
    message: {
        type: String,
        required: true
    }

},{timestamps: true})

export const Feedback = mongoose.model("Feedback",feedbackSchema)
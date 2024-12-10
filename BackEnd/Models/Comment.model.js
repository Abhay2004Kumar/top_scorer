import mongoose, {Schema} from "mongoose";

const commentSchema = new Schema({
    content: {
        type: String,
        required: true,
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    blog: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Blog",
        required: true,
    },
}, { timestamps: true });

export const Comment = mongoose.model("Comment", commentSchema);

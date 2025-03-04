import { Comment } from "../Models/Comment.model.js";
import { Blog } from "../Models/Blog.model.js";

export const addComment = async (req, res) => {
    try {
        const { blogId, content } = req.body;

        if (!req.user || !req.user._id) {
            return res.status(401).json({ message: "Unauthorized. Please log in to comment." });
        }

        const blog = await Blog.findById(blogId).populate("author", "username fullname");
        if (!blog || !blog.author) {
            return res.status(404).json({ message: "Blog not found or author is invalid" });
        }

        const comment = await Comment.create({
            content,
            user: req.user._id,
            blog: blogId,
        });

        blog.comments.push(comment._id);
        await blog.save();

        res.status(201).json({ message: "Comment added successfully", comment });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

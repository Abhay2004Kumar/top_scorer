import { Comment } from "../Models/Comment.model.js";
import { Blog } from "../Models/Blog.model.js";

export const addComment = async (req, res) => {
    try {
        const { blogId } = req.params;
        const { content } = req.body;

        const blog = await Blog.findById(blogId);
        if (!blog) return res.status(404).json({ message: "Blog not found" });

        const comment = await Comment.create({
            content,
            user: req.user._id, // Assuming `req.user` contains the authenticated user
            blog: blogId,
        });

        blog.comments.push(comment._id);
        await blog.save();

        res.status(201).json(comment);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
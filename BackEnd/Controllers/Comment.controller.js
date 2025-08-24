import { Comment } from "../Models/Comment.model.js";
import { Blog } from "../Models/Blog.model.js";
import redisClient from "../utils/redis.js";
import rabbitMQClient from "../utils/rabbitmq.js";

export const addComment = async (req, res) => {
    try {
        const { blogId, content } = req.body;

        if (!req.user || !req.user._id) {
            return res.status(401).json({ message: "Unauthorized. Please log in to comment." });
        }

        if (!content || content.trim().length === 0) {
            return res.status(400).json({ message: "Comment content cannot be empty." });
        }

        const blog = await Blog.findById(blogId)
            .populate("author", "username fullname")
            .populate({
                path: "comments",
                select: "content user createdAt",
                populate: {
                    path: "user",
                    select: "username fullname",
                },
            });

        if (!blog || !blog.author) {
            return res.status(404).json({ message: "Blog not found or author is invalid" });
        }

        const comment = await Comment.create({
            content: content.trim(),
            user: req.user._id,
            blog: blogId,
        });

        // Populate the comment with user info
        await comment.populate("user", "username fullname");

        blog.comments.push(comment._id);
        await blog.save();

        // Invalidate blog cache
        await redisClient.deleteMatchData('blogs', 'all');
        await redisClient.deleteMatchData('blogs', `blog_${blogId}`);

        // Increment comment statistics
        await redisClient.incrementStat('blogs', 'totalComments');

        // Send notification via RabbitMQ if commenter is not the blog author
        if (rabbitMQClient.isConnected && blog.author._id.toString() !== req.user._id.toString()) {
            await rabbitMQClient.sendNotification({
                type: 'blog_commented',
                userId: blog.author._id,
                blogId: blogId,
                commenterId: req.user._id,
                commentId: comment._id,
                message: `${req.user.username} commented on your blog "${blog.title}"`,
                priority: 'medium'
            });
        }

        // Get updated blog with populated comments
        const updatedBlog = await Blog.findById(blogId)
            .populate("author", "username fullname")
            .populate({
                path: "comments",
                select: "content user createdAt",
                populate: {
                    path: "user",
                    select: "username fullname",
                },
            });

        res.status(201).json({ 
            message: "Comment added successfully", 
            comment,
            blog: updatedBlog
        });
    } catch (error) {
        console.error('Comment creation error:', error);
        res.status(500).json({ message: error.message });
    }
};

export const getComments = async (req, res) => {
    try {
        const { blogId } = req.params;

        const comments = await Comment.find({ blog: blogId })
            .populate("user", "username fullname")
            .sort({ createdAt: -1 });

        res.status(200).json({ 
            message: "Comments fetched successfully", 
            comments 
        });
    } catch (error) {
        console.error('Get comments error:', error);
        res.status(500).json({ message: error.message });
    }
};

export const deleteComment = async (req, res) => {
    try {
        const { commentId } = req.params;

        if (!req.user || !req.user._id) {
            return res.status(401).json({ message: "Unauthorized. Please log in to delete comment." });
        }

        // Validate commentId format
        if (!commentId || !commentId.match(/^[0-9a-fA-F]{24}$/)) {
            return res.status(400).json({ message: "Invalid comment ID format" });
        }

        const comment = await Comment.findById(commentId);
        if (!comment) {
            return res.status(404).json({ message: "Comment not found" });
        }

        // Check if user is authorized to delete the comment
        if (comment.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: "You are not authorized to delete this comment" });
        }

        const blogId = comment.blog;

        // Remove comment from blog
        await Blog.findByIdAndUpdate(blogId, {
            $pull: { comments: commentId }
        });

        // Delete the comment
        await Comment.findByIdAndDelete(commentId);

        // Get updated blog with populated comments
        const updatedBlog = await Blog.findById(blogId)
            .populate("author", "username fullname")
            .populate({
                path: "comments",
                select: "content user createdAt",
                populate: {
                    path: "user",
                    select: "username fullname",
                },
            });

        if (!updatedBlog) {
            return res.status(404).json({ message: "Blog not found after comment deletion" });
        }

        // Invalidate blog cache
        await redisClient.deleteMatchData('blogs', 'all');
        await redisClient.deleteMatchData('blogs', `blog_${blogId}`);

        // Decrement comment statistics
        await redisClient.incrementStat('blogs', 'totalComments', -1);

        res.status(200).json({ 
            message: "Comment deleted successfully",
            blog: updatedBlog
        });
    } catch (error) {
        console.error('Delete comment error:', error);
        res.status(500).json({ message: error.message });
    }
};

import { Blog } from "../Models/Blog.model.js";

export const getAllBlogs = async (req, res) => {
    try {
        const blogs = await Blog.find()  // Find all blogs in the database
            .populate("author", "username fullname")
            .populate({
                path: "comments", // Populate comments field
                select: "content author", // Include content and author from each comment
                populate: {
                    path: "user", // Populate the author of the comment
                    select: "username fullname", // Include username and fullname of the comment's author
                },
            })
            .sort({ createdAt: -1 });  // Sort blogs by creation date (optional)

        res.status(200).json({ message: "Blogs fetched successfully", blogs });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const createBlog = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({ message: "Unauthorized. Please log in to create a blog." });
        }
        const { title, content, imageUrl } = req.body;
        const blog = await Blog.create({
            title,
            content,
            imageUrl,
            author: req.user._id, // Assuming `req.user` contains the authenticated user
        });
        res.status(201).json(blog);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const likeBlog = async (req, res) => {
    try {
        const { blogId } = req.body;
        const blog = await Blog.findById(blogId);

        if (!blog) return res.status(404).json({ message: "Blog not found" });

        if (blog.likes.includes(req.user._id)) {
            blog.likes.pull(req.user._id); // Unlike
        } else {
            blog.likes.push(req.user._id); // Like
        }
        await blog.save();
        res.status(200).json(blog);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

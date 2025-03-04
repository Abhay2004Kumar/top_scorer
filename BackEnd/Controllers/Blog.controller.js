import { Blog } from "../Models/Blog.model.js";

export const getAllBlogs = async (req, res) => {
    try {
        const blogs = await Blog.find()
            .populate("author", "username fullname")
            .populate({
                path: "comments",
                select: "content user",
                populate: {
                    path: "user",
                    select: "username fullname",
                },
            })
            .sort({ createdAt: -1 });

        // Filter out blogs where the author is missing (deleted user)
        const filteredBlogs = blogs.filter(blog => blog.author !== null);

        res.status(200).json({ message: "Blogs fetched successfully", blogs: filteredBlogs });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const createBlog = async (req, res) => {
    try {
        if (!req.user || !req.user._id) {
            return res.status(401).json({ message: "Unauthorized. Please log in to create a blog." });
        }

        const { title, content, imageUrl } = req.body;

        const blog = await Blog.create({
            title,
            content,
            imageUrl,
            author: req.user._id,
        });

        if (!blog) {
            return res.status(500).json({ message: "Failed to create blog" });
        }

        res.status(201).json({ message: "Blog created successfully", blog });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


export const likeBlog = async (req, res) => {
    try {
        const { blogId } = req.body;
        const blog = await Blog.findById(blogId).populate("author", "username fullname");

        if (!blog || !blog.author) {
            return res.status(404).json({ message: "Blog not found or author is invalid" });
        }

        if (blog.likes.includes(req.user._id)) {
            blog.likes.pull(req.user._id); // Unlike
        } else {
            blog.likes.push(req.user._id); // Like
        }

        await blog.save();
        res.status(200).json({ message: "Blog like updated", blog });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

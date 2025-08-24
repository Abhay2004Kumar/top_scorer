import { Blog } from "../Models/Blog.model.js";
import { imageupload } from "./BlogImageUpload.controller.js";
import redisClient from "../utils/redis.js";
import rabbitMQClient from "../utils/rabbitmq.js";

export const getAllBlogs = async (req, res) => {
    try {
        // Check if force refresh is requested
        const forceRefresh = req.query.refresh === 'true';
        
        // Try to get blogs from Redis cache first (unless force refresh is requested)
        if (!forceRefresh) {
            const cachedBlogs = await redisClient.getMatchData('blogs', 'all');
            
            if (cachedBlogs) {
                console.log('✅ Serving blogs from Redis cache');
                return res.status(200).json({ 
                    message: "Blogs fetched successfully (cached)", 
                    blogs: cachedBlogs,
                    source: 'cache'
                });
            }
        }

        // If not in cache, fetch from database
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

        // Cache the blogs in Redis for 30 minutes
        await redisClient.setMatchData('blogs', 'all', filteredBlogs, 1800);

        // Increment blog view statistics
        await redisClient.incrementStat('blogs', 'totalViews');

        res.status(200).json({ 
            message: "Blogs fetched successfully", 
            blogs: filteredBlogs,
            source: 'database'
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const createBlog = async (req, res) => {
    try {
        if (!req.user || !req.user._id) {
            return res.status(401).json({ message: "Unauthorized. Please log in to create a blog." });
        }

        const file = req.files.imagefile;
        let cloud = "";
        
        try {
            cloud = await imageupload(file);
        } catch (err) {
            return res.status(500).json({
                message: "Image Uploading Failed"
            });
        }

        const { title, content } = req.body;

        const blog = await Blog.create({
            title,
            content,
            imageUrl: cloud?.url,
            author: req.user._id,
        });

        if (!blog) {
            return res.status(500).json({ message: "Failed to create blog" });
        }

        // Send blog submission to RabbitMQ for processing
        if (rabbitMQClient.isConnected) {
            await rabbitMQClient.sendBlogSubmission({
                blogId: blog._id,
                authorId: req.user._id,
                title: title,
                content: content,
                status: 'pending_review',
                timestamp: Date.now()
            });
        }

        // Invalidate blog cache
        await redisClient.deleteMatchData('blogs', 'all');

        // Increment blog creation statistics
        await redisClient.incrementStat('blogs', 'totalCreated');
        await redisClient.incrementStat('blogs', 'pendingReview');

        res.status(201).json({ message: "Blog created successfully", blog });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const likeBlog = async (req, res) => {
    try {
        const { blogId } = req.body;
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

        const wasLiked = blog.likes.includes(req.user._id);
        
        if (wasLiked) {
            blog.likes.pull(req.user._id); // Unlike
            await redisClient.incrementStat('blogs', 'totalUnlikes');
        } else {
            blog.likes.push(req.user._id); // Like
            await redisClient.incrementStat('blogs', 'totalLikes');
        }

        await blog.save();

        // Get the updated blog with populated data after saving
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

        // Invalidate blog cache
        await redisClient.deleteMatchData('blogs', 'all');
        await redisClient.deleteMatchData('blogs', `blog_${blogId}`);

        // Send notification via RabbitMQ
        if (rabbitMQClient.isConnected && !wasLiked) {
            await rabbitMQClient.sendNotification({
                type: 'blog_liked',
                userId: updatedBlog.author._id,
                blogId: blogId,
                likerId: req.user._id,
                message: `${req.user.username} liked your blog "${updatedBlog.title}"`,
                priority: 'low'
            });
        }

        res.status(200).json({ message: "Blog like updated", blog: updatedBlog });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const updateBlog = async (req, res) => {
    try {
        const { title, content, id } = req.body;

        if (!id) {
            return res.status(400).json({ message: "Blog ID is required for update." });
        }

        // Get the current blog first to preserve existing image if not changed
        const currentBlog = await Blog.findById(id);
        if (!currentBlog) {
            return res.status(404).json({ message: "Blog not found" });
        }

        let imageUrl = currentBlog.imageUrl; // Default to existing image

        // Handle image upload if provided
        if (req.files && req.files.imagefile) {
            try {
                const cloud = await imageupload(req.files.imagefile);
                imageUrl = cloud?.url;
            } catch (err) {
                return res.status(500).json({
                    message: "Image Uploading Failed"
                });
            }
        }

        // Update the blog
        const updatedBlog = await Blog.findByIdAndUpdate(
            id,
            {
                title,
                content,
                imageUrl,
                updatedAt: Date.now()
            },
            { new: true }
        ).populate("author", "username fullname")
        .populate({
            path: "comments",
            select: "content user createdAt",
            populate: {
                path: "user",
                select: "username fullname",
            },
        });

        // Invalidate blog cache
        await redisClient.deleteMatchData('blogs', 'all');

        // Send update notification via RabbitMQ
        if (rabbitMQClient.isConnected) {
            await rabbitMQClient.sendNotification({
                type: 'blog_updated',
                userId: updatedBlog.author._id,
                blogId: id,
                message: `Your blog "${title}" has been updated successfully.`,
                priority: 'low'
            });
        }

        // Increment blog update statistics
        await redisClient.incrementStat('blogs', 'totalUpdates');

        res.status(200).json({ message: "Blog updated successfully", blog: updatedBlog });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const deleteBlog = async (req, res) => {
    try {
        const { id } = req.params;

        const blog = await Blog.findById(id);
        if (!blog) {
            return res.status(404).json({ message: "Blog not found" });
        }

        // Check if user is authorized to delete the blog
        if (blog.author.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: "You are not authorized to delete this blog" });
        }

        await Blog.findByIdAndDelete(id);

        // Invalidate blog cache - both general and specific
        await redisClient.deleteMatchData('blogs', 'all');
        await redisClient.deleteMatchData('blogs', `blog_${id}`);

        // Increment blog deletion statistics
        await redisClient.incrementStat('blogs', 'totalDeletions');

        res.status(200).json({ message: "Blog deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getBlogById = async (req, res) => {
    try {
        const { id } = req.params;

        // Try to get blog from Redis cache first
        const cachedBlog = await redisClient.getMatchData('blogs', `blog_${id}`);
        
        if (cachedBlog) {
            console.log('✅ Serving blog from Redis cache');
            await redisClient.incrementStat('blogs', 'cacheHits');
            return res.status(200).json({ 
                message: "Blog fetched successfully (cached)", 
                blog: cachedBlog,
                source: 'cache'
            });
        }

        const blog = await Blog.findById(id)
            .populate("author", "username fullname")
            .populate({
                path: "comments",
                select: "content user createdAt",
                populate: {
                    path: "user",
                    select: "username fullname",
                },
            });

        if (!blog) {
            return res.status(404).json({ message: "Blog not found" });
        }

        // Cache the blog in Redis for 15 minutes
        await redisClient.setMatchData('blogs', `blog_${id}`, blog, 900);

        // Increment blog view statistics
        await redisClient.incrementStat('blogs', 'totalViews');
        await redisClient.incrementStat('blogs', 'cacheMisses');

        res.status(200).json({ 
            message: "Blog fetched successfully", 
            blog,
            source: 'database'
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getBlogStats = async (req, res) => {
    try {
        // Get blog statistics from Redis
        const blogStats = await redisClient.getStats('blogs');

        res.status(200).json({ 
            message: "Blog statistics retrieved successfully", 
            stats: blogStats
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
  
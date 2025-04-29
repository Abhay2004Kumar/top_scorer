import { Blog } from "../Models/Blog.model.js";
import { imageupload } from "./BlogImageUpload.controller.js";

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
        const file = req.files.imagefile;
        let cloud = "";
        try{
             cloud = await imageupload(file);
            
        }
        catch(err){
            return res.status(500).json({
                message:"Image Uploading Failed"
            })
        }
        const { title, content } = req.body;

        const blog = await Blog.create({
            title,
            content,
            imageUrl:cloud?.url,
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

export const updateBlog = async (req, res) => {
    try {
      const { title, content, id } = req.body;
  
      if (!id) {
        return res.status(400).json({ message: "Blog ID is required for update." });
      }
  
      let imageUrl = "";

      if (req.files && req.files.imagefile) {
        const file = req.files.imagefile;
      
        // Check if the image is a blob (new upload from frontend)
        if (!file.name.includes('cloudinary')) {
          try {
            const cloud = await imageupload(file);
            imageUrl = cloud.secure_url;
          } catch (err) {
            return res.status(500).json({
              message: "Image Uploading Failed",
              error: err.message || err,
            });
          }
        } else {
          // If not a blob, assume it's a regular file with a public URL (already hosted)
          imageUrl = file.name;
        }
      }  else if (req.body.imagefile && !req.body.imagefile.includes('blob')) {
        // Direct image URL passed from client (public already)
        imageUrl = req.body.imagefile;
      }
      
  
      // Now update the blog in DB
      const updatedBlog = await Blog.findByIdAndUpdate(
        id,
        {
          title,
          content,
          imageUrl: imageUrl,
        },
        { new: true }
      );
  
      if (!updatedBlog) {
        return res.status(404).json({ message: "Blog not found" });
      }
  
      res.status(200).json({
        message: "Blog updated successfully",
        blog: updatedBlog,
      });
    } catch (err) {
      return res.status(500).json({
        message: "Blog Updation Failed",
        error: err.message || err,
      });
    }
  };
  
  export const deleteBlog = async (req, res) => {
    try {
      const { id } = req.body; 
  
      if (!id) {
        return res.status(400).json({
          message: "Blog ID is required to delete the blog.",
        });
      }
  
      const deleted = await Blog.findByIdAndDelete(id);
  
      if (!deleted) {
        return res.status(404).json({
          message: "Blog not found or already deleted.",
        });
      }
  
      return res.status(200).json({
        message: "Blog deleted successfully.",
        deletedBlog: deleted,
      });
    } catch (err) {
      return res.status(500).json({
        message: "Failed to delete blog.",
        error: err.message || err,
      });
    }
  };
  
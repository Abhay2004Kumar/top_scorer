import React, { useState, useEffect } from 'react';
import { FaThumbsUp, FaComment } from 'react-icons/fa';
import styles from '../Blog_Page/Blog.module.css'; // Ensure correct path to CSS module
import toast from 'react-hot-toast';
import Comment_Box from '../../Components/Comment_Box/Comment_Box';
import { IoIosSend } from "react-icons/io";
import axios from 'axios';

const BlogFeed = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedBlog, setSelectedBlog] = useState(null);
  const [comment, setComment] = useState('');
  const [blogs, setBlogs] = useState([]);

  // Fetch blogs data from API
  const fetchBlogs = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/v1/users/getAllblogs`);
      setBlogs(response.data.blogs); // Store blogs from API response
    } catch (error) {
      console.error('Error fetching blogs:', error);
      toast.error('Failed to fetch blogs');
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  // Update selected blog when blogs update
  useEffect(() => {
    if (selectedBlog) {
      const updatedBlog = blogs.find(blog => blog._id === selectedBlog._id);
      if (updatedBlog) {
        setSelectedBlog(updatedBlog);
      }
    }
  }, [blogs]);

  // Open modal with selected blog content
  const openBlogModal = (blog) => {
    setSelectedBlog(blog);
    setIsModalOpen(true);
  };

  // Close modal
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedBlog(null);
  };

  // Handle like
  const doLike = async () => {
    try {
      await axios.put(`${process.env.REACT_APP_BACKEND_URL}/api/v1/users/likeBlog`, {
        blogId: selectedBlog._id,
      }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` },
      });

      // Optimistically update UI
      setBlogs(prevBlogs =>
        prevBlogs.map(blog =>
          blog._id === selectedBlog._id
            ? { ...blog, likes: blog.likes.includes(localStorage.getItem('userId')) ? blog.likes.filter(id => id !== localStorage.getItem('userId')) : [...blog.likes, localStorage.getItem('userId')] }
            : blog
        )
      );
    } catch (err) {
      console.error(err);
      toast.error("Failed to like blog");
    }
  };

  // Handle comment
  const sendComment = async () => {
    if (!comment.trim()) return toast.error("Comment cannot be empty");
    
    try {
      await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/v1/users/commentBlog`, {
        blogId: selectedBlog._id,
        content: comment,
      }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` },
      });

      // Optimistically update UI
      setBlogs(prevBlogs =>
        prevBlogs.map(blog =>
          blog._id === selectedBlog._id
            ? { ...blog, comments: [...blog.comments, { _id: Date.now(), user: { username: "You" }, content: comment }] }
            : blog
        )
      );

      setComment('');
      toast.success("Comment added successfully");
    } catch (err) {
      console.error(err);
      toast.error("Failed to add comment");
    }
  };

  return (
    <>
      <div className={styles.blogFeedContainer}>
        <div className={styles.blogFeed}>
          {blogs.map((blog) => (
            <div
              key={blog._id}
              className={styles.blogPost}
              onClick={() => openBlogModal(blog)}
            >
              <div className={styles.blogImage}>
                <img src={blog.imageUrl} alt={blog.title} className={styles.imageBox} />
              </div>
              <div className={styles.blogText}>
                <h2 className={styles.blogTitle}>{blog.title}</h2>
                <p className={styles.blogAuthorDate}>
                  Posted by {blog.author?.fullname || "Unknown"} on {new Date(blog.createdAt).toLocaleDateString()}
                </p>
                <p className={styles.blogContent}>{blog.content}</p>
                <div className={styles.blogActions}>
                  <div className={styles.actionBtn}>
                    <FaThumbsUp /> Like ({blog.likes.length})
                  </div>
                  <div className={styles.actionBtn}>
                    <FaComment /> Comments ({blog.comments.length})
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal for blog detail */}
      {isModalOpen && selectedBlog && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <button className={styles.closeModal} onClick={closeModal}>
              Close
            </button>
            <div className={styles.modalBlogDetail}>
              <h1>{selectedBlog.title}</h1>
              <div className={styles.postInfo}>
                <p className={styles.auth}>
                  <strong>Author:</strong> {selectedBlog.author?.fullname || "Unknown"}
                </p>
                <p className={styles.auth}>
                  <strong>On:</strong> {new Date(selectedBlog.createdAt).toLocaleDateString()}
                </p>
              </div>
              <div className={styles.modalBlogContent}>
                <div className={styles.modalBlogImage}>
                  <img src={selectedBlog.imageUrl} alt={selectedBlog.title} className={styles.modalImageBox} />
                </div>
                <div className={styles.modelContent}>
                  <p>{selectedBlog.content}</p>
                  <div className={styles.blogActions}>
                    <button className={styles.actionBtn} onClick={doLike}>
                      <FaThumbsUp /> Like ({selectedBlog.likes.length})
                    </button>
                    <input 
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      type='text'
                      placeholder='Comment here...'
                      className={styles.commentInput}
                    />
                    <button onClick={sendComment} className={styles.sendButton}>
                      <IoIosSend style={{ scale: "1.7" }} />
                    </button>
                  </div>
                </div>
              </div>
              <div className={styles.line}></div>
              <div className={styles.commentboxx}>
                <h3 className={styles.comHead}>Comments</h3>
                {selectedBlog.comments.length === 0 ? (
                  <p>No comments</p>
                ) : (
                  <ul>
                    {selectedBlog.comments.map((comment) => (
                      <Comment_Box key={comment._id} user={comment.user?.username || "Unknown"} mssg={comment.content} />
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default BlogFeed;

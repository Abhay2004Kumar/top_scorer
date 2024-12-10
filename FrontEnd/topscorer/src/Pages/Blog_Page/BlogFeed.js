import React, { useState, useEffect } from 'react';
import { FaThumbsUp, FaComment, FaShareAlt } from 'react-icons/fa';
import styles from '../Blog_Page/Blog.module.css'; // Ensure correct path to CSS module
import toast from 'react-hot-toast';

const BlogFeed = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedBlog, setSelectedBlog] = useState(null); // To store the blog that was clicked
  const [blogs, setBlogs] = useState([]);

  // Fetch blogs data from API
  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/v1/users/getAllblogs');
        const data = await response.json();
        setBlogs(data.blogs); // Store blogs from API response
      } catch (error) {
        console.error('Error fetching blogs:', error);
        toast.error('Failed to fetch blogs');
      }
    };

    fetchBlogs();
  }, []);

  // Open modal with selected blog content
  const openBlogModal = (blog) => {
    setSelectedBlog(blog);
    setIsModalOpen(true);
    toast.success('Opening detailed view of blog');
  };

  // Close modal
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedBlog(null); // Clear selected blog when modal is closed
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
                  Posted by {blog.author.fullname} on {new Date(blog.createdAt).toLocaleDateString()}
                </p>
                <p className={styles.blogContent}>{blog.content}</p>
                <div className={styles.blogActions}>
                  <button className={styles.actionBtn}>
                    <FaThumbsUp /> Like ({blog.likes.length})
                  </button>
                  <button className={styles.actionBtn}>
                    <FaComment /> Comments ({blog.comments.length})
                  </button>
                  <button className={styles.actionBtn}>
                    <FaShareAlt /> Share
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal for blog detail */}
      {isModalOpen ? (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <button className={styles.closeModal} onClick={closeModal}>
              Close
            </button>
            {selectedBlog ? (
              <div className={styles.modalBlogDetail}>
                <h1>{selectedBlog.title}</h1>
                <div className={styles.postInfo}>
                  <p className={styles.auth}>
                    <strong>Author:</strong> {selectedBlog.author.fullname}
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
                      <button className={styles.actionBtn}>
                        <FaThumbsUp /> Like ({selectedBlog.likes.length})
                      </button>
                      <button className={styles.actionBtn}>
                        <FaComment /> Comments ({selectedBlog.comments.length})
                      </button>
                      {/* <button className={styles.actionBtn}>
                        <FaShareAlt /> Share
                      </button> */}
                    </div>
                  </div>
                </div>
                <h3>Comments:</h3>
                <ul>
                  {selectedBlog.comments.map((commentId) => {
                    const comment = selectedBlog.comments.find((comment) => comment._id === commentId);
                    return (
                      <li key={commentId}>
                        <p>
                          {console.log(selectedBlog)}
                          {console.log("Data")}
                          {console.log(comment)}
                          {/* <strong>{comment.name}:</strong> {comment.content} */}
                        </p>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ) : (
              <p>Loading blog details...</p>
            )}
          </div>
        </div>
      ) : null}
    </>
  );
};

export default BlogFeed;

import React, { useState, useEffect } from 'react';
import { FaThumbsUp, FaComment, FaShareAlt } from 'react-icons/fa';
import styles from '../Blog_Page/Blog.module.css'; // Ensure correct path to CSS module
import toast from 'react-hot-toast';
import Comment_Box from '../../Components/Comment_Box/Comment_Box';
import { IoIosSend } from "react-icons/io";
import axios from 'axios'

const BlogFeed = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedBlog, setSelectedBlog] = useState(null);
 // To store the blog that was clicked
 const [comment,setComment] = useState('');
  const [blogs, setBlogs] = useState([]);

  // Fetch blogs data from API
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
  useEffect(() => {
    if (selectedBlog) {
      const updatedBlog = blogs.find(blog => blog._id === selectedBlog._id);
      if (updatedBlog) {
        setSelectedBlog(updatedBlog);
      }
    }
  }, [blogs]);
  
  useEffect(() => {
    fetchBlogs();
  }, []);

  // Open modal with selected blog content
  const openBlogModal = (blog) => {
    setSelectedBlog(blog);
    setIsModalOpen(true);
    // toast.success('Opening detailed view of blog');
  };

  // Close modal
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedBlog(null); // Clear selected blog when modal is closed
  };

  const doLike = async () => {
    try {
      const res = await axios.put('http://localhost:5000/api/v1/users/likeBlog', {
        blogId: selectedBlog._id,
        accessToken: localStorage.getItem('accessToken'),
      });
      // toast.success("Liked successfully");
      // Refresh blogs and update the selected blog
      await fetchBlogs();
      // Update selectedBlog with the updated data
      const updatedBlog = blogs.find(blog => blog._id === selectedBlog._id);
      setSelectedBlog(updatedBlog);
    } catch (err) {
      console.error(err);
      toast.error("Failed to like blog");
    }
  };
  
  const sendComment = async () => {
    try {
      const res = await axios.post('http://localhost:5000/api/v1/users/commentBlog', {
        blogId: selectedBlog._id,
        accessToken: localStorage.getItem('accessToken'),
        content: comment,
      });
      toast.success("Comment added successfully");
      // Refresh blogs and update the selected blog
      await fetchBlogs();
      // Update selectedBlog with the updated data
      const updatedBlog = blogs.find(blog => blog._id === selectedBlog._id);
      setSelectedBlog(updatedBlog);
    } catch (err) {
      console.error(err);
      toast.error("Failed to add comment");
    }
    setComment('');
  };
  
  // const toTime =(date)=>{
  //   console.log(date);
  //   console.log(typeof(date))
  //   const arr = date.split(' ');
  //   let newdate = '';
  //   for(let i=0;i<arr.length;i++){
  //     newdate+=arr[i]+' ';
  //   }
  //   return newdate;
  // }

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
                  <div  className={styles.actionBtn}>
                    <FaThumbsUp /> Like ({blog.likes.length})
                  </div >
                  <div  className={styles.actionBtn}>
                    <FaComment /> Comments ({blog.comments.length})
                  </div >
                  {/* <button className={styles.actionBtn}>
                    <FaShareAlt /> Share
                  </button> */}
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
                      <button  className={styles.actionBtn} onClick={doLike}>
                        <FaThumbsUp /> Like ({selectedBlog.likes.length})
                      </button>
                      <input value={comment} onChange={(e)=>setComment(e.target.value)} type='text' placeholder='Comment here...' style={{padding:"5px",paddingLeft:"5px" ,marginLeft:"4px"}}></input>
                      <button onClick={sendComment} style={{padding:"10px",borderRadius:"10px"}}><IoIosSend style={{scale:"1.7"}}/></button>
                      {/* <button className={styles.actionBtn}>
                        <FaShareAlt /> Share
                      </button> */}
                    </div>
                  </div>
                </div>
                <div className={styles.line}></div>
                <div className={styles.commentboxx}>
                  <h3 className={styles.comHead}>Comments</h3>

                  {/* Display No comments if there are no comments */}
                  {selectedBlog.comments.length === 0 ? (
                    <p>No comments</p>
                  ) : (
                    <ul>
                      {selectedBlog.comments.map((comment) => {
                        return (
                          <Comment_Box key={comment._id} user={comment.user.username} mssg={comment.content}/>
                        );
                      })}
                    </ul>
                  )}
                </div>
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

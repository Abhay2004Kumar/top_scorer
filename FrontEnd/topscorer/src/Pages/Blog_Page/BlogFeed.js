import React, { useState, useEffect } from 'react';
import { FaThumbsUp, FaComment } from 'react-icons/fa';
import { IoIosSend } from 'react-icons/io';
import toast from 'react-hot-toast';
import axios from 'axios';
import Comment_Box from '../../Components/Comment_Box/Comment_Box';

const BlogFeed = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedBlog, setSelectedBlog] = useState(null);
  const [comment, setComment] = useState('');
  const [blogs, setBlogs] = useState([]);
  const [visibleComments, setVisibleComments] = useState(3); // Number of comments to show initially

  const fetchBlogs = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/v1/users/getAllblogs`);
      setBlogs(response.data.blogs);
    } catch (error) {
      console.error('Error fetching blogs:', error);
      toast.error('Failed to fetch blogs');
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  useEffect(() => {
    if (selectedBlog) {
      const updatedBlog = blogs.find(blog => blog._id === selectedBlog._id);
      if (updatedBlog) {
        setSelectedBlog(updatedBlog);
      }
    }
  }, [blogs]);

  const openBlogModal = (blog) => {
    setSelectedBlog(blog);
    setIsModalOpen(true);
    setVisibleComments(3); // Reset visible comments when modal opens
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedBlog(null);
  };

  const doLike = async () => {
    try {
      await axios.put(`${process.env.REACT_APP_BACKEND_URL}/api/v1/users/likeBlog`, {
        blogId: selectedBlog._id,
      }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` },
      });
      fetchBlogs();
    } catch (err) {
      console.error(err);
      toast.error("Failed to like blog");
    }
  };

  const sendComment = async () => {
    if (!comment.trim()) return toast.error("Comment cannot be empty");
    
    try {
      await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/v1/users/commentBlog`, {
        blogId: selectedBlog._id,
        content: comment,
      }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` },
      });
      setComment('');
      fetchBlogs();
      toast.success("Comment added successfully");
    } catch (err) {
      console.error(err);
      toast.error("Failed to add comment");
    }
  };

  const loadMoreComments = () => {
    setVisibleComments((prev) => prev + 3); // Load 3 more comments
  };

  return (
    <div className="container mx-auto p-4 dark:bg-gray-900 dark:text-white">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {blogs.map((blog) => (
          <div key={blog._id} className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-4 cursor-pointer" onClick={() => openBlogModal(blog)}>
            <img src={blog.imageUrl} alt={blog.title} className="w-full h-32 md:h-48 object-cover rounded-md" />
            <h3 className="text-lg font-bold mt-2">{blog.title}</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">Posted by {blog.author?.fullname || "Unknown"} on {new Date(blog.createdAt).toLocaleDateString()}</p>
            <p className="text-gray-700 dark:text-gray-300 mt-2">{blog.content.substring(0, 100)}...</p>
            <div className="flex items-center gap-4 mt-4 text-gray-600 dark:text-gray-400">
              <span className="flex items-center gap-1"><FaThumbsUp /> {blog.likes.length}</span>
              <span className="flex items-center gap-1"><FaComment /> {blog.comments.length}</span>
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && selectedBlog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg w-full max-w-2xl md:max-w-4xl relative flex flex-col md:flex-row gap-6 max-h-[80vh] overflow-hidden">
            <button className="absolute top-2 right-4 text-gray-700 dark:text-white" onClick={closeModal}>X</button>
            
           

            {/* Blog Content Section (Right on Desktop, Bottom on Mobile) */}
            <div className="w-full md:w-2/3 flex flex-col overflow-y-auto">
              <h3 className="text-xl font-bold">{selectedBlog.title}</h3>
              <p className="text-gray-500 dark:text-gray-400">By {selectedBlog.author?.fullname || "Unknown"} on {new Date(selectedBlog.createdAt).toLocaleDateString()}</p>
              <img src={selectedBlog.imageUrl} alt={selectedBlog.title} className="w-full h-32 md:h-64 object-cover mt-4 rounded-md" />
              <p className="text-gray-700 dark:text-gray-300 mt-4">{selectedBlog.content}</p>
              
              {/* Like and Comment Input */}
              <div className="mt-4 flex items-center gap-4">
                <button className="bg-blue-500 text-white px-4 py-2 rounded-full flex items-center gap-1" onClick={doLike}>
                  <FaThumbsUp /> Like ({selectedBlog.likes.length})
                </button>
                <input
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  type="text"
                  placeholder="Add a comment..."
                  className="border p-2  text-white rounded-full w-full dark:bg-gray-700 dark:text-white"
                />
                <button className="bg-green-500  text-white px-4 py-3 rounded-full flex items-center" onClick={sendComment}>
                  <IoIosSend />
                </button>
              </div>
            </div>
             {/* Comments Section (Left on Desktop, Top on Mobile) */}
             <div className="w-full md:w-1/2 flex flex-col overflow-y-auto border-t-4  border-slate-300 dark:border-slate-700">
              <h3 className="text-lg font-semibold">Comments</h3>
              <div className="mt-2">
                {selectedBlog.comments.length === 0 ? (
                  <p>No comments yet.</p>
                ) : (
                  <ul>
                    {selectedBlog.comments.slice(0, visibleComments).map((comment) => (
                      <Comment_Box key={comment._id} user={comment.user?.username || "Unknown"} mssg={comment.content} />
                    ))}
                  </ul>
                )}
                {selectedBlog.comments.length > visibleComments && (
                  <button
                    className="text-blue-500 mt-2 hover:underline"
                    onClick={loadMoreComments}
                  >
                    See More Comments
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BlogFeed;
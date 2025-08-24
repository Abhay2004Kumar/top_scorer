import React, { useState, useEffect } from "react";
import { FaThumbsUp, FaComment, FaEye, FaClock, FaTrash, FaHeart } from "react-icons/fa";
import { IoIosSend } from "react-icons/io";
import toast from "react-hot-toast";
import { Grid } from "react-loader-spinner";
import { api } from "../../util/axiosUtil";
import { createSafeHtml, stripHtmlTags } from "../../util/htmlUtils";
import Comment_Box from "../../Components/Comment_Box/Comment_Box";

const BlogFeed = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedBlog, setSelectedBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [comment, setComment] = useState("");
  const [blogs, setBlogs] = useState([]);
  const [visibleComments, setVisibleComments] = useState(3);
  const [cacheInfo, setCacheInfo] = useState(null);
  const [isLiking, setIsLiking] = useState(false);
  const [isCommenting, setIsCommenting] = useState(false);
  const [deletingCommentId, setDeletingCommentId] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    fetchBlogs();
    
    // Set up periodic refresh every 5 minutes to check for new/deleted blogs
    const refreshInterval = setInterval(() => {
      fetchBlogs(true); // Force refresh from database
    }, 5 * 60 * 1000); // 5 minutes
    
    return () => clearInterval(refreshInterval);
  }, []);

  // Separate useEffect for user authentication
  useEffect(() => {
    const getCurrentUserData = async () => {
      const token = localStorage.getItem('accessToken');
      if (token) {
        try {
          const response = await api.getCurrentUser();
          console.log('Current user data:', response.data.data);
          setCurrentUser(response.data.data);
        } catch (error) {
          console.error('Error fetching current user:', error);
          setCurrentUser(null);
          // Clear invalid tokens
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
        }
      } else {
        setCurrentUser(null);
      }
    };

    getCurrentUserData();

    // Listen for storage changes (login/logout events)
    const handleStorageChange = (e) => {
      if (e.key === 'accessToken' || e.key === 'refreshToken') {
        console.log('Token change detected:', e.key, e.newValue);
        getCurrentUserData();
      }
    };

    // Listen for custom login/logout events
    const handleAuthChange = () => {
      console.log('Auth change event detected');
      getCurrentUserData();
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('authChange', handleAuthChange);

    // Set up periodic user data refresh (every 2 minutes) for previously signed in users
    const userRefreshInterval = setInterval(() => {
      const token = localStorage.getItem('accessToken');
      if (token) {
        console.log('Periodic user data refresh');
        getCurrentUserData();
      }
    }, 2 * 60 * 1000); // 2 minutes

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('authChange', handleAuthChange);
      clearInterval(userRefreshInterval);
    };
  }, []);

  const fetchBlogs = async (forceRefresh = false) => {
    try {
      setLoading(true);
      
      // Add cache-busting parameter if force refresh is requested
      const url = forceRefresh ? '/api/v1/users/getAllblogs?refresh=true' : '/api/v1/users/getAllblogs';
      const response = await api.getAllBlogs(forceRefresh);
      
      setBlogs(response.data.blogs);
      
      // Show cache information if available
      if (response.data.source) {
        setCacheInfo(response.data.source);
        if (response.data.source === 'cache' && !forceRefresh) {
          toast.success('Blogs loaded from cache (faster!)', { duration: 2000 });
        } else if (forceRefresh) {
          toast.success('Blogs refreshed from database', { duration: 2000 });
        }
      }
    } catch (error) {
      console.error("Error fetching blogs:", error);
      if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error("Failed to fetch blogs");
      }
    } finally {
      setLoading(false);
    }
  };

  // Keep selected blog in sync with the blogs list
  useEffect(() => {
    if (selectedBlog && isModalOpen) {
      const updatedBlog = blogs.find((blog) => blog._id === selectedBlog._id);
      if (updatedBlog) {
        setSelectedBlog(updatedBlog);
      }
    }
  }, [blogs, selectedBlog, isModalOpen]);

  // Remove this useEffect as it was causing state overwrites
  // The openBlogModal function now handles data fetching more intelligently

  const refreshBlogData = async (blogId) => {
    try {
      const response = await api.getBlogById(blogId);
      if (response.data && response.data.blog) {
        // Update the blog in the list
        setBlogs(prevBlogs => 
          prevBlogs.map(blog => 
            blog._id === blogId 
              ? response.data.blog
              : blog
          )
        );
        
        // Update selected blog if it's currently open
        if (selectedBlog && selectedBlog._id === blogId) {
          setSelectedBlog(response.data.blog);
        }
      }
    } catch (error) {
      console.error('Error refreshing blog data:', error);
    }
  };

  const refreshUserData = async () => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      try {
        const response = await api.getCurrentUser();
        console.log('Refreshed user data:', response.data.data);
        setCurrentUser(response.data.data);
        return response.data.data;
      } catch (error) {
        console.error('Error refreshing user data:', error);
        setCurrentUser(null);
        // Clear invalid tokens
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        return null;
      }
    } else {
      setCurrentUser(null);
      return null;
    }
  };

  const openBlogModal = async (blog) => {
    setSelectedBlog(blog);
    setIsModalOpen(true);
    setVisibleComments(3);
    
    // Refresh current user data to ensure we have the latest user info
    await refreshUserData();
    
    // Only fetch fresh data if the blog in the list doesn't have complete data
    // This prevents overwriting local state changes
    if (!blog.comments || blog.comments.length === 0) {
      try {
        const response = await api.getBlogById(blog._id);
        const freshBlog = response.data.blog;
        
        // Update the blog in the list
        setBlogs(prevBlogs => 
          prevBlogs.map(b => 
            b._id === blog._id 
              ? freshBlog
              : b
          )
        );
        
        // Update selected blog
        setSelectedBlog(freshBlog);
        
        if (response.data.source === 'cache') {
          console.log('✅ Blog details loaded from cache');
        }
      } catch (error) {
        console.error("Error fetching blog details:", error);
      }
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedBlog(null);
    setComment("");
  };

  const doLike = async () => {
    if (!currentUser) {
      toast.error("Please log in to like this blog");
      return;
    }

    try {
      setIsLiking(true);
      const response = await api.likeBlog(selectedBlog._id);
      
      // Ensure the response has the expected structure
      if (!response.data || !response.data.blog) {
        throw new Error('Invalid response from server');
      }
      
      const updatedBlog = response.data.blog;
      
      // Update the blog in the list
      setBlogs(prevBlogs => 
        prevBlogs.map(blog => 
          blog._id === selectedBlog._id 
            ? updatedBlog
            : blog
        )
      );
      
      // Update selected blog with full data
      setSelectedBlog(updatedBlog);
      
      const isLiked = updatedBlog.likes && updatedBlog.likes.includes(currentUser._id);
      toast.success(isLiked ? "Blog liked successfully!" : "Blog unliked successfully!");
      
    } catch (err) {
      console.error('Like error:', err);
      if (err.response?.status === 401) {
        toast.error("Please log in to like this blog");
        window.location.href = '/login';
      } else if (err.response?.data?.message) {
        toast.error(err.response.data.message);
      } else {
        toast.error("Failed to like blog");
      }
    } finally {
      setIsLiking(false);
    }
  };

  const sendComment = async () => {
    if (!currentUser) {
      toast.error("Please log in to comment");
      return;
    }

    if (!comment.trim()) {
      toast.error("Comment cannot be empty");
      return;
    }

    try {
      setIsCommenting(true);
      const response = await api.addComment({
        blogId: selectedBlog._id,
        content: comment.trim(),
      });
      
      // Ensure the response has the expected structure
      if (!response.data || !response.data.blog) {
        throw new Error('Invalid response from server');
      }
      
      const updatedBlog = response.data.blog;
      
      // Update the blog in the list
      setBlogs(prevBlogs => 
        prevBlogs.map(blog => 
          blog._id === selectedBlog._id 
            ? updatedBlog
            : blog
        )
      );
      
      // Update selected blog with full data
      setSelectedBlog(updatedBlog);
      
      setComment("");
      toast.success("Comment added successfully!");
      
    } catch (err) {
      console.error('Comment error:', err);
      if (err.response?.status === 401) {
        toast.error("Please log in to comment");
        window.location.href = '/login';
      } else if (err.response?.data?.message) {
        toast.error(err.response.data.message);
      } else {
        toast.error("Failed to add comment");
      }
    } finally {
      setIsCommenting(false);
    }
  };

  const deleteComment = async (commentId) => {
    // Refresh user data first to ensure we have the latest user info
    const refreshedUser = await refreshUserData();
    if (!refreshedUser) {
      toast.error("Please log in to delete comments");
      return;
    }

    // Prevent multiple delete attempts for the same comment
    if (commentId === deletingCommentId) {
      return;
    }

    // Find the comment to check permissions
    const comment = selectedBlog?.comments?.find(c => c._id === commentId);
    if (comment) {
      console.log('Attempting to delete comment:', {
        commentId,
        commentUserId: comment.user._id,
        currentUserId: refreshedUser._id,
        canDelete: canDeleteComment(comment)
      });
    }

    try {
      setDeletingCommentId(commentId);
      const response = await api.deleteComment(commentId);
      
      // Ensure the response has the expected structure
      if (!response.data || !response.data.blog) {
        throw new Error('Invalid response from server');
      }
      
      const updatedBlog = response.data.blog;
      
      // Update the blog in the list
      setBlogs(prevBlogs => 
        prevBlogs.map(blog => 
          blog._id === selectedBlog._id 
            ? updatedBlog
            : blog
        )
      );
      
      // Update selected blog with full data
      setSelectedBlog(updatedBlog);
      
      toast.success("Comment deleted successfully!");
      
    } catch (err) {
      console.error('Delete comment error:', err);
      if (err.response?.status === 404) {
        toast.error("Comment not found or already deleted");
      } else if (err.response?.status === 403) {
        toast.error("You are not authorized to delete this comment. You can only delete your own comments.");
      } else if (err.response?.data?.message) {
        toast.error(err.response.data.message);
      } else {
        toast.error("Failed to delete comment");
      }
    } finally {
      setDeletingCommentId(null);
    }
  };

  const loadMoreComments = () => {
    setVisibleComments((prev) => prev + 3);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const isBlogLiked = (blog) => {
    return currentUser && blog.likes && blog.likes.includes(currentUser._id);
  };

  const canDeleteComment = (comment) => {
    if (!currentUser || !comment || !comment.user) {
      console.log('Permission check failed:', { 
        hasCurrentUser: !!currentUser, 
        hasComment: !!comment, 
        hasCommentUser: !!comment?.user,
        currentUserId: currentUser?._id,
        commentUserId: comment?.user?._id,
        commentUser: comment?.user
      });
      return false;
    }
    
    const isCommentOwner = comment.user._id === currentUser._id;
    const isBlogAuthor = selectedBlog?.author && selectedBlog.author._id === currentUser._id;
    
    console.log('Permission check:', {
      currentUserId: currentUser._id,
      commentUserId: comment.user._id,
      blogAuthorId: selectedBlog?.author?._id,
      isCommentOwner,
      isBlogAuthor,
      canDelete: isCommentOwner || isBlogAuthor
    });
    
    return isCommentOwner || isBlogAuthor;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Grid color="#00BFFF" height={80} width={80} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-4 sm:py-6 lg:py-8">
      <div className="max-w-6xl mx-auto px-3 sm:px-4 lg:px-8">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start space-y-4 sm:space-y-0">
            <div className="flex-1">
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-2">
                Latest Sports News & Updates
              </h1>
              <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
                Stay updated with the latest sports events and news
              </p>
              {cacheInfo && (
                <div className="mt-2 text-xs sm:text-sm text-blue-600 dark:text-blue-400">
                  Data source: {cacheInfo === 'cache' ? 'Redis Cache' : 'Database'}
                </div>
              )}
            </div>
            <button
              onClick={() => fetchBlogs(true)}
              disabled={loading}
              className="w-full sm:w-auto px-3 sm:px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm sm:text-base"
            >
              {loading ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              ) : (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              )}
              <span className="hidden sm:inline">Refresh</span>
              <span className="sm:hidden">Refresh</span>
            </button>
          </div>
        </div>

        {/* Blog Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {blogs.map((blog) => (
            <div
              key={blog._id}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 cursor-pointer"
              onClick={() => openBlogModal(blog)}
            >
              {blog.imageUrl && (
                <img
                  src={blog.imageUrl}
                  alt={blog.title}
                  className="w-full h-40 sm:h-48 object-cover rounded-t-lg"
                />
              )}
              <div className="p-4 sm:p-6">
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2">
                  {blog.title}
                </h3>
                <div 
                  className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mb-4 line-clamp-3"
                  dangerouslySetInnerHTML={createSafeHtml(blog.content)}
                />
                
                {/* Blog Meta */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between text-xs sm:text-sm text-gray-500 dark:text-gray-400 mb-4 space-y-1 sm:space-y-0">
                  <div className="flex items-center">
                    <FaClock className="mr-1" />
                    {formatDate(blog.createdAt)}
                  </div>
                  <div className="flex items-center">
                    <FaEye className="mr-1" />
                    {blog.views || 0}
                  </div>
                </div>

                {/* Author Info */}
                {blog.author && (
                  <div className="flex items-center mb-4">
                    <div className="w-6 h-6 sm:w-8 sm:h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs sm:text-sm font-semibold">
                      {blog.author.username?.charAt(0).toUpperCase()}
                    </div>
                    <span className="ml-2 text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                      {blog.author.fullname || blog.author.username}
                    </span>
                  </div>
                )}

                {/* Interaction Stats */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex items-center space-x-2 sm:space-x-4">
                    <div className={`flex items-center ${isBlogLiked(blog) ? 'text-red-500' : 'text-gray-500 dark:text-gray-400'}`}>
                      {isBlogLiked(blog) ? <FaHeart className="mr-1" /> : <FaThumbsUp className="mr-1" />}
                      <span>{blog.likes?.length || 0}</span>
                    </div>
                    <div className="flex items-center text-gray-500 dark:text-gray-400">
                      <FaComment className="mr-1" />
                      <span>{blog.comments?.length || 0}</span>
                    </div>
                  </div>
                  <button className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 text-sm font-medium">
                    Read More
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* No Blogs Message */}
        {blogs.length === 0 && !loading && (
          <div className="text-center py-12">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              No blogs available
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Check back later for the latest sports news and updates.
            </p>
          </div>
        )}

        {/* Blog Modal */}
        {isModalOpen && selectedBlog && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-2 sm:p-4 z-50">
            <div className="bg-white dark:bg-gray-800 rounded-lg max-w-4xl w-full max-h-[95vh] sm:max-h-[90vh] overflow-y-auto">
              <div className="p-4 sm:p-6">
                <div className="flex justify-between items-start mb-4">
                  <h2 className="text-lg sm:text-2xl font-bold text-gray-900 dark:text-white pr-4">
                    {selectedBlog.title}
                  </h2>
                  <button
                    onClick={closeModal}
                    className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 p-1"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                {selectedBlog.imageUrl && (
                  <img
                    src={selectedBlog.imageUrl}
                    alt={selectedBlog.title}
                    className="w-full h-48 sm:h-64 object-cover rounded-lg mb-4"
                  />
                )}

                <div className="prose dark:prose-invert max-w-none mb-6">
                  <div 
                    className="text-sm sm:text-base text-gray-700 dark:text-gray-300 whitespace-pre-wrap"
                    dangerouslySetInnerHTML={createSafeHtml(selectedBlog.content)}
                  />
                </div>

                {/* Blog Meta */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between text-xs sm:text-sm text-gray-500 dark:text-gray-400 mb-6 space-y-2 sm:space-y-0">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 space-y-1 sm:space-y-0">
                    <span>By {selectedBlog.author?.fullname || selectedBlog.author?.username}</span>
                    <span>{formatDate(selectedBlog.createdAt)}</span>
                  </div>
                  <div className="flex items-center space-x-4">
                    <span>{selectedBlog.views || 0} views</span>
                    <span>{selectedBlog.likes?.length || 0} likes</span>
                  </div>
                </div>

                {/* Like Button */}
                <div className="mb-6">
                  <button
                    onClick={doLike}
                    disabled={isLiking}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                      isBlogLiked(selectedBlog)
                        ? 'bg-red-600 text-white hover:bg-red-700'
                        : 'bg-blue-600 text-white hover:bg-blue-700'
                    } disabled:opacity-50 disabled:cursor-not-allowed`}
                  >
                    {isLiking ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    ) : isBlogLiked(selectedBlog) ? (
                      <FaHeart />
                    ) : (
                      <FaThumbsUp />
                    )}
                    <span>{isBlogLiked(selectedBlog) ? 'Liked' : 'Like'}</span>
                  </button>
                </div>

                {/* Comments Section */}
                <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                  <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    Comments ({selectedBlog.comments?.length || 0})
                  </h3>

                  {/* Add Comment */}
                  <div className="mb-6">
                    <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
                      <input
                        type="text"
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        placeholder={currentUser ? "Add a comment..." : "Please log in to comment"}
                        disabled={!currentUser || isCommenting}
                        className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
                        onKeyPress={(e) => e.key === 'Enter' && !isCommenting && sendComment()}
                      />
                      <button
                        onClick={sendComment}
                        disabled={!currentUser || isCommenting || !comment.trim()}
                        className="w-full sm:w-auto px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                      >
                        {isCommenting ? (
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        ) : (
                          <IoIosSend />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Comments List */}
                  <div className="space-y-4">
                    {selectedBlog.comments?.slice(0, visibleComments).map((comment, index) => (
                      <div key={comment._id || index} className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3 sm:p-4">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex flex-col sm:flex-row sm:items-center flex-1 min-w-0">
                            <div className="flex items-center mb-1 sm:mb-0">
                              <div className="w-5 h-5 sm:w-6 sm:h-6 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs font-semibold flex-shrink-0">
                                {comment.user?.username?.charAt(0)?.toUpperCase() || '?'}
                              </div>
                              <span className="ml-2 text-xs sm:text-sm font-medium text-gray-900 dark:text-white truncate">
                                {comment.user?.fullname || comment.user?.username || 'Unknown User'}
                              </span>
                            </div>
                            <span className="ml-7 sm:ml-2 text-xs text-gray-500 dark:text-gray-400">
                              {formatDate(comment.createdAt)}
                            </span>
                          </div>
                          {canDeleteComment(comment) && (
                            <button
                              onClick={() => deleteComment(comment._id)}
                              disabled={deletingCommentId === comment._id}
                              className={`text-sm transition-colors flex-shrink-0 ml-2 ${
                                deletingCommentId === comment._id
                                  ? 'text-gray-400 cursor-not-allowed'
                                  : 'text-red-500 hover:text-red-700'
                              }`}
                            >
                              {deletingCommentId === comment._id ? (
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-400"></div>
                              ) : (
                                <FaTrash />
                              )}
                            </button>
                          )}
                        </div>
                        <p className="text-xs sm:text-sm text-gray-700 dark:text-gray-300">
                          {comment.content || 'Comment content not available'}
                        </p>
                      </div>
                    ))}
                  </div>

                  {/* Load More Comments */}
                  {selectedBlog.comments?.length > visibleComments && (
                    <button
                      onClick={loadMoreComments}
                      className="mt-4 text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 text-sm font-medium"
                    >
                      Load more comments
                    </button>
                  )}

                  {/* No Comments */}
                  {(!selectedBlog.comments || selectedBlog.comments.length === 0) && (
                    <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                      <FaComment className="text-4xl mx-auto mb-2 opacity-50" />
                      <p>No comments yet. Be the first to comment!</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BlogFeed;

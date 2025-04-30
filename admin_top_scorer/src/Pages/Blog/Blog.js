import React, { useEffect, useState, useRef } from "react";
import BlogCard from "./BlogCard";
import axios from "axios";
import { Editor } from '@tinymce/tinymce-react';

function Blog() {
  const [showPopup, setShowPopup] = useState(false);
  const [image, setImage] = useState("");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [blogs, setBlogs] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const editorRef = useRef(null);

  const handleEditorChange = (content) => {
    setContent(content);
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImage(URL.createObjectURL(file));
    }
  };

  const handlePost = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        alert("You need to log in first");
        return;
      }

      const formData = new FormData();
      formData.append('title', title);
      formData.append('content', content);
      if (imageFile) formData.append('imagefile', imageFile);
      if (editMode) formData.append('id', selectedId);

      const url = editMode 
        ? `${process.env.REACT_APP_BACKEND_URL}/api/v1/users/updateBlog`
        : `${process.env.REACT_APP_BACKEND_URL}/api/v1/users/createBlog`;

      const response = await axios({
        method: editMode ? 'put' : 'post',
        url,
        data: formData,
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });
      
        resetForm();
        fetchBlogs();
      
    } catch (err) {
      console.error("Error posting blog:", err);
      if (err.response?.status === 401) {
        localStorage.removeItem('accessToken');
        alert("Your session has expired. Please log in again.");
      } else {
        alert(err.response?.data?.message || err.message || "Failed to save blog");
      }
    }
  };

  const resetForm = () => {
    setImage("");
    setTitle("");
    setContent("");
    setSelectedId(null);
    setEditMode(false);
    setShowPopup(false);
    setImageFile(null);
  };

  const handleCreateBlog = () => {
    resetForm();
    setShowPopup(true);
  };

  const fetchBlogs = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/api/v1/users/getAllblogs`
      );
      
      if (response.data && Array.isArray(response.data.blogs)) {
        setBlogs(response.data.blogs);
      } else {
        throw new Error("Invalid response format");
      }
    } catch (error) {
      console.error("Error fetching blogs:", error);
      setError("Failed to load blogs. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this blog?")) return;
    
    try {
      await axios.delete(
        `${process.env.REACT_APP_BACKEND_URL}/api/v1/users/deleteBlog`, 
        {
          headers: { 
            Authorization: `Bearer ${localStorage.getItem('accessToken')}` 
          },
          data: { id } 
        }
      );
      window.location.reload();
    } catch (err) {
      console.error("Error deleting blog:", err);
      alert(err.response?.data?.message || err.message || "Failed to delete blog");
    }
  };

  const handleEdit = (blog) => {
    setTitle(blog.title);
    setContent(blog.content);
    setImage(blog.imageUrl);
    setSelectedId(blog._id);
    setEditMode(true);
    setShowPopup(true);
  };
  
  useEffect(() => {
    fetchBlogs();
  }, []);

  return (
    <div className="w-full min-h-screen p-4 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Blog Posts</h1>
          <button
            onClick={handleCreateBlog}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors"
          >
            Create New Post
          </button>
        </div>

        <div className="border-b border-gray-200 mb-8"></div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : error ? (
          <div className="text-red-500 text-center py-4">{error}</div>
        ) : blogs.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No blogs found. Create your first blog!
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogs.map((blog) => (
              <BlogCard
                key={blog._id}
                title={blog.title}
                content={blog.content}
                image={blog.imageUrl}
                onEdit={() => handleEdit(blog)}
                onDelete={() => handleDelete(blog._id)}
              />
            ))}
          </div>
        )}

        {showPopup && (
          <div className="fixed inset-0 z-40 overflow-y-auto">
            <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
              <div className="fixed inset-0 transition-opacity" aria-hidden="true">
                <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
              </div>
              
              <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full">
                <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                  <div className="flex justify-between items-start">
                    <h3 className="text-2xl font-semibold text-gray-900">
                      {editMode ? "Edit Blog Post" : "Create New Blog Post"}
                    </h3>
                    <button
                      onClick={resetForm}
                      className="text-gray-400 hover:text-gray-500"
                    >
                      <span className="sr-only">Close</span>
                      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>

                  <div className="mt-6 space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Featured Image
                      </label>
                      <div className="flex items-center">
                        <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                          <div className="flex flex-col items-center justify-center pt-5 pb-6">
                            {image ? (
                              <img src={image} alt="Preview" className="h-24 object-contain" />
                            ) : (
                              <>
                                <svg className="w-8 h-8 mb-4 text-gray-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                                  <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"/>
                                </svg>
                                <p className="mb-2 text-sm text-gray-500">Upload an image</p>
                              </>
                            )}
                          </div>
                          <input 
                            id="dropzone-file" 
                            type="file" 
                            className="hidden" 
                            accept="image/*"
                            onChange={handleImageUpload}
                          />
                        </label>
                      </div>
                    </div>

                    <div>
                      <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                        Title
                      </label>
                      <input
                        type="text"
                        id="title"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="Enter a compelling title"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Content
                      </label>
                      <Editor
                        apiKey={process.env.REACT_APP_TINY_MCE_API_KEY}
                        onInit={(evt, editor) => editorRef.current = editor}
                        value={content}
                        init={{
                          height: 500,
                          menubar: true,
                          plugins: [
                            'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
                            'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
                            'insertdatetime', 'media', 'table', 'code', 'help', 'wordcount'
                          ],
                          toolbar: 'undo redo | blocks | ' +
                            'bold italic forecolor | alignleft aligncenter ' +
                            'alignright alignjustify | bullist numlist outdent indent | ' +
                            'link image media | table | code | help',
                          content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:16px }',
                          images_upload_url: `${process.env.REACT_APP_BACKEND_URL}/api/v1/users/upload`,
                          automatic_uploads: true,
                          file_picker_types: 'image',
                          images_reuse_filename: true,
                          image_title: true,
                          image_caption: true,
                          image_advtab: true
                        }}
                        onEditorChange={handleEditorChange}
                      />
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                  <button
                    type="button"
                    onClick={handlePost}
                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
                  >
                    {editMode ? "Update Post" : "Publish Post"}
                  </button>
                  <button
                    type="button"
                    onClick={resetForm}
                    className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Blog;
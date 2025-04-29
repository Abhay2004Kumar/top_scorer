import React, { useEffect, useState } from "react";
import BlogCard from "./BlogCard";
import axios from "axios";

function Blog() {
  const [showPopup, setShowPopup] = useState(false);
  const [image, setImage] = useState("");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [blogs, setBlogs] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const [selectedId, setSelectedId] = useState(null);

  const [imageFile, setImageFile] = useState(null);

const handleImageUpload = (e) => {
  const file = e.target.files[0];
  if (file) {
    setImageFile(file); // save raw file for FormData
    setImage(URL.createObjectURL(file)); // just for preview
  }
};


const handlePost = async () => {
  try {
    const token = localStorage.getItem('accessToken');
    const formData = new FormData();

    formData.append('title', title);
    formData.append('content', content);
    if (imageFile) formData.append('imagefile', imageFile); // imageFile must be the raw file object
    if(!editMode){
        const res = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/api/v1/users/createBlog`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        }
      );
    }
    else{
      formData.append('id',selectedId);
      const res = await axios.put(
        `${process.env.REACT_APP_BACKEND_URL}/api/v1/users/updateBlog`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        }
      );
    }
    

    fetchBlogs();
    resetForm();
  } catch (err) {
    console.error(err);
  }
};


  const resetForm = () => {
    setImage("");
    setTitle("");
    setContent("");
    setSelectedId(null);
    setEditMode(false);
    setShowPopup(false);
  };

  const handleCreateBlog = () => {
    resetForm();
    setShowPopup(true);
  };

  const fetchBlogs = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/v1/users/getAllblogs`);
      setBlogs(response.data.blogs);
    } catch (error) {
      console.error("Error fetching blogs:", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${process.env.REACT_APP_BACKEND_URL}/api/v1/users/deleteBlog`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` },
        data: {id: id } 
      });
      fetchBlogs();
    } catch (err) {
      console.error(err);
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
    <>
      <div className="w-full h-full p-4 bg-white">
        <div className="flex justify-between">
          <span className="font-extrabold font-mono text-2xl">Blogs</span>
          <button
            onClick={handleCreateBlog}
            className="text-white bg-blue-950 px-4 py-2 rounded-md"
          >
            Create Blog
          </button>
        </div>

        <div className="mt-2 w-[80vw] h-[1px] bg-black border-1-black"></div>

        <div className="flex flex-wrap  pt-2 grid-col-2 justify-evenly">
          {blogs?.map((val, idx) => (
            <BlogCard
            
              key={val._id}
              title={val.title}
              content={val.content}
              image={val.imageUrl}
              onEdit={() => handleEdit(val)}
              onDelete={() => handleDelete(val._id)}
            />
          ))}
        </div>
      </div>

      {/* Popup Dialog */}
      {showPopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-md h-[80vh] overflow-auto p-6 w-[90%] max-w-md relative">
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-red-500 text-xl"
              onClick={() => setShowPopup(false)}
            >
              &times;
            </button>
            <h2 className="text-xl font-semibold mb-4">
              {editMode ? "Update the Blog" : "Create a New Blog"}
            </h2>

            <div className="mb-4">
              <label className="block text-sm font-medium">Upload Image</label>
              <input type="file" accept="image/*" onChange={handleImageUpload} />
              {image && (
                <img
                  src={image}
                  alt="Preview"
                  className="mt-2 w-full h-[150px] object-cover rounded-md"
                />
              )}
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium">Title</label>
              <input
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium">Content</label>
              <textarea
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                rows={4}
                value={content}
                onChange={(e) => setContent(e.target.value)}
              ></textarea>
            </div>

            <button
              className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700"
              onClick={handlePost}
            >
              {editMode ? "Update Post" : "Post"}
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export default Blog;

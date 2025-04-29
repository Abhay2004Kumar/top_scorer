import React, { useEffect, useState } from "react";
import BlogCard from "./BlogCard";
import axios from "axios";

function Blog() {
  const [showPopup, setShowPopup] = useState(false);
  const [image, setImage] = useState("https://cdn.prod.website-files.com/5f58a4616a9e71d63ca059c8/63eb9c9bc0c7e518fd04ee67_MG1_2798.webp");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [blogs,setBlogs] = useState([]);

  const handleImageUpload = (e) => {
    // setImage(URL.createObjectURL(e.target.files[0]));
  };

  const handlePost = async () => {
 
    // Do something with image, title, content
    try{
      const res = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/v1/users/createBlog`,{imageUrl:image,title,content},{
            headers:{Authorization: `Bearer ${localStorage.getItem('accessToken')}` }
          })
          // Clear form
          // setImage(null);
          setTitle("");
          setContent("");
          setShowPopup(false);
    }
    catch(err){
      console.log(err);
    }
   
  };

  const handleUpdate = ()=>{
    console.log("updatioin....");
  }

  const handleCreateBlog = ()=>{
    setTitle("");
    setContent("");
    // setImage(null);
    setShowPopup(true);
  }

    const fetchBlogs = async () => {
    
      try {
        const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/v1/users/getAllblogs`);
        setBlogs(response.data.blogs);
      } catch (error) {
        console.error('Error fetching blogs:', error);
        // toast.error('Failed to fetch blogs');
      }
      // setLoading(false);
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
            onClick={() => handleCreateBlog()}
            className="text-white bg-blue-950 px-4 py-2 rounded-md"
          >
            Create Blog
          </button>
        </div>

        <div className="mt-2 w-[80vw] h-[1px] bg-black border-1-black"></div>

        <div className="flex flex-wrap justify-between pt-2">
        {
          blogs?.map((val,indx)=>{
            <BlogCard setTitle={val.title} setContent={val.content} setShowPopup={setShowPopup} title={"title"} content={"content"}/>
          })
        }
          {/* <BlogCard setTitle={setTitle} setContent={setContent} setShowPopup={setShowPopup} title={"title"} content={"content"}/>
          <BlogCard setTitle={setTitle} setContent={setContent} setShowPopup={setShowPopup} title={"title"} content={"content"}/>
          <BlogCard setTitle={setTitle} setContent={setContent} setShowPopup={setShowPopup} title={"title"} content={"content"}/>
          <BlogCard setTitle={setTitle} setContent={setContent} setShowPopup={setShowPopup} title={"title"} content={"content"}/> */}
          
        </div>
      </div>

      {/* Custom Popup Dialog */}
      {showPopup && (
        <div className="fixed  inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 " >
          <div className="bg-white  rounded-md h-[80vh] overflow-auto p-6 w-[90%] max-w-md relative ">
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-red-500 text-xl"
              onClick={() => setShowPopup(false)}
            >
              &times;
            </button>
            {
              title==''?(<h2 className="text-xl font-semibold mb-4">Create a New Blog</h2>):(<h2 className="text-xl font-semibold mb-4">Update the Blog</h2>)
            }
            

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
            {
              title==''?(<button
              className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700"
              onClick={handlePost}
            >
              Post
            </button>):(<button
              className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700"
              onClick={handlePost}
            >
              Update Post
            </button>)
            }
            
          </div>
        </div>
      )}
    </>
  );
}

export default Blog;

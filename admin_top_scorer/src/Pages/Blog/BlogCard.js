import React, { useState } from "react";
import { CiEdit } from "react-icons/ci";
import { MdDeleteForever } from "react-icons/md";

function BlogCard({ setTitle, setContent, setShowPopup, title, content, onDelete }) {
  const [showConfirm, setShowConfirm] = useState(false);

  const handleEditClick = () => {
    setShowPopup(true);
    setTitle(title);
    setContent(content);
  };

  const handleDeleteClick = () => {
    setShowConfirm(true);
  };

  const confirmDelete = () => {
    setShowConfirm(false);
    if (onDelete) onDelete(); // assuming onDelete is passed from parent
  };

  const cancelDelete = () => {
    setShowConfirm(false);
  };

  return (
    <div className="relative w-[300px] h-[360px] border-2 border-blue-400 rounded-md overflow-hidden mb-4">
      {/* Confirmation Popup */}
      {showConfirm && (
        <div className="absolute top-0 left-0 w-full h-full bg-black bg-opacity-50 flex items-center justify-center z-20">
          <div className="bg-white p-4 rounded shadow-md flex flex-col gap-3 items-center">
            <p>Are you sure you want to delete?</p>
            <div className="flex gap-4">
              <button
                onClick={confirmDelete}
                className="bg-red-500 text-white px-4 py-1 rounded hover:bg-red-600"
              >
                Yes
              </button>
              <button
                onClick={cancelDelete}
                className="bg-green-400 px-4 py-1 rounded hover:bg-green-600"
              >
                No
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit & Delete Buttons */}
      <div className="absolute bottom-[6px] right-1 flex gap-3 z-10">
        <button
          onClick={handleEditClick}
          className="p-1 bg-white rounded-full shadow-md hover:bg-blue-100 border border-blue-500"
        >
          <CiEdit size={20} />
        </button>
        <button
          onClick={handleDeleteClick}
          className="p-1 bg-white rounded-full shadow-md hover:bg-red-100 border border-blue-500"
        >
          <MdDeleteForever size={20} />
        </button>
      </div>

      {/* Image Section */}
      <div className="h-[60%] bg-gray-200 flex items-center justify-center">
        Image
      </div>

      {/* Content Section */}
      <div className="h-[35%] overflow-y-auto border-t-2 border-blue-400 p-2">
        <h4 className="font-bold">{title}</h4>
        <p>{content}</p>
      </div>
    </div>
  );
}

export default BlogCard;

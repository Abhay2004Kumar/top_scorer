import React, { useState } from "react";
import { CiEdit } from "react-icons/ci";
import { MdDeleteForever } from "react-icons/md";

function BlogCard({ title, content, image, onEdit, onDelete }) {
  const [showConfirm, setShowConfirm] = useState(false);

  return (
    <div className="relative w-[300px] h-[360px] border-2 border-blue-400 rounded-md overflow-hidden mb-4">
      {/* Confirmation Dialog */}
      {showConfirm && (
        <div className="absolute top-0 left-0 w-full h-full bg-black bg-opacity-50 flex items-center justify-center z-20">
          <div className="bg-white p-4 rounded shadow-md flex flex-col gap-3 items-center">
            <p>Are you sure you want to delete?</p>
            <div className="flex gap-4">
              <button
                onClick={() => {
                  setShowConfirm(false);
                  onDelete();
                }}
                className="bg-red-500 text-white px-4 py-1 rounded hover:bg-red-600"
              >
                Yes
              </button>
              <button
                onClick={() => setShowConfirm(false)}
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
          onClick={onEdit}
          className="p-1 bg-white rounded-full shadow-md hover:bg-blue-100 border border-blue-500"
        >
          <CiEdit size={20} />
        </button>
        <button
          onClick={() => setShowConfirm(true)}
          className="p-1 bg-white rounded-full shadow-md hover:bg-red-100 border border-blue-500"
        >
          <MdDeleteForever size={20} />
        </button>
      </div>

      {/* Image */}
      <div className="h-[60%] bg-gray-100">
        <img src={image} alt="blog" className="w-full h-full object-cover" />
      </div>

      {/* Title & Content */}
      <div className="h-[35%] overflow-y-auto border-t-2 border-blue-400 p-2">
        <h4 className="font-bold">{title}</h4>
        <p className="text-sm">{content}</p>
      </div>
    </div>
  );
}

export default BlogCard;

import React, { useState } from "react";
import { CiEdit } from "react-icons/ci";
import { MdDeleteForever } from "react-icons/md";

function BlogCard({ title, content, image, onEdit, onDelete }) {
  const [showConfirm, setShowConfirm] = useState(false);

  return (
    <div className="relative w-full max-w-sm bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
      {/* Confirmation Dialog */}
      {showConfirm && (
        <div className="absolute inset-0 z-20 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white p-4 rounded-lg shadow-xl max-w-xs w-full">
            <p className="text-gray-800 mb-4">Are you sure you want to delete this blog?</p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowConfirm(false)}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setShowConfirm(false);
                  onDelete();
                }}
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Image */}
      <div className="h-48 w-full overflow-hidden">
        <img 
          src={image || "https://via.placeholder.com/400x200?text=No+Image"} 
          alt={title}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 dangerouslySetInnerHTML={{ __html: title }} className="text-xl font-bold text-gray-800 mb-2 line-clamp-2"></h3>
        <div 
          className="prose prose-sm max-w-none text-gray-600 line-clamp-3"
          dangerouslySetInnerHTML={{ __html: content }}
        />
      </div>

      {/* Action Buttons */}
      <div className="absolute top-2 right-2 flex gap-2">
        <button
          onClick={onEdit}
          className="p-2 bg-white rounded-full shadow-md hover:bg-blue-50 text-blue-600"
          aria-label="Edit blog"
        >
          <CiEdit size={20} />
        </button>
        <button
          onClick={() => setShowConfirm(true)}
          className="p-2 bg-white rounded-full shadow-md hover:bg-red-50 text-red-600"
          aria-label="Delete blog"
        >
          <MdDeleteForever size={20} />
        </button>
      </div>
    </div>
  );
}

export default BlogCard;
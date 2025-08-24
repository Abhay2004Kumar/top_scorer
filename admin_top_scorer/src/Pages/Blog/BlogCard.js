import React, { useState } from "react";
import { CiEdit } from "react-icons/ci";
import { MdDeleteForever } from "react-icons/md";

function BlogCard({ title, content, image, onEdit, onDelete, isDeleting }) {

  return (
    <div className="relative w-full max-w-sm bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">

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
          onClick={onDelete}
          disabled={isDeleting}
          className={`p-2 bg-white rounded-full shadow-md transition-colors ${
            isDeleting
              ? 'opacity-50 cursor-not-allowed'
              : 'hover:bg-red-50 text-red-600'
          }`}
          aria-label="Delete blog"
        >
          {isDeleting ? (
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-red-600"></div>
          ) : (
            <MdDeleteForever size={20} />
          )}
        </button>
      </div>
    </div>
  );
}

export default BlogCard;
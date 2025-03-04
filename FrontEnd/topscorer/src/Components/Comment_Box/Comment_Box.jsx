import React from 'react';
import { RxAvatar } from "react-icons/rx";

export default function Comment_Box({ user, mssg, createdAt }) {
  return (
    <div className="flex gap-4 p-4 rounded-lg m-1 shadow-md border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
      {/* Avatar and username in a vertical stack */}
      <div className="flex flex-col items-center">
        <div className="w-10 h-10 bg-gray-300 dark:bg-gray-600 rounded-full flex items-center justify-center text-xl">
          <RxAvatar className="text-gray-600 dark:text-gray-300" />
        </div>
        <span className="text-xs text-gray-500 dark:text-gray-400 mt-1">{createdAt}</span>
      </div>

      {/* Comment content */}
      <div className="flex-1">
        <h3 className="font-semibold text-gray-900 dark:text-gray-200">{user}</h3>
        <p className="text-gray-700 dark:text-gray-300 mt-1">{mssg}</p>
      </div>
    </div>
  );
}

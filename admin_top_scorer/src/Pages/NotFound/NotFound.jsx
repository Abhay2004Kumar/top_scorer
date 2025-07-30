import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-900 p-4">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-gray-800 dark:text-white mb-4">404</h1>
        <h2 className="text-3xl font-semibold text-gray-700 dark:text-gray-300 mb-6">Page Not Found</h2>
        <p className="text-gray-600 dark:text-gray-400 mb-8">
          Oops! The page you're looking for doesn't exist or has been moved.
        </p>
        <Link
          to="/"
          className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
        >
          Go to Dashboard
        </Link>
      </div>
    </div>
  );
};

export default NotFound;

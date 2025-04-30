import React from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import style from "../Header/Header.module.css"

function Header({ username }) {
  const navigateTo = (path) => {
    window.location.href = path;
  };

  const handleLogout = async () => {
    try {
      // Send logout request to the API
      const accessToken = localStorage.getItem('accessToken');
      if (!accessToken) {
        toast.error('No access token found. You are already logged out.');
        navigateTo('/signin');
        return;
      }

      const response = await axios.post(
        'http://localhost:5000/api/v1/admin/logOutAdmin',
        {},
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );

      if (response.data.statusCode === 200) {
        toast.success('Successfully logged out.');
        // Clear tokens and navigate to sign-in page
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        navigateTo('/signin'); 
      } else {
        toast.error('Logout failed. Please try again.');
      }
    } catch (error) {
      console.error('Error during logout:', error);
      toast.error('An error occurred during logout. Please try again.');
    }
  };

  return (
    <>
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4 bg-white dark:bg-gray-900 shadow-md">
        <div className="flex items-center space-x-3">
          <img src="https://img.freepik.com/free-vector/business-user-shield_78370-7029.jpg?semt=ais_hybrid&w=740" alt="Logo" className="h-10 w-10 object-contain" />
          <h1 className="text-xl font-semibold text-gray-800 dark:text-white">Sports Admin</h1>
        </div>
        <nav className="flex items-center space-x-4">
          {/* <span className="text-gray-700 dark:text-gray-300">{username}</span> */}
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-md transition-colors"
          >
            Sign Out
          </button>
        </nav>
      </header>

      {/* Horizontal Bar for Sports Options */}
      <div className={style.Sports_Bar}>
        <button
          className={style.Sports_Button}
          onClick={() => navigateTo('/kabbadi')}
        >
          Kabbadi
        </button>
        <button
          className={style.Sports_Button}
          onClick={() => navigateTo('/football')}
        >
          Football
        </button>
        <button
          className={style.Sports_Button}
          onClick={() => navigateTo('/Badminton')}
        >
          Badminton
        </button>
        <button
          className={style.Sports_Button}
          onClick={() => navigateTo('/BadmintonDoubles')}
        >
          Badminton_D
        </button>

        <button
          className={style.Sports_Button}
          onClick={() => navigateTo('/tennis')}
        >
          Tennis
        </button>
        <button
          className={style.Sports_Button}
          onClick={() => navigateTo('/tennis_D')}
        >
          Tennis_D
        </button>
        <button
          className={style.Sports_Button}
          onClick={() => navigateTo('/cricket')}
        >
          Cricket
        </button>

        <button
          className={style.Sports_Button}
          onClick={() => navigateTo('/blogs')}
        >
          Blogs
        </button>
      </div>
    </>
  );
}

export default Header;

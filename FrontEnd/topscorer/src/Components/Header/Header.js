import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { IoExitOutline } from "react-icons/io5";
import toast from 'react-hot-toast';
import icons from '../../Project_Icon/Dark.png';

function Header({ islogin, setislogin }) {
  const navigate = useNavigate();
  const [isUser, setIsUser] = useState('');
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  useEffect(() => {
    const acToken = localStorage.getItem('accessToken');
    if (acToken) {
      const payload = acToken.split('.')[1];
      const decodedPayload = JSON.parse(atob(payload));
      if (decodedPayload.username) {
        setIsUser(decodedPayload.username);
      }
    }
  }, [islogin]);

  const handleLoginClick = () => {
    navigate('/dashboard/login');
  };

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    setIsUser('');
    setislogin(false);

    // Dispatch auth change event
    window.dispatchEvent(new Event('authChange'));

    toast.promise(
      Promise.resolve(),
      {
        loading: 'Logging Out...',
        success: <b>See you soon!</b>,
        error: <b>Logout failed. Please try again.</b>
      }
    );

    navigate('/');
  };

  return (
    <header className="bg-white text-black dark:bg-gray-900 dark:text-white flex justify-between items-center px-3 sm:px-6 py-3 sm:py-4 shadow-md">
      <div className="flex items-center space-x-2 sm:space-x-3">
        <img src={icons} alt="Dark Icon" className="w-8 h-8 sm:w-10 sm:h-10" />
        <span className="hidden sm:inline text-lg font-semibold">TopScorer</span>
      </div>
      <nav className="flex items-center space-x-3 sm:space-x-6">
        <Link to={"/"} className="text-sm sm:text-base text-gray-700 dark:text-gray-300 hover:text-black dark:hover:text-white transition">Home</Link>
        {isUser ? (
          <div className="flex items-center space-x-2 sm:space-x-3">
            <span className="text-xs sm:text-sm font-medium hidden sm:inline">{isUser}</span>
            <span className="text-xs font-medium sm:hidden">{isUser.length > 8 ? isUser.substring(0, 8) + '...' : isUser}</span>
            <button onClick={handleLogout} className="text-gray-600 dark:text-gray-400 hover:text-red-500 transition p-1">
              <IoExitOutline size={20} className="sm:w-6 sm:h-6" />
            </button>
          </div>
        ) : (
          <button onClick={handleLoginClick} className="bg-green-500 text-white dark:bg-green-600 px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg hover:bg-green-600 dark:hover:bg-green-700 transition text-sm sm:text-base">
            Login
          </button>
        )}
      </nav>
    </header>
  );
}

export default Header;
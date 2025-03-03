import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
    navigate('/login');
  };

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    setIsUser('');
    setislogin(false);

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
    <header className="bg-white text-black dark:bg-gray-900 dark:text-white flex justify-between items-center px-6 py-4 shadow-md">
      <div className="flex items-center space-x-3">
        <img src={icons} alt="Dark Icon" className="w-2-0 h-10" />
        <span className="text-lg font-semibold">TopScorer</span>
      </div>
      <nav className="flex items-center space-x-6">
        <a href="/" className="text-gray-700 dark:text-gray-300 hover:text-black dark:hover:text-white transition">Home</a>
        {isUser ? (
          <div className="flex items-center space-x-3">
            <span className="text-sm font-medium">{isUser}</span>
            <button onClick={handleLogout} className="text-gray-600 dark:text-gray-400 hover:text-red-500 transition">
              <IoExitOutline size={24} />
            </button>
          </div>
        ) : (
          <button onClick={handleLoginClick} className="bg-green-500 text-white dark:bg-green-600 px-4 py-2 rounded-lg hover:bg-green-600 dark:hover:bg-green-700 transition">
            Login
          </button>
        )}
      </nav>
    </header>
  );
}

export default Header;
import React from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { Link, useNavigate } from 'react-router-dom';

function Header({ username, setIsLogin }) {
  const navigate = useNavigate();

  const handleLogout = async () => {
    const accessToken = localStorage.getItem('accessToken');
    
    try {
      if (accessToken) {
        await axios.post(
          `${process.env.REACT_APP_BACKEND_URL}/api/v1/admin/logOutAdmin`,
          {},
          {
            headers: { Authorization: `Bearer ${accessToken}` },
            withCredentials: true,
          }
        );
      }

      toast.success('Successfully logged out.');
    } catch (error) {
      console.error('Error during logout API call:', error);
      toast.error('Logout failed on server, but clearing local session.');
    } finally {
      // Clear auth state and redirect
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      setIsLogin(false);
      navigate('/signin');
    }
  };

  return (
    <>
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4 bg-white dark:bg-gray-900 shadow-md">
        <div className="flex items-center space-x-3">
          <img
            src="https://img.freepik.com/free-vector/business-user-shield_78370-7029.jpg?semt=ais_hybrid&w=740"
            alt="Logo"
            className="h-10 w-10 object-contain"
          />
          <h1 className="text-xl font-semibold text-gray-800 dark:text-white">Sports Admin</h1>
        </div>
        <nav className="flex items-center space-x-4">
          {username && (
            <span className="text-gray-700 dark:text-gray-300 text-sm font-medium">
              Logged in as: {username}
            </span>
          )}
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-md transition-colors"
          >
            Sign Out
          </button>
        </nav>
      </header>

      {/* Sports Navigation Bar */}
      <div className="bg-gray-100 dark:bg-gray-800 flex justify-evenly flex-wrap gap-2 px-4 py-3 shadow-sm">
        {[
          { label: 'Kabbadi', path: '/kabbadi' },
          { label: 'Football', path: '/football' },
          { label: 'Badminton', path: '/Badminton' },
          { label: 'Badminton_D', path: '/BadmintonDoubles' },
          { label: 'Tennis', path: '/tennis' },
          { label: 'Tennis_D', path: '/tennis_D' },
          { label: 'Cricket', path: '/cricket' },
          { label: 'Blogs', path: '/blogs' },
        ].map((sport) => (
          <Link
            key={sport.label}
            to={sport.path}
            className="px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-sm font-medium transition"
          >
            {sport.label}
          </Link>
        ))}
      </div>
    </>
  );
}

export default Header;

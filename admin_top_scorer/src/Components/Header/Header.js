import React from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

function Header({ username }) {
  const navigateTo = (path) => {
    window.location.href = path;
  };

  const handleLogout = async () => {
    try {
      const accessToken = localStorage.getItem('admin_accessToken');
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
        localStorage.removeItem('admin_accessToken');
        localStorage.removeItem('admin_refreshToken');
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

      {/* Sports Navigation Bar */}
      <div className="bg-gray-100 dark:bg-gray-800 flex flex-wrap justify-center gap-2 px-4 py-3 shadow-sm">
        {[
          { label: 'Kabbadi', path: '/kabbadi' },
          { label: 'Football', path: '/football' },
          { label: 'Badminton', path: '/Badminton' },
          { label: 'Badminton_D', path: '/BadmintonDoubles' },
          { label: 'Tennis', path: '/tennis' },
          { label: 'Tennis_D', path: '/tennis_D' },
          { label: 'Cricket', path: '/cricket' },
        ].map((sport) => (
          <button
            key={sport.label}
            onClick={() => navigateTo(sport.path)}
            className="px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-sm font-medium transition"
          >
            {sport.label}
          </button>
        ))}
      </div>
    </>
  );
}

export default Header;

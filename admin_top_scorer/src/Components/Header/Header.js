import React from 'react';
import axios from 'axios';
import style from '../Header/Header.module.css';
import toast from 'react-hot-toast';

function Header({ username }) {
  const navigateTo = (path) => {
    window.location.href = path; // Simple navigation using window.location
  };

  const handleLogout = async () => {
    try {
      // Send logout request to the API
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

      console.log(response)
      if (response.data.statusCode === 200 ) {
        toast.success('Successfully logged out.');
        // Clear tokens and navigate to sign-in page
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
      {/* Header Section */}
      <header className={style.Header}>
        <div className={style.Logo}>
          <img src="/logo.png" alt="Logo" /> {/* Replace with your logo path */}
          <h1>Sports Admin</h1>
        </div>
        <nav className={style.Nav}>
          {/* <span>{username}</span> */}
          <button className={style.Nav_Button} onClick={handleLogout}>
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
      </div>
    </>
  );
}

export default Header;

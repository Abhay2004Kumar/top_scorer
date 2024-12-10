import React, { useState } from 'react';
import axios from 'axios'; // Import Axios for API calls
import { FaGoogle, FaFacebook, FaLinkedin } from "react-icons/fa";
import { Link, useNavigate } from 'react-router-dom'; // For navigation
import style from '../LoginPage/login.module.css';
import toast from 'react-hot-toast';

function Login({setislogin}) {
  const [emailOrUsername, setEmailOrUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate(); // To redirect the user after login

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
        const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/v1/users/loginUser`, { 
            login: emailOrUsername, 
            password: password 
        });
        console.log(response); // The response body shows data returned from the backend

        // Assuming the backend returns a JWT token and user data
        const { accessToken, refreshToken } = response.data.data;

        // Save tokens in localStorage
        localStorage.setItem('accessToken', accessToken);
        localStorage.setItem('refreshToken', refreshToken);

        // Save tokens in browser cookies
        document.cookie = `accessToken=${accessToken}; path=/; max-age=3600; Secure`;
        document.cookie = `refreshToken=${refreshToken}; path=/; max-age=604800; Secure`;

        setislogin(true);

        // Redirect to the dashboard or homepage
        toast.success(`Welcome, ${response.data.data.user.username}!`);
        navigate('/');

    } catch (err) {
        console.error(err);
        toast.error('Login failed');
        // Optionally handle error messages here
    }
};



  return (
    <>
      <div className={style.f_div}>
        <div className={style.image}>
          <img 
            src="https://e0.pxfuel.com/wallpapers/649/530/desktop-wallpaper-cricket-cricket-iphone.jpg" 
            alt="Cricket"
          />
          <div className={style.gradient}></div> 

          <div className={style.quote}>Live The Spirit</div> 
        </div>

        <div className={style.main2}>
          <h1>Join Us!</h1>
          <div className={style.inner}>
            <form onSubmit={handleSubmit}>
              <input 
                className={style.inp2} 
                type='text' 
                placeholder='Username or Email'
                value={emailOrUsername}
                onChange={(e) => setEmailOrUsername(e.target.value)}
                required
              />

              <input 
                className={style.inp2} 
                type="password" 
                placeholder='Password or OTP'
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />

              {error && <p className={style.errorText}>{error}</p>} {/* Display error messages */}

              <input 
                className={style.sb_btn}
                type='submit' 
                value='Login'
              />
            </form>

            <div className={style.icon_c}>
              <div className={style.icon}> <FaGoogle className={style.ic}/></div>
              <div className={style.icon}><FaFacebook className={style.ic} /></div>
              <div className={style.icon}><FaLinkedin className={style.ic} /></div>
            </div>

            <div className={style.terms}>
              <p className={style.termsText}>
                Don't have an account?{" "}
                <Link to="/sign_up" className={style.footerLink}>Sign Up</Link>
              </p>

              <p className={style.termsText}>
                By logging in, you agree to our <Link to="/tnc" className={style.termsLink}>Terms and Conditions</Link>.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Login;

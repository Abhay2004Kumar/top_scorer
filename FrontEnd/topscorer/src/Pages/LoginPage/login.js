import React, { useState } from 'react';
import axios from 'axios';
import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

const Login = ({ setislogin }) => {
    const [emailOrUsername, setEmailOrUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/v1/users/loginUser`, {
                login: emailOrUsername,
                password: password
            });

            const { accessToken, refreshToken } = response.data.data;
            localStorage.setItem('accessToken', accessToken);
            localStorage.setItem('refreshToken', refreshToken);

            document.cookie = `accessToken=${accessToken}; path=/; max-age=3600; Secure`;
            document.cookie = `refreshToken=${refreshToken}; path=/; max-age=604800; Secure`;

            setislogin(true);
            toast.success(`Welcome, ${response.data.data.user.username}!`);
            navigate('/');
        } catch (err) {
            console.error(err);
            toast.error('Login failed');
        }
    };

    const handleGoogleSuccess = async (credentialResponse) => {
        if (credentialResponse.credential) {
            const decodedToken = jwtDecode(credentialResponse.credential);

            try {
                const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/v1/users/google-login`, {
                    credential: credentialResponse.credential,
                });

                const { accessToken, refreshToken, user } = response.data.data;
                localStorage.setItem('accessToken', accessToken);
                localStorage.setItem('refreshToken', refreshToken);

                document.cookie = `accessToken=${accessToken}; path=/; max-age=3600; Secure`;
                document.cookie = `refreshToken=${refreshToken}; path=/; max-age=604800; Secure`;

                setislogin(true);
                toast.success(`Welcome, ${user.username}!`);
                navigate('/');
            } catch (error) {
                console.error("Google login error:", error);
                toast.error("Google login failed");
            }
        } else {
            console.error("No credential received");
            toast.error("Google login failed");
        }
    };

    // Carousel settings
    const carouselSettings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 3000,
        pauseOnHover: true,
        arrows: false, // Hide arrows for a cleaner look
    };

    // Carousel images
    const carouselImages = [
        'https://e0.pxfuel.com/wallpapers/649/530/desktop-wallpaper-cricket-cricket-iphone.jpg',
        'https://i.pinimg.com/736x/57/dd/90/57dd90c62e0de08a2774bf2b3b919bcb.jpg',
        'https://w0.peakpx.com/wallpaper/400/122/HD-wallpaper-chess-board-greetings-happy-paris-tumblr-twilight-zen.jpg',
    ];

    return (
        <div className="flex flex-col md:flex-row h-[700px] w-full bg-gray-100 dark:bg-gray-900 overflow-hidden">

            {/* Left Section with Carousel */}
            <div className="relative hidden md:flex w-1/3 overflow-hidden rounded-r-3xl shadow-sm ">
            <Slider {...carouselSettings} className="w-full h-full rounded-r-3xl">
                {carouselImages.map((image, index) => (
                    <div key={index} className="w-full h-full">
                        <img
                            src={image}
                            alt={`Carousel Image ${index + 1}`}
                            className="w-full h-full object-cover object-center rounded-r-3xl" // Emphasize the center of the image
                        />
                        <div className="absolute inset-0 bg-gradient-to-r from-black/10 via-black/10 to-black/20 rounded-r-3xl"></div>
                    </div>
                ))}
            </Slider>
            <h1 className="absolute bottom-10 left-10 text-white text-4xl font-bold animate-slide-in-left">
                Live The Spirit
            </h1>
        </div>

            {/* Right Section with Form */}
            {/* Right Section with Form */}
            <div className="flex flex-col justify-center items-center w-full md:w-1/2 h-full p-6">


                <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 animate-fade-in">
                    Join Us!
                </h1>

                {/* Login Form */}
                <form onSubmit={handleSubmit} className="mt-6 w-full max-w-sm space-y-4 animate-fade-in-up">
                    <input 
                        className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-white focus:ring-2 focus:ring-blue-400 transition-all duration-300 hover:shadow-lg"
                        type='text' 
                        placeholder='Username or Email'
                        value={emailOrUsername}
                        onChange={(e) => setEmailOrUsername(e.target.value)}
                        required
                    />
                    <input 
                        className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-white focus:ring-2 focus:ring-blue-400 transition-all duration-300 hover:shadow-lg"
                        type="password" 
                        placeholder='Password or OTP'
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    <button 
                        type="submit" 
                        className="w-full p-3 rounded-lg bg-blue-500 text-white font-semibold hover:bg-blue-600 transition-transform transform hover:scale-105 active:scale-95"
                    >
                        Login
                    </button>
                </form>

                {/* Google Login */}
                <div className="mt-4 flex flex-col items-center animate-fade-in-up">
                    <GoogleLogin
                        onSuccess={handleGoogleSuccess}
                        onError={() => {
                            console.error("Google Login Failed");
                            toast.error("Google Login Failed");
                        }}
                    />
                </div>

                {/* Footer Links */}
                <div className="mt-4 text-center animate-fade-in-up">
                    <p className="text-gray-600 dark:text-gray-400">
                        Don't have an account?{' '}
                        <Link to="/sign_up" className="text-blue-500 hover:underline transition-all duration-300 hover:text-blue-600">
                            Sign Up
                        </Link>
                    </p>
                    <p className="text-gray-600 dark:text-gray-400">
                        By logging in, you agree to our{' '}
                        <Link to="/tnc" className="text-blue-500 hover:underline transition-all duration-300 hover:text-blue-600">
                            Terms and Conditions
                        </Link>.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;
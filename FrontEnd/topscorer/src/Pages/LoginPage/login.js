import React, { useState } from 'react';
import { api } from '../../util/axiosUtil';
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
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        
        try {
            // Determine if input is email or username
            const isEmail = emailOrUsername.includes('@');
            const credentials = isEmail 
                ? { email: emailOrUsername, password }
                : { username: emailOrUsername, password };

            const response = await api.login(credentials);

            const { accessToken, refreshToken, user } = response.data.data;
            
            // Store tokens
            localStorage.setItem('accessToken', accessToken);
            localStorage.setItem('refreshToken', refreshToken);

            // Set cookies for better security
            document.cookie = `accessToken=${accessToken}; path=/; max-age=3600; Secure; SameSite=Strict`;
            document.cookie = `refreshToken=${refreshToken}; path=/; max-age=604800; Secure; SameSite=Strict`;

            // Dispatch auth change event
            window.dispatchEvent(new Event('authChange'));

            setislogin(true);
            toast.success(`Welcome back, ${user.username}!`);
            navigate('/dashboard');
        } catch (err) {
            console.error('Login error:', err);
            if (err.response?.data?.message) {
                toast.error(err.response.data.message);
            } else {
                toast.error('Login failed. Please check your credentials.');
            }
        } finally {
            setIsLoading(false);
        }
    };

    const handleGoogleSuccess = async (credentialResponse) => {
        if (credentialResponse.credential) {
            const decodedToken = jwtDecode(credentialResponse.credential);

            try {
                const response = await api.googleLogin({
                    credential: credentialResponse.credential,
                });

                const { accessToken, refreshToken, user } = response.data.data;
                
                // Store tokens
                localStorage.setItem('accessToken', accessToken);
                localStorage.setItem('refreshToken', refreshToken);

                // Set cookies for better security
                document.cookie = `accessToken=${accessToken}; path=/; max-age=3600; Secure; SameSite=Strict`;
                document.cookie = `refreshToken=${refreshToken}; path=/; max-age=604800; Secure; SameSite=Strict`;

                // Dispatch auth change event
                window.dispatchEvent(new Event('authChange'));

                setislogin(true);
                toast.success(`Welcome, ${user.username}!`);
                navigate('/dashboard');
            } catch (error) {
                console.error("Google login error:", error);
                if (error.response?.data?.message) {
                    toast.error(error.response.data.message);
                } else {
                    toast.error("Google login failed");
                }
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
        'https://img.freepik.com/free-photo/badminton-concept-with-dramatic-lighting_23-2149940937.jpg',
    ];

    return (
        <div className="flex flex-col md:flex-row min-h-screen w-full bg-gray-100 dark:bg-gray-900 overflow-hidden">

            {/* Left Section with Carousel */}
            <div className="relative hidden md:flex w-1/3 overflow-hidden rounded-r-3xl shadow-sm">
            <Slider {...carouselSettings} className="w-full rounded-r-3xl">
                {carouselImages.map((image, index) => (
                    <div key={index} className="w-full h-full">
                        <img
                            src={image}
                            alt={`Carousel Image ${index + 1}`}
                            className="w-full h-full object-cover object-center rounded-r-3xl"
                        />
                    </div>
                ))}
            </Slider>
            </div>

            {/* Right Section with Login Form */}
            <div className="flex-1 flex items-center justify-center px-3 sm:px-4 lg:px-8 py-8">
                <div className="max-w-md w-full space-y-6 sm:space-y-8">
                    <div>
                        <h2 className="mt-6 text-center text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white">
                            Sign in to your account
                        </h2>
                        <p className="mt-2 text-center text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                            Or{' '}
                            <Link to="/signup" className="font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400">
                                create a new account
                            </Link>
                        </p>
                    </div>
                    <form className="mt-6 sm:mt-8 space-y-4 sm:space-y-6" onSubmit={handleSubmit}>
                        <div className="rounded-md shadow-sm space-y-3 sm:space-y-0 sm:-space-y-px">
                            <div>
                                <label htmlFor="emailOrUsername" className="sr-only">
                                    Email or Username
                                </label>
                                <input
                                    id="emailOrUsername"
                                    name="emailOrUsername"
                                    type="text"
                                    required
                                    className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md sm:rounded-none sm:rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 text-sm dark:bg-gray-800 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
                                    placeholder="Email or Username"
                                    value={emailOrUsername}
                                    onChange={(e) => setEmailOrUsername(e.target.value)}
                                    disabled={isLoading}
                                />
                            </div>
                            <div>
                                <label htmlFor="password" className="sr-only">
                                    Password
                                </label>
                                <input
                                    id="password"
                                    name="password"
                                    type="password"
                                    required
                                    className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md sm:rounded-none sm:rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 text-sm dark:bg-gray-800 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
                                    placeholder="Password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    disabled={isLoading}
                                />
                            </div>
                        </div>

                        <div>
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isLoading ? (
                                    <span className="flex items-center">
                                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Signing in...
                                    </span>
                                ) : (
                                    'Sign in'
                                )}
                            </button>
                        </div>

                        <div className="flex items-center justify-center">
                            <div className="text-sm">
                                <a href="#" className="font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400">
                                    Forgot your password?
                                </a>
                            </div>
                        </div>

                        <div className="mt-4 sm:mt-6">
                            <div className="relative">
                                <div className="absolute inset-0 flex items-center">
                                    <div className="w-full border-t border-gray-300 dark:border-gray-600" />
                                </div>
                                <div className="relative flex justify-center text-xs sm:text-sm">
                                    <span className="px-2 bg-gray-100 dark:bg-gray-900 text-gray-500 dark:text-gray-400">Or continue with</span>
                                </div>
                            </div>

                            <div className="mt-4 sm:mt-6 flex justify-center">
                                <GoogleLogin
                                    onSuccess={handleGoogleSuccess}
                                    onError={() => {
                                        console.log('Login Failed');
                                        toast.error('Google login failed');
                                    }}
                                    useOneTap
                                    theme="filled_blue"
                                    size="large"
                                    text="signin_with"
                                    shape="rectangular"
                                />
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Login;
import React, { useState, useEffect } from "react";
import axios from "axios";
import styles from '../SignUp/SignUp.module.css';
import toast from "react-hot-toast";

const SignupPage = () => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [fadeClass, setFadeClass] = useState(styles.fadeIn);

    const [username, setUsername] = useState("");
    const [fullname, setFullname] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const images = [
        "https://p.imgci.com/db/PICTURES/CMS/357400/357408.jpg",
        "https://wallpapers.com/images/hd/messi-pictures-jzykf84saw6wbkd6.jpg",
        "https://img.freepik.com/free-photo/badminton-concept-with-dramatic-lighting_23-2149940937.jpg",
    ];

    // Handle form input changes
    const handleInputChange = (setter) => (e) => {
        setter(e.target.value);
    };

    // Form submission handler
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            toast.error("Passwords do not match!");
            return;
        }

        try {
            const userData = { username, fullname, email, password };

            const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/v1/users/registerUser`, userData);

            console.log(response.data);
            toast.success('Signup successful! You can now log in.');

        } catch (error) {
            console.error("Signup error:", error.message);
            toast.error('Signup failed. User already exist.');
        }
    };

    // Auto-slide logic with animation
    useEffect(() => {
        const interval = setInterval(() => {
            setFadeClass(styles.fadeOut);
            setTimeout(() => {
                setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
                setFadeClass(styles.fadeIn);
            }, 200);
        }, 4000);

        return () => clearInterval(interval);
    }, [images.length]);

    return (
        <div className={styles.container}>
            {/* Form Section */}
            <div className={styles.formSection}>
                <h1 className={styles.header}>Sign Up</h1>
                <p>Let’s join the world of sports!</p>

                <form className={styles.form} onSubmit={handleSubmit}>
                    <input
                        type="text"
                        placeholder="Username"
                        className={styles.input}
                        value={username}
                        onChange={handleInputChange(setUsername)}
                        required
                    />
                    <input
                        type="text"
                        placeholder="Full Name"
                        className={styles.input}
                        value={fullname}
                        onChange={handleInputChange(setFullname)}
                        required
                    />
                    <input
                        type="email"
                        placeholder="Email"
                        className={styles.input}
                        value={email}
                        onChange={handleInputChange(setEmail)}
                        required
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        className={styles.input}
                        value={password}
                        onChange={handleInputChange(setPassword)}
                        required
                    />
                    <input
                        type="password"
                        placeholder="Confirm Password"
                        className={styles.input}
                        value={confirmPassword}
                        onChange={handleInputChange(setConfirmPassword)}
                        required
                    />
                    <button type="submit" className={styles.button}>
                        Sign Up
                    </button>
                </form>

                <p className={styles.footerText}>
                    Already have an account?{" "}
                    <a className={styles.footerLink} href="/login">
                        Login
                    </a>
                </p>
            </div>

            {/* Carousel Section */}
            <div className={`${styles.carouselSection} ${window.innerWidth <= 768 ? styles.hideCarousel : ''}`}>
                <img
                    src={images[currentIndex]}
                    alt={`Slide ${currentIndex + 1}`}
                    className={`${styles.carouselImage} ${fadeClass}`}
                />
            </div>
        </div>
    );
};

export default SignupPage;

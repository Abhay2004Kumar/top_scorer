import React, { useState, useEffect } from "react";
import styles from '../SignUp/SignUp.module.css';

const SignupPage = () => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [fadeClass, setFadeClass] = useState(styles.fadeIn);

    const images = [
        "https://p.imgci.com/db/PICTURES/CMS/357400/357408.jpg",
        "https://wallpapers.com/images/hd/messi-pictures-jzykf84saw6wbkd6.jpg",
        "https://img.freepik.com/free-photo/badminton-concept-with-dramatic-lighting_23-2149940937.jpg",
    ];

    // Auto-slide logic with animation
    useEffect(() => {
        const interval = setInterval(() => {
            setFadeClass(styles.fadeOut); // Start fade-out animation

            setTimeout(() => {
                setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
                setFadeClass(styles.fadeIn); // Start fade-in animation
            }, 200);  // Ensure this matches the transition duration
        }, 4000);  // Change every 4 seconds

        return () => clearInterval(interval);  // Cleanup
    }, [images.length]);

    return (
        <div className={styles.container}>
            {/* Form Section */}
            <div className={styles.formSection}>
                <h1 className={styles.header}>Sign Up</h1>
                <p>Let’s join the world of sports!</p>
                <form className={styles.form}>
                    <input
                        type="text"
                        placeholder="Username"
                        className={styles.input}
                        required
                    />
                    <input
                        type="text"
                        placeholder="Full Name"
                        className={styles.input}
                        required
                    />
                    <input
                        type="email"
                        placeholder="Email"
                        className={styles.input}
                        required
                    />
                     <input
                        type="password"
                        placeholder="Password"
                        className={styles.input}
                        required
                    />
                     <input
                        type="password"
                        placeholder="Confirm Password"
                        className={styles.input}
                        required
                    />
                    <button type="submit" className={styles.button}>
                        Sign Up
                    </button>
                </form>
                <p className={styles.footerText}>
                    Already have an account?{" "}
                    <span className={styles.footerLink} >Login</span>
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

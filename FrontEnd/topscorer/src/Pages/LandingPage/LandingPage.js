import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import icons from '../../Project_Icon/Dark.png';

const LandingPage = () => {
  const navigate = useNavigate();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Array of background images
  const backgroundImages = [
    "/Images/im1.png",
    "/Images/im2.png",
    "/Images/im3.png",
    "/Images/im4.png",
    "/Images/im5.png"
  ];
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    }
  };

  // Auto-rotate images every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) =>
        prevIndex === backgroundImages.length - 1 ? 0 : prevIndex + 1
      );
    }, 2500);
    return () => clearInterval(interval);
  }, [backgroundImages.length]);

  return (
    <div className="relative h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 text-white overflow-hidden">
      {/* Background Carousel with Parallax Effect */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black opacity-80 z-10"></div>
        {backgroundImages.map((image, index) => (
        <motion.img
            key={index}
            src={image}
            alt="Sports Background"
            className="absolute inset-0 w-full h-full object-cover object-center"
            style={{
              transform: "translateZ(0)",
              willChange: "transform",
              animation: "parallax 20s linear infinite",
              zIndex: index === currentImageIndex ? 1 : 0,
              pointerEvents: index === currentImageIndex ? "auto" : "none",
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: index === currentImageIndex ? 1 : 0 }}
            transition={{ duration: 0.8 }}
          />
        ))}

      </div>

      {/* Content with Animations */}
      <motion.div
        className="relative z-20 flex flex-col items-center justify-center px-6 text-center max-w-6xl mx-auto"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Logo/Branding */}
        {/* <motion.div variants={itemVariants} className="mb-8">
          <div className="w-70 h-40 bg-gray-900 rounded-full flex items-center justify-center mx-auto shadow-xl">
            <img src={icons} alt="Dark Icon" className="w-3-0 h-20" />
          </div>
        </motion.div> */}

        {/* Main Heading */}
        <motion.h1
          variants={itemVariants}
          className="text-5xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight"
        >
          Welcome to <span className="text-yellow-400">Top Scorer</span>
        </motion.h1>

        {/* Subheading */}
        <motion.p
        variants={itemVariants}
        className="text-xl md:text-2xl font-mono max-w-2xl mb-10 text-white   drop-shadow-[0_1px_1px_rgba(0,0,0,0.8)]"
      >
        Empowering the passion of local sports with real-time scores and seamless match management.

        </motion.p>


        {/* CTA Button */}
        <motion.div variants={itemVariants}>
          <button
            onClick={() => navigate("/dashboard/badminton")}
            className="px-8 py-4 bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-gray-900 font-bold text-lg rounded-full shadow-lg transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-opacity-50"
          >
            Get Started
            <span className="ml-2">→</span>
          </button>
        </motion.div>

        {/* Additional Info */}
        <motion.div
          variants={itemVariants}
          className="mt-16 text-sm text-gray-400"
        >
          Trusted by IIIT Una sports communities
        </motion.div>

        {/* Carousel Indicators */}
        <div className="flex justify-center mt-8 space-x-2">
          {backgroundImages.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentImageIndex(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === currentImageIndex ? 'bg-yellow-500 w-6' : 'bg-gray-500'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </motion.div>

      {/* Custom CSS for Parallax */}
      <style jsx>{`
        @keyframes parallax {
          0% {
            transform: scale(1) translateY(0);
          }
          100% {
            transform: scale(1.1) translateY(-50px);
          }
        }
      `}</style>
    </div>
  );
};

export default LandingPage;
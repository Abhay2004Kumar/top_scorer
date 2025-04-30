import React, { useState, useEffect } from "react";
import { RiInstagramLine } from "react-icons/ri";
import { FaLinkedin, FaGithub } from "react-icons/fa";
import icons from "../../Project_Icon/Dark.png";
import { Link } from "react-router-dom";

function Footer_main() {
  // State to manage dark mode
  const [isDarkMode, setIsDarkMode] = useState(
    localStorage.getItem("theme") === "dark" || !localStorage.getItem("theme")
  );

  // Apply dark mode class to the document
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [isDarkMode]);

  // Toggle dark mode
  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  return (
    <footer
      className={`bg-white dark:bg-gray-900 text-gray-900 dark:text-white py-12 transition-colors duration-300`}
    >
      <div className="container mx-auto px-6">
        {/* Dark Mode Toggle Button */}
        <div className="flex justify-end mb-8">
          <button
            onClick={toggleDarkMode}
            className="p-2 bg-gray-200 dark:bg-gray-700 rounded-full focus:outline-none"
          >
            {isDarkMode ? (
              <span className="text-white">🌞</span> // Sun icon for light mode
            ) : (
              <span className="text-gray-900">🌙</span> // Moon icon for dark mode
            )}
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Logo Section */}
          <div className="flex flex-col items-center md:items-start">
            <img className="h-16 w-32 mb-4" src={icons} alt="Dark Icon" />
            <h1 className="text-2xl font-bold">Sports Updates</h1>
          </div>

          {/* Contact Form Section */}
          <div className="flex flex-col items-center md:items-start">
            <h1 className="text-2xl font-bold mb-4">Get In Touch</h1>
            <form className="w-full max-w-md">
              <input
                type="text"
                placeholder="Name"
                className="w-full p-2 mb-4 rounded bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="email"
                placeholder="Email"
                className="w-full p-2 mb-4 rounded bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <textarea
                placeholder="Type your message here"
                className="w-full p-2 mb-4 rounded bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows="4"
              />
              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Submit
              </button>
            </form>
          </div>

          {/* Social Links Section */}
          <div className="flex flex-col items-center md:items-start">
            <h3 className="text-2xl font-bold mb-4">Important Links</h3>
            <div className="space-y-2">
              <a
                href="https://instagram.com/#"
                className="flex items-center text-gray-600 dark:text-gray-400 hover:text-blue-500 dark:hover:text-white transition-colors"
              >
                <RiInstagramLine className="mr-2" /> Instagram
              </a>
              <a
                href="https://linkedin.com/in/#"
                className="flex items-center text-gray-600 dark:text-gray-400 hover:text-blue-500 dark:hover:text-white transition-colors"
              >
                <FaLinkedin className="mr-2" /> LinkedIn
              </a>
              <a
                href="https://github.com/#"
                className="flex items-center text-gray-600 dark:text-gray-400 hover:text-blue-500 dark:hover:text-white transition-colors"
              >
                <FaGithub className="mr-2" /> GitHub
              </a>
            </div>
          </div>
        </div>

        {/* Lower Footer Section */}
        <div className="border-t border-gray-200 dark:border-gray-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <h3 className="text-gray-600 dark:text-gray-400">© Top Scorer</h3>
          </div>
          <div className="mb-4 md:mb-0">
            <Link
              to="/dashboard/dev++"
              onClick={() => window.scrollTo(0, 0)}
              className="text-gray-600 dark:text-gray-400 hover:text-blue-500 dark:hover:text-white transition-colors"
            >
              Development Team
            </Link>
          </div>
          <div>
            <Link
              to="/dashboard/tnc"
              onClick={() => window.scrollTo(0, 0)}
              className="text-gray-600 dark:text-gray-400 hover:text-blue-500 dark:hover:text-white transition-colors"
            >
              Terms and Conditions
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer_main;

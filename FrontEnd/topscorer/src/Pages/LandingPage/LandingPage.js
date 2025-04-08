import React from "react";
import { useNavigate } from "react-router-dom";
import { Carousal1 } from "../../Components/Carousal/carousal1";


const images = [
    "https://img.freepik.com/free-photo/sports-tools_53876-138077.jpg",
  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT3wThXRGSbJ0H4i5_6whUYSdvwNeKJdtqeIA&s",
  "/images/football.jpg",
  "/images/badminton.jpg",
];

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="relative h-screen overflow-hidden">
      {/* Background Image Slider */}
      <div className="absolute top-0 left-0 w-full h-full z-0 ">
        {/* <div className="w-[400%] h-full flex">
          {images.map((src, idx) => (
            <img
              key={idx}
              src={src}
              alt="sports"
              className="w-full h-full object-cover"
            />
          ))}
        </div> */}
        <Carousal1></Carousal1>
      </div>

      {/* Overlay */}
      <div className="absolute inset-0 bg-black bg-opacity-60 z-10"></div>

      {/* Content */}
      <div className="relative z-20 flex flex-col items-center justify-center h-full text-white px-6 text-center">
        <h1 className="text-5xl md:text-6xl font-bold mb-4 text-white">
          Welcome to <span className="text-yellow-400">Top Scorer</span>
        </h1>
        <p className=" animate-slide-in-left text-xl md:text-2xl max-w-2xl mb-8 font-mono">
          Empowering the passion of local sports with real-time scores and seamless match management.
        </p>
        <button
          onClick={() => navigate("/dashboard/badminton")}
          className=" animate-bounce px-8 py-3 bg-blue-800 hover:bg-blue-900 text-white font-semibold text-lg rounded-full shadow-lg transition duration-300"
        >
          Get Started 
        </button>
      </div>
    </div>
  );
};

export default LandingPage;

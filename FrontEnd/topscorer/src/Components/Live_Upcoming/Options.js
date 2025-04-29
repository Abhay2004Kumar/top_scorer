import React from "react";
import { useNavigate } from "react-router-dom";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";

function Options({ cur_link, archived, upcoming }) {
  const navigate = useNavigate();

  // Function to redirect to the passed link
  const handleRedirect = (path) => {
    if (path) navigate(path);
  };

  return (
    <div className="flex space-x-4 justify-center items-center">
      {/* Live Button */}
      {cur_link && (
        <div className="flex items-center">
          <button
            className="flex items-center text-sm px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none transition duration-200"
            onClick={() => handleRedirect(cur_link)}
          >
            Live
            <DotLottieReact
              className="ml-2 w-6 h-6"
              src="https://lottie.host/a1af2d3c-51de-4b7f-8318-ce94d9a9cb0d/7sDiG42bjH.lottie"
              loop
              autoplay
            />
          </button>
        </div>
      )}

      {/* Upcoming Button */}
      {upcoming && (
        <button
          className="text-sm px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 focus:outline-none transition duration-200"
          onClick={() => handleRedirect(upcoming)}
        >
          Upcoming
        </button>
      )}

      {/* Archived Button */}
      {archived && (
        <button
          className="text-sm px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 focus:outline-none transition duration-200"
          onClick={() => handleRedirect(archived)}
        >
          Archived
        </button>
      )}
    </div>
  );
}

export default Options;

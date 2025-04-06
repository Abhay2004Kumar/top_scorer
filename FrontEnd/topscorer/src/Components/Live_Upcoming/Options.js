import React from "react";
import { useNavigate } from "react-router-dom";
import style from "../Live_Upcoming/Options.module.css";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";

function Options({ cur_link, archived, upcoming }) {
  const navigate = useNavigate();

  // Function to redirect to the passed link
  const handleRedirect = (path) => {
    if (path) navigate(path);
  };

  return (
    <div className={style.box}>
      {/* Live Button */}
      {cur_link && (
        <div className=" flex">
          <button
            className={style.live}
            onClick={() => handleRedirect(cur_link)}
          >
            <p>
              Live
            </p>
            {/* <div className={style.icon}></div> */}
          </button>
              <DotLottieReact
              className="ml-[-10px]"
                src="https://lottie.host/a1af2d3c-51de-4b7f-8318-ce94d9a9cb0d/7sDiG42bjH.lottie"
                loop
                autoplay
              />
        </div>
      )}

      {/* Upcoming Button */}
      {upcoming && (
        <button
          className={style.upcoming}
          onClick={() => handleRedirect(upcoming)}
        >
          <p>Upcoming</p>
        </button>
      )}

      {/* Archived Button */}
      {archived && (
        <button
          className={style.archived}
          onClick={() => handleRedirect(archived)}
        >
          <p>Archived</p>
        </button>
      )}
    </div>
  );
}

export default Options;

import React from "react";
import { useNavigate } from "react-router-dom";
import style from '../Live_Upcoming/Options.module.css';

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
        <button className={style.live} onClick={() => handleRedirect(cur_link)}>
          <p>Live</p>
          <div className={style.icon}></div>
        </button>
      )}
      
      {/* Upcoming Button */}
      {upcoming && (
        <button className={style.upcoming} onClick={() => handleRedirect(upcoming)}>
          <p>Upcoming</p>
        </button>
      )}

      {/* Archived Button */}
      {archived && (
        <button className={style.archived} onClick={() => handleRedirect(archived)}>
          <p>Archived</p>
        </button>
      )}
    </div>
  );
}

export default Options;

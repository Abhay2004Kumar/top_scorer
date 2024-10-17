import React, { useState } from 'react';
import style from '../Badminton/Badminton.module.css';
import io from "socket.io-client";

const socket = io.connect("http://localhost:5000");

function AdminBadminton() {
  const [matchData, setMatchData] = useState({
    teamA: {
      name: "", 
      player: "",
    },
    teamB: {
      name: "",
      player: "",
    },
    tmA_score:[],
    tmB_score:[],
    currentSet: 1,
    latestUpdate: ""
  });

  const handleInputChange = (e, team, field) => {
    setMatchData({
      ...matchData,
      [team]: { ...matchData[team], [field]: e.target.value },
    });
  };

  const handleScoreChange = (e, team, setIndex) => {
    const newScores = [...matchData[team]];
    newScores[setIndex] = parseInt(e.target.value);
    setMatchData({ ...matchData, [team]: newScores });
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    console.log("Match Data Submitted:", matchData);
    const payload = {matchData};
    socket.emit("bdminton", payload);
  };



  return (
    <div className={style.MainDiv}>
      <h2>Badminton Admin Page</h2>
      <form onSubmit={handleFormSubmit} className={style.adminForm}>
        <div className={style.teamsContainer}>
          {/* Team A Details */}
          <div className={style.adminSection}>
            <h3>Team A</h3>
            <input
              type="text"
              placeholder="Team Name"
              onChange={(e) => handleInputChange(e, 'teamA', 'name')}
            />
            <input
              type="text"
              placeholder="Player Name"
              onChange={(e) => handleInputChange(e, 'teamA', 'player')}
            />

            {/* Scores */}
            <div className={style.Info}>
              <input
                type="number"
                placeholder="Set 1 Score"
                onChange={(e) => handleScoreChange(e, 'tmA_score', 0)}
              />
              <input
                type="number"
                placeholder="Set 2 Score"
                onChange={(e) => handleScoreChange(e, 'tmA_score', 1)}
              />
              <input
                type="number"
                placeholder="Set 3 Score"
                onChange={(e) => handleScoreChange(e, 'tmA_score', 2)}
              />
            </div>
          </div>

          {/* Team B Details */}
          <div className={style.adminSection}>
            <h3>Team B</h3>
            <input
              type="text"
              placeholder="Team Name"
              onChange={(e) => handleInputChange(e, 'teamB', 'name')}
            />
            <input
              type="text"
              placeholder="Player Name"
              onChange={(e) => handleInputChange(e, 'teamB', 'player')}
            />

            {/* Scores */}
            <div className={style.Info}>
              <input
                type="number"
                placeholder="Set 1 Score"
                onChange={(e) => handleScoreChange(e, 'tmB_score', 0)}
              />
              <input
                type="number"
                placeholder="Set 2 Score"
                onChange={(e) => handleScoreChange(e, 'tmB_score', 1)}
              />
              <input
                type="number"
                placeholder="Set 3 Score"
                onChange={(e) => handleScoreChange(e, 'tmB_score', 2)}
              />
            </div>
          </div>
        </div>

        {/* Latest Update */}
        <div className={style.adminSection}>
          <h3>Latest Update</h3>
          <textarea
            placeholder="Latest Update"
            value={matchData.latestUpdate}
            onChange={(e) =>
              setMatchData({ ...matchData, latestUpdate: e.target.value })
            }
          />
        </div> 

        {/* Submit Button */}
        <button type="submit" className={style.submitButton}>
          Submit Match Details
        </button>
      </form>
    </div>
  );
}

export default AdminBadminton;

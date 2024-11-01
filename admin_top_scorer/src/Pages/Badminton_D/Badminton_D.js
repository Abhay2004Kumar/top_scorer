import React, { useState } from 'react';
import style from '../Badminton/Badminton.module.css';
import io from "socket.io-client";

const socket = io.connect("http://localhost:5000");

function AdminBadminton_D() {
  const [matchData, setMatchData] = useState({
    "name": "Badminton_D", 
    "data": { 
      teamA: {
        name: "", 
        player1: "",
        player2: "",
      },
      teamB: {
        name: "",
        player1: "",
        player2: "",
      },
      tmA_score: [],
      tmB_score: [],
      currentSet: 1,
      latestUpdate: ""
    }
  });

  const handleInputChange = (e, team, field) => {
    setMatchData(prevState => ({
      ...prevState,
      data: {
        ...prevState.data,
        [team]: { 
          ...prevState.data[team], 
          [field]: e.target.value 
        },
      }
    }));
  };

  const handleScoreChange = (e, team, setIndex) => {
    const newScores = [...matchData.data[team]];
    newScores[setIndex] = parseInt(e.target.value) || 0;
    setMatchData(prevState => ({
      ...prevState,
      data: {
        ...prevState.data,
        [team]: newScores
      }
    }));
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    // console.log("Match Data Submitted:", matchData);

    const payload = matchData ;
    socket.emit("data", payload);
  };

  return (
    <div className={style.MainDiv}>
      <h2>Badminton Doubles Admin Page</h2>
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
              placeholder="Player1 Name"
              onChange={(e) => handleInputChange(e, 'teamA', 'player1')}
            />
            <input
              type="text"
              placeholder="Player2 Name"
              onChange={(e) => handleInputChange(e, 'teamA', 'player2')}
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
              placeholder="Player1 Name"
              onChange={(e) => handleInputChange(e, 'teamB', 'player1')}
            />
            <input
              type="text"
              placeholder="Player2 Name"
              onChange={(e) => handleInputChange(e, 'teamB', 'player2')}
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
            value={matchData.data.latestUpdate}
            onChange={(e) =>
              setMatchData(prevState => ({
                ...prevState,
                data: { ...prevState.data, latestUpdate: e.target.value }
              }))
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

export default AdminBadminton_D;

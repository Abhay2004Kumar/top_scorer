import React, { useState } from 'react';
import style from '../Badminton/Badminton.module.css';
import io from "socket.io-client";

const socket = io.connect("http://localhost:5000");

function AdminBadminton() {
  const [matchData, setMatchData] = useState({
    name: "Badminton",
    data: {
      teamA: {
        name: "", 
        player: "",
        score: [0, 0, 0], // Initialize scores for 3 sets
      },
      teamB: {
        name: "",
        player: "",
        score: [0, 0, 0], // Initialize scores for 3 sets
      },
      currentSet: 1,
      latestUpdate: "",
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
    const newScore = parseInt(e.target.value) || 0; // Ensure value is a number
    setMatchData(prevState => ({
      ...prevState,
      data: {
        ...prevState.data,
        [team]: {
          ...prevState.data[team],
          score: prevState.data[team].score.map((score, index) => index === setIndex ? newScore : score),
        }
      }
    }));
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    console.log("Match Data Submitted:", matchData);
    socket.emit("data", matchData);  // Emit the whole matchData object with "name" and "data"
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
              value={matchData.data.teamA.name}
              onChange={(e) => handleInputChange(e, 'teamA', 'name')}
            />
            <input
              type="text"
              placeholder="Player Name"
              value={matchData.data.teamA.player}
              onChange={(e) => handleInputChange(e, 'teamA', 'player')}
            />

            {/* Scores */}
            <div className={style.Info}>
              {[0, 1, 2].map(setIndex => (
                <input
                  key={setIndex}
                  type="number"
                  placeholder={`Set ${setIndex + 1} Score`}
                  value={matchData.data.teamA.score[setIndex] || ""}
                  onChange={(e) => handleScoreChange(e, 'teamA', setIndex)}
                />
              ))}
            </div>
          </div>

          {/* Team B Details */}
          <div className={style.adminSection}>
            <h3>Team B</h3>
            <input
              type="text"
              placeholder="Team Name"
              value={matchData.data.teamB.name}
              onChange={(e) => handleInputChange(e, 'teamB', 'name')}
            />
            <input
              type="text"
              placeholder="Player Name"
              value={matchData.data.teamB.player}
              onChange={(e) => handleInputChange(e, 'teamB', 'player')}
            />

            {/* Scores */}
            <div className={style.Info}>
              {[0, 1, 2].map(setIndex => (
                <input
                  key={setIndex}
                  type="number"
                  placeholder={`Set ${setIndex + 1} Score`}
                  value={matchData.data.teamB.score[setIndex] || ""}
                  onChange={(e) => handleScoreChange(e, 'teamB', setIndex)}
                />
              ))}
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
                data: {
                  ...prevState.data,
                  latestUpdate: e.target.value
                }
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

export default AdminBadminton;

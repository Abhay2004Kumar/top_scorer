import React, { useState } from 'react';
import style from '../Badminton/Badminton.module.css';

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
    setScores: [
      { set1: "", set2: "", set3: "" },
      { set1: "", set2: "", set3: "" }
    ],
    currentSet: 1,
    latestUpdate: ""
  });

  const teams = [
    { name: "India", players: ["PV Sindhu", "Kidambi Srikanth"], flag: "https://cdn.britannica.com/97/1597-004-05816F4E/Flag-India.jpg" },
    { name: "China", players: ["Chen Long", "Li Ning"], flag: "https://cdn.britannica.com/90/7490-050-5D33348F/Flag-China.jpg" },
    { name: "Japan", players: ["Kento Momota", "Akane Yamaguchi"], flag: "https://cdn.britannica.com/32/1832-004-42C0E9AA/Flag-Japan.jpg" },
    // Add more teams as needed
  ];

  const handleInputChange = (e, team, field) => {
    setMatchData({
      ...matchData,
      [team]: { ...matchData[team], [field]: e.target.value },
    });
  };

  const handleSetScoreChange = (e, setIndex, field) => {
    const newSetScores = [...matchData.setScores];
    newSetScores[setIndex][field] = e.target.value;
    setMatchData({ ...matchData, setScores: newSetScores });
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    console.log("Match Data Submitted:", matchData);
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
               
              />
              <input
                type="text"
                placeholder="Player Name"
              />

              {/* Scores */}
              <div className={style.Info}>
              {/* <input
                type="text"
                placeholder="Set: (1 - 2 - 3)"
               
              /> */}
              <input
                type="text"
                placeholder="Set 1 Score"
              />
              <input
                type="text"
                placeholder="Set 2 Score"
              />
              <input
                type="text"
                placeholder="Set 3 Score"
              />
              </div>
            

            
          </div>

          {/* Team B Details */}
          <div className={style.adminSection}>
            <h3>Team B</h3>
            <input
                type="text"
                placeholder="Team Name"
               
              />
              <input
                type="text"
                placeholder="Player Name"
               
              />

              {/* Scores */}
              <div className={style.Info}>
              {/* <input
                type="text"
                placeholder="Set: (1 - 2 - 3)"
               
              /> */}
              <input
                type="text"
                placeholder="Set 1 Score"
              />
              <input
                type="text"
                placeholder="Set 2 Score"
              />
              <input
                type="text"
                placeholder="Set 3 Score"
              />
              </div>
          
            
          </div>
        </div>

        {/* Set Scores */}
        {/* <div className={style.adminSection}>
          <h3>Set Scores</h3>
          {matchData.setScores.map((set, index) => (
            <div key={index}>
              <h4>Set {index + 1}</h4>
              <input
                type="text"
                placeholder="Set 1 Score (Team A)"
                value={set.set1}
                onChange={(e) => handleSetScoreChange(e, index, "set1")}
              />
              <input
                type="text"
                placeholder="Set 2 Score (Team A)"
                value={set.set2}
                onChange={(e) => handleSetScoreChange(e, index, "set2")}
              />
              <input
                type="text"
                placeholder="Set 3 Score (Team A)"
                value={set.set3}
                onChange={(e) => handleSetScoreChange(e, index, "set3")}
              />
            </div>
          ))}
        </div>

        {/* Current Set */}
        {/* <div className={style.adminSection}>
          <h3>Current Set</h3>
          <input
            type="number"
            min="1"
            placeholder="Current Set"
            value={matchData.currentSet}
            onChange={(e) =>
              setMatchData({ ...matchData, currentSet: e.target.value })
            }
          />
        </div> */}

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

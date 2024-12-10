import React, { useState } from "react";
import style from "../Badminton/Badminton.module.css";
import io from "socket.io-client";
import axios from 'axios'
import toast from "react-hot-toast";


const socket = io.connect(process.env.REACT_APP_BACKEND_URL);

function AdminBadminton() {
  const [popup, setPopup] = useState(false);
  const [matchData, setMatchData] = useState({
    name: "Badminton",
    data: {
      teamA: {
        name: "",
        player: "",
      },
      teamB: {
        name: "",
        player: "",
      },
      tmA_score: [], // Initialize scores for Team A
      tmB_score: [], // Initialize scores for Team B
      currentSet: 1,
      latestUpdate: "",
    },
  });

  const handleInputChange = (e, team, field) => {
    setMatchData((prevMatchData) => ({
      ...prevMatchData,
      data: {
        ...prevMatchData.data,
        [team]: { ...prevMatchData.data[team], [field]: e.target.value },
      },
    }));
  };

  const handleScoreChange = (e, team, setIndex) => {
    const newScores = [
      ...matchData.data[team === "teamA" ? "tmA_score" : "tmB_score"],
    ];
    newScores[setIndex] = parseInt(e.target.value, 10) || 0; // Set to 0 if NaN
    setMatchData((prevMatchData) => ({
      ...prevMatchData,
      data: {
        ...prevMatchData.data,
        [team === "teamA" ? "tmA_score" : "tmB_score"]: newScores,
      },
    }));
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    // console.log("Match Data Submitted:", matchData);
    socket.emit("data", matchData); // Emit the whole matchData object
    toast.success("Data Updated!");
  };
  // to decide the state of popup
  const handleMatchSubmit = () => {
    setPopup(!popup);
  };
  //To submit match data as archieve in DB.
  const submitMatchData = async()=>{
    try{
      await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/v1/sports/bdsingle`,{data:matchData.data});
      toast.success("Saved to Database!");
    }catch(err){
      console.log(err);
      toast.error("Please Check Server Connection!");
    }
    handleMatchSubmit();
  }

  return (
    <>
      {popup && 
       <div className={style.cover} onClick={handleMatchSubmit}>
        <div className={style.pop}
        onClick={(e) => e.stopPropagation()}>
        <p className={style.text_pop}>Are you sure to submit the score?</p>
        <button className={style.yes} onClick={submitMatchData}>Yes</button>
        <button className={style.no} onClick={handleMatchSubmit}>NO</button>
        </div>
      </div>
      }
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
                onChange={(e) => handleInputChange(e, "teamA", "name")}
              />
              <input
                type="text"
                placeholder="Player Name"
                value={matchData.data.teamA.player}
                onChange={(e) => handleInputChange(e, "teamA", "player")}
              />

              {/* Scores */}
              <div className={style.Info}>
                {[0, 1, 2].map((setIndex) => (
                  <input
                    key={setIndex}
                    type="number"
                    placeholder={`Set ${setIndex + 1} Score`}
                    value={matchData.data.tmA_score[setIndex] || ""}
                    onChange={(e) => handleScoreChange(e, "teamA", setIndex)}
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
                onChange={(e) => handleInputChange(e, "teamB", "name")}
              />
              <input
                type="text"
                placeholder="Player Name"
                value={matchData.data.teamB.player}
                onChange={(e) => handleInputChange(e, "teamB", "player")}
              />

              {/* Scores */}
              <div className={style.Info}>
                {[0, 1, 2].map((setIndex) => (
                  <input
                    key={setIndex}
                    type="number"
                    placeholder={`Set ${setIndex + 1} Score`}
                    value={matchData.data.tmB_score[setIndex] || ""}
                    onChange={(e) => handleScoreChange(e, "teamB", setIndex)}
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
                setMatchData((prevState) => ({
                  ...prevState,
                  data: {
                    ...prevState.data,
                    latestUpdate: e.target.value,
                  },
                }))
              }
            />
          </div>

          {/* Submit Button */}
          <button type="submit" className={style.submitButton}>
            Send Match Details
          </button>
        </form>
        <button
          style={{ cursor: "pointer", height: "30px" }}
          onClick={handleMatchSubmit}
        >
          Submit Match Details
        </button>
      </div>
    </>
  );
}

export default AdminBadminton;

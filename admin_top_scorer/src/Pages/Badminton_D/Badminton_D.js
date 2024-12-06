import React, { useState } from 'react';
import style from '../Badminton/Badminton.module.css';
import io from "socket.io-client";
import axios from 'axios'

const socket = io.connect("http://localhost:5000");

function AdminBadminton_D() {
  const [popup, setPopup] = useState(false);
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

   // to decide the state of popup
   const handleMatchSubmit = () => {
    setPopup(!popup);
  };
  //To submit match data as archieve in DB.
  const submitMatchData = async()=>{
    try{
      await axios.post('http://localhost:5000/api/v1/sports/bdDouble',{data:matchData.data});
    }catch(err){
      console.log(err);
    }
    handleMatchSubmit();
  }

  return (
    <>
     {popup && 
       <div className={style.cover} onClick={handleMatchSubmit}>
        <div className={style.pop}
        onClick={(e) => e.stopPropagation()}>
        <p style={{color:"blue",textAlign:"center",fontSize:"30px"}}>Are you sure to submit the score?</p>
        <button className={style.yes} onClick={submitMatchData}>Yes</button>
        <button className={style.no} onClick={handleMatchSubmit}>NO</button>
        </div>
      </div>
      }
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

export default AdminBadminton_D;

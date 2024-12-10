import React, { useState } from 'react';
import style from '../Badminton/Badminton.module.css';
import io from "socket.io-client";
import axios from 'axios';

const socket = io.connect("http://localhost:5000");

// function Tennis_D() {
//   const [matchData, setMatchData] = useState({
//     "name": "Tennis_D", 
//     "data": {
//       teamA: {
//         name: "", 
//         player1: "",
//         player2: "",
//       },
//       teamB: {
//         name: "",
//         player1: "",
//         player2: "",
//       },
//       tmA_score: [],
//       tmB_score: [],
//       currentSet: 1,
//       latestUpdate: ""
//     }
//   });

//   const handleInputChange = (e, team, field) => {
//     setMatchData(prevState => ({
//       ...prevState,
//       data: {
//         ...prevState.data,
//         [team]: { 
//           ...prevState.data[team], 
//           [field]: e.target.value 
//         },
//       }
//     }));
//   };

//   const handleScoreChange = (e, team, setIndex) => {
//     const newScores = [...matchData.data[team]];
//     newScores[setIndex] = parseInt(e.target.value) || 0;
//     setMatchData(prevState => ({
//       ...prevState,
//       data: {
//         ...prevState.data,
//         [team]: newScores
//       }
//     }));
//   };

//   const handleFormSubmit = (e) => {
//     e.preventDefault();
//     console.log("Match Data Submitted:", matchData);

//     const payload = matchData ;
//     socket.emit("data", payload);
//   };

//   return (
//     <div className={style.MainDiv}>
//       <h2>Tennis Doubles Admin Page</h2>
//       <form onSubmit={handleFormSubmit} className={style.adminForm}>
//         <div className={style.teamsContainer}>
//           {/* Team A Details */}
//           <div className={style.adminSection}>
//             <h3>Team A</h3>
//             <input
//               type="text"
//               placeholder="Team Name"
//               onChange={(e) => handleInputChange(e, 'teamA', 'name')}
//             />
//             <input
//               type="text"
//               placeholder="Player1 Name"
//               onChange={(e) => handleInputChange(e, 'teamA', 'player1')}
//             />
//             <input
//               type="text"
//               placeholder="Player2 Name"
//               onChange={(e) => handleInputChange(e, 'teamA', 'player2')}
//             />

//             {/* Scores */}
//             <div className={style.Info}>
//               <input
//                 type="number"
//                 placeholder="Set 1 Score"
//                 onChange={(e) => handleScoreChange(e, 'tmA_score', 0)}
//               />
//               <input
//                 type="number"
//                 placeholder="Set 2 Score"
//                 onChange={(e) => handleScoreChange(e, 'tmA_score', 1)}
//               />
//               <input
//                 type="number"
//                 placeholder="Set 3 Score"
//                 onChange={(e) => handleScoreChange(e, 'tmA_score', 2)}
//               />
//             </div>
//           </div>

//           {/* Team B Details */}
//           <div className={style.adminSection}>
//             <h3>Team B</h3>
//             <input
//               type="text"
//               placeholder="Team Name"
//               onChange={(e) => handleInputChange(e, 'teamB', 'name')}
//             />
//             <input
//               type="text"
//               placeholder="Player1 Name"
//               onChange={(e) => handleInputChange(e, 'teamB', 'player1')}
//             />
//             <input
//               type="text"
//               placeholder="Player2 Name"
//               onChange={(e) => handleInputChange(e, 'teamB', 'player2')}
//             />

//             {/* Scores */}
//             <div className={style.Info}>
//               <input
//                 type="number"
//                 placeholder="Set 1 Score"
//                 onChange={(e) => handleScoreChange(e, 'tmB_score', 0)}
//               />
//               <input
//                 type="number"
//                 placeholder="Set 2 Score"
//                 onChange={(e) => handleScoreChange(e, 'tmB_score', 1)}
//               />
//               <input
//                 type="number"
//                 placeholder="Set 3 Score"
//                 onChange={(e) => handleScoreChange(e, 'tmB_score', 2)}
//               />
//             </div>
//           </div>
//         </div>

//         {/* Latest Update */}
//         <div className={style.adminSection}>
//           <h3>Latest Update</h3>
//           <textarea
//             placeholder="Latest Update"
//             value={matchData.data.latestUpdate}
//             onChange={(e) =>
//               setMatchData(prevState => ({
//                 ...prevState,
//                 data: { ...prevState.data, latestUpdate: e.target.value }
//               }))
//             }
//           />
//         </div> 

//         {/* Submit Button */}
//         <button type="submit" className={style.submitButton}>
//           Submit Match Details
//         </button>
//       </form>
//     </div>
//   );
// }


function Tennis_D() {
  const [popup, setPopup] = useState(false);
  const [matchData, setMatchData] = useState({
    name: "Tennis_D",
    data: {
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
      tmA_score: [0, 0, 0], // Scores for Team A for 3 sets
      tmB_score: [0, 0, 0], // Scores for Team B for 3 sets
      currentSet: 1,
      latestUpdate: "",
    },
  });

  // Handle input changes for team names and players
  const handleInputChange = (e, team, field) => {
    setMatchData((prevState) => ({
      ...prevState,
      data: {
        ...prevState.data,
        [team]: {
          ...prevState.data[team],
          [field]: e.target.value,
        },
      },
    }));
  };

  // Handle score changes for both teams
  const handleScoreChange = (e, team, setIndex) => {
    const newScores = [...matchData.data[team]];
    newScores[setIndex] = parseInt(e.target.value, 10) || 0;
    setMatchData((prevState) => ({
      ...prevState,
      data: {
        ...prevState.data,
        [team]: newScores,
      },
    }));
  };

  // Submit match data to the API
  const submitMatchData = async () => {
    try {
      console.log("Submitting match data:", matchData.data); // Log match data before sending

      // API call to submit match data, replace with your actual endpoint
      const response = await axios.post("http://localhost:5000/api/v1/sports/tennisDoubles", {
        data: matchData.data,
      });

      console.log("Match data submitted to API", response); // Log the response to verify

      // Optionally show an alert or message here to confirm successful submission

    } catch (err) {
      console.error("Error submitting match data:", err);
    } finally {
      setPopup(false); // Close the popup after submission
    }
  };

  // Handle toggling the popup visibility
  const handleMatchSubmit = () => {
    setPopup(!popup);
  };

  return (
    <>
      {popup && (
        <div className={style.cover} onClick={handleMatchSubmit}>
        <div className={style.pop}
        onClick={(e) => e.stopPropagation()}>
        <p className={style.text_pop}>Are you sure to submit the score?</p>
        <button className={style.yes} onClick={submitMatchData}>Yes</button>
        <button className={style.no} onClick={handleMatchSubmit}>NO</button>
        </div>
      </div>
      )}
      <div className={style.MainDiv}>
        <h2>Tennis Doubles Admin Page</h2>
        <form className={style.adminForm}>
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
                placeholder="Player 1 Name"
                value={matchData.data.teamA.player1}
                onChange={(e) => handleInputChange(e, 'teamA', 'player1')}
              />
              <input
                type="text"
                placeholder="Player 2 Name"
                value={matchData.data.teamA.player2}
                onChange={(e) => handleInputChange(e, 'teamA', 'player2')}
              />
              <div className={style.Info}>
                {[0, 1, 2].map((setIndex) => (
                  <input
                    key={setIndex}
                    type="number"
                    placeholder={`Set ${setIndex + 1} Score`}
                    value={matchData.data.tmA_score[setIndex] || ""}
                    onChange={(e) => handleScoreChange(e, 'tmA_score', setIndex)}
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
                placeholder="Player 1 Name"
                value={matchData.data.teamB.player1}
                onChange={(e) => handleInputChange(e, 'teamB', 'player1')}
              />
              <input
                type="text"
                placeholder="Player 2 Name"
                value={matchData.data.teamB.player2}
                onChange={(e) => handleInputChange(e, 'teamB', 'player2')}
              />
              <div className={style.Info}>
                {[0, 1, 2].map((setIndex) => (
                  <input
                    key={setIndex}
                    type="number"
                    placeholder={`Set ${setIndex + 1} Score`}
                    value={matchData.data.tmB_score[setIndex] || ""}
                    onChange={(e) => handleScoreChange(e, 'tmB_score', setIndex)}
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

          {/* Submit Button for Confirmation */}
          <button
            type="button"
            className={style.submitButton}
            onClick={handleMatchSubmit}
          >
            Submit Match
          </button>
        </form>
      </div>
    </>
  );
}

export default Tennis_D;


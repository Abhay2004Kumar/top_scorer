import React, { useState } from 'react';
import style from '../Tennis/Tennis.module.css'
import axios from 'axios';
import io from "socket.io-client";

const socket = io.connect(process.env.REACT_APP_BACKEND_URL);

function AdminTennis() {
  const [matchData, setMatchData] = useState({
    name: "tennis",
    data: {
      teamA: {
        name: "NA", 
        player: "NA",
      },
      teamB: {
        name: "NA",
        player: "NA",
      },
      tmA_score: [], // Initialize scores for Team A
      tmB_score: [], // Initialize scores for Team B
      currentSet: 1,
      latestUpdate: "NA"
    }
  });

  const handleInputChange = (e, team, field) => {
    setMatchData(prevMatchData => ({
      ...prevMatchData,
      data: {
        ...prevMatchData.data,
        [team]: { ...prevMatchData.data[team], [field]: e.target.value },
      },
    }));
  };

  const handleScoreChange = (e, team, setIndex) => {
    const newScores = [...matchData.data[team === 'teamA' ? 'tmA_score' : 'tmB_score']];
    newScores[setIndex] = parseInt(e.target.value, 10) || 0; // Set to 0 if NaN
    setMatchData(prevMatchData => ({
      ...prevMatchData,
      data: {
        ...prevMatchData.data,
        [team === 'teamA' ? 'tmA_score' : 'tmB_score']: newScores,
      },
    }));
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    console.log("Match Data Submitted:", matchData);
    socket.emit("data", matchData);  // Emit the whole matchData object
  };

  return (
    <div className={style.MainDiv}>
      <h2>Tennis Admin Page - Score</h2>
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
                  value={matchData.data.tmA_score[setIndex] || ""}
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
                  value={matchData.data.tmB_score[setIndex] || ""}
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



// function AdminTennis() {
//   const [popup, setPopup] = useState(false);
//   const [matchData, setMatchData] = useState({
//     name: "Tennis",
//     data: {
//       player1: {
//         name: "NA",
//         teamname: "NA",
//         teamlogo: "NA",
//         s1score: 0,
//         s2score: 0,
//         s3score: 0,
//       },
//       player2: {
//         name: "NA",
//         teamname: "NA",
//         teamlogo: "NA",
//         s1score: 0,
//         s2score: 0,
//         s3score: 0,
//       },
//       matchStatus: "ongoing",
//       winner: null,
//       latestUpdate: "",
//     },
//   });

//   const handleInputChange = (e, player, field) => {
//     setMatchData((prevMatchData) => ({
//       ...prevMatchData,
//       data: {
//         ...prevMatchData.data,
//         [player]: {
//           ...prevMatchData.data[player],
//           [field]: e.target.value,
//         },
//       },
//     }));
//   };

//   const handleScoreChange = (e, player, setIndex) => {
//     const scoreField = `s${setIndex + 1}score`;
//     const newScore = parseInt(e.target.value, 10) || 0;

//     setMatchData((prevMatchData) => ({
//       ...prevMatchData,
//       data: {
//         ...prevMatchData.data,
//         [player]: {
//           ...prevMatchData.data[player],
//           [scoreField]: newScore,
//         },
//       },
//     }));
//   };

//   const submitMatchData = async () => {
//     try {
//       await axios.post("http://localhost:5000/api/v1/sports/tennisSingle", {
//         data: matchData.data,
//       });
//       console.log("Match data submitted to API");
//     } catch (err) {
//       console.error(err);
//     }
//     setPopup(false); // Close popup after submission
//   };

//   const handleMatchSubmit = () => {
//     setPopup(!popup);
//   };

//   return (
//     <>
//       {popup && (
//         <div
//           className={`${style.cover} popup-cover`}
//           onClick={handleMatchSubmit}
//         >
//           <div
//             className={`${style.pop} popup-box`}
//             onClick={(e) => e.stopPropagation()}
//           >
//             <h2 className="popup-title">Confirm Submission</h2>
//             <p className="popup-message">
//               Are you sure you want to submit the match details?
//             </p>
//             <div className="popup-actions">
//               <button
//                 className="popup-button popup-yes"
//                 onClick={submitMatchData}
//               >
//                 Yes
//               </button>
//               <button
//                 className="popup-button popup-no"
//                 onClick={handleMatchSubmit}
//               >
//                 No
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//       <div className={style.MainDiv}>
//         <h2>Tennis Admin Page - Score</h2>
//         <form
//           onSubmit={(e) => {
//             e.preventDefault();
//             handleMatchSubmit(); // Trigger confirmation popup
//           }}
//           className={style.adminForm}
//         >
//           <div className={style.teamsContainer}>
//             {/* Player 1 Details */}
//             <div className={style.adminSection}>
//               <h3>Player 1</h3>
//               <input
//                 type="text"
//                 placeholder="Player Name"
//                 value={matchData.data.player1.name}
//                 onChange={(e) => handleInputChange(e, "player1", "name")}
//               />
//               <input
//                 type="text"
//                 placeholder="Team Name"
//                 value={matchData.data.player1.teamname}
//                 onChange={(e) => handleInputChange(e, "player1", "teamname")}
//               />
//               <input
//                 type="text"
//                 placeholder="Team Logo"
//                 value={matchData.data.player1.teamlogo}
//                 onChange={(e) => handleInputChange(e, "player1", "teamlogo")}
//               />
//               <div className={style.Info}>
//                 {[0, 1, 2].map((setIndex) => (
//                   <input
//                     key={setIndex}
//                     type="number"
//                     placeholder={`Set ${setIndex + 1} Score`}
//                     value={matchData.data.player1[`s${setIndex + 1}score`] || ""}
//                     onChange={(e) => handleScoreChange(e, "player1", setIndex)}
//                   />
//                 ))}
//               </div>
//             </div>
//             {/* Player 2 Details */}
//             <div className={style.adminSection}>
//               <h3>Player 2</h3>
//               <input
//                 type="text"
//                 placeholder="Player Name"
//                 value={matchData.data.player2.name}
//                 onChange={(e) => handleInputChange(e, "player2", "name")}
//               />
//               <input
//                 type="text"
//                 placeholder="Team Name"
//                 value={matchData.data.player2.teamname}
//                 onChange={(e) => handleInputChange(e, "player2", "teamname")}
//               />
//               <input
//                 type="text"
//                 placeholder="Team Logo"
//                 value={matchData.data.player2.teamlogo}
//                 onChange={(e) => handleInputChange(e, "player2", "teamlogo")}
//               />
//               <div className={style.Info}>
//                 {[0, 1, 2].map((setIndex) => (
//                   <input
//                     key={setIndex}
//                     type="number"
//                     placeholder={`Set ${setIndex + 1} Score`}
//                     value={matchData.data.player2[`s${setIndex + 1}score`] || ""}
//                     onChange={(e) => handleScoreChange(e, "player2", setIndex)}
//                   />
//                 ))}
//               </div>
//             </div>
//           </div>
//           <div className={style.adminSection}>
//             <h3>Latest Update</h3>
//             <textarea
//               placeholder="Latest Update"
//               value={matchData.data.latestUpdate}
//               onChange={(e) =>
//                 setMatchData((prevState) => ({
//                   ...prevState,
//                   data: {
//                     ...prevState.data,
//                     latestUpdate: e.target.value,
//                   },
//                 }))
//               }
//             />
//           </div>
//           <button type="submit" className={style.submitButton}>
//             Send Match Details
//           </button>
//         </form>
//         <button
//           className={style.submitButton}
//           onClick={handleMatchSubmit}
//         >
//           Submit Match Details
//         </button>
//       </div>
//     </>
//   );
// }

export default AdminTennis;




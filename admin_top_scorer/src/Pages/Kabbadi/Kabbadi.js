import React, {useState} from 'react';
import styles from '../Kabbadi/Kabbadi.module.css';
import axios from "axios";
import toast from 'react-hot-toast';

// function Kabbadi() {
//   const teamAPlayers = ['Player A1', 'Player A2', 'Player A3', 'Player A4'];
//   const teamBPlayers = ['Player B1', 'Player B2', 'Player B3', 'Player B4'];

  

//   return (
//     <>
//       <div className={style.Main_Div}>
//         <div className={style.Header}>
//           <h1>Kabbadi Match Details</h1>
//         </div>

//         <div className={style.Team_Container}>
//           {/* Form for Team A */}
//           <form className={style.Team_Detail}>
//             <h2>Team A Details</h2>
//             <div className={style.Input_Group}>
//               <label>Team A</label>
//               <select>
//                 <option>Select Team A</option>
//                 <option>Team A1</option>
//                 <option>Team A2</option>
//                 <option>Team A3</option>
//               </select>
//             </div>

//             <div className={style.Input_Group}>
//               <label>Team A Logo</label>
//               <input type="file" />
//             </div>

//             <div className={style.Input_Group}>
//               <label>Player</label>
//               <select>
//                 <option>Select Player</option>
//                 {teamAPlayers.map(player => (
//                   <option key={player}>{player}</option>
//                 ))}
//               </select>
//             </div>

//             <div className={style.Input_Group}>
//               <label>Touch</label>
//               <input type="number" placeholder="Enter Touch Points" />
//             </div>

//             <div className={style.Input_Group}>
//               <label>Tackle</label>
//               <input type="number" placeholder="Enter Tackle Points" />
//             </div>

//             <div className={style.Input_Group}>
//               <label>Raid</label>
//               <input type="number" placeholder="Enter Raid Points" />
//             </div>

//             <div className={style.Input_Group}>
//               <label>Bonus</label>
//               <input type="number" placeholder="Enter Bonus Points" />
//             </div>

//             <div className={style.Input_Group}>
//               <label>Total</label>
//               <input type="number" placeholder="Total Points" disabled />
//             </div>

//             <button type="submit" className={style.Submit_Button}>Submit</button>
//           </form>

//           {/* Form for Team B */}
//           <form className={style.Team_Detail}>
//             <h2>Team B Details</h2>
//             <div className={style.Input_Group}>
//               <label>Team B</label>
//               <select>
//                 <option>Select Team B</option>
//                 <option>Team B1</option>
//                 <option>Team B2</option>
//                 <option>Team B3</option>
//               </select>
//             </div>

//             <div className={style.Input_Group}>
//               <label>Team B Logo</label>
//               <input type="file" />
//             </div>

//             <div className={style.Input_Group}>
//               <label>Player</label>
//               <select>
//                 <option>Select Player</option>
//                 {teamBPlayers.map(player => (
//                   <option key={player}>{player}</option>
//                 ))}
//               </select>
//             </div>

//             <div className={style.Input_Group}>
//               <label>Touch</label>
//               <input type="number" placeholder="Enter Touch Points" />
//             </div>

//             <div className={style.Input_Group}>
//               <label>Tackle</label>
//               <input type="number" placeholder="Enter Tackle Points" />
//             </div>

//             <div className={style.Input_Group}>
//               <label>Raid</label>
//               <input type="number" placeholder="Enter Raid Points" />
//             </div>

//             <div className={style.Input_Group}>
//               <label>Bonus</label>
//               <input type="number" placeholder="Enter Bonus Points" />
//             </div>

//             <div className={style.Input_Group}>
//               <label>Total</label>
//               <input type="number" placeholder="Total Points" disabled />
//             </div>

//             <button type="submit" className={style.Submit_Button}>Submit</button>
//           </form>
//         </div>
//       </div>
//     </>
//   );
// }

// export default Kabbadi;




// function AdminKabaddi() {
//   const [popup, setPopup] = useState(false);
//   const [matchData, setMatchData] = useState({
//     name: 'Kabaddi',
//     data: {
//       teamA: {
//         name: '',
//         player: '',
//         raidPoints: 0,
//         tacklePoints: 0,
//         touchPoints: 0,
//         bonusPoints: 0,
//         totalPoints: 0,
//       },
//       teamB: {
//         name: '',
//         player: '',
//         raidPoints: 0,
//         tacklePoints: 0,
//         touchPoints: 0,
//         bonusPoints: 0,
//         totalPoints: 0,
//       },
//       currentHalf: 1,
//       latestUpdate: '',
//     },
//   });

//   const handleInputChange = (e, team, field) => {
//     setMatchData((prevMatchData) => ({
//       ...prevMatchData,
//       data: {
//         ...prevMatchData.data,
//         [team]: { ...prevMatchData.data[team], [field]: e.target.value },
//       },
//     }));
//   };

//   const handleScoreChange = (e, team, scoreType) => {
//     const score = parseInt(e.target.value, 10) || 0;
    
//     // Update the team data with the changed score
//     const updatedTeam = {
//       ...matchData.data[team],
//       [scoreType]: score,
//     };

//     // Recalculate total points for the team after the update
//     const totalPoints =
//       ['raidPoints', 'tacklePoints', 'touchPoints', 'bonusPoints']
//         .map((key) => updatedTeam[key])
//         .reduce((acc, value) => acc + value, 0);

//     // Set the updated match data with the new total points
//     setMatchData((prevMatchData) => ({
//       ...prevMatchData,
//       data: {
//         ...prevMatchData.data,
//         [team]: {
//           ...updatedTeam,
//           totalPoints,
//         },
//       },
//     }));
//   };

//   const handleFormSubmit = (e) => {
//     e.preventDefault();
//     setPopup(true);
//   };

//   const submitMatchData = async () => {
//     try {
//       await axios.post('http://localhost:5000/api/v1/sports/Createkabaddi', {
//         teamA: matchData.data.teamA,
//         teamB: matchData.data.teamB,
//         currentHalf: matchData.data.currentHalf,
//         latestUpdate: matchData.data.latestUpdate,
//       });
//       toast.success('Data Added Successfully!');
//       setPopup(false);
//     } catch (err) {
//       console.error(err);
//       toast.error('Failed! Try Again');
//     }
//   };

//   return (
//     <>
//       {popup && (
//         <div className={styles.kabaddiCover} onClick={() => setPopup(false)}>
//           <div className={styles.kabaddiPop} onClick={(e) => e.stopPropagation()}>
//             <p style={{ color: 'blue', textAlign: 'center', fontSize: '30px' }}>
//               Are you sure to submit the score?
//             </p>
//             <button className={styles.kabaddiYes} onClick={submitMatchData}>
//               Yes
//             </button>
//             <button className={styles.kabaddiNo} onClick={() => setPopup(false)}>
//               No
//             </button>
//           </div>
//         </div>
//       )}
//       <div className={styles.kabaddiMainDiv}>
//         <h2 className={styles.kabaddiHeader}>Kabaddi Admin Page</h2>
//         <form onSubmit={handleFormSubmit} className={styles.kabaddiAdminForm}>
//           <div className={styles.kabaddiTeamsContainer}>
//             {/* Team A */}
//             <div className={styles.kabaddiTeamBlock}>
//               <div className={styles.kabaddiBlockHeader}>Team A</div>
//               <div className={styles.kabaddiBlockContent}>
//                 <label className={styles.kabaddiLabel}>Team A Name</label>
//                 <input
//                   className={styles.kabaddiInput}
//                   type="text"
//                   placeholder="Enter Team A Name"
//                   value={matchData.data.teamA.name}
//                   onChange={(e) => handleInputChange(e, 'teamA', 'name')}
//                 />
//                 <label className={styles.kabaddiLabel}>Player Name</label>
//                 <input
//                   className={styles.kabaddiInput}
//                   type="text"
//                   placeholder="Enter Player Name"
//                   value={matchData.data.teamA.player}
//                   onChange={(e) => handleInputChange(e, 'teamA', 'player')}
//                 />
//                 <label className={styles.kabaddiLabel}>Raid Points</label>
//                 <input
//                   className={styles.kabaddiInput}
//                   type="number"
//                   value={matchData.data.teamA.raidPoints}
//                   onChange={(e) => handleScoreChange(e, 'teamA', 'raidPoints')}
//                 />
//                 <label className={styles.kabaddiLabel}>Tackle Points</label>
//                 <input
//                   className={styles.kabaddiInput}
//                   type="number"
//                   value={matchData.data.teamA.tacklePoints}
//                   onChange={(e) => handleScoreChange(e, 'teamA', 'tacklePoints')}
//                 />
//                 <label className={styles.kabaddiLabel}>Touch Points</label>
//                 <input
//                   className={styles.kabaddiInput}
//                   type="number"
//                   value={matchData.data.teamA.touchPoints}
//                   onChange={(e) => handleScoreChange(e, 'teamA', 'touchPoints')}
//                 />
//                 <label className={styles.kabaddiLabel}>Bonus Points</label>
//                 <input
//                   className={styles.kabaddiInput}
//                   type="number"
//                   value={matchData.data.teamA.bonusPoints}
//                   onChange={(e) => handleScoreChange(e, 'teamA', 'bonusPoints')}
//                 />
//                 <label className={styles.kabaddiLabel}>Total Points</label>
//                 <input
//                   className={styles.kabaddiInput}
//                   type="number"
//                   value={matchData.data.teamA.totalPoints}
//                   readOnly
//                 />
//               </div>
//             </div>

//             {/* Team B */}
//             <div className={styles.kabaddiTeamBlock}>
//               <div className={styles.kabaddiBlockHeader}>Team B</div>
//               <div className={styles.kabaddiBlockContent}>
//                 <label className={styles.kabaddiLabel}>Team B Name</label>
//                 <input
//                   className={styles.kabaddiInput}
//                   type="text"
//                   placeholder="Enter Team B Name"
//                   value={matchData.data.teamB.name}
//                   onChange={(e) => handleInputChange(e, 'teamB', 'name')}
//                 />
//                 <label className={styles.kabaddiLabel}>Player Name</label>
//                 <input
//                   className={styles.kabaddiInput}
//                   type="text"
//                   placeholder="Enter Player Name"
//                   value={matchData.data.teamB.player}
//                   onChange={(e) => handleInputChange(e, 'teamB', 'player')}
//                 />
//                 <label className={styles.kabaddiLabel}>Raid Points</label>
//                 <input
//                   className={styles.kabaddiInput}
//                   type="number"
//                   value={matchData.data.teamB.raidPoints}
//                   onChange={(e) => handleScoreChange(e, 'teamB', 'raidPoints')}
//                 />
//                 <label className={styles.kabaddiLabel}>Tackle Points</label>
//                 <input
//                   className={styles.kabaddiInput}
//                   type="number"
//                   value={matchData.data.teamB.tacklePoints}
//                   onChange={(e) => handleScoreChange(e, 'teamB', 'tacklePoints')}
//                 />
//                 <label className={styles.kabaddiLabel}>Touch Points</label>
//                 <input
//                   className={styles.kabaddiInput}
//                   type="number"
//                   value={matchData.data.teamB.touchPoints}
//                   onChange={(e) => handleScoreChange(e, 'teamB', 'touchPoints')}
//                 />
//                 <label className={styles.kabaddiLabel}>Bonus Points</label>
//                 <input
//                   className={styles.kabaddiInput}
//                   type="number"
//                   value={matchData.data.teamB.bonusPoints}
//                   onChange={(e) => handleScoreChange(e, 'teamB', 'bonusPoints')}
//                 />
//                 <label className={styles.kabaddiLabel}>Total Points</label>
//                 <input
//                   className={styles.kabaddiInput}
//                   type="number"
//                   value={matchData.data.teamB.totalPoints}
//                   readOnly
//                 />
//               </div>
//             </div>
//           </div>

//           <button className={styles.kabaddiSubmitButton} type="submit">
//             Submit Match
//           </button>
//         </form>
//       </div>
//     </>
//   );
// }


function AdminKabaddi() {
  const [popup, setPopup] = useState(false);
  const [matchData, setMatchData] = useState({
    teamA: {
      name: '',
      player: '',
      set1Points: { raidPoints: 0, tacklePoints: 0, touchPoints: 0, bonusPoints: 0, totalPoints: 0 },
      set2Points: { raidPoints: 0, tacklePoints: 0, touchPoints: 0, bonusPoints: 0, totalPoints: 0 },
      set3Points: { raidPoints: 0, tacklePoints: 0, touchPoints: 0, bonusPoints: 0, totalPoints: 0 },
      totalPoints: 0,
    },
    teamB: {
      name: '',
      player: '',
      set1Points: { raidPoints: 0, tacklePoints: 0, touchPoints: 0, bonusPoints: 0, totalPoints: 0 },
      set2Points: { raidPoints: 0, tacklePoints: 0, touchPoints: 0, bonusPoints: 0, totalPoints: 0 },
      set3Points: { raidPoints: 0, tacklePoints: 0, touchPoints: 0, bonusPoints: 0, totalPoints: 0 },
      totalPoints: 0,
    },
    currentHalf: 1,
    latestUpdate: '',
  });

  const handleInputChange = (e, team, field) => {
    const value = e.target.value;
    setMatchData((prevMatchData) => ({
      ...prevMatchData,
      [team]: {
        ...prevMatchData[team],
        [field]: value,
      },
    }));
  };

  const handleScoreChange = (e, team, set, scoreType) => {
    const score = parseInt(e.target.value, 10) || 0;

    setMatchData((prevMatchData) => {
      const updatedTeam = { ...prevMatchData[team] };

      updatedTeam[set][scoreType] = score;

      // Calculate the totalPoints for the set
      updatedTeam[set].totalPoints = Object.values(updatedTeam[set])
        .slice(0, -1)
        .reduce((acc, value) => acc + value, 0);

      // Recalculate totalPoints for the team
      updatedTeam.totalPoints = ['set1Points', 'set2Points', 'set3Points']
        .map((setKey) => updatedTeam[setKey].totalPoints)
        .reduce((acc, setTotal) => acc + setTotal, 0);

      return {
        ...prevMatchData,
        [team]: updatedTeam,
      };
    });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    // Check if team data is complete before showing the popup
    if (!matchData.teamA.name || !matchData.teamB.name) {
      toast.error('Please fill out both team names!');
      return;
    }
    setPopup(true);
  };

  // const submitMatchData = async () => {
  //   try {
  //     const response = await axios.post('http://localhost:5000/api/v1/sports/Createkabaddi', {
  //       teamA: matchData.teamA,
  //       teamB: matchData.teamB,
  //       currentHalf: matchData.currentHalf,
  //       latestUpdate: matchData.latestUpdate,
  //     });
  //     toast.success('Data Added Successfully!');
  //   } catch (error) {
  //     console.error('Error submitting match data:', error);
  //     toast.error('Failed to submit match data! Try again');
  //   }
  //   setPopup(false);
  // };
  const submitMatchData = async () => {
    try {
      // Set the latestUpdate to the current timestamp before submitting
      const updatedMatchData = { 
        ...matchData, 
        latestUpdate: new Date().toISOString() // Capture the current timestamp in ISO format
      };
  
      const response = await axios.post('http://localhost:5000/api/v1/sports/Createkabaddi', {
        teamA: updatedMatchData.teamA,
        teamB: updatedMatchData.teamB,
        currentHalf: updatedMatchData.currentHalf,
        latestUpdate: updatedMatchData.latestUpdate,
      });
  
      toast.success('Data Added Successfully!');
    } catch (error) {
      console.error('Error submitting match data:', error);
      toast.error('Failed to submit match data! Try again');
    }
    setPopup(false);
  };
  


  return (
    <>
      {popup && (
        <div className={styles.kabaddiCover} onClick={() => setPopup(false)}>
          <div className={styles.kabaddiPop} onClick={(e) => e.stopPropagation()}>
            <p style={{ color: 'blue', textAlign: 'center', fontSize: '30px' }}>
              Are you sure to submit the score?
            </p>
            <button className={styles.kabaddiYes} onClick={submitMatchData}>
              Yes
            </button>
            <button className={styles.kabaddiNo} onClick={() => setPopup(false)}>
              No
            </button>
          </div>
        </div>
      )}

      <div className={styles.kabaddiMainDiv}>
        <h2 className={styles.kabaddiHeader}>Kabaddi Admin Page</h2>
        <form onSubmit={handleFormSubmit} className={styles.kabaddiAdminForm}>
          <div className={styles.kabaddiTeamsContainer}>
            {/* Team A */}
            <div className={styles.kabaddiTeamBlock}>
              <div className={styles.kabaddiBlockHeader}>Team A</div>
              <div className={styles.kabaddiBlockContent}>
                <label className={styles.kabaddiLabel}>Team A Name</label>
                <input
                  className={styles.kabaddiInput}
                  type="text"
                  value={matchData.teamA.name}
                  onChange={(e) => handleInputChange(e, 'teamA', 'name')}
                />
                <label className={styles.kabaddiLabel}>Player Name</label>
                <input
                  className={styles.kabaddiInput}
                  type="text"
                  value={matchData.teamA.player}
                  onChange={(e) => handleInputChange(e, 'teamA', 'player')}
                />

                {['set1Points', 'set2Points', 'set3Points'].map((set) => (
                  <div key={set}>
                    <h3>{`Set ${set.slice(3)}`}</h3>
                    {['raidPoints', 'tacklePoints', 'touchPoints', 'bonusPoints'].map((scoreType) => (
                      <div key={scoreType}>
                        <label className={styles.kabaddiLabel}>{scoreType.replace(/([A-Z])/g, ' $1')}</label>
                        <input
                          className={styles.kabaddiInput}
                          type="number"
                          value={matchData.teamA[set][scoreType]}
                          onChange={(e) => handleScoreChange(e, 'teamA', set, scoreType)}
                        />
                      </div>
                    ))}
                    <div>
                      <label className={styles.kabaddiLabel}>Total Points for {`Set ${set.slice(3)}`}</label>
                      <input
                        className={styles.kabaddiInput}
                        type="text"
                        value={matchData.teamA[set].totalPoints}
                        readOnly
                      />
                    </div>
                  </div>
                ))}
                <div>
                  <label className={styles.kabaddiLabel}>Total Points for Team A</label>
                  <input
                    className={styles.kabaddiInput}
                    type="text"
                    value={matchData.teamA.totalPoints}
                    readOnly
                  />
                </div>
              </div>
            </div>

            {/* Team B */}
            <div className={styles.kabaddiTeamBlock}>
              <div className={styles.kabaddiBlockHeader}>Team B</div>
              <div className={styles.kabaddiBlockContent}>
                <label className={styles.kabaddiLabel}>Team B Name</label>
                <input
                  className={styles.kabaddiInput}
                  type="text"
                  value={matchData.teamB.name}
                  onChange={(e) => handleInputChange(e, 'teamB', 'name')}
                />
                <label className={styles.kabaddiLabel}>Player Name</label>
                <input
                  className={styles.kabaddiInput}
                  type="text"
                  value={matchData.teamB.player}
                  onChange={(e) => handleInputChange(e, 'teamB', 'player')}
                />

                {['set1Points', 'set2Points', 'set3Points'].map((set) => (
                  <div key={set}>
                    <h3>{`Set ${set.slice(3)}`}</h3>
                    {['raidPoints', 'tacklePoints', 'touchPoints', 'bonusPoints'].map((scoreType) => (
                      <div key={scoreType}>
                        <label className={styles.kabaddiLabel}>{scoreType.replace(/([A-Z])/g, ' $1')}</label>
                        <input
                          className={styles.kabaddiInput}
                          type="number"
                          value={matchData.teamB[set][scoreType]}
                          onChange={(e) => handleScoreChange(e, 'teamB', set, scoreType)}
                        />
                      </div>
                    ))}
                    <div>
                      <label className={styles.kabaddiLabel}>Total Points for {`Set ${set.slice(3)}`}</label>
                      <input
                        className={styles.kabaddiInput}
                        type="text"
                        value={matchData.teamB[set].totalPoints}
                        readOnly
                      />
                    </div>
                  </div>
                ))}
                <div>
                  <label className={styles.kabaddiLabel}>Total Points for Team B</label>
                  <input
                    className={styles.kabaddiInput}
                    type="text"
                    value={matchData.teamB.totalPoints}
                    readOnly
                  />
                </div>
              </div>
            </div>
          </div>

          <div className={styles.kabaddiFooter}>
            <button type="submit" className={styles.kabaddiSubmitButton}>
              Submit Match Score
            </button>
          </div>
        </form>
      </div>
    </>
  );
}

export default AdminKabaddi;



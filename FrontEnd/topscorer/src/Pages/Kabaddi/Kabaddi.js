import React, { useState, useEffect } from 'react';
import styles from "../Tennis/Tennis.module.css"; // Update with Kabaddi styles
import Options from '../../Components/Live_Upcoming/Options';
import { MdSportsKabaddi } from "react-icons/md";
import ChatComponent from '../../Components/Chat/Chat';

function Kabaddi({ data }) {
  const flag1_link = "https://upload.wikimedia.org/wikipedia/en/thumb/4/41/Flag_of_India.svg/640px-Flag_of_India.svg.png";
  const flag2_link = "https://upload.wikimedia.org/wikipedia/commons/thumb/f/fa/Flag_of_the_People%27s_Republic_of_China.svg/1200px-Flag_of_the_People%27s_Republic_of_China.svg.png";

  const dummyFlag = "https://via.placeholder.com/150"; // Placeholder flag
  const defaultTeam = {
    name: "Team",
    player: "Player",
    set1Points: { raidPoints: 0, tacklePoints: 0, touchPoints: 0, bonusPoints: 0, totalPoints: 0 },
    set2Points: { raidPoints: 0, tacklePoints: 0, touchPoints: 0, bonusPoints: 0, totalPoints: 0 },
    set3Points: { raidPoints: 0, tacklePoints: 0, touchPoints: 0, bonusPoints: 0, totalPoints: 0 },
    totalPoints: 0,
  };

  const matchData = data || {
    teamA: { ...defaultTeam },
    teamB: { ...defaultTeam },
    latestUpdate: "No updates available",
  };

  const [currSet, setCurrSet] = useState(1);
  const [wdth, setWidth] = useState(50);

  // Utility function to check if a set is empty
  const isSetEmpty = (set) =>
    set.raidPoints === 0 &&
    set.tacklePoints === 0 &&
    set.touchPoints === 0 &&
    set.bonusPoints === 0 &&
    set.totalPoints === 0;

  // Set current set based on the match data
  useEffect(() => {
    if (!(matchData.teamA.set1Points) || !(matchData.teamB.set1Points)) {
      setCurrSet(1);
    } else if (!(matchData.teamA.set2Points) || !(matchData.teamB.set2Points)) {
      setCurrSet(2);
    } else if (!(matchData.teamA.set3Points) || !(matchData.teamB.set3Points)) {
      setCurrSet(3);
    }
  }, [matchData]); // Run this effect only when matchData changes

  const renderSetData = (teamAData, teamBData, setName) => (
    <div className={styles.sets}>
      <h4>{setName} Summary</h4>
      <table>
        <thead>
          <tr>
            <th></th>
            <th>Player Name</th>
            <th>Touch Points</th>
            <th>Tackle Points</th>
            <th>Raid Points</th>
            <th>Bonus Points</th>
            <th>Total Score</th>
          </tr>
        </thead>
        <tbody>
          {/* Team A Row */}
          <tr>
            <td>
              <span className={styles.flg}>
                <img className={styles.tableimg} src={flag1_link} alt="flag" />
              </span>
            </td>
            <td>{matchData.teamA.player}</td>
            <td>{teamAData.touchPoints}</td>
            <td>{teamAData.tacklePoints}</td>
            <td>{teamAData.raidPoints}</td>
            <td>{teamAData.bonusPoints}</td>
            <td>{teamAData.totalPoints}</td>
          </tr>
  
          {/* Team B Row */}
          <tr>
            <td>
              <span className={styles.flg}>
                <img className={styles.tableimg} src={flag2_link} alt="flag" />
              </span>
            </td>
            <td>{matchData.teamB.player}</td>
            <td>{teamBData.touchPoints}</td>
            <td>{teamBData.tacklePoints}</td>
            <td>{teamBData.raidPoints}</td>
            <td>{teamBData.bonusPoints}</td>
            <td>{teamBData.totalPoints}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );

  return (
    <>
      <div className={styles.MainDiv}>
        
      <ChatComponent sportName={"Kabbadi"}/>
        <Options cur_link="/kabaddi" archived="/kabaddi_archived" />
        <div className={styles.ScoreBoard}>
          <div className={styles.SportName}>
            <p><MdSportsKabaddi /> Kabaddi</p>
          </div>
          <div className={styles.FLZ}>
            <div className={styles.teamA}>
              <p className={styles.tname}>{matchData.teamA.name}</p>
              <div className={styles.teamA_Img}>
                <img
                  className={styles.img1}
                  src={matchData.teamA.flag || flag1_link}
                  alt={`${matchData.teamA.name} Flag`}
                />
              </div>
              <p>{matchData.teamA.player} (P)</p>
            </div>
            <div className={styles.VS}>
              <h1 className={styles.gols}>
                {matchData.teamA.totalPoints} - {matchData.teamB.totalPoints}
              </h1>
              <p className={styles.setInfo}> .</p>
            </div>
            <div className={styles.teamB}>
              <p className={styles.tname}>{matchData.teamB.name}</p>
              <div className={styles.teamB_Img}>
                <img
                  className={styles.img2}
                  src={matchData.teamB.flag || flag2_link}
                  alt={`${matchData.teamB.name} Flag`}
                />
              </div>
              <p>{matchData.teamB.player} (P)</p>
            </div>
          </div>
        </div>

        <div className={styles.textUpdate}>
          <div className={styles.predictor}>
            <div style={{ width: `30%`, transition: "1s" }} className={styles.bar}></div> 
          </div>
          <p>{matchData.latestUpdate}</p>
        </div>

        <div className={styles.Sumry}>
          <h2>Summary</h2>
        </div>
        <div className={styles.table}>
          {renderSetData(matchData.teamA.set1Points, matchData.teamB.set1Points, "Set 1")}
          {renderSetData(matchData.teamA.set2Points, matchData.teamB.set2Points, "Set 2")}
          {renderSetData(matchData.teamA.set3Points, matchData.teamB.set3Points, "Set 3")}
        </div>

      </div>
    </>
  );
}

export default Kabaddi;

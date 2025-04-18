import { useState, useEffect } from "react";
import styles from "../Tennis_D/Tennis_D.module.css";
import Options from '../../Components/Live_Upcoming/Options';
import { GiTennisRacket } from "react-icons/gi";
import ChatComponent from "../../Components/Chat/Chat";

import Badminton_Probability from "../ProbabilityPred/BadmintonPred";

function Tennis_D({ttd}) {
  const flag1_link = "https://upload.wikimedia.org/wikipedia/en/thumb/4/41/Flag_of_India.svg/640px-Flag_of_India.svg.png";
  const flag2_link = "https://upload.wikimedia.org/wikipedia/commons/thumb/f/fa/Flag_of_the_People%27s_Republic_of_China.svg/1200px-Flag_of_the_People%27s_Republic_of_China.svg.png";
  const [wdth, setWidth] = useState(50);
  const matchData = ttd ? ttd : {
    teamA: {
      name: "NA", 
      player1: "NA",
      player2: "NA",
    },
    teamB: {
      name: "NA",
      player1: "NA",
      player2: "NA",
    },
    tmA_score: [],
    tmB_score: [],
    latestUpdate: "NA"
  }
  console.log("Match_Data",ttd)

  useEffect(() => {
    let score1 = matchData?.tmA_score.length > 0
      ? parseInt(matchData.tmA_score[matchData.tmA_score.length - 1], 10) 
      : 0;
  
    let score2 = matchData?.tmB_score.length > 0
      ? parseInt(matchData.tmB_score[matchData.tmB_score.length - 1], 10) 
      : 0;

    console.log("Score", score1, score2);
    // Calculate probability and set width
    let prbabs = Badminton_Probability(score1, score2) || 0;  // Default to 0 if undefined
    if (!isNaN(prbabs)) {
      // Normalize to range 0-100
      prbabs = Math.max(0, Math.min(prbabs, 100));
      setWidth(prbabs);
      console.log("Width set to:", prbabs); // Log the new width
    }
  }, [matchData]);

  useEffect(() => {
    console.log('Width updated to:', wdth); // Log width changes
  }, [wdth]);

  const { teamA, teamB, tmA_score, tmB_score, latestUpdate } = matchData; // Destructure for easier access

  return (
    <div className={styles.MainDiv}>
      
      <ChatComponent sportName={"Tennis_D"}/>
      <Options cur_link="/tennis_d" archived="/dbtennis_archived" />
      <div className={styles.ScoreBoard}>
        <div className={styles.SportName}>
          <p><GiTennisRacket /> <GiTennisRacket /> Tennis Doubles</p>
        </div>
        <div className={styles.FLZ}>
          <div className={styles.teamA}>
            <p className={styles.tname}>{teamA.name}</p> 
            <div className={styles.teamA_Img}>
              <img className={styles.img1} alt="Team A" src={flag1_link} />
            </div>
            <p>{teamA.player1}(P)</p>
            <p>{teamA.player2}(P)</p>
          </div>
          <div className={styles.VS}>
            <h1 style={{marginTop:"15px"}} className={styles.gols}> 
              {tmA_score.length > 0 ? tmA_score.at(-1) : 0} - {tmB_score.length > 0 ? tmB_score.at(-1) : 0}
            </h1>
            <p className={styles.setInfo}>Set {tmA_score.length}</p>
          </div>
          <div className={styles.teamB}>
            <p className={styles.tname}>{teamB.name}</p>
            <div className={styles.teamA_Img}>
              <img className={styles.img2} alt="Team B" src={flag2_link} />
            </div>
            <p>{teamB.player1}(P)</p>
            <p>{teamB.player2}(P)</p>
          </div>
        </div>
      </div>

      <div className={styles.textUpdate}>
        <div className={styles.predictor}>
          <div style={{ width: `${wdth}%`, transition: "1s" }} className={styles.bar}></div> {/* Display width as a percentage */}
        </div>
        <p>{latestUpdate}</p>
      </div>

      <div className={styles.Sumry}>
        <h2>Summary</h2>
      </div>

      <div className={styles.table}>
        <div className={styles.sets}>
          <table>
            <thead>
              <tr>
                <th></th>
                <th>Player 1</th>
                <th>Player 2</th>
                <th>Set 1</th>
                <th>Set 2</th>
                <th>Set 3</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <span className={styles.flg}>
                    <img className={styles.tableimg} src={flag1_link} alt="Flag 1" />
                  </span>
                </td>
                <td>{teamA.player1}</td>
                <td>{teamA.player2}</td>
                <td>{tmA_score[0] || 0}</td>
                <td>{tmA_score[1] || 0}</td>
                <td>{tmA_score[2] || 0}</td>
              </tr>
              <tr>
                <td>
                  <span className={styles.flg}>
                    <img className={styles.tableimg} src={flag2_link} alt="Flag 2" />
                  </span>
                </td>
                <td>{teamB.player1}</td>
                <td>{teamB.player2}</td>
                <td>{tmB_score[0] || 0}</td>
                <td>{tmB_score[1] || 0}</td>
                <td>{tmB_score[2] || 0}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Tennis_D;

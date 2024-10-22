import { useState, useEffect } from "react";
import styles from "../Badminton/Badminton.module.css";
import Options from '../../Components/Live_Upcoming/Options';
import { GiTennisRacket } from "react-icons/gi";
import io from "socket.io-client";

const socket = io.connect("http://localhost:5000");

function Badminton() {
  
  const [matchData, setMatchData] = useState({
    teamA: {
      name: "NA", 
      player: "NA",
    },
    teamB: {
      name: "NA",
      player: "NA",
    },
    tmA_score: [],
    tmB_score: [],
    currentSet: 1,
    latestUpdate: "NA"
  });

  useEffect(() => {
    socket.on("FullPayLoad", (payload) => {
      
      console.log(payload.badminton.lastMessageBD);
      setMatchData(payload.badminton.lastMessageBD);

    });
  }, []);  // Empty dependency array to ensure socket listener is set up only once
  
  const val = localStorage.getItem('badminton');
  console.log('------------', matchData);
  
  return (
    <>
      <div className={styles.MainDiv}>
        <Options />
        <div className={styles.ScoreBoard}>
          <div className={styles.SportName}>
            <p>< GiTennisRacket /> Badminton</p>
          </div>
          <div className={styles.FLZ}>
            <div className={styles.teamA}>
              <p className={styles.tname}>{matchData?.teamA?.name}</p> {/* Optional chaining */}
              <div className={styles.teamA_Img}>
                <img className={styles.img1} alt="Team A" src="https://upload.wikimedia.org/wikipedia/en/thumb/4/41/Flag_of_India.svg/640px-Flag_of_India.svg.png"/>
              </div>
              <p>{matchData?.teamA?.player}(P)</p>
            </div>
            <div className={styles.VS}>
              <h1 className={styles.gols}> {matchData?.tmA_score?.at(-1)}-{matchData?.tmB_score?.at(-1)}</h1> {/* Optional chaining */}
              <p className={styles.setInfo}>Set {matchData?.tmA_score?.length}</p>
            </div>
            <div className={styles.teamB}>
              <p className={styles.tname}>{matchData?.teamB?.name}</p>
              <div className={styles.teamA_Img}>
                <img className={styles.img2} alt="Team B" src="https://upload.wikimedia.org/wikipedia/commons/thumb/f/fa/Flag_of_the_People%27s_Republic_of_China.svg/1200px-Flag_of_the_People%27s_Republic_of_China.svg.png" />
              </div>
              <p>{matchData?.teamB?.player}(P)</p>
            </div>
          </div>
        </div>

        <div className={styles.textUpdate}>
          <div className={styles.predictor}>
            <div className={styles.bar}></div>
          </div>
          <p>{matchData?.latestUpdate}</p>
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
                  <th>Player Name</th>
                  <th>Set1</th>
                  <th>Set2</th>
                  <th>Set3</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><span className={styles.flg}>
                    <img className={styles.tableimg} src="path/to/flag1.png" alt="Flag 1" />
                  </span></td>
                  <td>{matchData?.teamA?.player}</td>
                  <td>{matchData?.tmA_score?.[0]}</td>
                  <td>{matchData?.tmA_score?.[1]}</td>
                  <td>{matchData?.tmA_score?.[2]}</td>
                </tr>
                <tr>
                  <td><span className={styles.flg}>
                    <img className={styles.tableimg} src="path/to/flag2.png" alt="Flag 2" />
                  </span></td>
                  <td>{matchData?.teamB?.player}</td>
                  <td>{matchData?.tmB_score?.[0]}</td>
                  <td>{matchData?.tmB_score?.[1]}</td>
                  <td>{matchData?.tmB_score?.[2]}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </>
  );
}

export default Badminton;
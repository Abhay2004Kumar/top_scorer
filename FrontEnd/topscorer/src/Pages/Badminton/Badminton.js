import React from 'react';
import styles from "../Badminton/Badminton.module.css";
import Options from '../../Components/Live_Upcoming/Options';
import { GiTennisRacket } from "react-icons/gi";
function Badminton() {
  const matchData = {
    c_Set:"1",
    teamA: {
      name: "IND",
      player: "PV Sindhu",
      flag: "https://cdn.britannica.com/97/1597-004-05816F4E/Flag-India.jpg"
    },
    teamB: {
      name: "CHN",
      player: "Player Name",
      flag: "https://cdn.britannica.com/90/7490-050-5D33348F/Flag-China.jpg"
    },
    setScore: "22 - 20",
    currentSet: 3,
    latestUpdate: "India won the final set 22-20!",
    sets: [
      {
        events: [
          { player: "PV Sindhu", set1: "21", set2: "19", set3: "21",
            flag: "https://cdn.britannica.com/97/1597-004-05816F4E/Flag-India.jpg" },

          { player: "Chini Bsk", set1: "19", set2: "21", set3: " 18" ,
            flag: "https://cdn.britannica.com/90/7490-050-5D33348F/Flag-China.jpg"}
        ]
      }
    ]
  };

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
            <p className={styles.tname}>{matchData.teamA.name}</p>
            <div className={styles.teamA_Img}>
              <img className={styles.img1} src={matchData.teamA.flag} alt={`${matchData.teamA.name} Flag`} />
            </div>
            <p>{matchData.teamA.player} (P)</p>
          </div>
          <div className={styles.VS}>
            <h1 className={styles.gols}> {matchData.setScore} </h1>
            <p className={styles.setInfo}>Set {matchData.currentSet}</p>
          </div>
          <div className={styles.teamB}>
            <p className={styles.tname}>{matchData.teamB.name}</p>
            <div className={styles.teamA_Img}>
              <img className={styles.img2} src={matchData.teamB.flag} alt={`${matchData.teamB.name} Flag`} />
            </div>
            <p>{matchData.teamB.player} (P)</p>
          </div>
          </div>
        </div>

        <div className={styles.textUpdate}>
          <div className={styles.predictor}>
            <div className={styles.bar}></div>
          </div>
          <p>{matchData.latestUpdate}</p>
        </div>

        <div className={styles.Sumry}>
          <h2>Summary</h2>
        </div>

        <div className={styles.table}>
          {matchData.sets.map((set, index) => (
            <div key={index} className={styles.sets}>
              <h4>Set {index + 1}</h4>
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
                  {set.events.map((event, eventIndex) => (
                    <tr key={eventIndex}>
                      <td><span className={styles.flg}>
                        <img className={styles.tableimg} src={event.flag}></img>
                        </span></td>
                      <td>{event.player}</td>
                      <td>{event.set1}</td>
                      <td>{event.set2}</td>
                      <td>{event.set3}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
export default Badminton;

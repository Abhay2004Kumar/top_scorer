import React from 'react';
import styles from "../Tennis/Tennis.module.css"; // Update with Kabaddi styles
import Options from '../../Components/Live_Upcoming/Options';
import { MdSportsKabaddi } from "react-icons/md";

function Kabaddi() {
  const matchData = {
    currentSet: 1,
    teamA: {
      name: "IND",
      player: "PV Sindhu",
      flag: "https://cdn.britannica.com/97/1597-004-05816F4E/Flag-India.jpg"
    },
    teamB: {
      name: "BAN",
      player: "Player Name",
      flag: "https://cdn.britannica.com/67/6267-004-10A21DF0/Flag-Bangladesh.jpg"
    },
    setScore: "22 - 20",
    latestUpdate: "India won the final set 22-20!",
    sets: [
      {
        events: [
          {
            player: "PV Sindhu",
            touchPoints: "5",
            tacklePoints: "3",
            raidPoints: "7",
            bonusPoints: "2",
            totalScore: "17",
            flag: "https://cdn.britannica.com/97/1597-004-05816F4E/Flag-India.jpg"
          },
          {
            player: "Chini Bsk",
            touchPoints: "4",
            tacklePoints: "2",
            raidPoints: "6",
            bonusPoints: "1",
            totalScore: "13",
            flag: "https://cdn.britannica.com/67/6267-004-10A21DF0/Flag-Bangladesh.jpg"
          }
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
            <p><MdSportsKabaddi /> Kabaddi</p>
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
        <div className={styles.Sumry}>
          <h2>Statistic</h2>
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
                    <th>Touch Points</th>
                    <th>Tackle Points</th>
                    <th>Raid Points</th>
                    <th>Bonus Points</th>
                    <th>Total Score</th>
                  </tr>
                </thead>
                <tbody>
                  {set.events.map((event, eventIndex) => (
                    <tr key={eventIndex}>
                      <td>
                        <span className={styles.flg}>
                          <img className={styles.tableimg} src={event.flag} alt="flag" />
                        </span>
                      </td>
                      <td>{event.player}</td>
                      <td>{event.touchPoints}</td>
                      <td>{event.tacklePoints}</td>
                      <td>{event.raidPoints}</td>
                      <td>{event.bonusPoints}</td>
                      <td>{event.totalScore}</td>
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

export default Kabaddi;

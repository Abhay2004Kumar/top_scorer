import React from 'react';
import styles from "../Tennis_D/Tennis_D.module.css";
import Options from '../../Components/Live_Upcoming/Options';
import { MdSportsTennis } from "react-icons/md";

function Tennis_D() {
  const matchData = {
    teamA: {
      name: "IND",
      players: [
        { name1: "PV Sindhu", name2 :"Sanya Nehwal",flag: "https://cdn.britannica.com/97/1597-004-05816F4E/Flag-India.jpg" },
       ]
    },
    teamB: {
      name: "JPN",
      players: [
        { name1: "Chen Yufei",name2 :"Japnese plyer", flag: "https://upload.wikimedia.org/wikipedia/en/thumb/9/9e/Flag_of_Japan.svg/1200px-Flag_of_Japan.svg.png" },
         ]
    },
    setScore: "22 - 20",
    currentSet: 3,
    latestUpdate: "India won the final set 22-20!",
    sets: [
      {
        events: [
          { player1: "PV Sindhu",player2:"Saina Nehwal", set1: "21", set2: "19", set3: "21", flag: "https://cdn.britannica.com/97/1597-004-05816F4E/Flag-India.jpg" },
          { player1: "Chen Yufei",player2: "Japnese plyer", set1: "19", set2: "21", set3: "18",flag: "https://upload.wikimedia.org/wikipedia/en/thumb/9/9e/Flag_of_Japan.svg/1200px-Flag_of_Japan.svg.png" }
        ]
      }
    ]
  };

  return (
    <>
      <div className={styles.MainDiv}>
        <Options></Options>
        <div className={styles.ScoreBoard}>

          <div className={styles.SportName}>
            <p> <MdSportsTennis/> <MdSportsTennis/> Tennis_Doubles</p>
          </div>

          <div className={styles.INFO}>
          <div className={styles.teamA}>
            <p className={styles.tname}>{matchData.teamA.name}</p>
            {matchData.teamA.players.map((player, index) => (
              <div key={index} className={styles.teamA_Img}>
                <img className={styles.img1} src={player.flag} alt={`${player.name} Flag`} />
                <p>{player.name1} (P)</p>
                <p>{player.name2} (P)</p>
              </div>
            ))}
          </div>
          <div className={styles.VS}>
            <h1 className={styles.gols}> {matchData.setScore} </h1>
            <p className={styles.setInfo}>Set  {matchData.currentSet}</p>
          </div>
          <div className={styles.teamB}>
            <p className={styles.tname}>{matchData.teamB.name}</p>
            {matchData.teamB.players.map((player, index) => (
              <div key={index} className={styles.teamA_Img}>
                <img className={styles.img2} src={player.flag} alt={`${player.name} Flag`} />
                <p>{player.name1} (P)</p>
                <p>{player.name2} (P)</p>
              </div>
            ))}
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
                    <th>Player 1</th>
                    <th>Player 2</th>
                    <th>Set 1</th>
                    <th>Set 2</th>
                    <th>Set 3</th>
                  </tr>
                </thead>
                <tbody>
                  {set.events.map((event, eventIndex) => (
                    <tr key={eventIndex}>
                      <td><span className={styles.flg}>
                        <img className={styles.tableimg} src={event.flag}></img>
                        </span></td>
                      <td>{event.player1}</td>
                      <td>{event.player2}</td>
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

export default Tennis_D;

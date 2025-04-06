import React from 'react';
import styles from "../Football/Football.module.css";
import { IoMdFootball } from "react-icons/io";
import Options from '../../Components/Live_Upcoming/Options';
import ChatComponent from '../../Components/Chat/Chat';

function Football() {
  const matchData = {
    sport: "Football",
    teams: {
      teamA: {
        name: "FCB",
        logo: "https://upload.wikimedia.org/wikipedia/en/thumb/4/47/FC_Barcelona_%28crest%29.svg/1200px-FC_Barcelona_%28crest%29.svg.png"
      },
      teamB: {
        name: "Valencia CF",
        logo: "https://upload.wikimedia.org/wikipedia/en/thumb/c/ce/Valenciacf.svg/1200px-Valenciacf.svg.png"
      }
    },
    score: "2 - 3",
    latestUpdate: "Team B scored in the 85th minute!",
    events: {
      firstHalf: [
        { time: "15'", event: "Goal", team: "Team A" },
        { time: "30'", event: "Goal", team: "Team B" },
        { time: "40'", event: "Goal", team: "Team A" }
      ],
      secondHalf: [
        { time: "60'", event: "Goal", team: "Team B" },
        { time: "85'", event: "Goal", team: "Team B" }
      ]
    }
  };

  return (
    <>
      <div className={styles.MainDiv}>
      <ChatComponent sportName={"Football"}/>
      <Options
          cur_link="/football"
          archived="/football_archived"
        />
        <div className={styles.ScoreBoard}>
          <div className={styles.SportName}>
            <p><IoMdFootball /> {matchData.sport}</p>
          </div>
          <div className={styles.FZF}>
            <div className={styles.teamA}>
              <p className={styles.tname}>{matchData.teams.teamA.name}</p>
              <div className={styles.teamA_Img}>
                <img className={styles.img1} src={matchData.teams.teamA.logo} alt={`${matchData.teams.teamA.name} logo`} />
              </div>
            </div>
            <div className={styles.VS}>
              <h1 className={styles.gols}>{matchData.score}</h1>
            </div>
            <div className={styles.teamB}>
              <p className={styles.tname}>{matchData.teams.teamB.name}</p>
              <div className={styles.teamA_Img}>
                <img className={styles.img2} src={matchData.teams.teamB.logo} alt={`${matchData.teams.teamB.name} logo`} />
              </div>
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
          <div className={styles.firstH}>
            <h4>First Half</h4>
          </div>
          <table>
            <thead>
              <tr>
                <th>Time</th>
                <th>Event</th>
                <th>Team</th>
              </tr>
            </thead>
            <tbody>
              {matchData.events.firstHalf.map((event, index) => (
                <tr key={index}>
                  <td>{event.time}</td>
                  <td>{event.event}</td>
                  <td>{event.team}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className={styles.secondH}>
            <h4>Second Half</h4>
          </div>
          <table>
            <thead>
              <tr>
                <th>Time</th>
                <th>Event</th>
                <th>Team</th>
              </tr>
            </thead>
            <tbody>
              {matchData.events.secondHalf.map((event, index) => (
                <tr key={index}>
                  <td>{event.time}</td>
                  <td>{event.event}</td>
                  <td>{event.team}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

export default Football;

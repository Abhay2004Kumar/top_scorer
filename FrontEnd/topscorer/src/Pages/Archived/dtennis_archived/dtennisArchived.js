import Options from "../../../Components/Live_Upcoming/Options";
import styles from "./tennisArchived.module.css";
import { useState } from "react";

function DBTennisArchived({ matches }) {
  const defaultMatches = matches || [
    {
      id: 1,
      teamA: {
        name: "USA",
        players: ["Serena Williams", "Venus Williams"],
      },
      teamB: {
        name: "Australia",
        players: ["Ashleigh Barty", "Casey Dellacqua"],
      },
      tmA_score: [6, 7, 6],
      tmB_score: [3, 5, 4],
      latestUpdate: "USA won the match!",
      currentSet: 3,
    },
    {
      id: 2,
      teamA: {
        name: "Spain",
        players: ["Rafael Nadal", "Carlos Alcaraz"],
      },
      teamB: {
        name: "France",
        players: ["Pierre-Hugues Herbert", "Nicolas Mahut"],
      },
      tmA_score: [7, 6, 6],
      tmB_score: [5, 7, 3],
      latestUpdate: "Spain won the match!",
      currentSet: 3,
    },
    {
      id: 3,
      teamA: {
        name: "Germany",
        players: ["Angelique Kerber", "Alexander Zverev"],
      },
      teamB: {
        name: "Italy",
        players: ["Camila Giorgi", "Jannik Sinner"],
      },
      tmA_score: [4, 6, 7],
      tmB_score: [6, 4, 6],
      latestUpdate: "Italy won the match!",
      currentSet: 3,
    },
    {
      id: 4,
      teamA: {
        name: "Great Britain",
        players: ["Andy Murray", "Johanna Konta"],
      },
      teamB: {
        name: "Canada",
        players: ["Milos Raonic", "Gabriela Dabrowski"],
      },
      tmA_score: [7, 6, 7],
      tmB_score: [5, 4, 5],
      latestUpdate: "Great Britain won the match!",
      currentSet: 3,
    },
    {
      id: 5,
      teamA: {
        name: "Switzerland",
        players: ["Roger Federer", "Belinda Bencic"],
      },
      teamB: {
        name: "Serbia",
        players: ["Novak Djokovic", "Ana Ivanovic"],
      },
      tmA_score: [6, 4, 6],
      tmB_score: [3, 6, 2],
      latestUpdate: "Switzerland won the match!",
      currentSet: 3,
    },
    // Add more matches here...
  ];

  const [selectedMatch, setSelectedMatch] = useState(null);

  const handleCardClick = (matchId) => {
    const match = defaultMatches.find((m) => m.id === matchId);
    if (match) setSelectedMatch(match);
  };

  return (
    <div className={styles.MainDiv}>
      <div className={styles.opn}>
        <Options cur_link="/tennis_d" archived="/dbtennis_archived" />
      </div>

      {selectedMatch ? (
        <div className={styles.MatchDetail}>
          <button
            className={styles.BackButton}
            onClick={() => setSelectedMatch(null)}
          >
            Back to Matches
          </button>
          <div className={styles.math_info}>
            <div className={styles.MatchTeams}>
              <div className={styles.TeamDetails}>
                <h3>{selectedMatch.teamA.name}</h3>
                <p>{selectedMatch.teamA.players.join(" & ")}</p>
              </div>
              <div className={styles.TeamDetails}>
                <h3>Vs</h3>
              </div>
              <div className={styles.TeamDetails}>
                <h3>{selectedMatch.teamB.name}</h3>
                <p>{selectedMatch.teamB.players.join(" & ")}</p>
              </div>
            </div>
          </div>

          <p className={styles.MatchUpdate}>{selectedMatch.latestUpdate}</p>

          <div className={styles.Scoreboard}>
            <h3>Scoreboard</h3>
            <table>
              <thead>
                <tr>
                  <th>Set</th>
                  <th>{selectedMatch.teamA.name}</th>
                  <th>{selectedMatch.teamB.name}</th>
                </tr>
              </thead>
              <tbody>
                {selectedMatch.tmA_score.map((score, index) => (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{score}</td>
                    <td>{selectedMatch.tmB_score[index]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className={styles.MatchList}>
          <span className={styles.Heading2}>Archived Tennis Doubles Matches</span>
          <div className={styles.CardContainer}>
            {defaultMatches.map((match) => (
              <div
                key={match.id}
                className={styles.MatchCard}
                onClick={() => handleCardClick(match.id)}
              >
                <h3>
                  {match.teamA.name} vs {match.teamB.name}
                </h3>
                <p className={styles.MatchUpdate}>{match.latestUpdate}</p>
                <div className={styles.CardScore}>
                  <p>
                    Last Set: {match.tmA_score.at(-1)} - {match.tmB_score.at(-1)}
                  </p>
                  <p>Current Set: {match.currentSet}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default DBTennisArchived;

import Options from "../../../Components/Live_Upcoming/Options";
import styles from "./tennisArchived.module.css";
import { useState } from "react";

function TennisArchived({ matches }) {
  const defaultMatches = matches || [
    {
      id: 1,
      playerA: {
        name: "Roger Federer",
        details: "Swiss Legend",
      },
      playerB: {
        name: "Rafael Nadal",
        details: "Spanish Icon",
      },
      scoreA: [6, 4, 6],
      scoreB: [3, 6, 2],
      latestUpdate: "Federer won the match!",
      currentSet: 3,
    },
    {
      id: 2,
      playerA: {
        name: "Serena Williams",
        details: "American Tennis Star",
      },
      playerB: {
        name: "Venus Williams",
        details: "Veteran Player",
      },
      scoreA: [7, 6],
      scoreB: [5, 2],
      latestUpdate: "Serena won the match!",
      currentSet: 2,
    },
    {
        id: 3,
        playerA: {
          name: "Novak Djokovic",
          details: "Serbian Sensation",
        },
        playerB: {
          name: "Andy Murray",
          details: "British Ace",
        },
        scoreA: [6, 3, 6],
        scoreB: [4, 6, 3],
        latestUpdate: "Djokovic secured the victory!",
        currentSet: 3,
      },
      {
        id: 4,
        playerA: {
          name: "Naomi Osaka",
          details: "Japanese Powerhouse",
        },
        playerB: {
          name: "Simona Halep",
          details: "Romanian Rocket",
        },
        scoreA: [7, 5, 6],
        scoreB: [6, 7, 3],
        latestUpdate: "Osaka defeated Halep in three sets!",
        currentSet: 3,
      },
      {
        id: 5,
        playerA: {
          name: "Pete Sampras",
          details: "American Legend",
        },
        playerB: {
          name: "Andre Agassi",
          details: "Dynamic American Duo",
        },
        scoreA: [6, 4, 7],
        scoreB: [4, 6, 5],
        latestUpdate: "Sampras edged out Agassi in a classic battle!",
        currentSet: 3,
      },
      {
        id: 6,
        playerA: {
          name: "Steffi Graf",
          details: "German Champion",
        },
        playerB: {
          name: "Martina Navratilova",
          details: "Tennis Hall of Famer",
        },
        scoreA: [6, 4],
        scoreB: [3, 6],
        latestUpdate: "Graf clinched the win after a tough second set!",
        currentSet: 2,
      },
      {
        id: 7,
        playerA: {
          name: "Venus Williams",
          details: "Tennis Icon",
        },
        playerB: {
          name: "Maria Sharapova",
          details: "Russian Superstar",
        },
        scoreA: [7, 6],
        scoreB: [6, 3],
        latestUpdate: "Venus Williams triumphed in straight sets!",
        currentSet: 2,
      },
      {
        id: 8,
        playerA: {
          name: "Caroline Wozniacki",
          details: "Danish Delight",
        },
        playerB: {
          name: "Angelique Kerber",
          details: "German Counterpuncher",
        },
        scoreA: [6, 4, 7],
        scoreB: [2, 6, 5],
        latestUpdate: "Wozniacki fought off Kerber in a thrilling final set!",
        currentSet: 3,
      },
      {
        id: 9,
        playerA: {
          name: "Tommy Haas",
          details: "German Veteran",
        },
        playerB: {
          name: "Marcos Baghdatis",
          details: "Cypriot Star",
        },
        scoreA: [6, 6],
        scoreB: [4, 3],
        latestUpdate: "Haas dominated Baghdatis in straight sets!",
        currentSet: 2,
      },
      {
        id: 10,
        playerA: {
          name: "Alexander Zverev",
          details: "German Rising Star",
        },
        playerB: {
          name: "Dominic Thiem",
          details: "Austrian Power",
        },
        scoreA: [7, 6, 4],
        scoreB: [5, 7, 6],
        latestUpdate: "Zverev won in a three-set thriller!",
        currentSet: 3,
      },
      {
        id: 11,
        playerA: {
          name: "Bianca Andreescu",
          details: "Canadian Sensation",
        },
        playerB: {
          name: "Serena Williams",
          details: "American Tennis Icon",
        },
        scoreA: [6, 4, 7],
        scoreB: [3, 6, 5],
        latestUpdate: "Andreescu beat Serena in an exciting match!",
        currentSet: 3,
      },
      {
        id: 12,
        playerA: {
          name: "Rafael Nadal",
          details: "King of Clay",
        },
        playerB: {
          name: "Daniil Medvedev",
          details: "Russian Prodigy",
        },
        scoreA: [6, 4],
        scoreB: [3, 6],
        latestUpdate: "Nadal powered through in straight sets!",
        currentSet: 2,
      }
      
    // Add more matches as needed...
  ];

  const [selectedMatch, setSelectedMatch] = useState(null);

  const handleCardClick = (matchId) => {
    const match = defaultMatches.find((m) => m.id === matchId);
    if (match) setSelectedMatch(match);
  };

  return (
    <div className={styles.MainDiv}>
      <div className={styles.opn}>
          <Options 
            cur_link="/dashboard/tennis"
            archived="/dashboard/tennis_archived"
          />
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
                <h3>{selectedMatch.playerA.name}</h3>
                <p>{selectedMatch.playerA.details}</p>
              </div>
              <div className={styles.TeamDetails}>
                <h3>Vs</h3>
              </div>
              <div className={styles.TeamDetails}>
                <h3>{selectedMatch.playerB.name}</h3>
                <p>{selectedMatch.playerB.details}</p>
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
                  <th>{selectedMatch.playerA.name}</th>
                  <th>{selectedMatch.playerB.name}</th>
                </tr>
              </thead>
              <tbody>
                {selectedMatch.scoreA.map((score, index) => (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{score}</td>
                    <td>{selectedMatch.scoreB[index]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className={styles.MatchList}>
          <span className={styles.Heading2}>Archived Matches</span>
          <div className={styles.CardContainer}>
            {defaultMatches.map((match) => (
              <div
                key={match.id}
                className={styles.MatchCard}
                onClick={() => handleCardClick(match.id)}
              >
                <h3>
                  {match.playerA.name} vs {match.playerB.name}
                </h3>
                <p className={styles.MatchUpdate}>{match.latestUpdate}</p>
                <div className={styles.CardScore}>
                  <p>
                    Last Set: {match.scoreA.at(-1)} - {match.scoreB.at(-1)}
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

export default TennisArchived;

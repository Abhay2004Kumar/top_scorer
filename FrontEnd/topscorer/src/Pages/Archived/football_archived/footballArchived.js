import Options from "../../../Components/Live_Upcoming/Options";
import styles from "./footballArchived.module.css";
import { useState } from "react";

function FootballArchived({ matches }) {
  const defaultMatches = matches || [
    {
        id: 1,
        teamA: {
          name: "Brazil",
          player: "Neymar Jr.",
        },
        teamB: {
          name: "Argentina",
          player: "Lionel Messi",
        },
        tmA_score: [3],
        tmB_score: [2],
        latestUpdate: "Brazil won the match after a thrilling 3-2 victory!",
        matchDuration: "90 + 5' (Extra Time)",
      },
      {
        id: 2,
        teamA: {
          name: "Germany",
          player: "Thomas Müller",
        },
        teamB: {
          name: "France",
          player: "Kylian Mbappé",
        },
        tmA_score: [2],
        tmB_score: [2],
        latestUpdate: "The match ended in a 2-2 draw after a late equalizer from Mbappé!",
        matchDuration: "90' (Regular Time)",
      },
      {
        id: 3,
        teamA: {
          name: "England",
          player: "Harry Kane",
        },
        teamB: {
          name: "Italy",
          player: "Ciro Immobile",
        },
        tmA_score: [1],
        tmB_score: [0],
        latestUpdate: "England won the match with a 1-0 victory!",
        matchDuration: "90' (Regular Time)",
      },
      {
        id: 4,
        teamA: {
          name: "Spain",
          player: "Sergio Ramos",
        },
        teamB: {
          name: "Portugal",
          player: "Cristiano Ronaldo",
        },
        tmA_score: [2],
        tmB_score: [1],
        latestUpdate: "Spain secured the win 2-1 over Portugal!",
        matchDuration: "90' (Regular Time)",
      },
      {
        id: 5,
        teamA: {
          name: "Belgium",
          player: "Kevin De Bruyne",
        },
        teamB: {
          name: "Netherlands",
          player: "Virgil van Dijk",
        },
        tmA_score: [3],
        tmB_score: [1],
        latestUpdate: "Belgium dominated Netherlands with a 3-1 win!",
        matchDuration: "90' (Regular Time)",
      },
      {
        id: 6,
        teamA: {
          name: "Croatia",
          player: "Luka Modrić",
        },
        teamB: {
          name: "Denmark",
          player: "Christian Eriksen",
        },
        tmA_score: [2],
        tmB_score: [0],
        latestUpdate: "Croatia won comfortably 2-0 against Denmark!",
        matchDuration: "90' (Regular Time)",
      },
      {
        id: 7,
        teamA: {
          name: "Italy",
          player: "Giorgio Chiellini",
        },
        teamB: {
          name: "Brazil",
          player: "Alisson Becker",
        },
        tmA_score: [0],
        tmB_score: [0],
        latestUpdate: "A 0-0 draw after a defensive masterclass from both teams!",
        matchDuration: "90' (Regular Time)",
      },
      {
        id: 8,
        teamA: {
          name: "Portugal",
          player: "Bernardo Silva",
        },
        teamB: {
          name: "Belgium",
          player: "Romelu Lukaku",
        },
        tmA_score: [1],
        tmB_score: [1],
        latestUpdate: "The match ended in a 1-1 draw with both teams playing aggressively!",
        matchDuration: "90' (Regular Time)",
      },
      {
        id: 9,
        teamA: {
          name: "Germany",
          player: "Manuel Neuer",
        },
        teamB: {
          name: "France",
          player: "Antoine Griezmann",
        },
        tmA_score: [2],
        tmB_score: [3],
        latestUpdate: "France won 3-2 after a dramatic comeback in the second half!",
        matchDuration: "90' (Regular Time)",
      },
      {
        id: 10,
        teamA: {
          name: "England",
          player: "Jude Bellingham",
        },
        teamB: {
          name: "Netherlands",
          player: "Memphis Depay",
        },
        tmA_score: [1],
        tmB_score: [1],
        latestUpdate: "The match was decided by penalties after a 1-1 draw!",
        matchDuration: "90' (Regular Time), followed by penalties",
      },
      {
        id: 11,
        teamA: {
          name: "Spain",
          player: "David De Gea",
        },
        teamB: {
          name: "Argentina",
          player: "Emiliano Martínez",
        },
        tmA_score: [1],
        tmB_score: [1],
        latestUpdate: "Spain defeated Argentina in penalties after a 1-1 draw!",
        matchDuration: "90' (Regular Time), followed by penalties",
      },
      {
        id: 12,
        teamA: {
          name: "Croatia",
          player: "Ivan Rakitić",
        },
        teamB: {
          name: "Denmark",
          player: "Kasper Schmeichel",
        },
        tmA_score: [4],
        tmB_score: [4],
        latestUpdate: "An intense match ended in a 4-4 draw, going into extra time and then penalties!",
        matchDuration: "90' (Regular Time), followed by Extra Time and Penalties",
      },
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
          cur_link="/football"
          archived="/football_archived"
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
          <div className={styles.matchInfo}>
            <div className={styles.MatchTeams}>
              <div className={styles.TeamDetails}>
                <h3>{selectedMatch.teamA.name}</h3>
                <p>{selectedMatch.teamA.player}</p>
                <p>{selectedMatch.teamA.details}</p>
              </div>
              <div className={styles.TeamDetails}>
                <h3>Vs</h3>
              </div>
              <div className={styles.TeamDetails}>
                <h3>{selectedMatch.teamB.name}</h3>
                <p>{selectedMatch.teamB.player}</p>
                <p>{selectedMatch.teamB.details}</p>
              </div>
            </div>
          </div>

          <p className={styles.MatchUpdate}>{selectedMatch.latestUpdate}</p>
          <p className={styles.MatchDuration}>{selectedMatch.matchDuration}</p>

          <div className={styles.Scoreboard}>
            <h3>Scoreboard</h3>
            <table>
              <thead>
                <tr>
                  <th>Team</th>
                  <th>Score</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>{selectedMatch.teamA.name}</td>
                  <td>{selectedMatch.tmA_score[0]}</td>
                </tr>
                <tr>
                  <td>{selectedMatch.teamB.name}</td>
                  <td>{selectedMatch.tmB_score[0]}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className={styles.MatchList}>
          <span className={styles.Heading2}>Archived Football Matches</span>
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
                    Final Score: {match.tmA_score[0]} - {match.tmB_score[0]}
                  </p>
                  <p>Duration: {match.matchDuration}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default FootballArchived;

import Options from "../../../Components/Live_Upcoming/Options";
import styles from "./badmintonArchived.module.css";
import { useState } from "react";

function DBadmintonArchived({ matches }) {
  const defaultMatches = matches || [
    {
      id: 1,
      teamA: {
        name: "India",
        players: ["PV Sindhu", "Srikanth Kidambi"],
      },
      teamB: {
        name: "China",
        players: ["Chen Long", "Li Xuerui"],
      },
      tmA_score: [21, 18, 21],
      tmB_score: [15, 21, 18],
      latestUpdate: "India won the match!",
      currentSet: 3,
    },
    {
      id: 2,
      teamA: {
        name: "Indonesia",
        players: ["Jonatan Christie", "Marcus Fernaldi Gideon"],
      },
      teamB: {
        name: "Malaysia",
        players: ["Lee Zii Jia", "Aaron Chia"],
      },
      tmA_score: [19, 21, 20],
      tmB_score: [21, 15, 22],
      latestUpdate: "Malaysia won the match!",
      currentSet: 3,
    },
    {
      id: 3,
      teamA: {
        name: "Denmark",
        players: ["Viktor Axelsen", "Mathias Boe"],
      },
      teamB: {
        name: "Japan",
        players: ["Kento Momota", "Takeshi Kamura"],
      },
      tmA_score: [21, 18, 19],
      tmB_score: [15, 21, 17],
      latestUpdate: "Denmark won the match!",
      currentSet: 3,
    },
    {
      id: 4,
      teamA: {
        name: "Thailand",
        players: ["Ratchanok Intanon", "Dechapol Puavaranukroh"],
      },
      teamB: {
        name: "Korea",
        players: ["An Se-young", "Seo Seung-jae"],
      },
      tmA_score: [19, 21, 21],
      tmB_score: [21, 15, 17],
      latestUpdate: "Thailand won the match!",
      currentSet: 3,
    },
    {
      id: 5,
      teamA: {
        name: "France",
        players: ["Christo Popov", "Toma Junior Popov"],
      },
      teamB: {
        name: "Malaysia",
        players: ["Lee Chong Wei", "Goh V Shem"],
      },
      tmA_score: [18, 21, 20],
      tmB_score: [21, 19, 22],
      latestUpdate: "Malaysia won the match!",
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
        <Options cur_link="/badminton_d" archived="/dbadminton_archived" />
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
          <span className={styles.Heading2}>Archived Badminton Doubles Matches</span>
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

export default DBadmintonArchived;

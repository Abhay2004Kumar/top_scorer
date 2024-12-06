import Options from "../../../Components/Live_Upcoming/Options";
import styles from "./kabaddiArchived.module.css";
import { useState } from "react";

function KabaddiArchived({ matches }) {
  const defaultMatches = matches || [
    {
      id: 1,
      teamA: {
        name: "India",
        player: "Anup Kumar",
        details: "Pro Kabaddi League Legend",
      },
      teamB: {
        name: "Pakistan",
        player: "Sohail Abbass",
        details: "Captain of Pakistan Kabaddi",
      },
      tmA_score: [32, 28, 30],
      tmB_score: [28, 30, 22],
      latestUpdate: "India won the match!",
      currentSet: 3,
    },
    {
      id: 2,
      teamA: {
        name: "Iran",
        player: "Mohammad Esmaeil",
        details: "Asian Games Medalist",
      },
      teamB: {
        name: "South Korea",
        player: "Kim Ki-soo",
        details: "Experienced All-Rounder",
      },
      tmA_score: [29, 24, 22],
      tmB_score: [23, 28, 21],
      latestUpdate: "Iran won the match!",
      currentSet: 3,
    },
    {
      id: 3,
      teamA: {
        name: "Bangladesh",
        player: "Shakil Ahmed",
        details: "Rising Star in Kabaddi",
      },
      teamB: {
        name: "Nepal",
        player: "Manoj Kumar",
        details: "Defensive Specialist",
      },
      tmA_score: [25, 20, 22],
      tmB_score: [22, 23, 19],
      latestUpdate: "Bangladesh won the match!",
      currentSet: 3,
    },
    {
      id: 4,
      teamA: {
        name: "Sri Lanka",
        player: "Nadeem Ashraf",
        details: "Aggressive Raider",
      },
      teamB: {
        name: "Thailand",
        player: "Sirikwan Kongsang",
        details: "Top Defender",
      },
      tmA_score: [22, 27, 29],
      tmB_score: [20, 24, 21],
      latestUpdate: "Sri Lanka won the match!",
      currentSet: 3,
    },
    {
      id: 5,
      teamA: {
        name: "India",
        player: "Pardeep Narwal",
        details: "Pro Kabaddi Star",
      },
      teamB: {
        name: "Pakistan",
        player: "Rana Muhammad",
        details: "Strong Raider",
      },
      tmA_score: [30, 28, 34],
      tmB_score: [26, 22, 25],
      latestUpdate: "India won the match!",
      currentSet: 3,
    },
    {
      id: 6,
      teamA: {
        name: "Iran",
        player: "Ali Asghar",
        details: "Veteran Raider",
      },
      teamB: {
        name: "Nepal",
        player: "Suman Koirala",
        details: "Sharp Defender",
      },
      tmA_score: [31, 29, 28],
      tmB_score: [24, 22, 27],
      latestUpdate: "Iran won the match!",
      currentSet: 3,
    },
    {
      id: 7,
      teamA: {
        name: "Sri Lanka",
        player: "Ruwan Yatawara",
        details: "Raiding Specialist",
      },
      teamB: {
        name: "Bangladesh",
        player: "Mohammad Rizwan",
        details: "All-Rounder",
      },
      tmA_score: [26, 30, 32],
      tmB_score: [22, 25, 30],
      latestUpdate: "Sri Lanka won the match!",
      currentSet: 3,
    },
    {
      id: 8,
      teamA: {
        name: "Thailand",
        player: "Chatchai Kongsang",
        details: "Pro Defender",
      },
      teamB: {
        name: "Pakistan",
        player: "Asim Raza",
        details: "Star Raider",
      },
      tmA_score: [29, 30],
      tmB_score: [25, 28],
      latestUpdate: "Thailand won the match!",
      currentSet: 2,
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
          cur_link="/kabaddi"
          archived="/kabaddi_archived"
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
                <h3>{selectedMatch.teamA.name}</h3>
                <p>{selectedMatch.teamA.player}</p>
              </div>
              <div className={styles.TeamDetails}>
                <h3>Vs</h3>
              </div>
              <div className={styles.TeamDetails}>
                <h3>{selectedMatch.teamB.name}</h3>
                <p>{selectedMatch.teamB.player}</p>
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
          <span className={styles.Heading2}>Archived Matches</span>
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
                    Last Set: {match.tmA_score.at(-1)} -{" "}
                    {match.tmB_score.at(-1)}
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

export default KabaddiArchived;

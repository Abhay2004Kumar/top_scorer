import Options from "../../../Components/Live_Upcoming/Options";
import styles from "./badmintonArchived.module.css";
import { useState } from "react";

function BadmintonArchived({ matches }) {
  const defaultMatches = matches || [
    {
      id: 1,
      teamA: {
        name: "India",
        player: "PV Sindhu",
        details: "Ranked #7 in the world",
      },
      teamB: {
        name: "China",
        player: "Chen Long",
        details: "Former World Champion",
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
        player: "Jonatan Christie",
        details: "Top 10 in the World Rankings",
      },
      teamB: {
        name: "Malaysia",
        player: "Lee Zii Jia",
        details: "Olympic Silver Medalist",
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
        player: "Viktor Axelsen",
        details: "Olympic Gold Medalist",
      },
      teamB: {
        name: "Japan",
        player: "Kento Momota",
        details: "Former World Champion",
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
        player: "Ratchanok Intanon",
        details: "Former World Champion",
      },
      teamB: { name: "Korea", player: "An Se-young", details: "Rising Star" },
      tmA_score: [19, 21, 21],
      tmB_score: [21, 15, 17],
      latestUpdate: "Thailand won the match!",
      currentSet: 3,
    },
    {
      id: 5,
      teamA: {
        name: "France",
        player: "Christo Popov",
        details: "Young and Talented Player",
      },
      teamB: {
        name: "Malaysia",
        player: "Lee Chong Wei",
        details: "One of the best in the sport",
      },
      tmA_score: [18, 21, 20],
      tmB_score: [21, 19, 22],
      latestUpdate: "Malaysia won the match!",
      currentSet: 3,
    },
    {
      id: 6,
      teamA: {
        name: "China",
        player: "Chen Long",
        details: "Experienced Veteran",
      },
      teamB: {
        name: "India",
        player: "Srikanth Kidambi",
        details: "Olympic Medalist",
      },
      tmA_score: [21, 19, 21],
      tmB_score: [18, 21, 15],
      latestUpdate: "China won the match!",
      currentSet: 3,
    },
    {
      id: 7,
      teamA: {
        name: "Indonesia",
        player: "Jonatan Christie",
        details: "Top 10 Player",
      },
      teamB: {
        name: "Japan",
        player: "Kento Momota",
        details: "World Champion",
      },
      tmA_score: [21, 20, 21],
      tmB_score: [19, 22, 19],
      latestUpdate: "Indonesia won the match!",
      currentSet: 3,
    },
    {
      id: 8,
      teamA: {
        name: "Thailand",
        player: "Ratchanok Intanon",
        details: "Top Female Player",
      },
      teamB: {
        name: "China",
        player: "He Bingjiao",
        details: "Strong Contender",
      },
      tmA_score: [22, 21],
      tmB_score: [20, 19],
      latestUpdate: "Thailand won the match!",
      currentSet: 2,
    },
    {
      id: 9,
      teamA: {
        name: "Malaysia",
        player: "Lee Zii Jia",
        details: "Olympic Silver Medalist",
      },
      teamB: {
        name: "South Korea",
        player: "Son Wan-ho",
        details: "Veteran Player",
      },
      tmA_score: [19, 21, 20],
      tmB_score: [21, 19, 22],
      latestUpdate: "South Korea won the match!",
      currentSet: 3,
    },
    {
      id: 10,
      teamA: {
        name: "India",
        player: "Saina Nehwal",
        details: "Former World Number 1",
      },
      teamB: {
        name: "Denmark",
        player: "Carolina Marin",
        details: "Olympic Champion",
      },
      tmA_score: [21, 19, 21],
      tmB_score: [19, 21, 19],
      latestUpdate: "India won the match!",
      currentSet: 3,
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
            cur_link="/badminton"
            // archived="/sports/archived"
            archived="/badminton_archived"
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

export default BadmintonArchived;

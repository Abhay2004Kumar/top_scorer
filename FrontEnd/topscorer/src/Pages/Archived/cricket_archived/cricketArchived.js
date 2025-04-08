import Options from "../../../Components/Live_Upcoming/Options";
import styles from "./cricketArchived.module.css";
import { useState } from "react";

function CricketArchived({ matches }) {
  const defaultMatches = matches || [
    {
      id: 1,
      teamA: {
        name: "India",
      },
      teamB: {
        name: "Pakistan",
      },
      tmA_score: [350],
      tmB_score: [348],
      latestUpdate: "India won by 2 runs in a thrilling finish!",
      matchDuration: "50 overs (Regular Time)",
      manOfTheMatch: { name: "Hardik Pandya", score: 10, wickets: 2 },
    },
    {
      id: 2,
      teamA: {
        name: "Australia",
      },
      teamB: {
        name: "England",
      },
      tmA_score: [280],
      tmB_score: [250],
      latestUpdate: "Australia secured a comfortable 30-run victory!",
      matchDuration: "50 overs (Regular Time)",
      manOfTheMatch: { name: "Steve Smith", score: 110, wickets: 0 },
    },
    {
      id: 3,
      teamA: {
        name: "New Zealand",
      },
      teamB: {
        name: "South Africa",
      },
      tmA_score: [275],
      tmB_score: [300],
      latestUpdate: "South Africa chased down the target with 5 wickets remaining!",
      matchDuration: "50 overs (Regular Time)",
      manOfTheMatch: { name: "Dale Steyn", score: 5, wickets: 3 },
    },
    {
      id: 4,
      teamA: {
        name: "Sri Lanka",
      },
      teamB: {
        name: "Bangladesh",
      },
      tmA_score: [240],
      tmB_score: [245],
      latestUpdate: "Bangladesh won by 5 wickets after a nail-biting chase!",
      matchDuration: "50 overs (Regular Time)",
      manOfTheMatch: { name: "Wanindu Hasaranga", score: 20, wickets: 3 },
    },
    {
      id: 5,
      teamA: {
        name: "West Indies",
      },
      teamB: {
        name: "Afghanistan",
      },
      tmA_score: [180],
      tmB_score: [185],
      latestUpdate: "Afghanistan won by 5 wickets with a brilliant performance!",
      matchDuration: "50 overs (Regular Time)",
      manOfTheMatch: { name: "Rashid Khan", score: 10, wickets: 4 },
    },
    {
      id: 6,
      teamA: {
        name: "South Africa",
      },
      teamB: {
        name: "India",
      },
      tmA_score: [320],
      tmB_score: [310],
      latestUpdate: "South Africa won by 10 runs in a high-scoring match!",
      matchDuration: "50 overs (Regular Time)",
      manOfTheMatch: { name: "AB de Villiers", score: 90, wickets: 0 },
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
          cur_link="/dashboard/cricket"
          archived="/dashboard/cricket_archived"
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
              </div>
              <div className={styles.TeamDetails}>
                <h3>Vs</h3>
              </div>
              <div className={styles.TeamDetails}>
                <h3>{selectedMatch.teamB.name}</h3>
              </div>
            </div>
          </div>

          <p className={styles.MatchUpdate}>{selectedMatch.latestUpdate}</p>

          {/* Centered Man of the Match and Duration */}
          <div className={styles.CenteredDetails}>
            <p className={styles.MatchDuration}>{selectedMatch.matchDuration}</p>
            <div className={styles.ManOfTheMatch}>
              <h3>Man of the Match</h3>
              <p>
                {selectedMatch.manOfTheMatch.name}: {selectedMatch.manOfTheMatch.score} runs, {selectedMatch.manOfTheMatch.wickets} wickets
              </p>
            </div>
          </div>

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
          <span className={styles.Heading2}>Archived Cricket Matches</span>
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

export default CricketArchived;

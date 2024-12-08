import Options from "../../../Components/Live_Upcoming/Options";
import styles from "./kabaddiArchived.module.css";
import { useState, useEffect } from "react";

function KabaddiArchived() {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedMatch, setSelectedMatch] = useState(null);

  // Fetch match data from the API
  useEffect(() => {
    const fetchMatches = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/v1/sports/getKabaddi");
        if (!response.ok) {
          throw new Error("Failed to fetch matches");
        }
        const data = await response.json();

        // Sort matches in reverse order (newest match first)
        const sortedMatches = data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

        setMatches(sortedMatches);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchMatches();
  }, []);

  // Function to handle card click and display match details
  const handleCardClick = (matchId) => {
    const match = matches.find((m) => m._id === matchId);
    if (match) setSelectedMatch(match);
  };

  // Function to format the date in DD/MM/YY format
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0'); // Get day (01-31)
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Get month (01-12)
    const year = String(date.getFullYear()).slice(-2); // Get last two digits of the year (YY)

    return `${day}/${month}/${year}`; // Return in DD/MM/YY format
  };

  // Loading and error states
  if (loading) {
    return <p>Loading matches...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

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
                  <th>Team</th>
                  <th>Raid Points</th>
                  <th>Tackle Points</th>
                  <th>Touch Points</th>
                  <th>Bonus Points</th>
                  <th>Total Points</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>{selectedMatch.teamA.name}</td>
                  <td>{selectedMatch.teamA.raidPoints.join(", ")}</td>
                  <td>{selectedMatch.teamA.tacklePoints.join(", ")}</td>
                  <td>{selectedMatch.teamA.touchPoints.join(", ")}</td>
                  <td>{selectedMatch.teamA.bonusPoints.join(", ")}</td>
                  <td>{selectedMatch.teamA.totalPoints}</td>
                </tr>
                <tr>
                  <td>{selectedMatch.teamB.name}</td>
                  <td>{selectedMatch.teamB.raidPoints.join(", ")}</td>
                  <td>{selectedMatch.teamB.tacklePoints.join(", ")}</td>
                  <td>{selectedMatch.teamB.touchPoints.join(", ")}</td>
                  <td>{selectedMatch.teamB.bonusPoints.join(", ")}</td>
                  <td>{selectedMatch.teamB.totalPoints}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className={styles.MatchSummary}>
            {/* <h4>Match Summary:</h4> */}
            <br></br>
            <p><strong>Current Half: </strong>{selectedMatch.currentHalf}</p>
            <p><strong>Latest Update: </strong>{selectedMatch.latestUpdate}</p>
            <p><strong>Match Date : </strong>{formatDate(selectedMatch.createdAt)}</p>
          </div>
        </div>
      ) : (
        <div className={styles.MatchList}>
          <span className={styles.Heading2}>Archived Matches</span>
          <div className={styles.CardContainer}>
            {matches.map((match) => (
              <div
                key={match._id}
                className={styles.MatchCard}
                onClick={() => handleCardClick(match._id)}
              >
                <h3>
                  {match.teamA.name} vs {match.teamB.name}
                </h3>
                <p className={styles.MatchUpdate}>{match.latestUpdate}</p>
                <p className={styles.MatchCreatedAt}>
                  Created At: {formatDate(match.createdAt)}
                </p>
                <div className={styles.CardScore}>
                  <p>
                    Last Raid Points: {match.teamA.raidPoints.at(-1)} - {match.teamB.raidPoints.at(-1)}
                  </p>
                  {/* <p>Current Half: {match.currentHalf}</p> */}
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

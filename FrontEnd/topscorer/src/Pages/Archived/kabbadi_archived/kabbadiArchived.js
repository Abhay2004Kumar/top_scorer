import Options from "../../../Components/Live_Upcoming/Options";
import styles from "./kabaddiArchived.module.css";
import { react, useState, useEffect } from "react";

function KabaddiArchived() {  
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedMatch, setSelectedMatch] = useState(null);

  // Fetch match data from the API
  useEffect(() => {
    console.log("HEEELLLO")
    const fetchMatches = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/v1/sports/getKabaddi`);
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
    <>
    <div className={styles.MainDiv}>
      <div className={styles.opn}>
        <Options
          cur_link="/dashboard/kabaddi"
          archived="/dashboard/kabaddi_archived"
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

          {/* Displaying separate tables for each set */}
          <div className={styles.Scoreboard}>
            <h3>Scoreboard</h3>

            {/* Set 1 Table */}
            <h4 className={styles.head4}>Set 1</h4>
            <table>
              <thead>
                <tr>
                  <th className={styles.table_heading}>Team</th>
                  <th className={styles.table_heading} >Raid Points</th>
                  <th className={styles.table_heading} >Tackle Points</th>
                  <th className={styles.table_heading} >Touch Points</th>
                  <th className={styles.table_heading} >Bonus Points</th>
                  <th className={styles.table_heading} >Total Points</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>{selectedMatch.teamA.name}</td>
                  <td>{selectedMatch.teamA.set1Points.raidPoints}</td>
                  <td>{selectedMatch.teamA.set1Points.tacklePoints}</td>
                  <td>{selectedMatch.teamA.set1Points.touchPoints}</td>
                  <td>{selectedMatch.teamA.set1Points.bonusPoints}</td>
                  <td>{selectedMatch.teamA.set1Points.totalPoints}</td>
                </tr>
                <tr>
                  <td>{selectedMatch.teamB.name}</td>
                  <td>{selectedMatch.teamB.set1Points.raidPoints}</td>
                  <td>{selectedMatch.teamB.set1Points.tacklePoints}</td>
                  <td>{selectedMatch.teamB.set1Points.touchPoints}</td>
                  <td>{selectedMatch.teamB.set1Points.bonusPoints}</td>
                  <td>{selectedMatch.teamB.set1Points.totalPoints}</td>
                </tr>
              </tbody>
            </table>

            {/* Set 2 Table */}
            <h4 className={styles.head4} >Set 2</h4>
            <table>
              <thead>
              <tr>
                  <th className={styles.table_heading}>Team</th>
                  <th className={styles.table_heading} >Raid Points</th>
                  <th className={styles.table_heading} >Tackle Points</th>
                  <th className={styles.table_heading} >Touch Points</th>
                  <th className={styles.table_heading} >Bonus Points</th>
                  <th className={styles.table_heading} >Total Points</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>{selectedMatch.teamA.name}</td>
                  <td>{selectedMatch.teamA.set2Points.raidPoints}</td>
                  <td>{selectedMatch.teamA.set2Points.tacklePoints}</td>
                  <td>{selectedMatch.teamA.set2Points.touchPoints}</td>
                  <td>{selectedMatch.teamA.set2Points.bonusPoints}</td>
                  <td>{selectedMatch.teamA.set2Points.totalPoints}</td>
                </tr>
                <tr>
                  <td>{selectedMatch.teamB.name}</td>
                  <td>{selectedMatch.teamB.set2Points.raidPoints}</td>
                  <td>{selectedMatch.teamB.set2Points.tacklePoints}</td>
                  <td>{selectedMatch.teamB.set2Points.touchPoints}</td>
                  <td>{selectedMatch.teamB.set2Points.bonusPoints}</td>
                  <td>{selectedMatch.teamB.set2Points.totalPoints}</td>
                </tr>
              </tbody>
            </table>

            {/* Set 3 Table */}
            <h4 className={styles.head4}>Set 3</h4>
            <table>
              <thead>
              <tr>
                  <th className={styles.table_heading}>Team</th>
                  <th className={styles.table_heading} >Raid Points</th>
                  <th className={styles.table_heading} >Tackle Points</th>
                  <th className={styles.table_heading} >Touch Points</th>
                  <th className={styles.table_heading} >Bonus Points</th>
                  <th className={styles.table_heading} >Total Points</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>{selectedMatch.teamA.name}</td>
                  <td>{selectedMatch.teamA.set3Points.raidPoints}</td>
                  <td>{selectedMatch.teamA.set3Points.tacklePoints}</td>
                  <td>{selectedMatch.teamA.set3Points.touchPoints}</td>
                  <td>{selectedMatch.teamA.set3Points.bonusPoints}</td>
                  <td>{selectedMatch.teamA.set3Points.totalPoints}</td>
                </tr>
                <tr>
                  <td>{selectedMatch.teamB.name}</td>
                  <td>{selectedMatch.teamB.set3Points.raidPoints}</td>
                  <td>{selectedMatch.teamB.set3Points.tacklePoints}</td>
                  <td>{selectedMatch.teamB.set3Points.touchPoints}</td>
                  <td>{selectedMatch.teamB.set3Points.bonusPoints}</td>
                  <td>{selectedMatch.teamB.set3Points.totalPoints}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className={styles.MatchSummary}>
            <p><strong>Current Half: </strong>{selectedMatch.currentHalf}</p>
            <p><strong>Latest Update: </strong>{selectedMatch.latestUpdate}</p>
            <p><strong>Match Date: </strong>{formatDate(selectedMatch.createdAt)}</p>
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
                    Last Raid Points: {match.teamA.set3Points.raidPoints} - {match.teamB.set3Points.raidPoints}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
      </>
  );
}

export default KabaddiArchived;

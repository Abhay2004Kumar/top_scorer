import Options from "../../../Components/Live_Upcoming/Options";
import styles from "./badmintonArchived.module.css";
import { useState, useEffect } from "react";

function DBadmintonArchived() {
  const [matches, setMatches] = useState([]); // Store match data from API
  const [selectedMatch, setSelectedMatch] = useState(null);
  const [loading, setLoading] = useState(true); // Loading state to manage fetch state
  const [error, setError] = useState(null); // Error state to handle API errors

  // Fetch matches from API
  useEffect(() => {
    const fetchMatches = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/v1/sports/getBDDouble");
        if (!response.ok) {
          throw new Error("Failed to fetch matches");
        }
        const data = await response.json();
        setMatches(data); // Assuming the response is an array of match objects
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };
    
    fetchMatches();
  }, []); // Empty dependency array to run the effect only once

  const handleCardClick = (matchId) => {
    const match = matches.find((m) => m._id === matchId);
    if (match) setSelectedMatch(match);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  // Reverse the matches array to show the most recent match last
  const reversedMatches = [...matches].reverse();

  // Function to format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
    });
  };
  const formatDate2 = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0'); // Get day (01-31)
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Get month (01-12)
    const year = String(date.getFullYear()).slice(-2); // Get last two digits of the year (YY)

    return `${day}/${month}/${year}`; // Return in DD/MM/YY format
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
                <p>{selectedMatch.teamA.player1} & {selectedMatch.teamA.player2}</p>
              </div>
              <div className={styles.TeamDetails}>
                <h3>Vs</h3>
              </div>
              <div className={styles.TeamDetails}>
                <h3>{selectedMatch.teamB.name}</h3>
                <p>{selectedMatch.teamB.player1} & {selectedMatch.teamB.player2}</p>
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

          <div className={styles.MatchSummary}>
            {/* <h4>Match Summary:</h4>
            <p><strong>Current Set: </strong>{selectedMatch.currentSet}</p>
            <p><strong>Last Set Score: </strong>{selectedMatch.tmA_score.at(-1)} - {selectedMatch.tmB_score.at(-1)}</p>
            <p><strong>Latest Update: </strong>{selectedMatch.latestUpdate}</p> */}
            <br></br>
            <p><strong>Match Date: </strong>{formatDate(selectedMatch.createdAt)}</p>
          </div>
        </div>
      ) : (
        <div className={styles.MatchList}>
          <span className={styles.Heading2}>Archived Badminton Doubles Matches</span>
          <div className={styles.CardContainer}>
            {reversedMatches.map((match) => (
              <div
                key={match._id}
                className={styles.MatchCard}
                onClick={() => handleCardClick(match._id)}
              >
                <h3>
                  {match.teamA.name} vs {match.teamB.name}
                </h3>
                <p className={styles.MatchUpdate}>{match.latestUpdate}</p>
                
                <div className={styles.CardScore}>
                  <p>
                    Last Set: {match.tmA_score.at(-1)} - {match.tmB_score.at(-1)}
                  </p>
                  
                  {/* <p>Current Set: {match.currentSet}</p> */}
                </div>
                <p className={styles.date_st} style={{color:'grey'}}>
                  Date: {formatDate2(match.createdAt)}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default DBadmintonArchived;

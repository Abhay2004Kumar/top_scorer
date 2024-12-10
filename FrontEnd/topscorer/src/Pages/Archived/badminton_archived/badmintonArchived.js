import Options from "../../../Components/Live_Upcoming/Options";
import styles from "./badmintonArchived.module.css";
import { useState, useEffect } from "react";

function BadmintonArchived() {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedMatch, setSelectedMatch] = useState(null);

  // Fetching match data from the API
  useEffect(() => {
    const fetchMatches = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/v1/sports/getbdsingle`);
        if (!response.ok) {
          throw new Error("Failed to fetch matches");
        }
        const data = await response.json();
        
        // Sorting matches in reverse order (newest match first)
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

  // Function to format the date into a readable format
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
    });
  };
  // Function to format the date in DD/MM/YY format
  const formatDate2 = (dateString) => {
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
          cur_link="/badminton"
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

          <div className={styles.MatchSummary}>
            {/* <h4>Match Summary:</h4>
            <p><strong>Current Set: </strong>{selectedMatch.currentSet}</p>
            <p><strong>Last Set Score: </strong>{selectedMatch.tmA_score.at(-1)} - {selectedMatch.tmB_score.at(-1)}</p>
            <p><strong>Latest Update: </strong>{selectedMatch.latestUpdate}</p> */}
            <br></br>
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
                
                <div className={styles.CardScore}>
                  <p>
                    Last Set: {match.tmA_score.at(-1)} - {match.tmB_score.at(-1)}
                  </p>
                  {/* <p>Current Set: {match.currentSet}</p> */}
                  
                </div>
                <p className={styles.MatchCreatedAt} style={{color:"grey"}}>
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

export default BadmintonArchived;

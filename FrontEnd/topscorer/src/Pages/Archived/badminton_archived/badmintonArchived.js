import Options from "../../../Components/Live_Upcoming/Options";
import styles from "./badmintonArchived.module.css";
import { Grid } from "react-loader-spinner";
import { MdErrorOutline } from "react-icons/md";
import { useState, useEffect } from "react";

function BadmintonArchived() {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedMatch, setSelectedMatch] = useState(null);
  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(1);
  const [itemPerPage, setItemPerPage] = useState(10);

  // Fetching match data from the API
  useEffect(() => {
    const fetchMatches = async () => {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_BACKEND_URL}/api/v1/sports/getbdsingle`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch matches");
        }
        const data = await response.json();

        // Sorting matches in reverse order (newest match first)
        const sortedMatches = data.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );

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
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };
  // Function to format the date in DD/MM/YY format
  const formatDate2 = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0"); // Get day (01-31)
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Get month (01-12)
    const year = String(date.getFullYear()).slice(-2); // Get last two digits of the year (YY)

    return `${day}/${month}/${year}`; // Return in DD/MM/YY format
  };

  const handleSetPage = (indx) => {
    setPage(indx + 1);
  };

  const movePage = (val) => {
    setPage((prev) => prev + val);
  };

  const handleItemPerPage = (quantity) => {
    setPage(1);
    setItemPerPage(quantity);
  };

  // Loading and error states
  if (loading) {
    return (
      <div className=" w-[100%] h-[100%] flex items-center justify-center">
        <Grid
          visible={true}
          height="80"
          width="80"
          color="#4fa94d"
          ariaLabel="grid-loading"
          radius="12.5"
          wrapperStyle={{}}
          wrapperClass="grid-wrapper"
        />
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full h-[90%] flex items-center justify-center">
        <div className="flex flex-col items-center">
          <MdErrorOutline className="text-white w-[100px] h-[100px]" />
          <p className="text-white mt-2">Error! Please refresh the page</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.MainDiv}>
      <div className={styles.opn}>
        <Options cur_link="/dashboard/badminton" archived="/dashboard/badminton_archived" />
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
            <p>
              <strong>Match Date : </strong>
              {formatDate(selectedMatch.createdAt)}
            </p>
          </div>
        </div>
      ) : (
        <div className={styles.MatchList}>
          <span className={styles.Heading2}>Archived Matches</span>
          <select
            name="optn"
            className=" text-black float-right"
            onChange={(e) => handleItemPerPage(e.target.value)}
          >
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={30}>30</option>
            <option value={40}>40</option>
            <option value={50}>50</option>
          </select>
          <div className=" mt-2 flex flex-wrap justify-start h-[500px] overflow-y-auto">
            {matches
              .slice(page * itemPerPage - itemPerPage, page * itemPerPage)
              .map((match) => (
                <div
                  key={match._id}
                  className=" cursor-pointer hover:translate-y-2 animate-slide-in-left flex-col items-center justify-center m-2 p-2 rounded-md w-[200px] bg-white"
                  onClick={() => handleCardClick(match._id)}
                >
                  <h3 className=" text-center">
                    {match.teamA.name} vs {match.teamB.name}
                  </h3>
                  <p className={styles.MatchUpdate}>{match.latestUpdate}</p>

                  <div className={styles.CardScore}>
                    <p>
                      Last Set: {match.tmA_score.at(-1)} -{" "}
                      {match.tmB_score.at(-1)}
                    </p>
                    {/* <p>Current Set: {match.currentSet}</p> */}
                  </div>
                  <p
                    className={styles.MatchCreatedAt}
                    style={{ color: "grey" }}
                  >
                    Date: {formatDate2(match.createdAt)}
                  </p>
                </div>
              ))}
          </div>
          <div className="flex mt-10 justify-between ">
            {page > 1 && <button onClick={() => movePage(-1)}>Prev</button>}
            {[...Array(Math.round(matches.length / itemPerPage))].map(
              (_, indx) => {
                return (
                  <div
                    key={indx}
                    onClick={() => handleSetPage(indx)}
                    className={`${
                      indx + 1 === page ? "bg-slate-600" : "bg-black"
                    } w-full text-center border-2 rounded-md m-1 hover:cursor-pointer hover:bg-slate-600`}
                  >
                    {indx + 1}
                  </div>
                );
              }
            )}
            {page < Math.round(matches.length / itemPerPage) && (
              <button onClick={() => movePage(1)}>Next</button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default BadmintonArchived;

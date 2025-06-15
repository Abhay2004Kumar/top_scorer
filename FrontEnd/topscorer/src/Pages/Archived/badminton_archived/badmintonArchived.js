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
  const [itemPerPage, setItemPerPage] = useState(10);

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

  const handleCardClick = (matchId) => {
    const match = matches.find((m) => m._id === matchId);
    if (match) setSelectedMatch(match);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatDate2 = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = String(date.getFullYear()).slice(-2);
    return `${day}/${month}/${year}`;
  };

  if (loading) {
    return (
      <div className="w-full h-screen flex items-center justify-center">
        <Grid visible={true} height="80" width="80" color="#4fa94d" ariaLabel="grid-loading" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full h-screen flex items-center justify-center">
        <div className="flex flex-col items-center">
          <MdErrorOutline className="text-red-500 w-24 h-24" />
          <p className="text-white mt-2">Error! Please refresh the page</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="mb-6">
        <Options cur_link="/dashboard/badminton" archived="/dashboard/badminton_archived" />
      </div>

      {selectedMatch ? (
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg animate-fade-in">
          <button
            className="mb-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded shadow"
            onClick={() => setSelectedMatch(null)}
          >
            ⬅ Back to Matches
          </button>

          <div className="text-center mb-4">
            <h2 className="text-2xl font-bold mb-2">{selectedMatch.teamA.name} vs {selectedMatch.teamB.name}</h2>
            <p className="text-sm italic">{formatDate(selectedMatch.createdAt)}</p>
          </div>

          <div className="grid grid-cols-2 gap-4 text-center mb-4">
            <div>
              <h3 className="text-lg font-semibold">{selectedMatch.teamA.name}</h3>
              <p>{selectedMatch.teamA.player}</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold">{selectedMatch.teamB.name}</h3>
              <p>{selectedMatch.teamB.player}</p>
            </div>
          </div>

          <div className="bg-white text-black rounded-lg p-4 mb-4 overflow-x-auto">
            <h3 className="text-lg font-bold mb-2">Scoreboard</h3>
            <table className="w-full text-left border-collapse">
              <thead>
                <tr>
                  <th className="border-b p-2">Set</th>
                  <th className="border-b p-2">{selectedMatch.teamA.name}</th>
                  <th className="border-b p-2">{selectedMatch.teamB.name}</th>
                </tr>
              </thead>
              <tbody>
                {selectedMatch.tmA_score.map((score, index) => (
                  <tr key={index}>
                    <td className="border-b p-2">{index + 1}</td>
                    <td className="border-b p-2">{score}</td>
                    <td className="border-b p-2">{selectedMatch.tmB_score[index]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="text-sm text-gray-300 italic text-center">
            {selectedMatch.latestUpdate}
          </div>
        </div>
      ) : (
        <div>
          <h2 className="text-3xl font-bold mb-4">📂 Archived Matches</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {matches.slice(0, itemPerPage).map((match) => (
              <div
                key={match._id}
                className="cursor-pointer transform transition-transform hover:-translate-y-1 bg-white text-black rounded-xl p-4 shadow-lg"
                onClick={() => handleCardClick(match._id)}
              >
                <h3 className="text-lg font-semibold text-center">{match.teamA.name} vs {match.teamB.name}</h3>
                <p className="text-sm text-gray-700 text-center">Last Set: {match.tmA_score.at(-1)} - {match.tmB_score.at(-1)}</p>
                <p className="text-xs text-gray-500 text-center">📅 {formatDate2(match.createdAt)}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default BadmintonArchived;

import React, { useState } from "react";
import io from "socket.io-client";
import axios from "axios";
import { GiTennisCourt, GiTennisBall } from "react-icons/gi";
import toast from "react-hot-toast";

const socket = io.connect(process.env.REACT_APP_BACKEND_URL);

function Tennis_D() {
  const [popup, setPopup] = useState(false);
  const [matchData, setMatchData] = useState({
    name: "Tennis_D",
    data: {
      teamA: { 
        name: "", 
        player1: "", 
        player2: "",
        flag: "",
        ranking: "" 
      },
      teamB: {  
        name: "", 
        player1: "", 
        player2: "",
        flag: "",
        ranking: "" 
      },
      tmA_score: [],
      tmB_score: [],
      currentSet: 1,
      latestUpdate: "",
      matchInfo: {
        tournament: "",
        location: "",
        courtType: "Hard",
        surface: "Outdoor",
        duration: ""
      }
    },
  });

  const handleInputChange = (e, team, field) => {
    setMatchData(prev => ({
      ...prev,
      data: {
        ...prev.data,
        [team]: { ...prev.data[team], [field]: e.target.value }
      }
    }));
  };

  const handleScoreChange = (team, index, value) => {
    const newScores = [...matchData.data[team]];
    newScores[index] = Math.max(0, parseInt(value) || 0);
    setMatchData(prev => ({
      ...prev,
      data: { ...prev.data, [team]: newScores }
    }));
  };

  const submitMatchData = async () => {
    try {
      // await axios.post(
      //   `${process.env.REACT_APP_BACKEND_URL}/api/v1/sports/tennisDoubles`,
      //   { data: matchData.data }
      // );
      socket.emit("data", matchData.data);
      setPopup(false);
    } catch (err) {
      console.error("Submission error:", err);
    }
  };

  const sendUpdates = async () => {
    try {
      socket.emit("data", matchData); // Emit the whole matchData object
      toast.success("Data Updated!");
    } catch (err) {
      console.error("Submission error:", err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      {/* Confirmation Modal */}
      {popup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 backdrop-blur-sm">
          <div className="bg-white rounded-xl p-6 w-96 shadow-2xl">
            <h3 className="text-xl font-bold mb-4 text-center text-gray-800">
              Confirm Submission
            </h3>
            <div className="flex justify-center gap-4">
              <button
                className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                onClick={submitMatchData}
              >
                Publish
              </button>
              <button
                className="px-6 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
                onClick={() => setPopup(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <GiTennisCourt className="mx-auto text-4xl text-green-600" />
          <h1 className="text-3xl font-bold text-gray-800">
            Tennis Doubles Match Administration
          </h1>
        </div>

        {/* Teams Configuration */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {['teamA', 'teamB'].map((team) => (
            <div key={team} className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
              <h2 className="text-xl font-semibold mb-6 text-gray-700">
                {team === 'teamA' ? 'Team A' : 'Team B'} Configuration
              </h2>

              {/* Flag & Basic Info */}
              <div className="flex items-center gap-4 mb-6">
                <div className="w-20 h-20 rounded-lg border-2 border-gray-200 overflow-hidden">
                  <img 
                    src={matchData.data[team].flag || 'https://via.placeholder.com/80'}
                    alt="Team flag"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 space-y-2">
                  <input
                    type="url"
                    className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-green-500"
                    placeholder="Flag Image URL"
                    value={matchData.data[team].flag}
                    onChange={(e) => handleInputChange(e, team, 'flag')}
                  />
                  <input
                    className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-green-500"
                    placeholder="Team Ranking"
                    value={matchData.data[team].ranking}
                    onChange={(e) => handleInputChange(e, team, 'ranking')}
                  />
                </div>
              </div>

              {/* Team Details */}
              <div className="space-y-4">
                <input
                  className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-green-500"
                  placeholder="Team Name"
                  value={matchData.data[team].name}
                  onChange={(e) => handleInputChange(e, team, 'name')}
                />

                <div className="grid grid-cols-2 gap-4">
                  <input
                    className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-green-500"
                    placeholder="Player 1 Name"
                    value={matchData.data[team].player1}
                    onChange={(e) => handleInputChange(e, team, 'player1')}
                  />
                  <input
                    className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-green-500"
                    placeholder="Player 2 Name"
                    value={matchData.data[team].player2}
                    onChange={(e) => handleInputChange(e, team, 'player2')}
                  />
                </div>

                {/* Score Inputs */}
                <div className="grid grid-cols-3 gap-2">
                  {[0, 1, 2].map((index) => (
                    <div key={index} className="relative">
                      <input
                        type="number"
                        className="w-full px-3 py-2 rounded-lg border text-center font-bold"
                        value={matchData.data[team === 'teamA' ? 'tmA_score' : 'tmB_score'][index]}
                        onChange={(e) => 
                          handleScoreChange(
                            team === 'teamA' ? 'tmA_score' : 'tmB_score',
                            index,
                            e.target.value
                          )
                        }
                      />
                      <span className="absolute right-2 top-2 text-sm text-gray-500">
                        Set {index + 1}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Match Details */}
        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
          <h2 className="text-xl font-semibold mb-6 text-gray-700">Match Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-green-500"
              placeholder="Tournament Name"
              value={matchData.data.matchInfo.tournament}
              onChange={(e) => setMatchData(prev => ({
                ...prev,
                data: {
                  ...prev.data,
                  matchInfo: {
                    ...prev.data.matchInfo,
                    tournament: e.target.value
                  }
                }
              }))}
            />
            <input
              className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-green-500"
              placeholder="Location"
              value={matchData.data.matchInfo.location}
              onChange={(e) => setMatchData(prev => ({
                ...prev,
                data: {
                  ...prev.data,
                  matchInfo: {
                    ...prev.data.matchInfo,
                    location: e.target.value
                  }
                }
              }))}
            />
            <select
              className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-green-500"
              value={matchData.data.matchInfo.courtType}
              onChange={(e) => setMatchData(prev => ({
                ...prev,
                data: {
                  ...prev.data,
                  matchInfo: {
                    ...prev.data.matchInfo,
                    courtType: e.target.value
                  }
                }
              }))}
            >
              <option value="Hard">Hard Court</option>
              <option value="Clay">Clay Court</option>
              <option value="Grass">Grass Court</option>
            </select>
            <select
              className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-green-500"
              value={matchData.data.matchInfo.surface}
              onChange={(e) => setMatchData(prev => ({
                ...prev,
                data: {
                  ...prev.data,
                  matchInfo: {
                    ...prev.data.matchInfo,
                    surface: e.target.value
                  }
                }
              }))}
            >
              <option value="Outdoor">Outdoor</option>
              <option value="Indoor">Indoor</option>
            </select>
          </div>
        </div>

        {/* Commentary Section */}
        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
          <h2 className="text-xl font-semibold mb-4 text-gray-700">Live Commentary</h2>
          <textarea
            className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-green-500 h-32"
            placeholder="Enter match update..."
            value={matchData.data.latestUpdate}
            onChange={(e) => setMatchData(prev => ({
              ...prev,
              data: { ...prev.data, latestUpdate: e.target.value }
            }))}
          />
        </div>

        {/* Submit Button */}
        <div className="text-center">
          <button
            onClick={() => sendUpdates()}
            className="px-8 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors font-semibold text-lg shadow-md hover:shadow-lg"
          >
            Send Match Update
          </button>
        </div>
        <div className="text-center">
          <button
            onClick={() => setPopup(true)}
            className="px-8 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors font-semibold text-lg shadow-md hover:shadow-lg"
          >
            Publish Match Update
          </button>
        </div>
      </div>
    </div>
  );
}

export default Tennis_D;
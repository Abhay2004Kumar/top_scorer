import React, { useState, useEffect } from "react";
import axios from "axios";
import io from "socket.io-client";
import toast from "react-hot-toast";
import { MdSportsKabaddi } from "react-icons/md";

const socket = io.connect(process.env.REACT_APP_BACKEND_URL);

function AdminKabaddi() {
  const [popup, setPopup] = useState(false);
  const [currentSet, setCurrentSet] = useState(1);
  const [matchData, setMatchData] = useState({
    name: "Kabaddi",
    data: {
      teamA: {
        name: "",
        flag: "https://upload.wikimedia.org/wikipedia/en/thumb/4/41/Flag_of_India.svg/640px-Flag_of_India.svg.png",
        player: "",
        set1Points: { 
          raidPoints: 0, 
          tacklePoints: 0, 
          allOuts: 0,
          bonusPoints: 0, 
          totalPoints: 0 
        },
        set2Points: { 
          raidPoints: 0, 
          tacklePoints: 0, 
          allOuts: 0,
          bonusPoints: 0, 
          totalPoints: 0 
        },
        set3Points: { 
          raidPoints: 0, 
          tacklePoints: 0, 
          allOuts: 0,
          bonusPoints: 0, 
          totalPoints: 0 
        },
        totalPoints: 0,
        doOrDieRaids: 0,
        successfulRaids: 0,
        superRaids: 0,
        superTackles: 0,
        reviewPoints: 0
      },
      teamB: {
        name: "",
        flag: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/fa/Flag_of_the_People%27s_Republic_of_China.svg/1200px-Flag_of_the_People%27s_Republic_of_China.svg.png",
        player: "",
        set1Points: { 
          raidPoints: 0, 
          tacklePoints: 0, 
          allOuts: 0,
          bonusPoints: 0, 
          totalPoints: 0 
        },
        set2Points: { 
          raidPoints: 0, 
          tacklePoints: 0, 
          allOuts: 0,
          bonusPoints: 0, 
          totalPoints: 0 
        },
        set3Points: { 
          raidPoints: 0, 
          tacklePoints: 0, 
          allOuts: 0,
          bonusPoints: 0, 
          totalPoints: 0 
        },
        totalPoints: 0,
        doOrDieRaids: 0,
        successfulRaids: 0,
        superRaids: 0,
        superTackles: 0,
        reviewPoints: 0
      },
      currentSet: 1,
      latestUpdate: "Match about to begin",
      timeRemaining: "20:00",
      winner: null
    },
  });

  const handleInputChange = (e, team, field) => {
    const value = e.target.value;
    setMatchData(prev => ({
      ...prev,
      data: {
        ...prev.data,
        [team]: {
          ...prev.data[team],
          [field]: value
        }
      }
    }));
  };

  const handleScoreChange = (e, team, set, scoreType) => {
    const value = parseInt(e.target.value) || 0;
    
    setMatchData(prev => {
      const updatedTeam = { ...prev.data[team] };
      
      // Update the specific score
      updatedTeam[set][scoreType] = value;
      
      // Calculate set total
      updatedTeam[set].totalPoints = 
        updatedTeam[set].raidPoints + 
        updatedTeam[set].tacklePoints + 
        updatedTeam[set].bonusPoints;
      
      // Calculate team total
      updatedTeam.totalPoints = 
        updatedTeam.set1Points.totalPoints + 
        updatedTeam.set2Points.totalPoints + 
        updatedTeam.set3Points.totalPoints;
      
      // Check for winner if all sets are complete
      let winner = null;
      if (currentSet === 3 && 
          prev.data.teamA.set1Points.totalPoints + 
          prev.data.teamA.set2Points.totalPoints + 
          prev.data.teamA.set3Points.totalPoints !== 
          prev.data.teamB.set1Points.totalPoints + 
          prev.data.teamB.set2Points.totalPoints + 
          prev.data.teamB.set3Points.totalPoints) {
        winner = updatedTeam.totalPoints > prev.data[team === 'teamA' ? 'teamB' : 'teamA'].totalPoints ? 
                team : 
                team === 'teamA' ? 'teamB' : 'teamA';
      }
      
      return {
        ...prev,
        data: {
          ...prev.data,
          [team]: updatedTeam,
          winner: winner || prev.data.winner,
          currentSet: prev.data.currentSet,
          latestUpdate: `Updated ${scoreType} for ${team} in ${set}`
        }
      };
    });
  };

  const handlePlayerStatChange = (e, team, stat) => {
    const value = parseInt(e.target.value) || 0;
    setMatchData(prev => ({
      ...prev,
      data: {
        ...prev.data,
        [team]: {
          ...prev.data[team],
          [stat]: value
        }
      }
    }));
  };

  const handleSetChange = (setNumber) => {
    setCurrentSet(setNumber);
    setMatchData(prev => ({
      ...prev,
      data: {
        ...prev.data,
        currentSet: setNumber,
        latestUpdate: `Switched to Set ${setNumber}`
      }
    }));
  };

  const handleTimeUpdate = (e) => {
    setMatchData(prev => ({
      ...prev,
      data: {
        ...prev.data,
        timeRemaining: e.target.value
      }
    }));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!matchData.data.teamA.name || !matchData.data.teamB.name) {
      toast.error("Both team names are required!");
      return;
    }
    setPopup(true);
  };

  const submitMatchData = async () => {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/api/v1/sports/Createkabaddi`,
        matchData.data
      );
      toast.success("Match data saved successfully!");
      console.log("Match data saved:", response.data);
    } catch (error) {
      console.error("Error saving match data:", error);
      toast.error("Failed to save match data!");
    }
    setPopup(false);
  };

  const sendSocketUpdate = () => {
    socket.emit("data", matchData);
    console.log(matchData);
    toast.success("Live update sent to viewers!");
  };

  const quickPointAdd = (team, pointType, amount = 1) => {
    const currentSetKey = `set${currentSet}Points`;
    
    setMatchData(prev => {
      const updatedTeam = { ...prev.data[team] };
      
      // Update the specific point type
      updatedTeam[currentSetKey][pointType] += amount;
      
      // Recalculate totals
      updatedTeam[currentSetKey].totalPoints = 
        updatedTeam[currentSetKey].raidPoints + 
        updatedTeam[currentSetKey].tacklePoints + 
        updatedTeam[currentSetKey].bonusPoints;
      
      updatedTeam.totalPoints = 
        updatedTeam.set1Points.totalPoints + 
        updatedTeam.set2Points.totalPoints + 
        updatedTeam.set3Points.totalPoints;
      
      return {
        ...prev,
        data: {
          ...prev.data,
          [team]: updatedTeam,
          latestUpdate: `${team} gained ${amount} ${pointType}`
        }
      };
    });
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      {/* Confirmation Popup */}
      {popup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full">
            <h3 className="text-xl font-bold text-center mb-4">Confirm Submission</h3>
            <p className="text-center mb-6">Are you sure you want to submit this match data?</p>
            <div className="flex justify-center space-x-4">
              <button
                onClick={submitMatchData}
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
              >
                Yes, Submit
              </button>
              <button
                onClick={() => setPopup(false)}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-6xl mx-auto bg-white rounded-xl shadow-md overflow-hidden p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <MdSportsKabaddi className="text-3xl text-orange-600 mr-3" />
            <h1 className="text-2xl font-bold text-gray-800">Kabaddi Match Admin Panel</h1>
          </div>
          <div className="flex space-x-2">
            <button
              onClick={sendSocketUpdate}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 flex items-center"
            >
              Send Live Update
            </button>
          </div>
        </div>

        {/* Match Info */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Team A */}
          <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
            <h2 className="text-xl font-semibold mb-4 text-center">Team A</h2>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700">Team Name</label>
                <input
                  type="text"
                  value={matchData.data.teamA.name}
                  onChange={(e) => handleInputChange(e, "teamA", "name")}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Player Name</label>
                <input
                  type="text"
                  value={matchData.data.teamA.player}
                  onChange={(e) => handleInputChange(e, "teamA", "player")}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Flag URL</label>
                <input
                  type="text"
                  value={matchData.data.teamA.flag}
                  onChange={(e) => handleInputChange(e, "teamA", "flag")}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500"
                />
              </div>
            </div>
          </div>

          {/* Match Controls */}
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
            <h2 className="text-xl font-semibold mb-4 text-center">Match Controls</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Current Set</label>
                <div className="flex space-x-2 mt-1">
                  {[1, 2, 3].map(set => (
                    <button
                      key={set}
                      onClick={() => handleSetChange(set)}
                      className={`px-4 py-2 rounded ${currentSet === set ? 'bg-orange-600 text-white' : 'bg-gray-200'}`}
                    >
                      Set {set}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Time Remaining</label>
                <input
                  type="text"
                  value={matchData.data.timeRemaining}
                  onChange={handleTimeUpdate}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500"
                  placeholder="MM:SS"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Match Update</label>
                <input
                  type="text"
                  value={matchData.data.latestUpdate}
                  onChange={(e) => setMatchData(prev => ({
                    ...prev,
                    data: {
                      ...prev.data,
                      latestUpdate: e.target.value
                    }
                  }))}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500"
                  placeholder="Latest match update"
                />
              </div>
            </div>
          </div>

          {/* Team B */}
          <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
            <h2 className="text-xl font-semibold mb-4 text-center">Team B</h2>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700">Team Name</label>
                <input
                  type="text"
                  value={matchData.data.teamB.name}
                  onChange={(e) => handleInputChange(e, "teamB", "name")}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Player Name</label>
                <input
                  type="text"
                  value={matchData.data.teamB.player}
                  onChange={(e) => handleInputChange(e, "teamB", "player")}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Flag URL</label>
                <input
                  type="text"
                  value={matchData.data.teamB.flag}
                  onChange={(e) => handleInputChange(e, "teamB", "flag")}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Quick Point Buttons */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Team A Quick Points */}
          <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
            <h3 className="text-lg font-semibold mb-3 text-center">Team A Quick Points</h3>
            <div className="grid grid-cols-2 gap-2">
              <button 
                onClick={() => quickPointAdd("teamA", "raidPoints")}
                className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded"
              >
                +1 Raid
              </button>
              <button 
                onClick={() => quickPointAdd("teamA", "tacklePoints")}
                className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded"
              >
                +1 Tackle
              </button>
              <button 
                onClick={() => quickPointAdd("teamA", "bonusPoints")}
                className="bg-purple-500 hover:bg-purple-600 text-white py-2 px-4 rounded"
              >
                +1 Bonus
              </button>
              <button 
                onClick={() => quickPointAdd("teamA", "allOuts")}
                className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded"
              >
                +1 All Out
              </button>
            </div>
          </div>

          {/* Team B Quick Points */}
          <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
            <h3 className="text-lg font-semibold mb-3 text-center">Team B Quick Points</h3>
            <div className="grid grid-cols-2 gap-2">
              <button 
                onClick={() => quickPointAdd("teamB", "raidPoints")}
                className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded"
              >
                +1 Raid
              </button>
              <button 
                onClick={() => quickPointAdd("teamB", "tacklePoints")}
                className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded"
              >
                +1 Tackle
              </button>
              <button 
                onClick={() => quickPointAdd("teamB", "bonusPoints")}
                className="bg-purple-500 hover:bg-purple-600 text-white py-2 px-4 rounded"
              >
                +1 Bonus
              </button>
              <button 
                onClick={() => quickPointAdd("teamB", "allOuts")}
                className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded"
              >
                +1 All Out
              </button>
            </div>
          </div>
        </div>

        {/* Detailed Score Input */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Team A Detailed Scores */}
          <div className="bg-white p-4 rounded-lg border border-gray-200 shadow">
            <h3 className="text-lg font-semibold mb-4 text-center">Team A Detailed Scores</h3>
            {["set1Points", "set2Points", "set3Points"].map((set) => (
              <div key={set} className="mb-4">
                <h4 className="font-medium mb-2">{set.replace('set', 'Set ').replace('Points', '')}</h4>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs text-gray-500">Raid Points</label>
                    <input
                      type="number"
                      value={matchData.data.teamA[set].raidPoints}
                      onChange={(e) => handleScoreChange(e, "teamA", set, "raidPoints")}
                      className="w-full p-1 border rounded"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500">Tackle Points</label>
                    <input
                      type="number"
                      value={matchData.data.teamA[set].tacklePoints}
                      onChange={(e) => handleScoreChange(e, "teamA", set, "tacklePoints")}
                      className="w-full p-1 border rounded"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500">All Outs</label>
                    <input
                      type="number"
                      value={matchData.data.teamA[set].allOuts}
                      onChange={(e) => handleScoreChange(e, "teamA", set, "allOuts")}
                      className="w-full p-1 border rounded"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500">Bonus Points</label>
                    <input
                      type="number"
                      value={matchData.data.teamA[set].bonusPoints}
                      onChange={(e) => handleScoreChange(e, "teamA", set, "bonusPoints")}
                      className="w-full p-1 border rounded"
                    />
                  </div>
                </div>
                <div className="mt-2">
                  <label className="block text-xs text-gray-500">Set Total</label>
                  <input
                    type="text"
                    value={matchData.data.teamA[set].totalPoints}
                    readOnly
                    className="w-full p-1 border rounded bg-gray-100"
                  />
                </div>
              </div>
            ))}
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700">Team Total</label>
              <input
                type="text"
                value={matchData.data.teamA.totalPoints}
                readOnly
                className="w-full p-2 border rounded bg-gray-100 font-bold"
              />
            </div>
          </div>

          {/* Team B Detailed Scores */}
          <div className="bg-white p-4 rounded-lg border border-gray-200 shadow">
            <h3 className="text-lg font-semibold mb-4 text-center">Team B Detailed Scores</h3>
            {["set1Points", "set2Points", "set3Points"].map((set) => (
              <div key={set} className="mb-4">
                <h4 className="font-medium mb-2">{set.replace('set', 'Set ').replace('Points', '')}</h4>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs text-gray-500">Raid Points</label>
                    <input
                      type="number"
                      value={matchData.data.teamB[set].raidPoints}
                      onChange={(e) => handleScoreChange(e, "teamB", set, "raidPoints")}
                      className="w-full p-1 border rounded"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500">Tackle Points</label>
                    <input
                      type="number"
                      value={matchData.data.teamB[set].tacklePoints}
                      onChange={(e) => handleScoreChange(e, "teamB", set, "tacklePoints")}
                      className="w-full p-1 border rounded"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500">All Outs</label>
                    <input
                      type="number"
                      value={matchData.data.teamB[set].allOuts}
                      onChange={(e) => handleScoreChange(e, "teamB", set, "allOuts")}
                      className="w-full p-1 border rounded"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500">Bonus Points</label>
                    <input
                      type="number"
                      value={matchData.data.teamB[set].bonusPoints}
                      onChange={(e) => handleScoreChange(e, "teamB", set, "bonusPoints")}
                      className="w-full p-1 border rounded"
                    />
                  </div>
                </div>
                <div className="mt-2">
                  <label className="block text-xs text-gray-500">Set Total</label>
                  <input
                    type="text"
                    value={matchData.data.teamB[set].totalPoints}
                    readOnly
                    className="w-full p-1 border rounded bg-gray-100"
                  />
                </div>
              </div>
            ))}
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700">Team Total</label>
              <input
                type="text"
                value={matchData.data.teamB.totalPoints}
                readOnly
                className="w-full p-2 border rounded bg-gray-100 font-bold"
              />
            </div>
          </div>
        </div>

        {/* Player Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Team A Player Stats */}
          <div className="bg-white p-4 rounded-lg border border-gray-200 shadow">
            <h3 className="text-lg font-semibold mb-4 text-center">Team A Player Stats</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-gray-500">Successful Raids</label>
                <input
                  type="number"
                  value={matchData.data.teamA.successfulRaids}
                  onChange={(e) => handlePlayerStatChange(e, "teamA", "successfulRaids")}
                  className="w-full p-1 border rounded"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500">Do or Die Raids</label>
                <input
                  type="number"
                  value={matchData.data.teamA.doOrDieRaids}
                  onChange={(e) => handlePlayerStatChange(e, "teamA", "doOrDieRaids")}
                  className="w-full p-1 border rounded"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500">Super Raids</label>
                <input
                  type="number"
                  value={matchData.data.teamA.superRaids}
                  onChange={(e) => handlePlayerStatChange(e, "teamA", "superRaids")}
                  className="w-full p-1 border rounded"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500">Super Tackles</label>
                <input
                  type="number"
                  value={matchData.data.teamA.superTackles}
                  onChange={(e) => handlePlayerStatChange(e, "teamA", "superTackles")}
                  className="w-full p-1 border rounded"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500">Review Points</label>
                <input
                  type="number"
                  value={matchData.data.teamA.reviewPoints}
                  onChange={(e) => handlePlayerStatChange(e, "teamA", "reviewPoints")}
                  className="w-full p-1 border rounded"
                />
              </div>
            </div>
          </div>

          {/* Team B Player Stats */}
          <div className="bg-white p-4 rounded-lg border border-gray-200 shadow">
            <h3 className="text-lg font-semibold mb-4 text-center">Team B Player Stats</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-gray-500">Successful Raids</label>
                <input
                  type="number"
                  value={matchData.data.teamB.successfulRaids}
                  onChange={(e) => handlePlayerStatChange(e, "teamB", "successfulRaids")}
                  className="w-full p-1 border rounded"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500">Do or Die Raids</label>
                <input
                  type="number"
                  value={matchData.data.teamB.doOrDieRaids}
                  onChange={(e) => handlePlayerStatChange(e, "teamB", "doOrDieRaids")}
                  className="w-full p-1 border rounded"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500">Super Raids</label>
                <input
                  type="number"
                  value={matchData.data.teamB.superRaids}
                  onChange={(e) => handlePlayerStatChange(e, "teamB", "superRaids")}
                  className="w-full p-1 border rounded"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500">Super Tackles</label>
                <input
                  type="number"
                  value={matchData.data.teamB.superTackles}
                  onChange={(e) => handlePlayerStatChange(e, "teamB", "superTackles")}
                  className="w-full p-1 border rounded"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500">Review Points</label>
                <input
                  type="number"
                  value={matchData.data.teamB.reviewPoints}
                  onChange={(e) => handlePlayerStatChange(e, "teamB", "reviewPoints")}
                  className="w-full p-1 border rounded"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-center">
          <button
            onClick={handleFormSubmit}
            className="px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 font-medium"
          >
            Submit Final Match Data
          </button>
        </div>
      </div>
    </div>
  );
}

export default AdminKabaddi;
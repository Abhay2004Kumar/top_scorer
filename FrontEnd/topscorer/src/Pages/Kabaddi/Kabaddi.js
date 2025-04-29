import React, { useState, useEffect, useRef } from 'react';
import { MdSportsKabaddi } from "react-icons/md";
import { FaEye, FaTrophy } from "react-icons/fa";
import Options from '../../Components/Live_Upcoming/Options';
import ChatComponent from '../../Components/Chat/Chat';
import FireworksComponent from '../../Components/customAnimations/FireWork';

function Kabaddi({ data, clients, kabb2 }) {
  const flag1_link = "https://upload.wikimedia.org/wikipedia/en/thumb/4/41/Flag_of_India.svg/640px-Flag_of_India.svg.png";
  const flag2_link = "https://upload.wikimedia.org/wikipedia/commons/thumb/f/fa/Flag_of_the_People%27s_Republic_of_China.svg/1200px-Flag_of_the_People%27s_Republic_of_China.svg.png";
  console.log("DATA",kabb2)
  const defaultTeam = {
    name: "Team",
    player: "Player",
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
  };

  const matchData = data || {
    teamA: { ...defaultTeam },
    teamB: { ...defaultTeam },
    currentSet: 1,
    latestUpdate: "Match about to begin",
    timeRemaining: "00:00",
    winner: null
  };

  const [cracker, setCracker] = useState(true);
  const [animateScore, setAnimateScore] = useState({ teamA: false, teamB: false });
  const prevScores = useRef({ teamA: 0, teamB: 0 });

  useEffect(() => {
    setTimeout(() => {
      setCracker(false);
    }, 4000);
  }, []);

  // Calculate winner if match is finished
  useEffect(() => {
    if (matchData.winner) {
      setCracker(true);
      setTimeout(() => setCracker(false), 4000);
    }
  }, [matchData.winner]);

  // Animation for score changes
  useEffect(() => {
    if (matchData.teamA.totalPoints !== prevScores.current.teamA) {
      setAnimateScore(prev => ({ ...prev, teamA: true }));
      setTimeout(() => setAnimateScore(prev => ({ ...prev, teamA: false })), 500);
      prevScores.current.teamA = matchData.teamA.totalPoints;
    }
    
    if (matchData.teamB.totalPoints !== prevScores.current.teamB) {
      setAnimateScore(prev => ({ ...prev, teamB: true }));
      setTimeout(() => setAnimateScore(prev => ({ ...prev, teamB: false })), 500);
      prevScores.current.teamB = matchData.teamB.totalPoints;
    }
  }, [matchData.teamA.totalPoints, matchData.teamB.totalPoints]);

  const renderSetStats = (teamAData, teamBData, setName) => (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 mb-4">
      <h3 className="text-xl font-bold text-center mb-4 text-orange-600 dark:text-orange-400">
        {setName} Statistics
      </h3>
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="bg-gray-100 dark:bg-gray-700">
            <tr>
              <th className="px-4 py-2">Team</th>
              <th className="px-4 py-2">Raids</th>
              <th className="px-4 py-2">Tackles</th>
              <th className="px-4 py-2">All Outs</th>
              <th className="px-4 py-2">Bonuses</th>
              <th className="px-4 py-2">Total</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b dark:border-gray-700">
              <td className="px-4 py-2 font-medium">{matchData.teamA.name}</td>
              <td className="px-4 py-2">{teamAData.raidPoints}</td>
              <td className="px-4 py-2">{teamAData.tacklePoints}</td>
              <td className="px-4 py-2">{teamAData.allOuts}</td>
              <td className="px-4 py-2">{teamAData.bonusPoints}</td>
              <td className="px-4 py-2 font-bold">{teamAData.totalPoints}</td>
            </tr>
            <tr>
              <td className="px-4 py-2 font-medium">{matchData.teamB.name}</td>
              <td className="px-4 py-2">{teamBData.raidPoints}</td>
              <td className="px-4 py-2">{teamBData.tacklePoints}</td>
              <td className="px-4 py-2">{teamBData.allOuts}</td>
              <td className="px-4 py-2">{teamBData.bonusPoints}</td>
              <td className="px-4 py-2 font-bold">{teamBData.totalPoints}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderPlayerStats = (team) => (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 mb-4">
      <h3 className="text-lg font-semibold mb-2">{team.name} Player Stats</h3>
      <div className="grid grid-cols-2 gap-4 text-sm">
        <div>
          <p><span className="font-medium">Successful Raids:</span> {team.successfulRaids}</p>
          <p><span className="font-medium">Do or Die Raids:</span> {team.doOrDieRaids}</p>
        </div>
        <div>
          <p><span className="font-medium">Super Raids:</span> {team.superRaids}</p>
          <p><span className="font-medium">Super Tackles:</span> {team.superTackles}</p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white font-sans p-4 rounded-3xl shadow-lg">
      {cracker && <FireworksComponent />}
      
      {/* Header Section */}
      <div className="text-center mb-6">
        <div className="flex justify-center items-center mt-2">
          <Options
            cur_link="/dashboard/kabaddi"
            archived="/dashboard/kabaddi_archived"
          />
        </div>
      </div>

      {/* Main Content Container */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-3xl shadow-lg border-2 border-gray-200 dark:border-gray-700">
        <ChatComponent sportName={"Kabaddi"} />
        
        {/* Match Header */}
        <div className="flex items-center justify-center space-x-3 mb-6">
          <MdSportsKabaddi className="text-3xl text-orange-600 dark:text-orange-400" />
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
          Kabaddi
          </h1>
          <div className="absolute right-10 flex justify-center items-center">
            <FaEye />
            <span className="ml-1">{clients}</span>
          </div>
        </div>

        {/* Time and Winner Display */}
        <div className="flex justify-between items-center mb-6">
          <div className="bg-orange-100 dark:bg-orange-900 px-4 py-2 rounded-full">
            <span className="font-medium text-orange-800 dark:text-orange-200">
              {matchData.timeRemaining} remaining
            </span>
          </div>
          {matchData.winner && (
            <div className="flex items-center bg-yellow-100 dark:bg-yellow-900 px-4 py-2 rounded-full">
              <FaTrophy className="text-yellow-500 dark:text-yellow-300 mr-2" />
              <span className="font-bold text-yellow-800 dark:text-yellow-200">
                {matchData.winner === 'teamA' ? matchData.teamA.name : matchData.teamB.name} wins!
              </span>
            </div>
          )}
        </div>

        {/* Scoreboard */}
        <div className="flex justify-center h-[196px] bg-gradient-to-r from-orange-50 to-amber-50 dark:from-gray-700 dark:to-gray-800 rounded-3xl p-6 w-full max-w-4xl mx-auto my-4 shadow-md border-2 border-gray-200 dark:border-gray-700">
          <div className="grid grid-cols-3 gap-4 items-center">
            {/* Team A */}
            <div className={`flex flex-col items-center space-y-2 ${matchData.winner === 'teamA' ? 'ring-2 ring-yellow-400 rounded-lg p-2' : ''}`}>
              <img
                src={flag1_link}
                alt="Team A"
                className="w-16 h-12 object-contain rounded-lg shadow-sm border border-gray-200 dark:border-gray-700"
              />
              <p className="text-lg font-semibold">{matchData.teamA.name}</p>
              {matchData.winner === 'teamA' && (
                <div className="flex items-center text-yellow-500 dark:text-yellow-300">
                  <FaTrophy className="mr-1" size={14} />
                  <span className="text-xs font-bold">Winner</span>
                </div>
              )}
            </div>

            {/* Score */}
            <div className="flex flex-col items-center space-y-2">
              <div className="flex items-center">
                <span className={`text-4xl font-bold ${
                  animateScore.teamA ? 'text-green-500 dark:text-green-300 scale-125 transition-all duration-300' : ''
                }`}>
                  {matchData.teamA.totalPoints}
                </span>
                <span className="text-4xl font-bold mx-2">-</span>
                <span className={`text-4xl font-bold ${
                  animateScore.teamB ? 'text-green-500 dark:text-green-300 scale-125 transition-all duration-300' : ''
                }`}>
                  {matchData.teamB.totalPoints}
                </span>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Set {matchData.currentSet} in progress
              </p>
            </div>

            {/* Team B */}
            <div className={`flex flex-col items-center space-y-2 ${matchData.winner === 'teamB' ? 'ring-2 ring-yellow-400 rounded-lg p-2' : ''}`}>
              <img
                src={flag2_link}
                alt="Team B"
                className="w-16 h-12 object-contain rounded-lg shadow-sm border border-gray-200 dark:border-gray-700"
              />
              <p className="text-lg font-semibold">{matchData.teamB.name}</p>
              {matchData.winner === 'teamB' && (
                <div className="flex items-center text-yellow-500 dark:text-yellow-300">
                  <FaTrophy className="mr-1" size={14} />
                  <span className="text-xs font-bold">Winner</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Match Update */}
        <div className='flex justify-center items-center'>
          <div className=" w-[90%]  bg-orange-50 dark:bg-gray-700 rounded-xl p-4 mb-6">
                    <p className="text-center font-medium text-orange-800 dark:text-orange-200">
                      {matchData.latestUpdate}
                    </p>
          </div>
        </div>
       

        {/* Player Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          {renderPlayerStats(matchData.teamA)}
          {renderPlayerStats(matchData.teamB)}
        </div>

        {/* Set Statistics */}
        <div className="space-y-4">
          <h1 className="text-2xl font-bold text-center mb-4 text-orange-600 dark:text-orange-400">
            Match Statistics
          </h1>
          {renderSetStats(matchData.teamA.set1Points, matchData.teamB.set1Points, "Set 1")}
          {renderSetStats(matchData.teamA.set2Points, matchData.teamB.set2Points, "Set 2")}
          {renderSetStats(matchData.teamA.set3Points, matchData.teamB.set3Points, "Set 3")}
        </div>
      </div>
    </div>
  );
}

export default Kabaddi;
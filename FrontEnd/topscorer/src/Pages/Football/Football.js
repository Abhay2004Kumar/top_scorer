import React, { useEffect, useState } from 'react';
import { IoMdFootball } from "react-icons/io";
import Options from '../../Components/Live_Upcoming/Options';
import ChatComponent from '../../Components/Chat/Chat';

const Football = ({ data }) => {
  const [matchData, setMatchData] = useState(null);
  const [currentTime, setCurrentTime] = useState(0);
  
  // Default data structure
  const defaultData = {
    teamA: {
      name: "",
      logo: "https://upload.wikimedia.org/wikipedia/sco/thumb/4/47/FC_Barcelona_%28crest%29.svg/2020px-FC_Barcelona_%28crest%29.svg.png",
      score: 0,
      penalties: 0,
      players: [],
      striker: "",
      keeper: ""
    },
    teamB: {
      name: "",
      logo: "https://upload.wikimedia.org/wikipedia/en/thumb/7/7a/Manchester_United_FC_crest.svg/800px-Manchester_United_FC_crest.svg.png",
      score: 0,
      penalties: 0,
      players: [],
      striker: "",
      keeper: ""
    },
    timer: "00:00",
    commentaries: [],
    isTimerRunning: false,
    isMatchFinished: false
  };

  // Parse time string to seconds
  const parseTimeToSeconds = (timeStr) => {
    const [minutes, seconds] = timeStr.split(':').map(Number);
    return minutes * 60 + seconds;
  };

  // Format seconds to time string
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Timer effect
  useEffect(() => {
    let interval;
    if (matchData?.isTimerRunning && !matchData.isMatchFinished) {
      interval = setInterval(() => {
        setCurrentTime(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [matchData?.isTimerRunning, matchData?.isMatchFinished]);

  useEffect(() => {
    if (data) {
      // Ensure data structure matches expected format
      const formattedData = {
        teamA: {
          ...defaultData.teamA,
          ...data.teamA,
          logo: data.teamA?.logo || defaultData.teamA.logo,
          players: Array.isArray(data.teamA?.players) ? data.teamA.players : []
        },
        teamB: {
          ...defaultData.teamB,
          ...data.teamB,
          logo: data.teamB?.logo || defaultData.teamB.logo,
          players: Array.isArray(data.teamB?.players) ? data.teamB.players : []
        },
        timer: data.timer || "00:00",
        commentaries: Array.isArray(data.commentaries) ? data.commentaries : [],
        isTimerRunning: data.isTimerRunning || false,
        isMatchFinished: data.isMatchFinished || false
      };
      setMatchData(formattedData);
      // Set current time based on received timer value
      setCurrentTime(parseTimeToSeconds(data.timer || "00:00"));
    } else {
      setMatchData(defaultData);
      setCurrentTime(0);
    }
    console.log("Data", data);
  }, [data]);

  if (!matchData) return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-4">
      Loading match data...
    </div>
  );

  // Determine winner
  const getWinner = () => {
    if (!matchData.isMatchFinished) return null;
    if (matchData.teamA.score > matchData.teamB.score) return 'A';
    if (matchData.teamB.score > matchData.teamA.score) return 'B';
    return 'draw';
  };

  const winner = getWinner();
  const isDraw = winner === 'draw';

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 p-4 md:p-6 transition-colors">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div className="flex items-center gap-3">
          <IoMdFootball className="text-3xl text-green-600 dark:text-green-400" />
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Live Football Match
          </h1>
        </div>
        <Options 
          cur_link="/dashboard/football"
          archived="/dashboard/football_archived"
        />
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Score Board */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            {/* Team A */}
            <div className={`flex-1 text-center transition-all duration-300 ${
              winner === 'A' ? 'ring-4 ring-green-500 rounded-lg p-4' : ''
            }`}>
              <img 
                src={matchData.teamA.logo} 
                alt={matchData.teamA.name}
                className="w-16 h-16 md:w-24 md:h-24 object-contain mx-auto mb-4"
              />
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                {matchData.teamA.name}
              </h2>
              <div className="text-4xl font-bold text-green-600 dark:text-green-400 mt-2">
                {matchData.teamA.score}
              </div>
              {winner === 'A' && (
                <div className="mt-2 text-green-500 font-bold">
                  Winner 🏆
                </div>
              )}
            </div>

            {/* Match Info */}
            <div className="flex flex-col items-center space-y-2">
              <div className="text-2xl md:text-3xl font-mono font-bold text-gray-900 dark:text-white">
                {formatTime(currentTime)}
              </div>
              <span className={`px-3 py-1 rounded-full text-sm ${
                matchData.isMatchFinished 
                  ? 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'
                  : matchData.isTimerRunning 
                    ? 'bg-red-100 dark:bg-red-800 text-red-600 dark:text-red-100'
                    : 'bg-yellow-100 dark:bg-yellow-800 text-yellow-600 dark:text-yellow-100'
              }`}>
                {matchData.isMatchFinished ? 'Match Finished' : matchData.isTimerRunning ? 'Live' : 'Paused'}
              </span>
            </div>

            {/* Team B */}
            <div className={`flex-1 text-center transition-all duration-300 ${
              winner === 'B' ? 'ring-4 ring-green-500 rounded-lg p-4' : ''
            }`}>
              <img 
                src={matchData.teamB.logo} 
                alt={matchData.teamB.name}
                className="w-16 h-16 md:w-24 md:h-24 object-contain mx-auto mb-4"
              />
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                {matchData.teamB.name}
              </h2>
              <div className="text-4xl font-bold text-green-600 dark:text-green-400 mt-2">
                {matchData.teamB.score}
              </div>
              {winner === 'B' && (
                <div className="mt-2 text-green-500 font-bold">
                  Winner 🏆
                </div>
              )}
            </div>
          </div>
          {isDraw && matchData.isMatchFinished && (
            <div className="text-center mt-4 text-yellow-500 font-bold">
              Match Ended in a Draw
            </div>
          )}
        </div>

        {/* Player Stats */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md">
          <h3 className="text-lg font-semibold mb-6 text-green-600 dark:text-green-400">
            ⭐ Key Players
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <h4 className="text-sm font-medium text-gray-600 dark:text-gray-300 mb-2">
                Home Striker
              </h4>
              <p className="font-semibold text-gray-900 dark:text-white">
                {matchData.teamA.striker}
              </p>
            </div>
            
            <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <h4 className="text-sm font-medium text-gray-600 dark:text-gray-300 mb-2">
                Home Keeper
              </h4>
              <p className="font-semibold text-gray-900 dark:text-white">
                {matchData.teamA.keeper}
              </p>
            </div>

            <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <h4 className="text-sm font-medium text-gray-600 dark:text-gray-300 mb-2">
                Away Striker
              </h4>
              <p className="font-semibold text-gray-900 dark:text-white">
                {matchData.teamB.striker}
              </p>
            </div>

            <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <h4 className="text-sm font-medium text-gray-600 dark:text-gray-300 mb-2">
                Away Keeper
              </h4>
              <p className="font-semibold text-gray-900 dark:text-white">
                {matchData.teamB.keeper}
              </p>
            </div>
          </div>
        </div>

        {/* Commentaries Section */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md">
          <h3 className="text-lg font-semibold mb-4 text-green-600 dark:text-green-400">
            📢 Live Commentary
          </h3>
          <div className="space-y-4">
            {matchData.commentaries.map((commentary, index) => (
              <div
                key={index}
                className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <span className="font-mono text-sm text-gray-600 dark:text-gray-300">
                    {commentary.time}
                  </span>
                  <span className="text-gray-900 dark:text-white">
                    {commentary.text}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Chat Component */}
        <ChatComponent sportName="Football" />
      </div>
    </div>
  );
};

export default Football;
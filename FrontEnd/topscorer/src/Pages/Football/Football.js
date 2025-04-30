import React, { useEffect, useState } from 'react';
import { IoMdFootball } from "react-icons/io";
import Options from '../../Components/Live_Upcoming/Options';
import ChatComponent from '../../Components/Chat/Chat';
import FireworksComponent from '../../Components/customAnimations/FireWork';

const Football = ({ data }) => {
  const [matchData, setMatchData] = useState(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [cracker,setCracker]   = useState(false);
  
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
      if(formattedData.isMatchFinished){
        setCracker(true)
      }
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

  if(cracker){
    setTimeout(()=>{
      setCracker(false)
    },4000)
  }

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
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 px-2 md:p-6 transition-colors">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-4 gap-2">
        <div className="flex items-center gap-2">
          <IoMdFootball className="text-2xl md:text-3xl text-green-600 dark:text-green-400" />
          <h1 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white">
            Live Football Match
          </h1>
        </div>
        
        <div className="w-full md:w-auto">
          <Options 
            cur_link="/dashboard/football"
            archived="/dashboard/football_archived"
          />
        </div>
      </div>
      {cracker && <FireworksComponent/>}
      {/* Main Content */}
      <div className="max-w-7xl mx-auto space-y-4">
        {/* Score Board */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-3 md:p-6 shadow-lg">
          <div className="flex flex-col items-center justify-between gap-4">
            {/* Teams Row */}
            <div className="w-full flex flex-row items-center justify-between gap-2">
              {/* Team A */}
              <div className={`flex-1 text-center ${
                winner === 'A' ? 'ring-4 ring-green-500 rounded-lg p-2' : ''
              }`}>
                <img 
                  src={matchData.teamA.logo} 
                  alt={matchData.teamA.name}
                  className="w-12 h-12 md:w-24 md:h-24 object-contain mx-auto mb-2"
                />
                <h2 className="text-sm md:text-lg font-semibold text-gray-900 dark:text-white truncate">
                  {matchData.teamA.name}
                </h2>
                <div className="text-3xl md:text-4xl font-bold text-green-600 dark:text-green-400 mt-1">
                  {matchData.teamA.score}
                </div>
              </div>

              {/* VS Separator */}
              <div className="text-xl font-bold text-gray-500 dark:text-gray-400 mx-2">
                VS
              </div>

              {/* Team B */}
              <div className={`flex-1 text-center ${
                winner === 'B' ? 'ring-4 ring-green-500 rounded-lg p-2' : ''
              }`}>
                <img 
                  src={matchData.teamB.logo} 
                  alt={matchData.teamB.name}
                  className="w-12 h-12 md:w-24 md:h-24 object-contain mx-auto mb-2"
                />
                <h2 className="text-sm md:text-lg font-semibold text-gray-900 dark:text-white truncate">
                  {matchData.teamB.name}
                </h2>
                <div className="text-3xl md:text-4xl font-bold text-green-600 dark:text-green-400 mt-1">
                  {matchData.teamB.score}
                </div>
              </div>
            </div>

            {/* Match Info */}
            <div className="w-full flex flex-col items-center space-y-2">
              <div className="text-xl md:text-3xl font-mono font-bold text-gray-900 dark:text-white">
                {formatTime(currentTime)}
              </div>
              <span className={`px-2 py-1 rounded-full text-xs md:text-sm ${
                matchData.isMatchFinished 
                  ? 'bg-gray-100 dark:bg-gray-700'
                  : matchData.isTimerRunning 
                    ? 'bg-red-100 dark:bg-red-800'
                    : 'bg-yellow-100 dark:bg-yellow-800'
              }`}>
                {matchData.isMatchFinished ? 'Finished' : matchData.isTimerRunning ? 'Live' : 'Paused'}
              </span>
            </div>
          </div>
        </div>

        {/* Player Stats */}
        <div className="bg-white dark:bg-gray-800 p-3 md:p-6 rounded-xl shadow-md">
          <h3 className="text-md md:text-lg font-semibold mb-4 text-green-600 dark:text-green-400">
            ⭐ Key Players
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-4">
            {/* Player cards */}
            {[['Home Striker', matchData.teamA.striker], 
              ['Home Keeper', matchData.teamA.keeper],
              ['Away Striker', matchData.teamB.striker],
              ['Away Keeper', matchData.teamB.keeper]].map(([title, name]) => (
              <div key={title} className="p-2 md:p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <h4 className="text-xs md:text-sm font-medium text-gray-600 dark:text-gray-300 mb-1">
                  {title}
                </h4>
                <p className="text-sm md:text-base font-semibold text-gray-900 dark:text-white truncate">
                  {name}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Commentaries Section */}
        <div className="bg-white dark:bg-gray-800 p-3 md:p-6 rounded-xl shadow-md">
          <h3 className="text-md md:text-lg font-semibold mb-3 text-green-600 dark:text-green-400">
            📢 Live Commentary
          </h3>
          <div className="space-y-2">
            {matchData.commentaries.map((commentary, index) => (
              <div
                key={index}
                className="p-2 md:p-3 bg-gray-50 dark:bg-gray-700 rounded-lg text-sm"
              >
                <div className="flex flex-col md:flex-row md:items-center gap-1 md:gap-3">
                  <span className="font-mono text-xs md:text-sm text-gray-600 dark:text-gray-300">
                    {commentary.time}
                  </span>
                  <span className="text-gray-900 dark:text-white break-words">
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

export default Football
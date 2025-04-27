import React, { useEffect, useState } from "react";
import { io } from "socket.io-client";
import { toast } from "react-toastify";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import ChatComponent from "../../Components/Chat/Chat";
import Options from "../../Components/Live_Upcoming/Options";
import PlayerCard from "../../Components/PlayerCard/Card";
import { FaTrophy, FaChartLine, FaUserFriends, FaHistory, FaMoon, FaSun } from 'react-icons/fa';

function Cricket() {
  const [socket, setSocket] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedTeam, setSelectedTeam] = useState("team1");
  const [activeTab, setActiveTab] = useState("scorecard");
  const [darkMode, setDarkMode] = useState(() => {
    // Check if user has a theme preference in localStorage
    const savedTheme = localStorage.getItem('theme');
    // Check system preference if no saved theme
    if (!savedTheme) {
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return savedTheme === 'dark';
  });

  // Effect to handle dark mode changes
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [darkMode]);

  // Add teamData state with dummy data
  const [teamData, setTeamData] = useState({
    team1: {
      name: "India",
      shortName: "IND",
      logo: "https://img.icons8.com/color/96/india.png",
      score: "187/5",
      overs: "19.3",
      runRate: "9.56",
      isBatting: true,
      crr: "9.56"
    },
    team2: {
      name: "Australia",
      shortName: "AUS",
      logo: "https://img.icons8.com/color/96/australia.png",
      score: "182/8",
      overs: "20.0",
      runRate: "9.10",
      isBatting: false,
      crr: "9.10"
    }
  });
  
  // Add scoreCard state with dummy data
  const [scoreCard, setScoreCard] = useState([
    {
      name: "Virat Kohli",
      runs: 72,
      balls: 42,
      fours: 6,
      sixes: 3,
      strikeRate: "171.42",
      isOut: false,
      dismissal: "Not Out"
    },
    {
      name: "Rohit Sharma",
      runs: 45,
      balls: 30,
      fours: 5,
      sixes: 2,
      strikeRate: "150.00",
      isOut: true,
      dismissal: "c Warner b Cummins"
    },
    {
      name: "KL Rahul",
      runs: 28,
      balls: 20,
      fours: 3,
      sixes: 1,
      strikeRate: "140.00",
      isOut: true,
      dismissal: "b Zampa"
    },
    {
      name: "Rishabh Pant",
      runs: 15,
      balls: 10,
      fours: 1,
      sixes: 1,
      strikeRate: "150.00",
      isOut: true,
      dismissal: "c Smith b Cummins"
    },
    {
      name: "Hardik Pandya",
      runs: 18,
      balls: 12,
      fours: 1,
      sixes: 1,
      strikeRate: "150.00",
      isOut: false,
      dismissal: "Not Out"
    }
  ]);

  // Add bowling card data
  const [bowlingCard, setBowlingCard] = useState([
    {
      name: "Pat Cummins",
      overs: "4.0",
      maidens: 0,
      runs: 38,
      wickets: 2,
      economy: "9.50"
    },
    {
      name: "Adam Zampa",
      overs: "4.0",
      maidens: 0,
      runs: 32,
      wickets: 1,
      economy: "8.00"
    },
    {
      name: "Mitchell Starc",
      overs: "3.0",
      maidens: 0,
      runs: 28,
      wickets: 1,
      economy: "9.33"
    },
    {
      name: "Glenn Maxwell",
      overs: "3.0",
      maidens: 0,
      runs: 25,
      wickets: 0,
      economy: "8.33"
    }
  ]);

  const [commentary, setCommentary] = useState([
    { over: 18.2, text: "SIX! Rohit launches this over long-on!", runs: 6 },
    { over: 18.1, text: "OUT! Caught at deep mid-wicket", wickets: 1 },
    { over: 18.0, text: "FOUR! Pulled away to the boundary", runs: 4 },
    { over: 17.6, text: "Single taken", runs: 1 },
    { over: 17.5, text: "OUT! Bowled! Middle stump uprooted", wickets: 1 },
    { over: 17.4, text: "SIX! Over the bowler's head", runs: 6 },
    { over: 17.3, text: "FOUR! Through the covers", runs: 4 },
    { over: 17.2, text: "Dot ball", runs: 0 },
    { over: 17.1, text: "FOUR! Down the ground", runs: 4 },
    { over: 17.0, text: "FOUR! Through the leg side", runs: 4 },
  ]);

  const runRateData = [
    { over: 1, team1: 8, team2: 7 },
    { over: 2, team1: 15, team2: 14 },
    { over: 3, team1: 22, team2: 21 },
    { over: 4, team1: 35, team2: 29 },
    { over: 5, team1: 48, team2: 37 },
    { over: 6, team1: 55, team2: 45 },
    { over: 7, team1: 63, team2: 53 },
    { over: 8, team1: 72, team2: 64 },
    { over: 9, team1: 85, team2: 73 },
    { over: 10, team1: 97, team2: 82 },
  ];

  const winProbability = 68; // Example value

  // Current over data
  const [currentOver, setCurrentOver] = useState([1, 0, 4, 6, 2, 'W']);
  const [lastOver, setLastOver] = useState({ runs: 13, wickets: 1 });

  // Match status
  const [matchStatus, setMatchStatus] = useState("India need 12 runs in 3 balls");

  useEffect(() => {
    // Simulate loading data
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100 dark:bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-900 dark:text-white text-lg">Loading match data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white p-4 transition-colors duration-200">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <FaTrophy className="text-3xl text-blue-500 mr-2" />
            <h1 className="text-2xl font-bold">Cricket Live</h1>
          </div>
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-2 rounded-lg bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
              aria-label="Toggle dark mode"
            >
              {darkMode ? (
                <FaSun className="text-yellow-500 text-xl" />
              ) : (
                <FaMoon className="text-gray-700 text-xl" />
              )}
            </button>
            <Options cur_link="/dashboard/cricket" archived="/dashboard/cricket_archived" />
          </div>
        </div>

        {/* Match Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-900 dark:to-indigo-900 p-6 rounded-xl shadow-lg border border-blue-500 dark:border-blue-700">
          <h1 className="text-2xl font-bold text-center mb-2">
            {teamData.team1.name} vs {teamData.team2.name} - T20 International
          </h1>
          <p className="text-center text-blue-100 dark:text-blue-200">Dubai International Stadium • 23 August 2023</p>
        </div>

        {/* Live Score Banner */}
        <div className="grid grid-cols-3 bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
          <div className="text-center">
            <img src={teamData.team1.logo} className="h-16 mx-auto mb-2" alt={teamData.team1.name} />
            <h3 className="text-xl font-bold">{teamData.team1.score}</h3>
            <p className="text-sm text-gray-600 dark:text-gray-300">{teamData.team1.overs} Overs</p>
          </div>
          <div className="text-center flex flex-col justify-center">
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">VS</div>
            <div className="text-sm bg-red-100 dark:bg-red-900 px-3 py-1 rounded-full mt-2 inline-block">Live</div>
            <div className="mt-2 text-sm text-blue-600 dark:text-blue-300">{matchStatus}</div>
          </div>
          <div className="text-center">
            <img src={teamData.team2.logo} className="h-16 mx-auto mb-2" alt={teamData.team2.name} />
            <h3 className="text-xl font-bold">{teamData.team2.score}</h3>
            <p className="text-sm text-gray-600 dark:text-gray-300">{teamData.team2.overs} Overs</p>
          </div>
        </div>

        {/* Key Metrics Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow border border-gray-200 dark:border-gray-700">
            <h4 className="text-sm font-medium text-gray-600 dark:text-gray-300 mb-1">Current Run Rate</h4>
            <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{teamData[selectedTeam].crr}</p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow border border-gray-200 dark:border-gray-700">
            <h4 className="text-sm font-medium text-gray-600 dark:text-gray-300 mb-1">Target</h4>
            <p className="text-2xl font-bold text-green-600 dark:text-green-400">235</p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow border border-gray-200 dark:border-gray-700">
            <h4 className="text-sm font-medium text-gray-600 dark:text-gray-300 mb-1">Req. Run Rate</h4>
            <p className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">12.5</p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow border border-gray-200 dark:border-gray-700">
            <h4 className="text-sm font-medium text-gray-600 dark:text-gray-300 mb-1">Balls Remaining</h4>
            <p className="text-2xl font-bold text-red-600 dark:text-red-400">18</p>
          </div>
        </div>

        {/* Current Over Section */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
          <h3 className="text-xl font-bold mb-4 text-blue-600 dark:text-blue-300">Current Over</h3>
          <div className="flex flex-wrap gap-3 mb-6 justify-center">
            {currentOver.map((ball, index) => (
              <div key={index} className="relative">
                <div className={`w-14 h-14 rounded-full flex items-center justify-center text-lg font-bold border-2 
                  ${ball === 'W' ? 'bg-red-100 dark:bg-red-900 border-red-500 dark:border-red-700' : 
                    ball === 4 ? 'bg-blue-100 dark:bg-blue-900 border-blue-500 dark:border-blue-700' : 
                    ball === 6 ? 'bg-purple-100 dark:bg-purple-900 border-purple-500 dark:border-purple-700' : 
                    ball === 0 ? 'bg-gray-100 dark:bg-gray-700 border-gray-300 dark:border-gray-600' : 
                    'bg-green-100 dark:bg-green-900 border-green-500 dark:border-green-700'}`}>
                  {ball}
                </div>
                <span className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-gray-200 dark:bg-gray-700 text-xs flex items-center justify-center">
                  {index + 1}
                </span>
              </div>
            ))}
          </div>
          <div className="grid grid-cols-2 gap-6">
            <div className="bg-gray-100 dark:bg-gray-700 p-3 rounded-lg">
              <h4 className="text-sm font-medium text-gray-600 dark:text-gray-300 mb-1">Last Over Runs</h4>
              <p className="text-xl font-bold text-blue-600 dark:text-blue-400">{lastOver.runs}</p>
            </div>
            <div className="bg-gray-100 dark:bg-gray-700 p-3 rounded-lg">
              <h4 className="text-sm font-medium text-gray-600 dark:text-gray-300 mb-1">Last Over Wickets</h4>
              <p className="text-xl font-bold text-red-600 dark:text-red-400">{lastOver.wickets}</p>
            </div>
          </div>
        </div>

        {/* Tabs Navigation */}
        <div className="flex space-x-2 bg-white dark:bg-gray-800 p-2 rounded-lg shadow border border-gray-200 dark:border-gray-700">
          <button 
            className={`flex-1 py-2 px-4 rounded-md flex items-center justify-center ${
              activeTab === "scorecard" 
                ? 'bg-blue-600 text-white' 
                : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
            }`}
            onClick={() => setActiveTab("scorecard")}
          >
            <FaUserFriends className="mr-2" />
            Scorecard
          </button>
          <button 
            className={`flex-1 py-2 px-4 rounded-md flex items-center justify-center ${
              activeTab === "bowling" 
                ? 'bg-blue-600 text-white' 
                : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
            }`}
            onClick={() => setActiveTab("bowling")}
          >
            <FaTrophy className="mr-2" />
            Bowling
          </button>
          <button 
            className={`flex-1 py-2 px-4 rounded-md flex items-center justify-center ${
              activeTab === "commentary" 
                ? 'bg-blue-600 text-white' 
                : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
            }`}
            onClick={() => setActiveTab("commentary")}
          >
            <FaHistory className="mr-2" />
            Commentary
          </button>
          <button 
            className={`flex-1 py-2 px-4 rounded-md flex items-center justify-center ${
              activeTab === "stats" 
                ? 'bg-blue-600 text-white' 
                : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
            }`}
            onClick={() => setActiveTab("stats")}
          >
            <FaChartLine className="mr-2" />
            Stats
          </button>
        </div>

        {/* Tab Content */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
          {activeTab === "scorecard" && (
            <div>
              <h3 className="text-xl font-bold mb-4 text-blue-600 dark:text-blue-300">Batting Scorecard</h3>
              <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700">
                <table className="w-full text-left">
                  <thead className="bg-gray-100 dark:bg-gray-700">
                    <tr>
                      <th className="p-3 text-gray-600 dark:text-gray-300 font-medium">Batter</th>
                      <th className="p-3 text-gray-600 dark:text-gray-300 font-medium">R</th>
                      <th className="p-3 text-gray-600 dark:text-gray-300 font-medium">B</th>
                      <th className="p-3 text-gray-600 dark:text-gray-300 font-medium">4s</th>
                      <th className="p-3 text-gray-600 dark:text-gray-300 font-medium">6s</th>
                      <th className="p-3 text-gray-600 dark:text-gray-300 font-medium">SR</th>
                      <th className="p-3 text-gray-600 dark:text-gray-300 font-medium">Dismissal</th>
                    </tr>
                  </thead>
                  <tbody>
                    {scoreCard.map((player, index) => (
                      <tr key={index} className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                        <td className="p-3">
                          {player.name}
                          {!player.isOut && <span className="ml-2 inline-block w-2 h-2 rounded-full bg-green-500"></span>}
                        </td>
                        <td className="p-3">{player.runs}</td>
                        <td className="p-3">{player.balls}</td>
                        <td className="p-3">{player.fours}</td>
                        <td className="p-3">{player.sixes}</td>
                        <td className="p-3">{player.strikeRate}</td>
                        <td className="p-3 text-sm">{player.dismissal}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === "bowling" && (
            <div>
              <h3 className="text-xl font-bold mb-4 text-blue-600 dark:text-blue-300">Bowling Scorecard</h3>
              <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700">
                <table className="w-full text-left">
                  <thead className="bg-gray-100 dark:bg-gray-700">
                    <tr>
                      <th className="p-3 text-gray-600 dark:text-gray-300 font-medium">Bowler</th>
                      <th className="p-3 text-gray-600 dark:text-gray-300 font-medium">O</th>
                      <th className="p-3 text-gray-600 dark:text-gray-300 font-medium">M</th>
                      <th className="p-3 text-gray-600 dark:text-gray-300 font-medium">R</th>
                      <th className="p-3 text-gray-600 dark:text-gray-300 font-medium">W</th>
                      <th className="p-3 text-gray-600 dark:text-gray-300 font-medium">ER</th>
                    </tr>
                  </thead>
                  <tbody>
                    {bowlingCard.map((player, index) => (
                      <tr key={index} className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                        <td className="p-3">{player.name}</td>
                        <td className="p-3">{player.overs}</td>
                        <td className="p-3">{player.maidens}</td>
                        <td className="p-3">{player.runs}</td>
                        <td className="p-3">{player.wickets}</td>
                        <td className="p-3">{player.economy}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === "commentary" && (
            <div>
              <h3 className="text-xl font-bold mb-4 text-blue-600 dark:text-blue-300">Live Commentary</h3>
              <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
                {commentary.map((item, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <div className="w-16 text-sm font-medium text-blue-600 dark:text-blue-300">Over {item.over}</div>
                    <div className={`flex-1 p-3 rounded-lg ${
                      item.wickets 
                        ? 'bg-red-50 dark:bg-red-900/50 border border-red-200 dark:border-red-800' 
                        : 'bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600'
                    }`}>
                      <p className="text-sm">{item.text}</p>
                      {item.runs && <span className="text-xs text-green-600 dark:text-green-400">+{item.runs} runs</span>}
                      {item.wickets && <span className="text-xs text-red-600 dark:text-red-400">-{item.wickets} wicket</span>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "stats" && (
            <div className="space-y-6">
              <h3 className="text-xl font-bold mb-4 text-blue-600 dark:text-blue-300">Match Statistics</h3>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg border border-gray-200 dark:border-gray-600">
                  <h4 className="text-lg font-semibold mb-3 text-blue-600 dark:text-blue-300">Run Rate Comparison</h4>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={runRateData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                        <XAxis 
                          dataKey="over" 
                          label={{ value: 'Overs', position: 'insideBottom', fill: '#3B82F6' }} 
                          stroke="#6B7280" 
                        />
                        <YAxis stroke="#6B7280" />
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: '#FFFFFF', 
                            border: '1px solid #E5E7EB', 
                            color: '#1F2937',
                            borderRadius: '0.5rem'
                          }} 
                        />
                        <Legend wrapperStyle={{ color: '#1F2937' }} />
                        <Line type="monotone" dataKey="team1" stroke="#3B82F6" name={teamData.team1.name} />
                        <Line type="monotone" dataKey="team2" stroke="#F59E0B" name={teamData.team2.name} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg border border-gray-200 dark:border-gray-600">
                  <h4 className="text-lg font-semibold mb-3 text-blue-600 dark:text-blue-300">Win Probability</h4>
                  <div className="h-64 flex items-center justify-center">
                    <div className="relative w-48 h-48">
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">{winProbability}%</div>
                      </div>
                      <svg className="transform -rotate-90 w-48 h-48">
                        <circle cx="96" cy="96" r="88" className="stroke-current text-gray-200 dark:text-gray-600" strokeWidth="16" fill="none" />
                        <circle cx="96" cy="96" r="88" className="stroke-current text-blue-500" strokeWidth="16"
                          strokeDasharray={`${(2 * Math.PI * 88) * (winProbability/100)} ${2 * Math.PI * 88}`}
                          strokeDashoffset="0" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Player Performance Cards */}
        <div className="grid md:grid-cols-3 gap-4">
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow border border-gray-200 dark:border-gray-700">
            <div className="flex items-center mb-3">
              <img src="https://img.icons8.com/color/96/india.png" className="h-10 w-10 mr-3" alt="Player" />
              <div>
                <h3 className="font-bold text-blue-600 dark:text-blue-300">Virat Kohli</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Batsman</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div className="bg-gray-50 dark:bg-gray-700 p-2 rounded">
                <h4 className="text-xs font-medium text-gray-600 dark:text-gray-300 mb-1">Runs</h4>
                <p className="text-lg font-bold text-blue-600 dark:text-blue-400">72</p>
              </div>
              <div className="bg-gray-50 dark:bg-gray-700 p-2 rounded">
                <h4 className="text-xs font-medium text-gray-600 dark:text-gray-300 mb-1">Strike Rate</h4>
                <p className="text-lg font-bold text-green-600 dark:text-green-400">171.42</p>
              </div>
              <div className="bg-gray-50 dark:bg-gray-700 p-2 rounded">
                <h4 className="text-xs font-medium text-gray-600 dark:text-gray-300 mb-1">4s</h4>
                <p className="text-lg font-bold text-blue-600 dark:text-blue-400">6</p>
              </div>
              <div className="bg-gray-50 dark:bg-gray-700 p-2 rounded">
                <h4 className="text-xs font-medium text-gray-600 dark:text-gray-300 mb-1">6s</h4>
                <p className="text-lg font-bold text-purple-600 dark:text-purple-400">3</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow border border-gray-200 dark:border-gray-700">
            <div className="flex items-center mb-3">
              <img src="https://img.icons8.com/color/96/australia.png" className="h-10 w-10 mr-3" alt="Player" />
              <div>
                <h3 className="font-bold text-blue-600 dark:text-blue-300">Pat Cummins</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Bowler</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div className="bg-gray-50 dark:bg-gray-700 p-2 rounded">
                <h4 className="text-xs font-medium text-gray-600 dark:text-gray-300 mb-1">Wickets</h4>
                <p className="text-lg font-bold text-red-600 dark:text-red-400">2</p>
              </div>
              <div className="bg-gray-50 dark:bg-gray-700 p-2 rounded">
                <h4 className="text-xs font-medium text-gray-600 dark:text-gray-300 mb-1">Economy</h4>
                <p className="text-lg font-bold text-yellow-600 dark:text-yellow-400">9.50</p>
              </div>
              <div className="bg-gray-50 dark:bg-gray-700 p-2 rounded">
                <h4 className="text-xs font-medium text-gray-600 dark:text-gray-300 mb-1">Overs</h4>
                <p className="text-lg font-bold text-blue-600 dark:text-blue-400">4.0</p>
              </div>
              <div className="bg-gray-50 dark:bg-gray-700 p-2 rounded">
                <h4 className="text-xs font-medium text-gray-600 dark:text-gray-300 mb-1">Runs</h4>
                <p className="text-lg font-bold text-green-600 dark:text-green-400">38</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow border border-gray-200 dark:border-gray-700">
            <div className="flex items-center mb-3">
              <img src="https://img.icons8.com/color/96/india.png" className="h-10 w-10 mr-3" alt="Player" />
              <div>
                <h3 className="font-bold text-blue-600 dark:text-blue-300">Rohit Sharma</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Batsman</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div className="bg-gray-50 dark:bg-gray-700 p-2 rounded">
                <h4 className="text-xs font-medium text-gray-600 dark:text-gray-300 mb-1">Runs</h4>
                <p className="text-lg font-bold text-blue-600 dark:text-blue-400">45</p>
              </div>
              <div className="bg-gray-50 dark:bg-gray-700 p-2 rounded">
                <h4 className="text-xs font-medium text-gray-600 dark:text-gray-300 mb-1">Strike Rate</h4>
                <p className="text-lg font-bold text-green-600 dark:text-green-400">150.00</p>
              </div>
              <div className="bg-gray-50 dark:bg-gray-700 p-2 rounded">
                <h4 className="text-xs font-medium text-gray-600 dark:text-gray-300 mb-1">4s</h4>
                <p className="text-lg font-bold text-blue-600 dark:text-blue-400">5</p>
              </div>
              <div className="bg-gray-50 dark:bg-gray-700 p-2 rounded">
                <h4 className="text-xs font-medium text-gray-600 dark:text-gray-300 mb-1">6s</h4>
                <p className="text-lg font-bold text-purple-600 dark:text-purple-400">2</p>
              </div>
            </div>
          </div>
        </div>

        {/* Chat Component */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
          <ChatComponent sportName="Cricket" />
        </div>
      </div>
    </div>
  );
}

export default Cricket;
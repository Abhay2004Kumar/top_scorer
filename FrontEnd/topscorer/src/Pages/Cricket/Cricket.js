import React, { useEffect, useState } from "react";
import { io } from "socket.io-client";
import { toast } from "react-toastify";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import ChatComponent from "../../Components/Chat/Chat";
import Options from "../../Components/Live_Upcoming/Options";
import PlayerCard from "../../Components/PlayerCard/Card";
import { FaTrophy, FaChartLine, FaUserFriends, FaHistory, FaMoon, FaSun } from 'react-icons/fa';

const initialMatchData = {
    name: "Cricket",
    data: {
        basicInfo: {
            status: "In Progress",
            venue: "IIIT Una Ground",
            date: "2025-04-29",
            toss: "IIIT Una",
            decision: "Bat",
            maxOvers: 20,
            matchType: "T20",
            winningTeam: "",
            matchResult: ""
        },
        teams: {
            team1: {
                name: "IIIT Una",
                score: "35/0",
                overs: "1.5",
                logo: "",
                runRate: "23.33",
                requiredRate: "N/A"
            },
            team2: {
                name: "IIIT Ranchi",
                score: "0/0",
                overs: "0.2",
                logo: "",
                runRate: "0.00",
                requiredRate: "N/A"
            }
        },
        current: {
            batsmen: ["Rahul", "Shreyash"],
            bowler: "Ramesh",
            thisOver: [1, 1, 1, 0, 3, 4],
            partnership: "0 (0)",
            lastOver: { runs: 0, wickets: 0 },
            striker: 1,
            nonStriker: 0
        },
        scorecard: {
            team1: [
                {
                    name: "Rahul",
                    runs: 22,
                    balls: 9,
                    fours: 1,
                    sixes: 2,
                    strikeRate: "244.44",
                    isOut: false,
                    dismissal: "Not Out"
                },
                {
                    name: "Shreyash",
                    runs: 10,
                    balls: 4,
                    fours: 1,
                    sixes: 0,
                    strikeRate: "250.00",
                    isOut: false,
                    dismissal: "Not Out"
                }
            ],
            team2: []
        },
        bowlingcard: {
            team1: [],
            team2: [
                {
                    name: "Saurabh",
                    overs: "1.2",
                    maidens: 0,
                    runs: 23,
                    wickets: 0,
                    economy: "19.17"
                },
                {
                    name: "Ramesh",
                    overs: "0.5",
                    maidens: 0,
                    runs: 9,
                    wickets: 0,
                    economy: "18.00"
                }
            ]
        },
        overs: {
            team1: [
                {
                    number: 1,
                    balls: [1, 2, 3, 4, 6, 6],
                    runs: 22,
                    wickets: 0
                }
            ],
            team2: []
        },
        commentary: []
    }
};

function Cricket({ data }) {
  console.log("DATA",data)
  const [socket, setSocket] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedTeam, setSelectedTeam] = useState("team1");
  const [activeTab, setActiveTab] = useState("scorecard");
  const [darkMode, setDarkMode] = useState(() => {
    const savedTheme = localStorage.getItem('theme');
    if (!savedTheme) {
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return savedTheme === 'dark';
  });

  // Initialize all state variables with data from props or initialMatchData
  const initialData = data || initialMatchData.data;
  
  const [matchData, setMatchData] = useState({ name: "Cricket", data: initialData });
  const [teamData, setTeamData] = useState({
    team1: {
      name: initialData.teams.team1.name,
      shortName: initialData.teams.team1.name.substring(0, 3).toUpperCase(),
      logo: initialData.teams.team1.logo || "https://img.icons8.com/color/96/india.png",
      score: initialData.teams.team1.score,
      overs: initialData.teams.team1.overs,
      runRate: initialData.teams.team1.runRate,
      isBatting: initialData.teams.team1.score !== "0/0",
      crr: initialData.teams.team1.runRate
    },
    team2: {
      name: initialData.teams.team2.name,
      shortName: initialData.teams.team2.name.substring(0, 3).toUpperCase(),
      logo: initialData.teams.team2.logo || "https://img.icons8.com/color/96/australia.png",
      score: initialData.teams.team2.score,
      overs: initialData.teams.team2.overs,
      runRate: initialData.teams.team2.runRate,
      isBatting: initialData.teams.team2.score !== "0/0",
      crr: initialData.teams.team2.runRate
    }
  });
  const [scoreCard, setScoreCard] = useState(initialData.scorecard.team1);
  const [bowlingCard, setBowlingCard] = useState(initialData.bowlingcard.team2);
  const [commentary, setCommentary] = useState(initialData.commentary);
  const [currentOver, setCurrentOver] = useState(initialData.current.thisOver);
  const [lastOver, setLastOver] = useState(initialData.current.lastOver);
  const [matchStatus, setMatchStatus] = useState(() => {
    const team1Score = initialData.teams.team1.score;
    const team2Score = initialData.teams.team2.score;
    if (team1Score === "0/0" && team2Score === "0/0") {
      return "Match not started";
    } else if (team1Score !== "0/0" && team2Score === "0/0") {
      return `${initialData.teams.team1.name} batting`;
    } else if (team1Score !== "0/0" && team2Score !== "0/0") {
      const [runs1, wickets1] = team1Score.split('/').map(Number);
      const [runs2, wickets2] = team2Score.split('/').map(Number);
      const remainingRuns = runs1 - runs2;
      const remainingBalls = (initialData.basicInfo.maxOvers * 6) - 
        (parseFloat(initialData.teams.team2.overs) * 6);
      return `${initialData.teams.team2.name} need ${remainingRuns} runs in ${remainingBalls} balls`;
    }
    return "Match in progress";
  });

  // Update states when data prop changes
  useEffect(() => {
    if (data) {
      setMatchData({ name: "Cricket", data });
      setTeamData({
        team1: {
          name: data.teams.team1.name,
          shortName: data.teams.team1.name.substring(0, 3).toUpperCase(),
          logo: data.teams.team1.logo || "https://img.icons8.com/color/96/india.png",
          score: data.teams.team1.score,
          overs: data.teams.team1.overs,
          runRate: data.teams.team1.runRate,
          isBatting: data.teams.team1.score !== "0/0",
          crr: data.teams.team1.runRate
        },
        team2: {
          name: data.teams.team2.name,
          shortName: data.teams.team2.name.substring(0, 3).toUpperCase(),
          logo: data.teams.team2.logo || "https://img.icons8.com/color/96/australia.png",
          score: data.teams.team2.score,
          overs: data.teams.team2.overs,
          runRate: data.teams.team2.runRate,
          isBatting: data.teams.team2.score !== "0/0",
          crr: data.teams.team2.runRate
        }
      });
      setScoreCard(data.scorecard.team1);
      setBowlingCard(data.bowlingcard.team2);
      setCommentary(data.commentary);
      setCurrentOver(data.current.thisOver);
      setLastOver(data.current.lastOver);
    }
  }, [data]);

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

  // Socket connection effect
  useEffect(() => {
    const newSocket = io(process.env.REACT_APP_BACKEND_URL);
    setSocket(newSocket);

    newSocket.on("connect", () => {
      console.log("Connected to server");
    });

    newSocket.on("cricket_update", (updatedData) => {
      setMatchData(updatedData);
    });

    return () => {
      newSocket.disconnect();
    };
  }, []);

  // Functions to update match data
  const updateBasicInfo = (field, value) => {
    setMatchData(prev => ({
      ...prev,
      data: {
        ...prev.data,
        basicInfo: {
          ...prev.data.basicInfo,
          [field]: value
        }
      }
    }));
  };

  const updateTeamInfo = (team, field, value) => {
    setMatchData(prev => ({
      ...prev,
      data: {
        ...prev.data,
        teams: {
          ...prev.data.teams,
          [team]: {
            ...prev.data.teams[team],
            [field]: value
          }
        }
      }
    }));
  };

  const updateCurrentPlay = (field, value) => {
    setMatchData(prev => ({
      ...prev,
      data: {
        ...prev.data,
        current: {
          ...prev.data.current,
          [field]: value
        }
      }
    }));
  };

  const updateScorecard = (team, playerIndex, field, value) => {
    setMatchData(prev => ({
      ...prev,
      data: {
        ...prev.data,
        scorecard: {
          ...prev.data.scorecard,
          [team]: prev.data.scorecard[team].map((player, index) => 
            index === playerIndex ? { ...player, [field]: value } : player
          )
        }
      }
    }));
  };

  const updateBowlingCard = (team, bowlerIndex, field, value) => {
    setMatchData(prev => ({
      ...prev,
      data: {
        ...prev.data,
        bowlingcard: {
          ...prev.data.bowlingcard,
          [team]: prev.data.bowlingcard[team].map((bowler, index) => 
            index === bowlerIndex ? { ...bowler, [field]: value } : bowler
          )
        }
      }
    }));
  };

  const addCommentary = (comment) => {
    const newComment = {
      text: comment,
      timestamp: new Date().toISOString(),
      time: new Date().toLocaleTimeString(),
      over: matchData.data.teams[selectedTeam].overs,
      inning: matchData.data.teams.team1.score !== "0/0" ? "1st Innings" : "2nd Innings",
      runs: 0,
      wickets: 0
    };

    setMatchData(prev => ({
      ...prev,
      data: {
        ...prev.data,
        commentary: [newComment, ...prev.data.commentary]
      }
    }));
  };

  const updateOvers = (team, overNumber, balls) => {
    setMatchData(prev => ({
      ...prev,
      data: {
        ...prev.data,
        overs: {
          ...prev.data.overs,
          [team]: prev.data.overs[team].map(over => 
            over.number === overNumber ? { ...over, balls } : over
          )
        }
      }
    }));
  };

  // Function to handle ball updates
  const handleBallUpdate = (runs, isWicket = false) => {
    const currentTeam = selectedTeam;
    const currentOver = matchData.data.teams[currentTeam].overs;
    const [fullOvers, balls] = currentOver.split('.').map(Number);
    
    // Update current over
    const newBalls = [...matchData.data.current.thisOver, runs];
    updateCurrentPlay('thisOver', newBalls);

    // Update score
    const [currentScore, currentWickets] = matchData.data.teams[currentTeam].score.split('/').map(Number);
    const newScore = `${currentScore + runs}/${currentWickets + (isWicket ? 1 : 0)}`;
    updateTeamInfo(currentTeam, 'score', newScore);

    // Update overs
    const newBallsCount = balls + 1;
    const newFullOvers = newBallsCount === 6 ? fullOvers + 1 : fullOvers;
    const newBallsRemaining = newBallsCount === 6 ? 0 : newBallsCount;
    const newOvers = `${newFullOvers}.${newBallsRemaining}`;
    updateTeamInfo(currentTeam, 'overs', newOvers);

    // Update run rate
    const runRate = ((currentScore + runs) / (newFullOvers + newBallsRemaining/6)).toFixed(2);
    updateTeamInfo(currentTeam, 'runRate', runRate);

    // If over is complete, update overs array
    if (newBallsCount === 6) {
      updateOvers(currentTeam, newFullOvers, newBalls);
      updateCurrentPlay('thisOver', []);
    }

    // Emit update to server
    if (socket) {
      socket.emit('cricket_update', matchData);
    }
  };

  // Function to handle wicket
  const handleWicket = () => {
    handleBallUpdate(0, true);
    // Additional wicket-specific logic can be added here
  };

  // Function to handle extra runs
  const handleExtra = (runs) => {
    handleBallUpdate(runs);
    // Additional extra-specific logic can be added here
  };

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
          <p className="text-center text-blue-100 dark:text-blue-200">{initialMatchData.data.basicInfo.venue}, </p>
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
            <h3 className="text-sm font-medium text-gray-600 dark:text-gray-300 mb-1">Current Run Rate</h3>
            <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{teamData[selectedTeam].crr}</p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow border border-gray-200 dark:border-gray-700">
            <h3 className="text-sm font-medium text-gray-600 dark:text-gray-300 mb-1">Target</h3>
            <p className="text-2xl font-bold text-green-600 dark:text-green-400">235</p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow border border-gray-200 dark:border-gray-700">
            <h3 className="text-sm font-medium text-gray-600 dark:text-gray-300 mb-1">Req. Run Rate</h3>
            <p className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">12.5</p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow border border-gray-200 dark:border-gray-700">
            <h3 className="text-sm font-medium text-gray-600 dark:text-gray-300 mb-1">Balls Remaining</h3>
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
              <h3 className="text-sm font-medium text-gray-600 dark:text-gray-300 mb-1">Last Over Runs</h3>
              <p className="text-xl font-bold text-blue-600 dark:text-blue-400">{lastOver.runs}</p>
            </div>
            <div className="bg-gray-100 dark:bg-gray-700 p-3 rounded-lg">
              <h3 className="text-sm font-medium text-gray-600 dark:text-gray-300 mb-1">Last Over Wickets</h3>
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
                  <h3 className="text-lg font-semibold mb-3 text-blue-600 dark:text-blue-300">Run Rate Comparison</h3>
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
                  <h3 className="text-lg font-semibold mb-3 text-blue-600 dark:text-blue-300">Win Probability</h3>
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
                <h3 className="text-xs font-medium text-gray-600 dark:text-gray-300 mb-1">Runs</h3>
                <p className="text-lg font-bold text-blue-600 dark:text-blue-400">72</p>
              </div>
              <div className="bg-gray-50 dark:bg-gray-700 p-2 rounded">
                <h3 className="text-xs font-medium text-gray-600 dark:text-gray-300 mb-1">Strike Rate</h3>
                <p className="text-lg font-bold text-green-600 dark:text-green-400">171.42</p>
              </div>
              <div className="bg-gray-50 dark:bg-gray-700 p-2 rounded">
                <h3 className="text-xs font-medium text-gray-600 dark:text-gray-300 mb-1">4s</h3>
                <p className="text-lg font-bold text-blue-600 dark:text-blue-400">6</p>
              </div>
              <div className="bg-gray-50 dark:bg-gray-700 p-2 rounded">
                <h3 className="text-xs font-medium text-gray-600 dark:text-gray-300 mb-1">6s</h3>
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
                <h3 className="text-xs font-medium text-gray-600 dark:text-gray-300 mb-1">Wickets</h3>
                <p className="text-lg font-bold text-red-600 dark:text-red-400">2</p>
              </div>
              <div className="bg-gray-50 dark:bg-gray-700 p-2 rounded">
                <h3 className="text-xs font-medium text-gray-600 dark:text-gray-300 mb-1">Economy</h3>
                <p className="text-lg font-bold text-yellow-600 dark:text-yellow-400">9.50</p>
              </div>
              <div className="bg-gray-50 dark:bg-gray-700 p-2 rounded">
                <h3 className="text-xs font-medium text-gray-600 dark:text-gray-300 mb-1">Overs</h3>
                <p className="text-lg font-bold text-blue-600 dark:text-blue-400">4.0</p>
              </div>
              <div className="bg-gray-50 dark:bg-gray-700 p-2 rounded">
                <h3 className="text-xs font-medium text-gray-600 dark:text-gray-300 mb-1">Runs</h3>
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
                <h3 className="text-xs font-medium text-gray-600 dark:text-gray-300 mb-1">Runs</h3>
                <p className="text-lg font-bold text-blue-600 dark:text-blue-400">45</p>
              </div>
              <div className="bg-gray-50 dark:bg-gray-700 p-2 rounded">
                <h3 className="text-xs font-medium text-gray-600 dark:text-gray-300 mb-1">Strike Rate</h3>
                <p className="text-lg font-bold text-green-600 dark:text-green-400">150.00</p>
              </div>
              <div className="bg-gray-50 dark:bg-gray-700 p-2 rounded">
                <h3 className="text-xs font-medium text-gray-600 dark:text-gray-300 mb-1">4s</h3>
                <p className="text-lg font-bold text-blue-600 dark:text-blue-400">5</p>
              </div>
              <div className="bg-gray-50 dark:bg-gray-700 p-2 rounded">
                <h3 className="text-xs font-medium text-gray-600 dark:text-gray-300 mb-1">6s</h3>
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
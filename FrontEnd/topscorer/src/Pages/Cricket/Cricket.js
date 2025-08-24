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
            venue: "",
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
            thisOver: [
                { value: 1, type: 'normal', extra: false, isWicket: false },
                { value: 1, type: 'normal', extra: false, isWicket: false },
                { value: 1, type: 'normal', extra: false, isWicket: false },
                { value: 0, type: 'normal', extra: false, isWicket: false },
                { value: 3, type: 'normal', extra: false, isWicket: false },
                { value: 4, type: 'normal', extra: false, isWicket: false }
            ],
            partnership: "0 (0)",
            lastOver: { 
                runs: 10, 
                wickets: 1,
                balls: [
                    { value: 1, type: 'normal', extra: false, isWicket: false },
                    { value: 2, type: 'normal', extra: false, isWicket: false },
                    { value: 0, type: 'normal', extra: false, isWicket: false },
                    { value: 4, type: 'normal', extra: false, isWicket: false },
                    { value: 2, type: 'normal', extra: false, isWicket: false },
                    { value: 1, type: 'W', extra: false, isWicket: true, dismissalType: 'Bowled', dismissalInfo: 'b Ramesh' }
                ]
            },
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
                    balls: [
                        { value: 1, type: 'normal', extra: false, isWicket: false },
                        { value: 2, type: 'normal', extra: false, isWicket: false },
                        { value: 0, type: 'normal', extra: false, isWicket: false },
                        { value: 4, type: 'normal', extra: false, isWicket: false },
                        { value: 2, type: 'normal', extra: false, isWicket: false },
                        { value: 1, type: 'W', extra: false, isWicket: true, dismissalType: 'Bowled', dismissalInfo: 'b Ramesh' }
                    ],
                    runs: 10,
                    wickets: 1
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
  const [loading, setLoading] = useState(false);
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
      logo: initialData.teams.team1.logo || "https://upload.wikimedia.org/wikipedia/en/8/83/Indian_Institute_of_Information_Technology%2C_Una_logo.png",
      score: initialData.teams.team1.score,
      overs: initialData.teams.team1.overs,
      runRate: initialData.teams.team1.runRate,
      isBatting: initialData.teams.team1.score !== "0/0",
      crr: initialData.teams.team1.runRate
    },
    team2: {
      name: initialData.teams.team2.name,
      shortName: initialData.teams.team2.name.substring(0, 3).toUpperCase(),
      logo: initialData.teams.team2.logo || "https://upload.wikimedia.org/wikipedia/en/4/49/IIIT_Sri_City_Logo.png",
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

  // Calculate required run rate
  const calculateRequiredRunRate = (battingTeam, bowlingTeam) => {
    if (battingTeam.score === "0/0") return "N/A";
    
    const [runsScored, wickets] = battingTeam.score.split('/').map(Number);
    const [targetRuns] = bowlingTeam.score.split('/').map(Number);
    const oversBowled = parseFloat(battingTeam.overs) || 0;
    const totalOvers = parseFloat(matchData.data.basicInfo.maxOvers) || 20;
    const ballsBowled = Math.floor(oversBowled) * 6 + ((oversBowled % 1) * 10);
    const ballsRemaining = (totalOvers * 6) - ballsBowled;
    
    if (ballsRemaining <= 0) return "Match Over";
    
    const runsNeeded = targetRuns - runsScored + 1;
    if (runsNeeded <= 0) return "0.00";
    
    const requiredRate = (runsNeeded / (ballsRemaining / 6)).toFixed(2);
    return requiredRate;
  };

  // Update states when data prop changes
  useEffect(() => {
    if (data) {
      const updatedData = { ...data };
      
      // Calculate required run rates
      const team1RR = calculateRequiredRunRate(data.teams.team1, data.teams.team2);
      const team2RR = calculateRequiredRunRate(data.teams.team2, data.teams.team1);
      
      setMatchData({ 
        name: "Cricket", 
        data: {
          ...updatedData,
          teams: {
            team1: { ...updatedData.teams.team1, requiredRate: team1RR },
            team2: { ...updatedData.teams.team2, requiredRate: team2RR }
          }
        } 
      });
      
      setTeamData({
        team1: {
          name: data.teams.team1.name,
          shortName: data.teams.team1.name.substring(0, 3).toUpperCase(),
          logo: data.teams.team1.logo || "https://upload.wikimedia.org/wikipedia/en/8/83/Indian_Institute_of_Information_Technology%2C_Una_logo.png",
          score: data.teams.team1.score,
          overs: data.teams.team1.overs,
          runRate: data.teams.team1.runRate,
          requiredRate: team1RR,
          isBatting: data.teams.team1.score !== "0/0",
          crr: data.teams.team1.runRate
        },
        team2: {
          name: data.teams.team2.name,
          shortName: data.teams.team2.name.substring(0, 3).toUpperCase(),
          logo: data.teams.team2.logo || "https://upload.wikimedia.org/wikipedia/en/4/49/IIIT_Sri_City_Logo.png",
          score: data.teams.team2.score,
          overs: data.teams.team2.overs,
          runRate: data.teams.team2.runRate,
          requiredRate: team2RR,
          isBatting: data.teams.team2.score !== "0/0",
          crr: data.teams.team2.runRate
        }
      });
      
      // Filter out empty commentary entries
      const validCommentary = Array.isArray(data.commentary) 
        ? data.commentary.filter(comment => 
            comment && 
            (comment.text || '').trim() !== '' && 
            (comment.time || '').trim() !== ''
          )
        : [];
      
      setScoreCard(data.scorecard.team1);
      setBowlingCard(data.bowlingcard.team2);
      setCommentary(validCommentary);
      setCurrentOver(data.current.thisOver);
      setLastOver(data.current.lastOver);
      
      // Update match status
      const team1Score = data.teams.team1.score;
      const team2Score = data.teams.team2.score;
      if (team1Score === "0/0" && team2Score === "0/0") {
        setMatchStatus("Match not started");
      } else if (team1Score !== "0/0" && team2Score === "0/0") {
        setMatchStatus(`${data.teams.team1.name} batting`);
      } else if (team1Score !== "0/0" && team2Score !== "0/0") {
        const [runs1] = team1Score.split('/').map(Number);
        const [runs2] = team2Score.split('/').map(Number);
        const remainingRuns = runs1 - runs2;
        const remainingBalls = (data.basicInfo.maxOvers * 6) - 
          (parseFloat(data.teams.team2.overs) * 6);
        setMatchStatus(`${data.teams.team2.name} need ${remainingRuns} runs in ${remainingBalls} balls`);
      } else {
        setMatchStatus("Match in progress");
      }
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

  // Socket connection effect with error handling
  useEffect(() => {
    if (!process.env.REACT_APP_BACKEND_URL) {
      console.error("Backend URL is not configured");
      return;
    }

    const newSocket = io(process.env.REACT_APP_BACKEND_URL, {
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      timeout: 10000,
      transports: ['websocket']
    });

    const onConnect = () => {
      console.log("Connected to WebSocket server");
    };

    const onDisconnect = (reason) => {
      console.log("Disconnected from WebSocket server:", reason);
      if (reason === 'io server disconnect') {
        newSocket.connect();
      }
    };

    const onConnectError = (error) => {
      console.error("WebSocket connection error:", error);
    };

    const onCricketUpdate = (updatedData) => {
      try {
        // Use the requiredRate from the server if available, otherwise calculate it
        const team1RR = updatedData.data.teams.team1.requiredRate || 
                       calculateRequiredRunRate(updatedData.data.teams.team1, updatedData.data.teams.team2);
        const team2RR = updatedData.data.teams.team2.requiredRate || 
                       calculateRequiredRunRate(updatedData.data.teams.team2, updatedData.data.teams.team1);
        
        // Ensure requiredRate is included in the data
        const updatedWithRR = {
          ...updatedData,
          data: {
            ...updatedData.data,
            teams: {
              team1: { 
                ...updatedData.data.teams.team1, 
                requiredRate: team1RR 
              },
              team2: { 
                ...updatedData.data.teams.team2, 
                requiredRate: team2RR 
              }
            }
          }
        };
        
        setMatchData(updatedWithRR);
        
        // Update team data with required run rates
        setTeamData({
          team1: {
            ...updatedData.data.teams.team1,
            requiredRate: team1RR,
            shortName: updatedData.data.teams.team1.name.substring(0, 3).toUpperCase(),
            isBatting: updatedData.data.teams.team1.score !== "0/0"
          },
          team2: {
            ...updatedData.data.teams.team2,
            requiredRate: team2RR,
            shortName: updatedData.data.teams.team2.name.substring(0, 3).toUpperCase(),
            isBatting: updatedData.data.teams.team2.score !== "0/0"
          }
        });
        
        // Update other states
        setScoreCard(updatedData.data.scorecard.team1);
        setBowlingCard(updatedData.data.bowlingcard.team2);
        
        // Filter out empty commentary entries
        const validCommentary = Array.isArray(updatedData.data.commentary) 
          ? updatedData.data.commentary.filter(comment => 
              comment && 
              (comment.text || '').trim() !== '' && 
              (comment.time || '').trim() !== ''
            )
          : [];
        
        setCommentary(validCommentary);
        setCurrentOver(updatedData.data.current.thisOver);
        setLastOver(updatedData.data.current.lastOver);
        
      } catch (error) {
        console.error("Error processing update:", error);
      }
    };

    // Set up event listeners
    newSocket.on('connect', onConnect);
    newSocket.on('disconnect', onDisconnect);
    newSocket.on('connect_error', onConnectError);
    newSocket.on('cricket_update', onCricketUpdate);

    setSocket(newSocket);

    // Cleanup function
    return () => {
      if (newSocket) {
        newSocket.off('connect', onConnect);
        newSocket.off('disconnect', onDisconnect);
        newSocket.off('connect_error', onConnectError);
        newSocket.off('cricket_update', onCricketUpdate);
        
        if (newSocket.connected) {
          newSocket.disconnect();
        }
      }
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
    if (!comment || comment.trim() === '') return;
    
    const now = new Date();
    const currentInning = matchData.data.teams.team1.score !== "0/0" ? "1st Innings" : "2nd Innings";
    const currentOver = matchData.data.teams[selectedTeam].overs;
    
    const newComment = {
      text: comment.trim(),
      timestamp: now.toISOString(),
      time: now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      over: currentOver,
      inning: currentInning,
      runs: 0,
      wickets: 0
    };

    // Filter out any empty or invalid comments before adding new one
    const currentCommentary = Array.isArray(matchData.data.commentary) 
      ? matchData.data.commentary.filter(c => c && c.text && c.time)
      : [];

    setMatchData(prev => ({
      ...prev,
      data: {
        ...prev.data,
        commentary: [newComment, ...currentCommentary].slice(0, 50) // Keep last 50 comments
      }
    }));
    
    // Also update the local commentary state
    setCommentary(prev => [newComment, ...prev].slice(0, 50));
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
  const handleBallUpdate = (runs, isWicket = false, extraType = null, dismissalType = null, dismissalInfo = null) => {
    const currentTeam = selectedTeam;
    const currentOver = matchData.data.teams[currentTeam].overs;
    const [fullOvers, balls] = currentOver.split('.').map(Number);
    
    // Create ball object with detailed information
    const ballObject = {
        value: runs,
        type: extraType || (isWicket ? 'W' : 'normal'),
        extra: extraType ? true : false,
        isWicket: isWicket,
        dismissalType: dismissalType,
        dismissalInfo: dismissalInfo
    };

    // Update current over with the new ball object
    const newBalls = [...matchData.data.current.thisOver, ballObject];
    updateCurrentPlay('thisOver', newBalls);

    // Update score
    const [currentScore, currentWickets] = matchData.data.teams[currentTeam].score.split('/').map(Number);
    const newScore = `${currentScore + runs}/${currentWickets + (isWicket ? 1 : 0)}`;
    updateTeamInfo(currentTeam, 'score', newScore);

    // Update overs (only increment ball count for non-extra deliveries)
    if (!extraType) {
        const newBallsCount = balls + 1;
        const newFullOvers = newBallsCount === 6 ? fullOvers + 1 : fullOvers;
        const newBallsRemaining = newBallsCount === 6 ? 0 : newBallsCount;
        const newOvers = `${newFullOvers}.${newBallsRemaining}`;
        updateTeamInfo(currentTeam, 'overs', newOvers);

        // If over is complete, update last over data and reset current over
        if (newBallsCount === 6) {
            const lastOverRuns = newBalls.reduce((sum, ball) => sum + ball.value, 0);
            const lastOverWickets = newBalls.filter(ball => ball.isWicket).length;
            
            updateCurrentPlay('lastOver', {
                runs: lastOverRuns,
                wickets: lastOverWickets,
                balls: newBalls
            });
            
            // Add the completed over to the overs array
            const newOver = {
                number: newFullOvers,
                balls: newBalls,
                runs: lastOverRuns,
                wickets: lastOverWickets
            };
            
            setMatchData(prev => ({
                ...prev,
                data: {
                    ...prev.data,
                    overs: {
                        ...prev.data.overs,
                        [currentTeam]: [...prev.data.overs[currentTeam], newOver]
                    }
                }
            }));
            
            // Reset current over
            updateCurrentPlay('thisOver', []);
        }
    }

    // Update run rate
    const runRate = ((currentScore + runs) / (parseFloat(currentOver) + (!extraType ? 1/6 : 0))).toFixed(2);
    updateTeamInfo(currentTeam, 'runRate', runRate);

    // Emit update to server
    if (socket) {
        socket.emit('cricket_update', matchData);
    }
  };

  // Function to handle wicket
  const handleWicket = (dismissalType = 'Bowled', dismissalInfo = null) => {
    handleBallUpdate(0, true, null, dismissalType, dismissalInfo);
  };

  // Function to handle extra runs
  const handleExtra = (runs, extraType) => {
    handleBallUpdate(runs, false, extraType);
  };

  // Function to handle no ball
  const handleNoBall = (runs = 0) => {
    handleExtra(runs, 'nb');
  };

  // Function to handle wide ball
  const handleWideBall = (runs = 0) => {
    handleExtra(runs, 'wd');
  };

  // Function to handle bye
  const handleBye = (runs) => {
    handleExtra(runs, 'b');
  };

  // Function to handle leg bye
  const handleLegBye = (runs) => {
    handleExtra(runs, 'lb');
  };

  // Function to handle run out
  const handleRunOut = (runs, dismissalInfo) => {
    handleBallUpdate(runs, true, null, 'Run Out', dismissalInfo);
  };

  // Generate run rate data for a specific team
  const generateTeamRunRateData = (teamKey) => {
    const data = [];
    
    // Get team scores and overs
    const teamScore = matchData.data.teams[teamKey].score;
    const teamOvers = parseFloat(matchData.data.teams[teamKey].overs);
    
    // Extract runs from scores
    const teamRuns = teamScore !== "0/0" ? parseInt(teamScore.split('/')[0]) : 0;
    
    // Check if we have over-by-over data
    const hasOverData = matchData.data.overs[teamKey] && matchData.data.overs[teamKey].length > 0;
    
    if (hasOverData) {
      // Use actual over-by-over data
      
      // Get all over numbers
      const overNumbers = matchData.data.overs[teamKey].map(over => over.number);
      
      // Sort over numbers
      const sortedOverNumbers = overNumbers.sort((a, b) => a - b);
      
      // Create data points for each over
      sortedOverNumbers.forEach(overNumber => {
        const dataPoint = { over: overNumber };
        
        // Calculate runs at this over
        let runsAtOver = 0;
        for (const overData of matchData.data.overs[teamKey]) {
          if (overData.number <= overNumber) {
            runsAtOver += overData.runs;
          }
        }
        dataPoint.runs = runsAtOver;
        
        data.push(dataPoint);
      });
      
      // Add current over data if it's incomplete (has balls played but not a full over)
      const currentBalls = teamOvers % 1 !== 0 ? teamOvers : null;
      
      if (currentBalls) {
        const currentOverNumber = Math.floor(teamOvers) + 1;
        
        // Only add if this over number isn't already in the data
        if (!sortedOverNumbers.includes(currentOverNumber)) {
          const currentDataPoint = { 
            over: currentOverNumber,
            runs: teamRuns,
            isCurrentOver: true // Flag to identify current incomplete over
          };
          
          data.push(currentDataPoint);
        }
      }
    } else {
      // If no over-by-over data, create a single data point with current score
      if (teamOvers > 0) {
        const dataPoint = { 
          over: Math.ceil(teamOvers),
          runs: teamRuns,
          isCurrentOver: true // Flag to identify current incomplete over
        };
        
        data.push(dataPoint);
      } else {
        // If team hasn't started batting yet
        data.push({ over: 0, runs: 0 });
      }
    }
    
    return data;
  };

  // Generate data for both teams
  const team1RunRateData = generateTeamRunRateData('team1');
  const team2RunRateData = generateTeamRunRateData('team2');

  // Calculate win probability using Bayes' theorem
  const calculateWinProbability = () => {
    // Get team scores and wickets
    const team1Score = matchData.data.teams.team1.score;
    const team2Score = matchData.data.teams.team2.score;
    
    // Extract runs and wickets
    const [team1Runs, team1Wickets] = team1Score !== "0/0" ? team1Score.split('/').map(Number) : [0, 0];
    const [team2Runs, team2Wickets] = team2Score !== "0/0" ? team2Score.split('/').map(Number) : [0, 0];
    
    // Get overs played
    const team1Overs = parseFloat(matchData.data.teams.team1.overs);
    const team2Overs = parseFloat(matchData.data.teams.team2.overs);
    
    // Get max overs
    const maxOvers = matchData.data.basicInfo.maxOvers;
    
    // Determine which team is batting
    const isTeam1Batting = team1Score !== "0/0" && team2Score === "0/0";
    const isTeam2Batting = team1Score !== "0/0" && team2Score !== "0/0";
    
    // If match hasn't started or first innings is complete
    if (team1Score === "0/0" || (isTeam2Batting && team2Overs === 0)) {
      return 50; // Equal probability at the start
    }
    
    // Calculate run rates
    const team1RunRate = team1Overs > 0 ? team1Runs / team1Overs : 0;
    const team2RunRate = team2Overs > 0 ? team2Runs / team2Overs : 0;
    
    // Calculate required run rate for team 2
    const remainingRuns = team1Runs - team2Runs + 1;
    const remainingOvers = maxOvers - team2Overs;
    const requiredRunRate = remainingOvers > 0 ? remainingRuns / remainingOvers : 0;
    
    // Calculate historical win probabilities based on different factors
    
    // 1. Run Rate Factor (P(Win|RunRate))
    let runRateProbability = 0;
    
    if (isTeam1Batting) {
      // For first innings, higher run rate = higher probability of winning
      // Historical data shows teams with run rate > 8 win ~70% of the time
      // Teams with run rate < 5 win ~30% of the time
      if (team1RunRate >= 8) {
        runRateProbability = 0.7;
      } else if (team1RunRate >= 6) {
        runRateProbability = 0.6;
      } else if (team1RunRate >= 5) {
        runRateProbability = 0.5;
      } else {
        runRateProbability = 0.3;
      }
    } else {
      // For second innings, compare current run rate to required run rate
      if (team2RunRate > requiredRunRate * 1.2) {
        // Well ahead of required rate
        runRateProbability = 0.8;
      } else if (team2RunRate > requiredRunRate) {
        // Just ahead of required rate
        runRateProbability = 0.6;
      } else if (team2RunRate > requiredRunRate * 0.8) {
        // Slightly behind required rate
        runRateProbability = 0.4;
      } else {
        // Well behind required rate
        runRateProbability = 0.2;
      }
    }
    
    // 2. Wicket Factor (P(Win|Wickets))
    const maxWickets = 10;
    let wicketProbability = 0;
    
    if (isTeam1Batting) {
      // For first innings, fewer wickets = higher probability
      const wicketRatio = team1Wickets / maxWickets;
      if (wicketRatio <= 0.2) {
        wicketProbability = 0.7; // 0-2 wickets
      } else if (wicketRatio <= 0.4) {
        wicketProbability = 0.6; // 3-4 wickets
      } else if (wicketRatio <= 0.6) {
        wicketProbability = 0.5; // 5-6 wickets
      } else if (wicketRatio <= 0.8) {
        wicketProbability = 0.4; // 7-8 wickets
      } else {
        wicketProbability = 0.3; // 9-10 wickets
      }
    } else {
      // For second innings, fewer wickets = higher probability
      const wicketRatio = team2Wickets / maxWickets;
      if (wicketRatio <= 0.2) {
        wicketProbability = 0.8; // 0-2 wickets
      } else if (wicketRatio <= 0.4) {
        wicketProbability = 0.7; // 3-4 wickets
      } else if (wicketRatio <= 0.6) {
        wicketProbability = 0.6; // 5-6 wickets
      } else if (wicketRatio <= 0.8) {
        wicketProbability = 0.5; // 7-8 wickets
      } else {
        wicketProbability = 0.4; // 9-10 wickets
      }
    }
    
    // 3. Overs Remaining Factor (P(Win|OversRemaining))
    let oversProbability = 0;
    
    if (isTeam1Batting) {
      // For first innings, more overs = higher probability
      const oversRatio = team1Overs / maxOvers;
      if (oversRatio <= 0.2) {
        oversProbability = 0.4; // Early in innings
      } else if (oversRatio <= 0.4) {
        oversProbability = 0.5; // Early-middle
      } else if (oversRatio <= 0.6) {
        oversProbability = 0.6; // Middle
      } else if (oversRatio <= 0.8) {
        oversProbability = 0.7; // Middle-late
      } else {
        oversProbability = 0.8; // Late
      }
    } else {
      // For second innings, more overs = higher probability if ahead of rate
      const oversRatio = team2Overs / maxOvers;
      if (team2RunRate > requiredRunRate) {
        // Ahead of rate, more overs = higher probability
        if (oversRatio <= 0.2) {
          oversProbability = 0.5;
        } else if (oversRatio <= 0.4) {
          oversProbability = 0.6;
        } else if (oversRatio <= 0.6) {
          oversProbability = 0.7;
        } else if (oversRatio <= 0.8) {
          oversProbability = 0.8;
        } else {
          oversProbability = 0.9;
        }
      } else {
        // Behind rate, more overs = lower probability
        if (oversRatio <= 0.2) {
          oversProbability = 0.6;
        } else if (oversRatio <= 0.4) {
          oversProbability = 0.5;
        } else if (oversRatio <= 0.6) {
          oversProbability = 0.4;
        } else if (oversRatio <= 0.8) {
          oversProbability = 0.3;
        } else {
          oversProbability = 0.2;
        }
      }
    }
    
    // 4. Target Factor (P(Win|Target)) - Only for second innings
    let targetProbability = 0.5; // Default value
    
    if (isTeam2Batting) {
      // For second innings, consider the target
      const targetRatio = team2Runs / team1Runs;
      if (targetRatio >= 0.9) {
        targetProbability = 0.8; // Very close to target
      } else if (targetRatio >= 0.7) {
        targetProbability = 0.6; // Close to target
      } else if (targetRatio >= 0.5) {
        targetProbability = 0.5; // Halfway to target
      } else if (targetRatio >= 0.3) {
        targetProbability = 0.4; // Far from target
      } else {
        targetProbability = 0.3; // Very far from target
      }
    }
    
    // Apply Bayes' theorem to combine probabilities
    // P(Win) = P(Win|RunRate) * P(Win|Wickets) * P(Win|Overs) * P(Win|Target) / P(Evidence)
    // We'll use a weighted average approach for simplicity
    
    let finalProbability;
    
    if (isTeam1Batting) {
      // For first innings, we don't have target probability
      finalProbability = (
        runRateProbability * 0.4 + 
        wicketProbability * 0.3 + 
        oversProbability * 0.3
      ) * 100;
    } else {
      // For second innings, include target probability
      finalProbability = (
        runRateProbability * 0.35 + 
        wicketProbability * 0.25 + 
        oversProbability * 0.2 +
        targetProbability * 0.2
      ) * 100;
    }
    
    // Ensure probability is between 0 and 100
    return Math.min(100, Math.max(0, Math.round(finalProbability)));
  };

  const winProbability = calculateWinProbability();

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
      <div className="flex flex-col items-center justify-center">
        <div className="flex items-center">
          <FaTrophy className="text-3xl text-blue-500 mr-2" />
          <h1 className="text-2xl font-bold">Cricket Live</h1>
        </div>
        <div className="flex items-center space-x-4 mt-2">
          <Options cur_link="/dashboard/cricket" archived="/dashboard/cricket_archived" />
        </div>
      </div>


        {/* Match Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-900 dark:to-indigo-900 p-6 rounded-xl shadow-lg border border-blue-500 dark:border-blue-700">
          <h1 className="text-2xl font-bold text-center mb-2">
            {teamData.team1.name} vs {teamData.team2.name} 
          </h1>
          <p className="text-center text-blue-100 dark:text-blue-200">
            {matchData.data.basicInfo.venue || 'Venue not set'}, 
          </p>
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
            <p className="text-2xl font-bold text-green-600 dark:text-green-400">
              {matchData.data.teams.team1.score !== "0/0" ? 
                parseInt(matchData.data.teams.team1.score.split('/')[0]) + 1 : 
                "N/A"}
            </p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow border border-gray-200 dark:border-gray-700">
            <h3 className="text-sm font-medium text-gray-600 dark:text-gray-300 mb-1">Req. Run Rate</h3>
            <p className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
              {matchData.data.teams.team1.score !== "0/0" && matchData.data.teams.team2.score !== "0/0" ?
                ((parseInt(matchData.data.teams.team1.score.split('/')[0]) - 
                  parseInt(matchData.data.teams.team2.score.split('/')[0]) + 1) / 
                 (matchData.data.basicInfo.maxOvers - parseFloat(matchData.data.teams.team2.overs))).toFixed(2) :
                "N/A"}
            </p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow border border-gray-200 dark:border-gray-700">
            <h3 className="text-sm font-medium text-gray-600 dark:text-gray-300 mb-1">Balls Remaining</h3>
            <p className="text-2xl font-bold text-red-600 dark:text-red-400">
              {(() => {
                const battingTeam = matchData.data.teams.team1.score !== "0/0" ? "team1" : "team2";
                const [fullOvers, balls] = matchData.data.teams[battingTeam].overs.split('.').map(Number);
                const totalBallsPlayed = (fullOvers * 6) + (balls || 0);
                const maxBalls = matchData.data.basicInfo.maxOvers * 6;
                return Math.max(0, maxBalls - totalBallsPlayed);
              })()}
            </p>
          </div>
        </div>

        {/* Current Over Section */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
          <h3 className="text-xl font-bold mb-4 text-blue-600 dark:text-blue-300">Current Over</h3>
          <div className="flex flex-wrap gap-3 mb-6 justify-center">
            {currentOver.map((ball, index) => (
              <div key={index} className="relative">
                <div className={`w-14 h-14 rounded-full flex flex-col items-center justify-center text-lg font-bold border-2 
                  ${ball.type === 'W' ? 'bg-red-100 dark:bg-red-900 border-red-500 dark:border-red-700' : 
                    ball.type === 'nb' ? 'bg-yellow-100 dark:bg-yellow-900 border-yellow-500 dark:border-yellow-700' :
                    ball.type === 'wd' ? 'bg-orange-100 dark:bg-orange-900 border-orange-500 dark:border-orange-700' :
                    ball.type === 'b' || ball.type === 'lb' ? 'bg-pink-100 dark:bg-pink-900 border-pink-500 dark:border-pink-700' :
                    ball.value === 4 ? 'bg-blue-100 dark:bg-blue-900 border-blue-500 dark:border-blue-700' : 
                    ball.value === 6 ? 'bg-purple-100 dark:bg-purple-900 border-purple-500 dark:border-purple-700' : 
                    ball.value === 0 ? 'bg-gray-100 dark:bg-gray-700 border-gray-300 dark:border-gray-600' : 
                    'bg-green-100 dark:bg-green-900 border-green-500 dark:border-green-700'}`}>
                  {ball.extra ? (
                    <>
                      <div className="text-xs font-semibold">{ball.type.toUpperCase()}</div>
                      <div className="text-sm">{ball.value}</div>
                      {ball.isWicket && (
                        <div className="text-xs text-red-600 dark:text-red-400">W</div>
                      )}
                    </>
                  ) : ball.isWicket ? (
                    <>
                      <div className="text-xs font-semibold">{ball.dismissalType}</div>
                      <div className="text-sm text-red-600 dark:text-red-400">W</div>
                      {ball.dismissalInfo && (
                        <div className="text-[10px] text-gray-600 dark:text-gray-400">{ball.dismissalInfo}</div>
                      )}
                    </>
                  ) : (
                    <div className="text-base">{ball.value}</div>
                  )}
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
              <p className="text-xl font-bold text-blue-600 dark:text-blue-400">
                {matchData.data.current.lastOver.runs}
              </p>
            </div>
            <div className="bg-gray-100 dark:bg-gray-700 p-3 rounded-lg">
              <h3 className="text-sm font-medium text-gray-600 dark:text-gray-300 mb-1">Last Over Wickets</h3>
              <p className="text-xl font-bold text-red-600 dark:text-red-400">
                {matchData.data.current.lastOver.wickets}
              </p>
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
            <FaUserFriends className="text-lg md:text-base md:mr-2" />
            <span className="hidden md:inline">Scorecard</span>
          </button>
          <button 
            className={`flex-1 py-2 px-4 rounded-md flex items-center justify-center ${
              activeTab === "bowling" 
                ? 'bg-blue-600 text-white' 
                : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
            }`}
            onClick={() => setActiveTab("bowling")}
          >
            <FaTrophy className="text-lg md:text-base md:mr-2" />
            <span className="hidden md:inline">Bowling</span>
          </button>
          <button 
            className={`flex-1 py-2 px-4 rounded-md flex items-center justify-center ${
              activeTab === "commentary" 
                ? 'bg-blue-600 text-white' 
                : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
            }`}
            onClick={() => setActiveTab("commentary")}
          >
            <FaHistory className="text-lg md:text-base md:mr-2" />
            <span className="hidden md:inline">Commentary</span>
          </button>
          <button 
            className={`flex-1 py-2 px-4 rounded-md flex items-center justify-center ${
              activeTab === "stats" 
                ? 'bg-blue-600 text-white' 
                : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
            }`}
            onClick={() => setActiveTab("stats")}
          >
            <FaChartLine className="text-lg md:text-base md:mr-2" />
            <span className="hidden md:inline">Stats</span>
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
                    {bowlingCard.map((bowler, index) => (
                      <tr key={index} className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                        <td className="p-3">{bowler.name}</td>
                        <td className="p-3">{bowler.overs}</td>
                        <td className="p-3">{bowler.maidens}</td>
                        <td className="p-3">{bowler.runs}</td>
                        <td className="p-3">{bowler.wickets}</td>
                        <td className="p-3">{bowler.economy}</td>
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
                {commentary.length > 0 ? (
                  commentary.map((item, index) => {
                    // Skip rendering if the item is empty or contains only zeros
                    if (!item || (item.text === '00' && !item.runs && !item.wickets)) {
                      return null;
                    }
                    
                    // Format the over display to show only the over number without trailing .00
                    const overDisplay = item.over ? `Over ${item.over.toString().replace(/\.00$/, '')}` : '';
                    
                    return (
                      <div key={index} className="flex items-start space-x-3">
                        <div className="w-16 text-sm font-medium text-blue-600 dark:text-blue-300">
                          {overDisplay}
                        </div>
                        <div className={`flex-1 p-3 rounded-lg ${
                          item.wickets 
                            ? 'bg-red-50 dark:bg-red-900/50 border border-red-200 dark:border-red-800' 
                            : 'bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600'
                        }`}>
                          <p className="text-sm">{item.text}</p>
                          {item.runs > 0 && (
                            <span className="text-xs text-green-600 dark:text-green-400 mr-2">
                              +{item.runs} run{item.runs !== 1 ? 's' : ''}
                            </span>
                          )}
                          {item.wickets > 0 && (
                            <span className="text-xs text-red-600 dark:text-red-400">
                              -{item.wickets} wicket{item.wickets !== 1 ? 's' : ''}
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="text-center py-4 text-gray-500 dark:text-gray-400">
                    No commentary available yet.
                  </div>
                )}
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
                      <LineChart 
                        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? "#4B5563" : "#E5E7EB"} />
                        <XAxis 
                          dataKey="over" 
                          label={{ 
                            value: 'Overs', 
                            position: 'insideBottom', 
                            fill: darkMode ? '#93C5FD' : '#3B82F6',
                            offset: -5
                          }} 
                          stroke={darkMode ? "#9CA3AF" : "#6B7280"} 
                          tick={{ fill: darkMode ? "#9CA3AF" : "#6B7280" }}
                        />
                        <YAxis 
                          stroke={darkMode ? "#9CA3AF" : "#6B7280"} 
                          tick={{ fill: darkMode ? "#9CA3AF" : "#6B7280" }}
                          label={{ 
                            value: 'Runs', 
                            angle: -90, 
                            position: 'insideLeft',
                            fill: darkMode ? '#93C5FD' : '#3B82F6',
                            offset: 10
                          }}
                        />
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: darkMode ? '#1F2937' : '#FFFFFF', 
                            border: `1px solid ${darkMode ? '#374151' : '#E5E7EB'}`, 
                            color: darkMode ? '#F3F4F6' : '#1F2937',
                            borderRadius: '0.5rem'
                          }} 
                          labelStyle={{ color: darkMode ? '#93C5FD' : '#3B82F6' }}
                        />
                        <Legend 
                          wrapperStyle={{ 
                            color: darkMode ? '#F3F4F6' : '#1F2937',
                            paddingTop: '10px'
                          }} 
                        />
                        <Line 
                          data={team1RunRateData}
                          type="monotone" 
                          dataKey="runs" 
                          stroke="#3B82F6" 
                          name={teamData.team1.name} 
                          strokeWidth={2}
                          dot={{ r: 4 }}
                          activeDot={{ r: 6 }}
                          connectNulls={true}
                          isAnimationActive={false}
                        />
                        <Line 
                          data={team2RunRateData}
                          type="monotone" 
                          dataKey="runs" 
                          stroke="#F59E0B" 
                          name={teamData.team2.name} 
                          strokeWidth={2}
                          dot={{ r: 4 }}
                          activeDot={{ r: 6 }}
                          connectNulls={true}
                          isAnimationActive={false}
                        />
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
                  <div className="mt-4 text-center text-sm text-gray-600 dark:text-gray-400">
                    {matchData.data.teams.team1.score !== "0/0" && matchData.data.teams.team2.score === "0/0" ? (
                      <p>{teamData.team1.name} has a {winProbability}% chance of winning based on current performance</p>
                    ) : matchData.data.teams.team1.score !== "0/0" && matchData.data.teams.team2.score !== "0/0" ? (
                      <p>{teamData.team2.name} has a {winProbability}% chance of winning based on current performance</p>
                    ) : (
                      <p>Match hasn't started yet</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Player Performance Cards */}
        <div className="grid md:grid-cols-3 gap-4">
          {/* Current Batsmen */}
          {scoreCard.map((player, index) => (
            <div key={index} className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow border border-gray-200 dark:border-gray-700">
              <div className="flex items-center mb-3">
                <img 
                  src={teamData[selectedTeam].logo || `https://img.icons8.com/color/96/${teamData[selectedTeam].name.toLowerCase().replace(/\s+/g, '')}.png`} 
                  className="h-10 w-10 mr-3" 
                  alt={teamData[selectedTeam].name} 
                />
                <div>
                  <h3 className="font-bold text-blue-600 dark:text-blue-300">{player.name}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {player.isOut ? 'Out' : 'Batting'} • {player.strikeRate} SR
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="bg-gray-50 dark:bg-gray-700 p-2 rounded">
                  <h3 className="text-xs font-medium text-gray-600 dark:text-gray-300 mb-1">Runs</h3>
                  <p className="text-lg font-bold text-blue-600 dark:text-blue-400">{player.runs}</p>
                </div>
                <div className="bg-gray-50 dark:bg-gray-700 p-2 rounded">
                  <h3 className="text-xs font-medium text-gray-600 dark:text-gray-300 mb-1">Balls</h3>
                  <p className="text-lg font-bold text-green-600 dark:text-green-400">{player.balls}</p>
                </div>
                <div className="bg-gray-50 dark:bg-gray-700 p-2 rounded">
                  <h3 className="text-xs font-medium text-gray-600 dark:text-gray-300 mb-1">4s</h3>
                  <p className="text-lg font-bold text-blue-600 dark:text-blue-400">{player.fours}</p>
                </div>
                <div className="bg-gray-50 dark:bg-gray-700 p-2 rounded">
                  <h3 className="text-xs font-medium text-gray-600 dark:text-gray-300 mb-1">6s</h3>
                  <p className="text-lg font-bold text-purple-600 dark:text-purple-400">{player.sixes}</p>
                </div>
              </div>
            </div>
          ))}
          
          {/* Current Bowler */}
          {bowlingCard.map((bowler, index) => (
            <div key={index} className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow border border-gray-200 dark:border-gray-700">
              <div className="flex items-center mb-3">
                <img 
                  src={teamData[selectedTeam === "team1" ? "team2" : "team1"].logo || 
                    `https://img.icons8.com/color/96/${teamData[selectedTeam === "team1" ? "team2" : "team1"].name.toLowerCase().replace(/\s+/g, '')}.png`} 
                  className="h-10 w-10 mr-3" 
                  alt={teamData[selectedTeam === "team1" ? "team2" : "team1"].name} 
                />
                <div>
                  <h3 className="font-bold text-blue-600 dark:text-blue-300">{bowler.name}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Bowler</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="bg-gray-50 dark:bg-gray-700 p-2 rounded">
                  <h3 className="text-xs font-medium text-gray-600 dark:text-gray-300 mb-1">Wickets</h3>
                  <p className="text-lg font-bold text-red-600 dark:text-red-400">{bowler.wickets}</p>
                </div>
                <div className="bg-gray-50 dark:bg-gray-700 p-2 rounded">
                  <h3 className="text-xs font-medium text-gray-600 dark:text-gray-300 mb-1">Economy</h3>
                  <p className="text-lg font-bold text-yellow-600 dark:text-yellow-400">{bowler.economy}</p>
                </div>
                <div className="bg-gray-50 dark:bg-gray-700 p-2 rounded">
                  <h3 className="text-xs font-medium text-gray-600 dark:text-gray-300 mb-1">Overs</h3>
                  <p className="text-lg font-bold text-blue-600 dark:text-blue-400">{bowler.overs}</p>
                </div>
                <div className="bg-gray-50 dark:bg-gray-700 p-2 rounded">
                  <h3 className="text-xs font-medium text-gray-600 dark:text-gray-300 mb-1">Runs</h3>
                  <p className="text-lg font-bold text-green-600 dark:text-green-400">{bowler.runs}</p>
                </div>
              </div>
            </div>
          ))}
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
import React, { useState, useEffect } from 'react';
import io from "socket.io-client";
import axios from 'axios';
import toast from "react-hot-toast";
import { FaCricket, FaPlus, FaTrash, FaSave, FaUndo, FaRedo, FaHistory, FaUpload, FaDownload, FaSync, FaTrophy, FaClock, FaUsers } from 'react-icons/fa';

// Socket initialization will be moved inside the component

const initialMatchData = {
    name: "Cricket",
    data: {
        basicInfo: {
            status: "Not Started",
            venue: "",
            date: "",
            toss: "",
            decision: "",
            maxOvers: 20,
            matchType: "T20",
            winningTeam: "",
            matchResult: ""
        },
        teams: {
            team1: { name: "", score: "0/0", overs: "0.0", logo: "", _id: `temp_${Date.now()}_1` },
            team2: { name: "", score: "0/0", overs: "0.0", logo: "", _id: `temp_${Date.now()}_2` }
        },
        current: {
            batsmen: ["", ""],
            bowler: "",
            thisOver: [],
            partnership: "0 (0)",
            lastOver: { runs: 0, wickets: 0 },
            striker: 0, // 0 for first batsman, 1 for second batsman
            nonStriker: 1
        },
        scorecard: {
            team1: [],
            team2: []
        },
        bowlingcard: {
            team1: [],
            team2: []
        },
        overs: {
            team1: [],
            team2: []
        },
        commentary: []
    }
};

function Cricket() {
    const [matchData, setMatchData] = useState(initialMatchData);
    const [newComment, setNewComment] = useState("");
    const [showAdvanced, setShowAdvanced] = useState(false);
    const [lastSaved, setLastSaved] = useState(null);
    const [socket, setSocket] = useState(null);
    const [isConnected, setIsConnected] = useState(false);
    const [currentBalls, setCurrentBalls] = useState(0);
    const [activeStep, setActiveStep] = useState(1); // 1: Team Setup, 2: Match Settings, 3: Scoring

    // Add field positions to the match data
    const [fieldPositions, setFieldPositions] = useState([
        { name: "Slip", x: 85, y: 30 },
        { name: "Gully", x: 80, y: 25 },
        { name: "Point", x: 75, y: 20 },
        { name: "Cover", x: 70, y: 15 },
        { name: "Extra Cover", x: 65, y: 10 },
        { name: "Mid Off", x: 60, y: 5 },
        { name: "Mid On", x: 40, y: 5 },
        { name: "Mid Wicket", x: 35, y: 10 },
        { name: "Square Leg", x: 30, y: 15 },
        { name: "Fine Leg", x: 25, y: 20 },
        { name: "Long Leg", x: 20, y: 25 },
        { name: "Long Off", x: 15, y: 30 },
        { name: "Long On", x: 10, y: 35 },
        { name: "Deep Mid Wicket", x: 5, y: 40 },
        { name: "Deep Square Leg", x: 0, y: 45 }
    ]);

    // Socket connection status
    useEffect(() => {
        if (!process.env.REACT_APP_BACKEND_URL) {
            console.error("Backend URL is not configured");
            return;
        }

        // Create socket connection inside the effect
        const newSocket = io(process.env.REACT_APP_BACKEND_URL, {
            reconnection: true,
            reconnectionAttempts: 5,
            reconnectionDelay: 1000,
            reconnectionDelayMax: 5000,
            timeout: 10000,
            transports: ['websocket'],
            upgrade: false
        });

        const handleConnect = () => {
            console.log("Connected to WebSocket server");
            setIsConnected(true);
            toast.success('Connected to server');
        };
        
        const handleDisconnect = (reason) => {
            console.log("Disconnected from WebSocket server:", reason);
            setIsConnected(false);
            
            if (reason === 'io server disconnect') {
                // The disconnection was initiated by the server, try to reconnect
                socket.connect();
            } else {
                toast.error('Disconnected from server');
            }
        };

        const handleConnectError = (error) => {
            console.error("WebSocket connection error:", error);
            toast.error(`Connection error: ${error.message}`);
        };
        
        // Set up event listeners
        newSocket.on('connect', handleConnect);
        newSocket.on('disconnect', handleDisconnect);
        newSocket.on('connect_error', handleConnectError);
        
        // Store the socket in state
        setSocket(newSocket);
        
        // Add a ping/pong handler to keep the connection alive
        const pingInterval = setInterval(() => {
            if (newSocket.connected) {
                newSocket.emit('ping');
            }
        }, 30000); // Ping every 30 seconds
        
        // Cleanup function
        return () => {
            clearInterval(pingInterval);
            
            // Remove all event listeners
            newSocket.off('connect', handleConnect);
            newSocket.off('disconnect', handleDisconnect);
            newSocket.off('connect_error', handleConnectError);
            
            // Only disconnect if we're still connected
            if (newSocket.connected) {
                newSocket.disconnect();
            }
            
            // Clear the socket from state
            setSocket(null);
        };
    }, []); // Empty dependency array means this effect runs once on mount

    // Load saved data on component mount
    useEffect(() => {
        const loadSavedData = () => {
            try {
                const savedMatchData = localStorage.getItem('cricketMatchData');
                if (savedMatchData) {
                    const parsedData = JSON.parse(savedMatchData);
                    
                    // Ensure all required fields exist
                    const completeData = {
                        ...initialMatchData,
                        ...parsedData,
                        data: {
                            ...initialMatchData.data,
                            ...parsedData.data,
                            scorecard: {
                                team1: parsedData.data.scorecard?.team1 || [],
                                team2: parsedData.data.scorecard?.team2 || []
                            },
                            bowlingcard: {
                                team1: parsedData.data.bowlingcard?.team1 || [],
                                team2: parsedData.data.bowlingcard?.team2 || []
                            },
                            overs: {
                                team1: parsedData.data.overs?.team1 || [],
                                team2: parsedData.data.overs?.team2 || []
                            },
                            current: {
                                ...initialMatchData.data.current,
                                ...parsedData.data.current,
                                striker: parsedData.data.current?.striker || 0,
                                nonStriker: parsedData.data.current?.nonStriker || 1
                            }
                        }
                    };
                    
                    setMatchData(completeData);
                    setLastSaved(new Date().toISOString());
                    
                    // Calculate current balls from overs
                    const currentTeam = completeData.data.teams.team1.score !== "0/0" ? "team1" : "team2";
                    const overs = completeData.data.teams[currentTeam].overs;
                    const [fullOvers, balls] = overs.split('.').map(Number);
                    setCurrentBalls(fullOvers * 6 + (balls || 0));
                    
                    // Set active step based on data
                    if (completeData.data.teams.team1.name && completeData.data.teams.team2.name) {
                        setActiveStep(2);
                    }
                    
                    toast.success('Loaded saved match data');
                }
            } catch (error) {
                console.error('Error parsing saved data:', error);
                toast.error('Error loading saved data');
            }
        };
        
        loadSavedData();
    }, []);

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

    // Function to emit match updates to the server
    const emitMatchUpdate = (updatedData) => {
        if (isConnected && socket) {
            try {
                // Calculate required run rates before sending
                const team1RR = calculateRequiredRunRate(updatedData.data.teams.team1, updatedData.data.teams.team2);
                const team2RR = calculateRequiredRunRate(updatedData.data.teams.team2, updatedData.data.teams.team1);
                
                // Update the data with calculated RRR
                const dataWithRR = {
                    ...updatedData,
                    data: {
                        ...updatedData.data,
                        teams: {
                            team1: { ...updatedData.data.teams.team1, requiredRate: team1RR },
                            team2: { ...updatedData.data.teams.team2, requiredRate: team2RR }
                        }
                    }
                };
                
                socket.emit('cricket_update', dataWithRR);
            } catch (error) {
                console.error('Error emitting update:', error);
                toast.error('Failed to send update to server');
            }
        }
    };

    // Auto-save to localStorage and emit updates whenever matchData changes
    useEffect(() => {
        try {
            localStorage.setItem('cricketMatchData', JSON.stringify(matchData));
            setLastSaved(new Date().toISOString());
            
            // Only emit updates if we're connected
            if (isConnected) {
                emitMatchUpdate(matchData);
            }
        } catch (error) {
            console.error('Error saving data:', error);
            toast.error('Error saving data');
        }
    }, [matchData]);

    // Auto-calculate derived values
    useEffect(() => {
        const calculateRates = (team) => {
            const [runs, wickets] = team.score.split('/').map(Number);
            const overs = parseFloat(team.overs) || 0;
            return {
                runRate: overs > 0 ? (runs / overs).toFixed(2) : "0.00",
                requiredRate: team.target ? ((team.target - runs) / (matchData.data.basicInfo.maxOvers - overs)).toFixed(2) : "N/A"
            };
        };

        setMatchData(prev => ({
            ...prev,
            data: {
                ...prev.data,
                teams: {
                    team1: { ...prev.data.teams.team1, ...calculateRates(prev.data.teams.team1) },
                    team2: { ...prev.data.teams.team2, ...calculateRates(prev.data.teams.team2) }
                }
            }
        }));
    }, [matchData.data.teams.team1.score, matchData.data.teams.team2.score, matchData.data.teams.team1.overs, matchData.data.teams.team2.overs]);

    const handleBasicChange = (e) => {
        const { name, value } = e.target;
        setMatchData(prev => ({
            ...prev,
            data: {
                ...prev.data,
                basicInfo: { ...prev.data.basicInfo, [name]: value }
            }
        }));
    };

    const handleTeamChange = (team, field, value) => {
        setMatchData(prev => ({
            ...prev,
            data: {
                ...prev.data,
                teams: {
                    ...prev.data.teams,
                    [team]: { ...prev.data.teams[team], [field]: value }
                }
            }
        }));
    };

    // Determine which team is batting and which is bowling
    const getBattingTeam = () => {
        // If team1 has a non-zero score, they're batting
        if (matchData.data.teams.team1.score !== "0/0") {
            return "team1";
        }
        // If team2 has a non-zero score, they're batting
        else if (matchData.data.teams.team2.score !== "0/0") {
            return "team2";
        }
        // Default to team1 if no team has scored yet
        return "team1";
    };

    const getBowlingTeam = () => {
        return getBattingTeam() === "team1" ? "team2" : "team1";
    };

    // Check if first innings is complete
    const isFirstInningsComplete = () => {
        const battingTeam = getBattingTeam();
        const [runs, wickets] = matchData.data.teams[battingTeam].score.split('/').map(Number);
        const overs = parseFloat(matchData.data.teams[battingTeam].overs) || 0;
        
        // First innings is complete if:
        // 1. All wickets are taken (10 wickets)
        // 2. Max overs are reached
        // 3. Match status is "Completed"
        return wickets >= 10 || 
               overs >= matchData.data.basicInfo.maxOvers || 
               matchData.data.basicInfo.status === "Completed";
    };

    const updateOvers = (team) => {
        // Get current overs
        const currentOvers = matchData.data.teams[team].overs;
        const [fullOvers, balls] = currentOvers.split('.').map(Number);
        
        // Calculate new balls and overs
        let newBalls = (balls || 0) + 1;
        let newFullOvers = fullOvers;
        
        // Check if we're starting a new over
        const isNewOver = newBalls >= 6;
        
        if (isNewOver) {
            newFullOvers += 1;
            newBalls = 0;
            
            // Save the completed over
            const overData = {
                number: newFullOvers,
                balls: matchData.data.current.thisOver,
                runs: matchData.data.current.thisOver.reduce((sum, ball) => {
                    // Handle the new ball object structure
                    if (ball.isWicket) return sum;
                    return sum + (parseInt(ball.value) || 0);
                }, 0),
                wickets: matchData.data.current.thisOver.filter(ball => ball.isWicket).length
            };
            
            addOver(team, overData);
            
            // Reset the thisOver array when a new over starts
            setMatchData(prev => ({
                ...prev,
                data: {
                    ...prev.data,
                    current: {
                        ...prev.data.current,
                        thisOver: []
                    }
                }
            }));
            
            // Check if this was the last over
            const maxBalls = matchData.data.basicInfo.maxOvers * 6;
            const totalBallsPlayed = (newFullOvers * 6) + newBalls;
            
            if (totalBallsPlayed >= maxBalls) {
                // Update match status to completed
                setMatchData(prev => ({
                    ...prev,
                    data: {
                        ...prev.data,
                        basicInfo: {
                            ...prev.data.basicInfo,
                            status: "Completed"
                        }
                    }
                }));
                toast.success("Match completed - Maximum overs reached");
                return;
            }
            
            // Only ask for new bowler if there isn't one already set
            if (!matchData.data.current.bowler) {
                const newBowlerName = prompt("Enter name of new bowler for this over:");
                if (newBowlerName) {
                    const bowlingTeam = team === "team1" ? "team2" : "team1";
                    
                    // Check if bowler already exists
                    const existingBowlerIndex = matchData.data.bowlingcard[bowlingTeam].findIndex(b => b.name === newBowlerName);
                    
                    if (existingBowlerIndex === -1) {
                        // Add new bowler if not exists
                        addBowler(bowlingTeam, newBowlerName);
                    }
                    
                    // Set as current bowler
                    setMatchData(prev => ({
                        ...prev,
                        data: {
                            ...prev.data,
                            current: {
                                ...prev.data.current,
                                bowler: newBowlerName
                            }
                        }
                    }));
                }
            }
            
            // Rotate strike at the end of over
            rotateStrike();
        }
        
        // Update overs
        handleTeamChange(team, 'overs', `${newFullOvers}.${newBalls}`);
    };

    const addBall = (value, isExtra = false, extraType = null, isWicket = false, dismissalType = null, dismissalInfo = null) => {
        // Determine which team is batting (the one with non-zero score)
        const battingTeam = matchData.data.teams.team1.score !== "0/0" ? "team1" : "team2";
        
        // Create ball object with detailed information
        const ballObject = {
            value: value,
            type: extraType || (isWicket ? 'W' : 'normal'),
            extra: isExtra,
            isWicket: isWicket,
            dismissalType: dismissalType,
            dismissalInfo: dismissalInfo
        };
        
        // Update the over only if it's not an extra
        if (!isExtra) {
            updateOvers(battingTeam);
        }
        
        // Update the current over display
        setMatchData(prev => ({
            ...prev,
            data: {
                ...prev.data,
                current: {
                    ...prev.data.current,
                    thisOver: [...prev.data.current.thisOver, ballObject]
                }
            }
        }));
    };

    // Add a new batsman to the scorecard
    const addBatsman = (team, name) => {
        if (!name) return;
        
        setMatchData(prev => ({
            ...prev,
            data: {
                ...prev.data,
                scorecard: {
                    ...prev.data.scorecard,
                    [team]: [
                        ...prev.data.scorecard[team],
                        {
                            name,
                            runs: 0,
                            balls: 0,
                            fours: 0,
                            sixes: 0,
                            strikeRate: "0.00",
                            isOut: false,
                            dismissal: "Not Out"
                        }
                    ]
                }
            }
        }));
    };

    // Add a new bowler to the bowling card
    const addBowler = (team, name) => {
        if (!name) return;
        
        setMatchData(prev => {
            const newData = { ...prev };
            const bowlingCard = [...newData.data.bowlingcard[team]];
            
            // Check if bowler already exists
            const existingBowlerIndex = bowlingCard.findIndex(b => b.name === name);
            if (existingBowlerIndex !== -1) {
                // If bowler exists, set as current bowler
                newData.data.current.bowler = name;
                return newData;
            }
            
            // Add new bowler
            bowlingCard.push({
                name,
                overs: '0.0',
                maidens: 0,
                runs: 0,
                wickets: 0,
                economy: 0
            });
            
            newData.data.bowlingcard[team] = bowlingCard;
            newData.data.current.bowler = name;
            
            return newData;
        });
    };

    // Update batsman statistics
    const updateBatsmanStats = (team, index, stats) => {
        setMatchData(prev => {
            const updatedScorecard = [...prev.data.scorecard[team]];
            updatedScorecard[index] = {
                ...updatedScorecard[index],
                ...stats,
                strikeRate: stats.balls > 0 ? ((stats.runs / stats.balls) * 100).toFixed(2) : "0.00"
            };
            
            return {
                ...prev,
                data: {
                    ...prev.data,
                    scorecard: {
                        ...prev.data.scorecard,
                        [team]: updatedScorecard
                    }
                }
            };
        });
    };

    // Update bowler statistics
    const updateBowlerStats = (team, bowlerName, ball) => {
        setMatchData(prev => {
            const newData = { ...prev };
            const bowlingCard = [...newData.data.bowlingcard[team]];
            const bowlerIndex = bowlingCard.findIndex(b => b.name === bowlerName);
            
            if (bowlerIndex === -1) return newData;
            
            const bowler = { ...bowlingCard[bowlerIndex] };
            
            // Update overs
            const [whole, part] = bowler.overs.split('.');
            const newPart = parseInt(part) + 1;
            if (newPart === 6) {
                bowler.overs = `${parseInt(whole) + 1}.0`;
            } else {
                bowler.overs = `${whole}.${newPart}`;
            }
            
            // Update runs
            if (!ball.extra) {
                bowler.runs += ball.value;
            }
            
            // Update wickets
            if (ball.isWicket) {
                bowler.wickets += 1;
            }
            
            // Update economy
            const overs = parseFloat(bowler.overs);
            bowler.economy = overs > 0 ? (bowler.runs / overs).toFixed(2) : '0.00';
            
            bowlingCard[bowlerIndex] = bowler;
            newData.data.bowlingcard[team] = bowlingCard;
            
            return newData;
        });
    };

    // Add an over to the overs list
    const addOver = (team, overData) => {
        setMatchData(prev => ({
            ...prev,
            data: {
                ...prev.data,
                overs: {
                    ...prev.data.overs,
                    [team]: [...prev.data.overs[team], overData]
                }
            }
        }));
    };

    // Rotate strike on odd runs
    const rotateStrike = () => {
        setMatchData(prev => ({
            ...prev,
            data: {
                ...prev.data,
                current: {
                    ...prev.data.current,
                    striker: prev.data.current.nonStriker,
                    nonStriker: prev.data.current.striker
                }
            }
        }));
    };

    // Update the quickScoreUpdate function to handle strike rotation and stats
    const quickScoreUpdate = (team, runs, isWicket, isExtra = false, extraType = null, dismissalType = null, dismissalInfo = null) => {
        // Get current score or initialize if empty
        const currentScore = matchData.data.teams[team].score || "0/0";
        const [currentRuns, currentWickets] = currentScore.split('/').map(Number);
        
        // Calculate new values, handling NaN cases
        const newRuns = (isNaN(currentRuns) ? 0 : currentRuns) + runs;
        const newWickets = (isNaN(currentWickets) ? 0 : currentWickets) + (isWicket ? 1 : 0);

        // Create ball object with detailed information
        const ballObject = {
            value: runs,
            type: extraType || (isWicket ? 'W' : 'normal'),
            extra: isExtra,
            isWicket: isWicket,
            dismissalType: dismissalType,
            dismissalInfo: dismissalInfo
        };

        // Get current bowler info
        const bowlingTeam = team === "team1" ? "team2" : "team1";
        const currentBowler = matchData.data.current.bowler;
        let bowlerStats = null;
        
        if (currentBowler) {
            const bowlerIndex = matchData.data.bowlingcard[bowlingTeam].findIndex(b => b.name === currentBowler);
            if (bowlerIndex !== -1) {
                bowlerStats = { ...matchData.data.bowlingcard[bowlingTeam][bowlerIndex] };
            }
        }

        if (isWicket) {
            const strikerIndex = matchData.data.current.striker;
            const strikerName = matchData.data.current.batsmen[strikerIndex];
        
            // Find the striker batsman in the scorecard
            const batsmanIndex = matchData.data.scorecard[team].findIndex(batsman => batsman.name === strikerName);
        
            if (batsmanIndex !== -1) {
                const newBatsmanName = prompt("Enter name of new batsman:");
                if (!newBatsmanName) {
                    toast.error("New batsman name is required");
                    return;
                }
        
                setMatchData(prev => {
                    const prevScorecard = [...prev.data.scorecard[team]];
                    
                    // Mark outgoing batsman as out
                    prevScorecard[batsmanIndex] = {
                        ...prevScorecard[batsmanIndex],
                        isOut: true,
                        dismissal: dismissalInfo || "b " + prev.data.current.bowler
                    };
        
                    // Create new batsman
                    const newBatsman = {
                        name: newBatsmanName,
                        runs: 0,
                        balls: 0,
                        fours: 0,
                        sixes: 0,
                        strikeRate: "0.00",
                        isOut: false,
                        dismissal: "Not Out"
                    };
        
                    const updatedScorecard = [...prevScorecard, newBatsman];
        
                    // Determine new batsmen
                    const wasStriker = prev.data.current.batsmen[0] === strikerName;
                    const updatedBatsmen = wasStriker
                        ? [newBatsmanName, prev.data.current.batsmen[1]]
                        : [prev.data.current.batsmen[0], newBatsmanName];
                    
                    // Update the over only if it's not an extra
                    if (!isExtra) {
                        updateOvers(team);
                    }
                    
                    // Update bowler stats if exists
                    let updatedBowlingCard = { ...prev.data.bowlingcard };
                    if (bowlerStats) {
                        const [fullOvers, balls] = bowlerStats.overs.split('.').map(Number);
                        let newBalls = balls;
                        let newFullOvers = fullOvers;
                        
                        if (!isExtra || extraType !== 'WD') {
                            newBalls = (balls || 0) + 1;
                            if (newBalls >= 6) {
                                newFullOvers += 1;
                                newBalls = 0;
                            }
                        }
                        
                        const updatedBowlerStats = {
                            ...bowlerStats,
                            overs: `${newFullOvers}.${newBalls}`,
                            runs: bowlerStats.runs + runs,
                            wickets: bowlerStats.wickets + 1,
                            economy: ((bowlerStats.runs + runs) / (newFullOvers + newBalls/6)).toFixed(2)
                        };
                        
                        updatedBowlingCard[bowlingTeam] = updatedBowlingCard[bowlingTeam].map(bowler => 
                            bowler.name === currentBowler ? updatedBowlerStats : bowler
                        );
                    }
                    
                    return {
                        ...prev,
                        data: {
                            ...prev.data,
                            teams: {
                                ...prev.data.teams,
                                [team]: {
                                    ...prev.data.teams[team],
                                    score: `${newRuns}/${newWickets}`
                                }
                            },
                            scorecard: {
                                ...prev.data.scorecard,
                                [team]: updatedScorecard
                            },
                            bowlingcard: updatedBowlingCard,
                            current: {
                                ...prev.data.current,
                                batsmen: updatedBatsmen,
                                striker: 0,
                                nonStriker: 1,
                                thisOver: [...prev.data.current.thisOver, ballObject]
                            }
                        }
                    };
                });
            } else {
                console.error(`Striker batsman "${strikerName}" not found in scorecard!`);
            }
        } else {
            setMatchData(prev => {
                // Update the over only if it's not an extra
                if (!isExtra) {
                    updateOvers(team);
                }
                
                // Update bowler stats if exists
                let updatedBowlingCard = { ...prev.data.bowlingcard };
                if (bowlerStats) {
                    const [fullOvers, balls] = bowlerStats.overs.split('.').map(Number);
                    let newBalls = balls;
                    let newFullOvers = fullOvers;
                    
                    if (!isExtra || extraType !== 'WD') {
                        newBalls = (balls || 0) + 1;
                        if (newBalls >= 6) {
                            newFullOvers += 1;
                            newBalls = 0;
                        }
                    }
                    
                    const updatedBowlerStats = {
                        ...bowlerStats,
                        overs: `${newFullOvers}.${newBalls}`,
                        runs: bowlerStats.runs + runs,
                        wickets: bowlerStats.wickets,
                        economy: ((bowlerStats.runs + runs) / (newFullOvers + newBalls/6)).toFixed(2)
                    };
                    
                    updatedBowlingCard[bowlingTeam] = updatedBowlingCard[bowlingTeam].map(bowler => 
                        bowler.name === currentBowler ? updatedBowlerStats : bowler
                    );
                }
                
                return {
                    ...prev,
                    data: {
                        ...prev.data,
                        teams: {
                            ...prev.data.teams,
                            [team]: {
                                ...prev.data.teams[team],
                                score: `${newRuns}/${newWickets}`
                            }
                        },
                        bowlingcard: updatedBowlingCard,
                        current: {
                            ...prev.data.current,
                            thisOver: [...prev.data.current.thisOver, ballObject]
                        }
                    }
                };
            });
            
            // Update batsman stats if not an extra
            if (!isExtra) {
                const strikerIndex = matchData.data.current.striker;
                const strikerName = matchData.data.current.batsmen[strikerIndex];
                
                // Find batsman index by name
                const batsmanIndex = matchData.data.scorecard[team].findIndex(batsman => batsman.name === strikerName);
                
                if (batsmanIndex !== -1) {
                    const currentBatsman = matchData.data.scorecard[team][batsmanIndex];
                    if (!currentBatsman.isOut) {
                        const updatedStats = {
                            runs: currentBatsman.runs + runs,
                            balls: currentBatsman.balls + 1,
                            fours: runs === 4 ? currentBatsman.fours + 1 : currentBatsman.fours,
                            sixes: runs === 6 ? currentBatsman.sixes + 1 : currentBatsman.sixes,
                            strikeRate: ((currentBatsman.runs + runs) / (currentBatsman.balls + 1) * 100).toFixed(2)
                        };
                        
                        updateBatsmanStats(team, batsmanIndex, updatedStats);
        
                        // Rotate strike on odd runs (1 or 3)
                        if (runs === 1 || runs === 3) {
                            rotateStrike();
                        }
                    }
                } else {
                    console.error(`Striker batsman "${strikerName}" not found in scorecard!`);
                }
            }
        }
        
        // Send socket update after score change
        sendSocketUpdate();
    };

    const submitData = async () => {
        // Helper function to validate MongoDB ObjectId
        const isValidObjectId = (id) => /^[0-9a-fA-F]{24}$/.test(id);
        
        try {
            const statusMap = {
                'Not Started': 'Not Started',
                'In Progress': 'In Progress',
                'Completed': 'Completed'
            };

            // Map toss decision to lowercase for enum validation
            const decisionMap = {
                'Bat': 'bat',
                'Bowl': 'bowl'
            };

            // Prepare team data with proper references
            const team1 = matchData.data.teams.team1;
            const team2 = matchData.data.teams.team2;
            
            // Ensure both teams have valid MongoDB ObjectIds
            if (!team1._id || !isValidObjectId(team1._id)) {
                toast.error('Please save Team 1 first before saving the match');
                return;
            }
            if (!team2._id || !isValidObjectId(team2._id)) {
                toast.error('Please save Team 2 first before saving the match');
                return;
            }
            
            // Get the winning team's ID with more robust comparison
            let tossWinnerId = null;
            const selectedTossWinner = (matchData.data.basicInfo.toss || '').trim().toLowerCase();
            const team1Name = (team1.name || '').trim().toLowerCase();
            const team2Name = (team2.name || '').trim().toLowerCase();
            
            if (selectedTossWinner === team1Name) {
                tossWinnerId = team1._id;
            } else if (selectedTossWinner === team2Name) {
                tossWinnerId = team2._id;
            }
            
            console.log('Team and toss data:', {
                team1: { name: team1.name, id: team1._id },
                team2: { name: team2.name, id: team2._id },
                selectedTossWinner,
                tossWinnerId,
                basicInfo: matchData.data.basicInfo
            });
            
            // Validate teams have names
            if (!team1.name || !team2.name) {
                toast.error("Both teams must have names before saving");
                return;
            }
            
            // Validate toss winner is one of the teams
            if (!tossWinnerId) {
                console.error('Toss winner validation failed. Current state:', {
                    selectedTossWinner: matchData.data.basicInfo.toss,
                    team1: { name: team1.name, id: team1._id },
                    team2: { name: team2.name, id: team2._id },
                    basicInfo: matchData.data.basicInfo
                });
                toast.error(`Please select a valid toss winner from the playing teams. Current selection: "${matchData.data.basicInfo.toss || 'none'}"`);
                return;
            }
            
            // Prepare team data for the backend
            const teamData = {
                team1: {
                    _id: team1._id,
                    name: team1.name,
                    score: team1.score,
                    overs: team1.overs,
                    logo: team1.logo || ''
                },
                team2: {
                    _id: team2._id,
                    name: team2.name,
                    score: team2.score,
                    overs: team2.overs,
                    logo: team2.logo || ''
                }
            };

            // Prepare the data with all required fields
            const dataToSave = {
                ...matchData,
                gameType: (matchData.data.basicInfo.matchType || 'T20').toUpperCase(),
                venue: matchData.data.basicInfo.venue || 'Unknown Venue',
                matchDate: matchData.data.basicInfo.date || new Date().toISOString(),
                matchTitle: `${team1.name || 'Team 1'} vs ${team2.name || 'Team 2'}`,
                status: statusMap[matchData.data.basicInfo.status] || 'Scheduled',
                toss: {
                    winner: tossWinnerId,
                    decision: decisionMap[matchData.data.basicInfo.decision] || 'bat'
                },
                teams: teamData,
                basicInfo: matchData.data.basicInfo,
                current: matchData.data.current,
                scorecard: matchData.data.scorecard,
                bowlingcard: matchData.data.bowlingcard,
                overs: matchData.data.overs,
                commentary: matchData.data.commentary || []
            };
            
            console.log("Saving match data:", dataToSave);
            
            try {
                const response = await axios.post(
                    `${process.env.REACT_APP_BACKEND_URL}/api/v1/sports/cricketMatch`,
                    dataToSave
                );
                
                if (response.data.success) {
                    toast.success("Match data saved successfully!");
                    // Update the match data with any server-generated fields (like _id)
                    if (response.data.match) {
                        setMatchData(prev => ({
                            ...prev,
                            ...response.data.match
                        }));
                    }
                    setLastSaved(new Date());
                } else {
                    toast.error(response.data.message || "Failed to save match data");
                }
            } catch (error) {
                console.error('Error saving match data:', error);
                toast.error(error.response?.data?.message || "Error saving match data");
            }

            // Validate required fields
            if (!dataToSave.gameType) {
                toast.error("Please set the match type in Basic Info");
                return;
            }
            if (!dataToSave.venue) {
                toast.error("Please set the venue in Basic Info");
                return;
            }
            if (!dataToSave.matchDate) {
                toast.error("Please set the match date in Basic Info");
                return;
            }

            // Validate teams have names
            if (!team1.name || !team2.name) {
                toast.error("Both teams must have names before saving");
                return;
            }
            
            // Validate toss winner is one of the teams and has a valid ObjectId
            if (!tossWinnerId) {
                console.error('Toss winner validation failed. No toss winner selected. Current state:', {
                    selectedTossWinner: matchData.data.basicInfo.toss,
                    team1: { name: team1.name, id: team1._id },
                    team2: { name: team2.name, id: team2._id },
                    basicInfo: matchData.data.basicInfo
                });
                toast.error('Please select a toss winner');
                return;
            }
            
            // Verify tossWinnerId is a valid MongoDB ObjectId
            if (!isValidObjectId(tossWinnerId)) {
                console.error('Invalid toss winner ID format:', tossWinnerId);
                toast.error('Invalid team selection. Please try again.');
                return;
            }
            
            // Verify tossWinnerId matches one of the team IDs
            if (tossWinnerId !== team1._id && tossWinnerId !== team2._id) {
                console.error('Toss winner ID does not match either team ID:', {
                    tossWinnerId,
                    team1Id: team1._id,
                    team2Id: team2._id
                });
                toast.error('Invalid team selection. Please select a valid team.');
                return;
            }
            
            // Save data to server
            try {
                const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/cricketMatch`, dataToSave);
                
                if (response.data.success) {
                    toast.success('Match data saved successfully!');
                    // Update the match data with any server-generated fields (like _id)
                    if (response.data.match) {
                        setMatchData(prev => ({
                            ...prev,
                            _id: response.data.match._id,
                            ...response.data.match
                        }));
                    }
                } else {
                    toast.error(response.data.message || "Error saving match data");
                }
            } catch (error) {
                console.error('Error saving match data:', error);
                toast.error(error.response?.data?.message || "Error saving match data");
            }
        } catch (error) {
            console.error("Error saving match data:", error);
            const errorMessage = error.response?.data?.message || "Error saving data";
            toast.error(errorMessage);
            
            // Log detailed error information
            if (error.response?.data?.errors) {
                console.error("Validation errors:", error.response.data.errors);
                Object.values(error.response.data.errors).forEach(err => {
                    toast.error(err.message);
                });
            }
        }
    };

    const sendSocketUpdate = () => {
        if (!isConnected) {
            toast.error("Not connected to server");
            return;
        }
        
        socket.emit("data", matchData);
        console.log(matchData);
        toast.success("Update sent to all connected clients");
    };

    const saveToLocalStorage = () => {
        try {
            localStorage.setItem('cricketMatchData', JSON.stringify(matchData));
            setLastSaved(new Date().toISOString());
            toast.success("Data saved to local storage");
        } catch (error) {
            console.error('Error saving to localStorage:', error);
            toast.error('Error saving data');
        }
    };

    const loadFromLocalStorage = () => {
        try {
            const savedMatchData = localStorage.getItem('cricketMatchData');
            if (savedMatchData) {
                const parsedData = JSON.parse(savedMatchData);
                setMatchData(parsedData);
                setLastSaved(new Date().toISOString());
                
                // Calculate current balls from overs
                const currentTeam = parsedData.data.teams.team1.score !== "0/0" ? "team1" : "team2";
                const overs = parsedData.data.teams[currentTeam].overs;
                const [fullOvers, balls] = overs.split('.').map(Number);
                setCurrentBalls(fullOvers * 6 + (balls || 0));
                
                // Set active step based on data
                if (parsedData.data.teams.team1.name && parsedData.data.teams.team2.name) {
                    setActiveStep(2);
                }
                
                toast.success('Loaded saved match data');
            } else {
                toast.error('No saved data found');
            }
        } catch (error) {
            console.error('Error parsing saved data:', error);
            toast.error('Error loading saved data');
        }
    };

    const clearLocalStorage = () => {
        if (window.confirm('Are you sure you want to clear all saved data? This cannot be undone.')) {
            localStorage.removeItem('cricketMatchData');
            setMatchData(initialMatchData);
            setLastSaved(null);
            setCurrentBalls(0);
            setActiveStep(1);
            toast.success('All saved data cleared');
        }
    };

    const nextStep = () => {
        if (activeStep === 1) {
            // Validate team names
            if (!matchData.data.teams.team1.name || !matchData.data.teams.team2.name) {
                toast.error("Please enter both team names");
                return;
            }
        } else if (activeStep === 2) {
            // Prompt for initial batsmen and bowler when moving to scoring
            const battingTeam = getBattingTeam();
            const bowlingTeam = getBowlingTeam();
            
            // Prompt for first batsman
            const firstBatsmanName = prompt(`Enter name of first batsman for ${matchData.data.teams[battingTeam].name}:`);
            if (firstBatsmanName) {
                addBatsman(battingTeam, firstBatsmanName);
                
                // Prompt for second batsman
                const secondBatsmanName = prompt(`Enter name of second batsman for ${matchData.data.teams[battingTeam].name}:`);
                if (secondBatsmanName) {
                    addBatsman(battingTeam, secondBatsmanName);
                    
                    // Prompt for bowler
                    const bowlerName = prompt(`Enter name of bowler for ${matchData.data.teams[bowlingTeam].name}:`);
                    if (bowlerName) {
                        addBowler(bowlingTeam, bowlerName);
                        
                        // Set initial batsmen and bowler
                        setMatchData(prev => ({
                            ...prev,
                            data: {
                                ...prev.data,
                                current: {
                                    ...prev.data.current,
                                    batsmen: [firstBatsmanName, secondBatsmanName],
                                    bowler: bowlerName,
                                    striker: 0,
                                    nonStriker: 1
                                }
                            }
                        }));
                    } else {
                        toast.error("Bowler name is required");
                        return;
                    }
                } else {
                    toast.error("Second batsman name is required");
                    return;
                }
            } else {
                toast.error("First batsman name is required");
                return;
            }
        }
        setActiveStep(activeStep + 1);
    };

    const prevStep = () => {
        setActiveStep(activeStep - 1);
    };

    const setWinningTeam = (team) => {
        const teamName = matchData.data.teams[team].name;
        setMatchData(prev => ({
            ...prev,
            data: {
                ...prev.data,
                basicInfo: { 
                    ...prev.data.basicInfo, 
                    winningTeam: teamName,
                    status: "Completed",
                    matchResult: `${teamName} won the match`
                }
            }
        }));
        toast.success(`${teamName} set as winning team`);
    };

    // Add a function to update field positions
    const updateFieldPosition = (index, newPosition) => {
        const updatedPositions = [...fieldPositions];
        updatedPositions[index] = { ...updatedPositions[index], ...newPosition };
        setFieldPositions(updatedPositions);
        
        // Update match data with new field positions
        setMatchData(prev => ({
            ...prev,
            data: {
                ...prev.data,
                fieldPositions: updatedPositions
            }
        }));
        
        // Send socket update
        sendSocketUpdate();
    };

    // Add a function to reset field positions to default
    const resetFieldPositions = () => {
        setFieldPositions([
            { name: "Slip", x: 85, y: 30 },
            { name: "Gully", x: 80, y: 25 },
            { name: "Point", x: 75, y: 20 },
            { name: "Cover", x: 70, y: 15 },
            { name: "Extra Cover", x: 65, y: 10 },
            { name: "Mid Off", x: 60, y: 5 },
            { name: "Mid On", x: 40, y: 5 },
            { name: "Mid Wicket", x: 35, y: 10 },
            { name: "Square Leg", x: 30, y: 15 },
            { name: "Fine Leg", x: 25, y: 20 },
            { name: "Long Leg", x: 20, y: 25 },
            { name: "Long Off", x: 15, y: 30 },
            { name: "Long On", x: 10, y: 35 },
            { name: "Deep Mid Wicket", x: 5, y: 40 },
            { name: "Deep Square Leg", x: 0, y: 45 }
        ]);
        
        // Update match data with reset field positions
        setMatchData(prev => ({
            ...prev,
            data: {
                ...prev.data,
                fieldPositions: fieldPositions
            }
        }));
        
        // Send socket update
        sendSocketUpdate();
    };

    // Add a field positions section to the UI
    const renderFieldPositions = () => {
        return (
            <div className="bg-white p-4 rounded-lg mb-4 shadow">
                <h2 className="text-xl font-semibold mb-3">Field Positions</h2>
                <div className="grid grid-cols-3 gap-2">
                    {fieldPositions.map((position, index) => (
                        <div key={index} className="flex items-center">
                            <span className="w-24 text-sm">{position.name}</span>
                            <input
                                type="number"
                                value={position.x}
                                onChange={(e) => updateFieldPosition(index, { x: parseInt(e.target.value) })}
                                className="w-16 p-1 border rounded mr-1"
                                placeholder="X"
                            />
                            <input
                                type="number"
                                value={position.y}
                                onChange={(e) => updateFieldPosition(index, { y: parseInt(e.target.value) })}
                                className="w-16 p-1 border rounded"
                                placeholder="Y"
                            />
                        </div>
                    ))}
                </div>
                <button
                    onClick={resetFieldPositions}
                    className="mt-2 p-2 bg-blue-100 rounded hover:bg-blue-200 text-sm"
                >
                    Reset Field Positions
                </button>
            </div>
        );
    };

    // Add function to calculate remaining balls
    const calculateRemainingBalls = () => {
        const battingTeam = getBattingTeam();
        const [fullOvers, balls] = matchData.data.teams[battingTeam].overs.split('.').map(Number);
        const totalBallsPlayed = (fullOvers * 6) + (balls || 0);
        const maxBalls = matchData.data.basicInfo.maxOvers * 6;
        return Math.max(0, maxBalls - totalBallsPlayed);
    };

    return (
        <div className="w-4/5 mx-auto my-5 p-6 bg-gray-100 rounded-lg shadow-lg">
            <div className="mb-6 flex justify-between items-center">
                <h1 className="text-2xl font-bold text-gray-800">Cricket Match Control</h1>
                <div className="flex space-x-2">
                    <button 
                        onClick={() => setShowAdvanced(!showAdvanced)}
                        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 flex items-center"
                    >
                        {showAdvanced ? 'Basic View' : 'Advanced View'}
                    </button>
                    <button 
                        onClick={sendSocketUpdate}
                        className={`px-4 py-2 ${isConnected ? 'bg-green-500 hover:bg-green-600' : 'bg-gray-400 cursor-not-allowed'} text-white rounded flex items-center`}
                        disabled={!isConnected}
                    >
                        <FaUpload className="mr-2" /> 
                        {isConnected ? 'Send Update' : 'Disconnected'}
                    </button>
                    <button 
                        onClick={saveToLocalStorage}
                        className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600 flex items-center"
                    >
                        <FaSave className="mr-2" /> Save
                    </button>
                    <button 
                        onClick={loadFromLocalStorage}
                        className="px-4 py-2 bg-indigo-500 text-white rounded hover:bg-indigo-600 flex items-center"
                    >
                        <FaDownload className="mr-2" /> Load
                    </button>
                    <button 
                        onClick={clearLocalStorage}
                        className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 flex items-center"
                    >
                        <FaTrash className="mr-2" /> Clear
                    </button>
                </div>
            </div>

            {lastSaved && (
                <div className="mb-4 text-sm text-gray-600 flex items-center">
                    <FaSync className="mr-1" /> Last saved: {new Date(lastSaved).toLocaleString()}
                </div>
            )}

            {/* Step Indicator */}
            <div className="mb-6">
                <div className="flex items-center justify-between">
                    <div className={`flex items-center ${activeStep >= 1 ? 'text-blue-600' : 'text-gray-400'}`}>
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${activeStep >= 1 ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}>1</div>
                        <span className="ml-2">Team Setup</span>
                    </div>
                    <div className={`flex-1 h-1 mx-2 ${activeStep >= 2 ? 'bg-blue-600' : 'bg-gray-200'}`}></div>
                    <div className={`flex items-center ${activeStep >= 2 ? 'text-blue-600' : 'text-gray-400'}`}>
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${activeStep >= 2 ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}>2</div>
                        <span className="ml-2">Match Settings</span>
                    </div>
                    <div className={`flex-1 h-1 mx-2 ${activeStep >= 3 ? 'bg-blue-600' : 'bg-gray-200'}`}></div>
                    <div className={`flex items-center ${activeStep >= 3 ? 'text-blue-600' : 'text-gray-400'}`}>
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${activeStep >= 3 ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}>3</div>
                        <span className="ml-2">Scoring</span>
                    </div>
                </div>
            </div>

            {/* Step 1: Team Setup */}
            {activeStep === 1 && (
                <div className="bg-white p-6 rounded-lg shadow mb-6">
                    <h2 className="text-xl font-semibold mb-4">Team Setup</h2>
                    <div className="grid md:grid-cols-2 gap-6">
                        {['team1', 'team2'].map(team => (
                            <div key={team} className="border rounded-lg p-4">
                                <h3 className="text-lg font-medium mb-3">{team.toUpperCase()}</h3>
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Team Name</label>
                                        <input
                                            type="text"
                                            placeholder="Enter team name"
                                            value={matchData.data.teams[team].name}
                                            onChange={(e) => handleTeamChange(team, 'name', e.target.value)}
                                            className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Team Logo URL (optional)</label>
                                        <input
                                            type="text"
                                            placeholder="Enter logo URL"
                                            value={matchData.data.teams[team].logo}
                                            onChange={(e) => handleTeamChange(team, 'logo', e.target.value)}
                                            className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="mt-6 flex justify-end">
                        <button 
                            onClick={nextStep}
                            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                        >
                            Next: Match Settings
                        </button>
                    </div>
                </div>
            )}

            {/* Step 2: Match Settings */}
            {activeStep === 2 && (
                <div className="bg-white p-6 rounded-lg shadow mb-6">
                    <h2 className="text-xl font-semibold mb-4">Match Settings</h2>
                    <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Venue</label>
                                <input
                                    type="text"
                                    placeholder="Enter venue"
                                    name="venue"
                                    value={matchData.data.basicInfo.venue}
                                    onChange={handleBasicChange}
                                    className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                                <input
                                    type="date"
                                    name="date"
                                    value={matchData.data.basicInfo.date}
                                    onChange={handleBasicChange}
                                    className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Match Type</label>
                                <select
                                    name="matchType"
                                    value={matchData.data.basicInfo.matchType}
                                    onChange={handleBasicChange}
                                    className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="T20">T20</option>
                                    <option value="ODI">ODI</option>
                                    <option value="Test">Test</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Max Overs</label>
                                <input
                                    type="number"
                                    name="maxOvers"
                                    value={matchData.data.basicInfo.maxOvers}
                                    onChange={handleBasicChange}
                                    className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                        </div>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Toss</label>
                                <select
                                    name="toss"
                                    value={matchData.data.basicInfo.toss}
                                    onChange={handleBasicChange}
                                    className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="">Select team</option>
                                    <option value={matchData.data.teams.team1.name}>{matchData.data.teams.team1.name}</option>
                                    <option value={matchData.data.teams.team2.name}>{matchData.data.teams.team2.name}</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Decision</label>
                                <select
                                    name="decision"
                                    value={matchData.data.basicInfo.decision}
                                    onChange={handleBasicChange}
                                    className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="">Select decision</option>
                                    <option value="Bat">Bat</option>
                                    <option value="Bowl">Bowl</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Match Status</label>
                                <select
                                    name="status"
                                    value={matchData.data.basicInfo.status}
                                    onChange={handleBasicChange}
                                    className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="Not Started">Not Started</option>
                                    <option value="In Progress">In Progress</option>
                                    <option value="Completed">Completed</option>
                                </select>
                            </div>
                            {matchData.data.basicInfo.status === "Completed" && (
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Winning Team</label>
                                    <div className="flex space-x-2">
                                        <button
                                            onClick={() => setWinningTeam('team1')}
                                            className={`px-4 py-2 rounded ${matchData.data.basicInfo.winningTeam === matchData.data.teams.team1.name ? 'bg-green-500 text-white' : 'bg-gray-200'}`}
                                        >
                                            {matchData.data.teams.team1.name}
                                        </button>
                                        <button
                                            onClick={() => setWinningTeam('team2')}
                                            className={`px-4 py-2 rounded ${matchData.data.basicInfo.winningTeam === matchData.data.teams.team2.name ? 'bg-green-500 text-white' : 'bg-gray-200'}`}
                                        >
                                            {matchData.data.teams.team2.name}
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="mt-6 flex justify-between">
                        <button 
                            onClick={prevStep}
                            className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
                        >
                            Back: Team Setup
                        </button>
                        <button 
                            onClick={nextStep}
                            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                        >
                            Next: Scoring
                        </button>
                    </div>
                </div>
            )}

            {/* Step 3: Scoring */}
            {activeStep === 3 && (
                <>
                    {/* Add this inside the scoring section, before the Current Over section */}
                    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow border border-gray-200 dark:border-gray-700 mb-4">
                        <h3 className="text-sm font-medium text-gray-600 dark:text-gray-300 mb-1">Balls Remaining</h3>
                        <p className="text-2xl font-bold text-red-600 dark:text-red-400">
                            {(() => {
                                const battingTeam = getBattingTeam();
                                const [fullOvers, balls] = matchData.data.teams[battingTeam].overs.split('.').map(Number);
                                const totalBallsPlayed = (fullOvers * 6) + (balls || 0);
                                const maxBalls = matchData.data.basicInfo.maxOvers * 6;
                                return Math.max(0, maxBalls - totalBallsPlayed);
                            })()}
                        </p>
                    </div>

                    {/* Team Score Quick Update */}
                    <div className="grid md:grid-cols-2 gap-4 mb-6">
                        {/* Show batting team first */}
                        {(() => {
                            const battingTeam = getBattingTeam();
                            const bowlingTeam = getBowlingTeam();
                            
                            return (
                                <>
                                    {/* Batting Team */}
                                    <div className="bg-white p-4 rounded-lg shadow">
                                        <h3 className="text-lg font-semibold mb-3">
                                            {matchData.data.teams[battingTeam].name} (Batting)
                                        </h3>
                                        <div className="space-y-2">
                                            <div className="flex gap-2">
                                                <input
                                                    type="text"
                                                    placeholder="Score (e.g., 200/3)"
                                                    value={matchData.data.teams[battingTeam].score}
                                                    onChange={(e) => handleTeamChange(battingTeam, 'score', e.target.value)}
                                                    className="flex-1 p-2 border rounded"
                                                />
                                                <input
                                                    type="text"
                                                    placeholder="Overs (e.g., 15.2)"
                                                    value={matchData.data.teams[battingTeam].overs}
                                                    onChange={(e) => handleTeamChange(battingTeam, 'overs', e.target.value)}
                                                    className="w-24 p-2 border rounded"
                                                />
                                            </div>
                                            <div className="grid grid-cols-2 gap-2">
                                                <button 
                                                    onClick={() => quickScoreUpdate(battingTeam, 1, false)}
                                                    className="p-2 bg-green-100 rounded hover:bg-green-200"
                                                >
                                                    +1 Run
                                                </button>
                                                <button 
                                                    onClick={() => quickScoreUpdate(battingTeam, 4, false)}
                                                    className="p-2 bg-blue-100 rounded hover:bg-blue-200"
                                                >
                                                    +4 Runs
                                                </button>
                                                <button 
                                                    onClick={() => quickScoreUpdate(battingTeam, 6, false)}
                                                    className="p-2 bg-purple-100 rounded hover:bg-purple-200"
                                                >
                                                    +6 Runs
                                                </button>
                                                <button 
                                                    onClick={() => quickScoreUpdate(battingTeam, 0, true)}
                                                    className="p-2 bg-red-100 rounded hover:bg-red-200"
                                                >
                                                    Wicket
                                                </button>
                                            </div>
                                            <div className="mt-2 text-sm">
                                                <p>Run Rate: {matchData.data.teams[battingTeam].runRate}</p>
                                                {matchData.data.teams[battingTeam].target && 
                                                    <p>Required RR: {matchData.data.teams[battingTeam].requiredRate}</p>
                                                }
                                            </div>
                                        </div>
                                    </div>

                                    {/* Bowling Team - Only show if first innings is complete */}
                                    {isFirstInningsComplete() && (
                                        <div className="bg-white p-4 rounded-lg shadow">
                                            <h3 className="text-lg font-semibold mb-3">
                                                {matchData.data.teams[bowlingTeam].name} (Batting)
                                            </h3>
                                            <div className="space-y-2">
                                                <div className="flex gap-2">
                                                    <input
                                                        type="text"
                                                        placeholder="Score (e.g., 200/3)"
                                                        value={matchData.data.teams[bowlingTeam].score}
                                                        onChange={(e) => handleTeamChange(bowlingTeam, 'score', e.target.value)}
                                                        className="flex-1 p-2 border rounded"
                                                    />
                                                    <input
                                                        type="text"
                                                        placeholder="Overs (e.g., 15.2)"
                                                        value={matchData.data.teams[bowlingTeam].overs}
                                                        onChange={(e) => handleTeamChange(bowlingTeam, 'overs', e.target.value)}
                                                        className="w-24 p-2 border rounded"
                                                    />
                                                </div>
                                                <div className="grid grid-cols-2 gap-2">
                                                    <button 
                                                        onClick={() => quickScoreUpdate(bowlingTeam, 1, false)}
                                                        className="p-2 bg-green-100 rounded hover:bg-green-200"
                                                    >
                                                        +1 Run
                                                    </button>
                                                    <button 
                                                        onClick={() => quickScoreUpdate(bowlingTeam, 4, false)}
                                                        className="p-2 bg-blue-100 rounded hover:bg-blue-200"
                                                    >
                                                        +4 Runs
                                                    </button>
                                                    <button 
                                                        onClick={() => quickScoreUpdate(bowlingTeam, 6, false)}
                                                        className="p-2 bg-purple-100 rounded hover:bg-purple-200"
                                                    >
                                                        +6 Runs
                                                    </button>
                                                    <button 
                                                        onClick={() => quickScoreUpdate(bowlingTeam, 0, true)}
                                                        className="p-2 bg-red-100 rounded hover:bg-red-200"
                                                    >
                                                        Wicket
                                                    </button>
                                                </div>
                                                <div className="mt-2 text-sm">
                                                    <p>Run Rate: {matchData.data.teams[bowlingTeam].runRate}</p>
                                                    {matchData.data.teams[bowlingTeam].target && 
                                                        <p>Required RR: {matchData.data.teams[bowlingTeam].requiredRate}</p>
                                                    }
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </>
                            );
                        })()}
                    </div>

                    {/* Current Play Section */}
                    <div className="bg-white p-4 rounded-lg mb-4 shadow">
                        <h2 className="text-xl font-semibold mb-3">Current Play</h2>
                        <div className="grid md:grid-cols-3 gap-4">
                            <div>
                                <label className="block mb-1">Current Batsmen</label>
                                <div className="space-y-2">
                                    {matchData.data.current.batsmen.map((batsman, i) => (
                                        <div key={i} className="flex items-center">
                                            <span className="flex-1 p-2 border rounded bg-gray-50">
                                                {batsman}
                                                {i === matchData.data.current.striker && (
                                                    <span className="ml-2 px-2 py-1 bg-green-100 text-green-800 rounded text-xs">Striker</span>
                                                )}
                                                {i === matchData.data.current.nonStriker && (
                                                    <span className="ml-2 px-2 py-1 bg-gray-100 text-gray-800 rounded text-xs">Non-striker</span>
                                                )}
                                            </span>
                                        </div>
                                    ))}
                                    <button
                                        onClick={() => {
                                            const battingTeam = getBattingTeam();
                                            const newBatsmanName = prompt("Enter new batsman name");
                                            if (newBatsmanName) {
                                                addBatsman(battingTeam, newBatsmanName);
                                            }
                                        }}
                                        className="mt-2 p-2 bg-blue-100 rounded hover:bg-blue-200 text-sm"
                                    >
                                        Add New Batsman
                                    </button>
                                </div>
                            </div>
                            
                            <div>
                                <label className="block mb-1">Current Bowler</label>
                                <div className="space-y-2">
                                    <div className="flex flex-col space-y-2">
                                        <div className="flex items-center justify-between p-2 border rounded bg-gray-50">
                                            <span className="font-medium">{matchData.data.current.bowler}</span>
                                            {matchData.data.bowlingcard[getBowlingTeam()].find(b => b.name === matchData.data.current.bowler) && (
                                                <div className="text-sm text-gray-600">
                                                    {matchData.data.bowlingcard[getBowlingTeam()].find(b => b.name === matchData.data.current.bowler).overs} overs, 
                                                    {matchData.data.bowlingcard[getBowlingTeam()].find(b => b.name === matchData.data.current.bowler).wickets} wickets
                                                </div>
                                            )}
                                        </div>
                                        <button
                                            onClick={() => {
                                                const bowlingTeam = getBowlingTeam();
                                                const newBowlerName = prompt("Enter new bowler name");
                                                if (newBowlerName) {
                                                    addBowler(bowlingTeam, newBowlerName);
                                                }
                                            }}
                                            className="p-2 bg-blue-100 rounded hover:bg-blue-200 text-sm"
                                        >
                                            Change Bowler
                                        </button>
                                    </div>
                                </div>
                            </div>
                            
                            <div>
                                <label className="block mb-1">This Over</label>
                                <div className="flex flex-wrap gap-2">
                                    {matchData.data.current.thisOver.map((ball, i) => (
                                        <div key={i} className="flex flex-col items-center">
                                            <span className={`px-2 py-1 rounded ${
                                                ball.isWicket ? 'bg-red-200' :
                                                ball.extra ? 'bg-yellow-200' :
                                                'bg-gray-200'
                                            }`}>
                                                {ball.type === 'W' ? 'W' : 
                                                 ball.type === 'nb' ? 'NB' :
                                                 ball.type === 'wd' ? 'WD' :
                                                 ball.type === 'b' ? 'B' :
                                                 ball.type === 'lb' ? 'LB' :
                                                 ball.value}
                                            </span>
                                            {ball.dismissalType && (
                                                <span className="text-xs text-gray-500">
                                                    {ball.dismissalType}
                                                </span>
                                            )}
                                        </div>
                                    ))}
                                </div>
                                <div className="mt-2 grid grid-cols-3 gap-2">
                                    {[0, 1, 2, 3, 4, 6].map(val => (
                                        <button
                                            key={val}
                                            onClick={() => {
                                                const battingTeam = getBattingTeam();
                                                quickScoreUpdate(battingTeam, val, false);
                                            }}
                                            className="p-2 bg-blue-100 rounded hover:bg-blue-200"
                                        >
                                            {val}
                                        </button>
                                    ))}
                                </div>
                                <div className="mt-2 grid grid-cols-3 gap-2">
                                    <button
                                        onClick={() => {
                                            const battingTeam = getBattingTeam();
                                            const dismissalType = prompt("Enter dismissal type (e.g., Bowled, Caught, LBW):");
                                            if (dismissalType) {
                                                const dismissalInfo = prompt("Enter dismissal info (e.g., b Bowler, c Fielder b Bowler):");
                                                quickScoreUpdate(battingTeam, 0, true, false, null, dismissalType, dismissalInfo);
                                            }
                                        }}
                                        className="p-2 bg-red-100 rounded hover:bg-red-200"
                                    >
                                        Wicket
                                    </button>
                                    <button
                                        onClick={() => {
                                            const battingTeam = getBattingTeam();
                                            const runs = parseInt(prompt("Enter runs scored (0-6):")) || 0;
                                            quickScoreUpdate(battingTeam, runs, false, true, 'NB');
                                        }}
                                        className="p-2 bg-yellow-100 rounded hover:bg-yellow-200"
                                    >
                                        No Ball
                                    </button>
                                    <button
                                        onClick={() => {
                                            const battingTeam = getBattingTeam();
                                            const runs = parseInt(prompt("Enter runs scored (0-6):")) || 0;
                                            quickScoreUpdate(battingTeam, runs, false, true, 'WD');
                                        }}
                                        className="p-2 bg-yellow-100 rounded hover:bg-yellow-200"
                                    >
                                        Wide
                                    </button>
                                </div>
                                <div className="mt-2 grid grid-cols-2 gap-2">
                                    <button
                                        onClick={() => {
                                            const battingTeam = getBattingTeam();
                                            const runs = parseInt(prompt("Enter runs scored (0-6):")) || 0;
                                            quickScoreUpdate(battingTeam, runs, false, true, 'B');
                                        }}
                                        className="p-2 bg-yellow-100 rounded hover:bg-yellow-200"
                                    >
                                        Bye
                                    </button>
                                    <button
                                        onClick={() => {
                                            const battingTeam = getBattingTeam();
                                            const runs = parseInt(prompt("Enter runs scored (0-6):")) || 0;
                                            quickScoreUpdate(battingTeam, runs, false, true, 'LB');
                                        }}
                                        className="p-2 bg-yellow-100 rounded hover:bg-yellow-200"
                                    >
                                        Leg Bye
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Scorecard Section */}
                    <div className="bg-white p-4 rounded-lg mb-4 shadow">
                        <h2 className="text-xl font-semibold mb-3">Scorecard</h2>
                        <div className="overflow-x-auto">
                            <table className="min-w-full bg-white">
                                <thead>
                                    <tr className="bg-gray-100">
                                        <th className="py-2 px-4 border-b">Batsman</th>
                                        <th className="py-2 px-4 border-b">R</th>
                                        <th className="py-2 px-4 border-b">B</th>
                                        <th className="py-2 px-4 border-b">4s</th>
                                        <th className="py-2 px-4 border-b">6s</th>
                                        <th className="py-2 px-4 border-b">SR</th>
                                        <th className="py-2 px-4 border-b">Dismissal</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {matchData.data.scorecard[getBattingTeam()].map((batsman, index) => (
                                        <tr key={index} className={batsman.isOut ? "bg-red-50" : ""}>
                                            <td className="py-2 px-4 border-b">
                                                {batsman.name}
                                                {!batsman.isOut && (
                                                    <span className="ml-2 inline-block w-2 h-2 rounded-full bg-green-500"></span>
                                                )}
                                            </td>
                                            <td className="py-2 px-4 border-b">{batsman.runs}</td>
                                            <td className="py-2 px-4 border-b">{batsman.balls}</td>
                                            <td className="py-2 px-4 border-b">{batsman.fours}</td>
                                            <td className="py-2 px-4 border-b">{batsman.sixes}</td>
                                            <td className="py-2 px-4 border-b">{batsman.strikeRate}</td>
                                            <td className="py-2 px-4 border-b">{batsman.dismissal}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Bowling Card Section */}
                    <div className="bg-white p-4 rounded-lg mb-4 shadow">
                        <h2 className="text-xl font-semibold mb-3">Bowling Card</h2>
                        <div className="overflow-x-auto">
                            <table className="min-w-full bg-white">
                                <thead>
                                    <tr className="bg-gray-100">
                                        <th className="py-2 px-4 border-b">Bowler</th>
                                        <th className="py-2 px-4 border-b">O</th>
                                        <th className="py-2 px-4 border-b">M</th>
                                        <th className="py-2 px-4 border-b">R</th>
                                        <th className="py-2 px-4 border-b">W</th>
                                        <th className="py-2 px-4 border-b">Econ</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {matchData.data.bowlingcard[getBowlingTeam()].map((bowler, index) => (
                                        <tr key={index}>
                                            <td className="py-2 px-4 border-b">{bowler.name}</td>
                                            <td className="py-2 px-4 border-b">{bowler.overs}</td>
                                            <td className="py-2 px-4 border-b">{bowler.maidens}</td>
                                            <td className="py-2 px-4 border-b">{bowler.runs}</td>
                                            <td className="py-2 px-4 border-b">{bowler.wickets}</td>
                                            <td className="py-2 px-4 border-b">{bowler.economy}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Overs Table */}
                    <div className="bg-white p-4 rounded-lg mb-4 shadow">
                        <h2 className="text-xl font-semibold mb-3">Overs</h2>
                        <div className="overflow-x-auto">
                            <table className="min-w-full bg-white">
                                <thead>
                                    <tr className="bg-gray-100">
                                        <th className="py-2 px-4 border-b">Over</th>
                                        <th className="py-2 px-4 border-b">Runs</th>
                                        <th className="py-2 px-4 border-b">Wickets</th>
                                        <th className="py-2 px-4 border-b">Balls</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {matchData.data.overs[getBattingTeam()].map((over, index) => (
                                        <tr key={index}>
                                            <td className="py-2 px-4 border-b">{over.number}</td>
                                            <td className="py-2 px-4 border-b">{over.runs}</td>
                                            <td className="py-2 px-4 border-b">{over.wickets}</td>
                                            <td className="py-2 px-4 border-b">
                                                <div className="flex flex-wrap gap-1">
                                                    {over.balls.map((ball, i) => (
                                                        <span key={i} className="px-1 py-0.5 bg-gray-200 rounded text-xs">
                                                            {ball.value}
                                                        </span>
                                                    ))}
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Advanced Sections */}
                    {showAdvanced && (
                        <>
                            {/* Field Positions Section */}
                            {renderFieldPositions()}
                            
                            {/* Commentary Section */}
                            <div className="bg-white p-4 rounded-lg mb-4 shadow">
                                <h2 className="text-xl font-semibold mb-3">Commentary</h2>
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        placeholder="Add commentary..."
                                        value={newComment}
                                        onChange={(e) => setNewComment(e.target.value)}
                                        className="flex-1 p-2 border rounded"
                                    />
                                    <button 
                                        onClick={() => {
                                            // Get current time in HH:MM:SS format
                                            const now = new Date();
                                            const timeString = now.toLocaleTimeString('en-US', { 
                                                hour12: false, 
                                                hour: '2-digit', 
                                                minute: '2-digit',
                                                second: '2-digit'
                                            });
                                            
                                            // Determine current inning (1st or 2nd)
                                            const currentInning = isFirstInningsComplete() ? "2nd Innings" : "1st Innings";
                                            
                                            // Get current over count
                                            const battingTeam = getBattingTeam();
                                            const currentOver = matchData.data.teams[battingTeam].overs;
                                            
                                            // Extract runs and wickets from the commentary text if possible
                                            let runs = 0;
                                            let wickets = 0;
                                            
                                            // Check for common patterns in commentary
                                            if (newComment.includes("SIX") || newComment.includes("six")) {
                                                runs = 6;
                                            } else if (newComment.includes("FOUR") || newComment.includes("four")) {
                                                runs = 4;
                                            } else if (newComment.includes("THREE") || newComment.includes("three")) {
                                                runs = 3;
                                            } else if (newComment.includes("TWO") || newComment.includes("two")) {
                                                runs = 2;
                                            } else if (newComment.includes("ONE") || newComment.includes("one") || newComment.includes("SINGLE") || newComment.includes("single")) {
                                                runs = 1;
                                            } else if (newComment.includes("OUT") || newComment.includes("out") || newComment.includes("WICKET") || newComment.includes("wicket")) {
                                                wickets = 1;
                                            }
                                            
                                            setMatchData(prev => ({
                                                ...prev,
                                                data: {
                                                    ...prev.data,
                                                    commentary: [...prev.data.commentary, {
                                                        text: newComment,
                                                        timestamp: now.toISOString(),
                                                        time: timeString,
                                                        over: currentOver,
                                                        inning: currentInning,
                                                        runs: runs,
                                                        wickets: wickets
                                                    }]
                                                }
                                            }));
                                            setNewComment("");
                                            sendSocketUpdate();
                                        }}
                                        className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                                    >
                                        Add
                                    </button>
                                </div>
                                
                                {/* Display commentary entries */}
                                <div className="mt-4 max-h-60 overflow-y-auto">
                                    {matchData.data.commentary.map((entry, index) => (
                                        <div key={index} className="border-b py-2">
                                            <div className="flex justify-between text-sm text-gray-500">
                                                <span>{entry.time}</span>
                                                <span>{entry.inning} - {entry.over} overs</span>
                                            </div>
                                            <div className="flex items-center mt-1">
                                                <p className="flex-1">{entry.text}</p>
                                                {entry.runs > 0 && (
                                                    <span className="ml-2 px-2 py-1 bg-green-100 text-green-800 rounded text-xs">
                                                        {entry.runs} {entry.runs === 1 ? 'run' : 'runs'}
                                                    </span>
                                                )}
                                                {entry.wickets > 0 && (
                                                    <span className="ml-2 px-2 py-1 bg-red-100 text-red-800 rounded text-xs">
                                                        Wicket
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Full Scorecard Section */}
                            <div className="bg-white p-4 rounded-lg shadow">
                                <h2 className="text-xl font-semibold mb-3">Detailed Scorecard</h2>
                                {/* Add scorecard inputs here */}
                            </div>
                        </>
                    )}

                    <div className="mt-6 flex justify-between">
                        <button 
                            onClick={prevStep}
                            className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
                        >
                            Back: Match Settings
                        </button>
                        <button 
                            onClick={submitData}
                            className="px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                        >
                            Save Match Data
                        </button>
                    </div>
                </>
            )}
        </div>
    );
}

export default Cricket;
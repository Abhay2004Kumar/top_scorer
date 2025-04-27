import React, { useState, useEffect } from 'react';
import io from "socket.io-client";
import axios from 'axios';
import toast from "react-hot-toast";
import { FaCricket, FaPlus, FaTrash, FaSave, FaUndo, FaRedo, FaHistory, FaUpload, FaDownload, FaSync, FaTrophy, FaClock, FaUsers } from 'react-icons/fa';

const socket = io.connect(process.env.REACT_APP_BACKEND_URL);

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
            team1: { name: "", score: "0/0", overs: "0.0", logo: "" },
            team2: { name: "", score: "0/0", overs: "0.0", logo: "" }
        },
        current: {
            batsmen: ["", ""],
            bowler: "",
            thisOver: [],
            partnership: "0 (0)",
            lastOver: { runs: 0, wickets: 0 }
        },
        scorecard: [],
        bowlingcard: [],
        commentary: []
    }
};

function Cricket() {
    const [matchData, setMatchData] = useState(initialMatchData);
    const [newComment, setNewComment] = useState("");
    const [showAdvanced, setShowAdvanced] = useState(false);
    const [lastSaved, setLastSaved] = useState(null);
    const [isConnected, setIsConnected] = useState(false);
    const [currentBalls, setCurrentBalls] = useState(0);
    const [activeStep, setActiveStep] = useState(1); // 1: Team Setup, 2: Match Settings, 3: Scoring

    // Socket connection status
    useEffect(() => {
        const handleConnect = () => {
            setIsConnected(true);
            toast.success('Connected to server');
        };
        
        const handleDisconnect = () => {
            setIsConnected(false);
            toast.error('Disconnected from server');
        };
        
        socket.on('connect', handleConnect);
        socket.on('disconnect', handleDisconnect);
        
        return () => {
            socket.off('connect', handleConnect);
            socket.off('disconnect', handleDisconnect);
        };
    }, []);

    // Load saved data on component mount
    useEffect(() => {
        const loadSavedData = () => {
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
                }
            } catch (error) {
                console.error('Error parsing saved data:', error);
                toast.error('Error loading saved data');
            }
        };
        
        loadSavedData();
    }, []);

    // Auto-save to localStorage whenever matchData changes
    useEffect(() => {
        try {
            localStorage.setItem('cricketMatchData', JSON.stringify(matchData));
            setLastSaved(new Date().toISOString());
        } catch (error) {
            console.error('Error saving to localStorage:', error);
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
        }
        
        // Update overs
        handleTeamChange(team, 'overs', `${newFullOvers}.${newBalls}`);
    };

    const addBall = (value, isExtra = false) => {
        // Determine which team is batting (the one with non-zero score)
        const battingTeam = matchData.data.teams.team1.score !== "0/0" ? "team1" : "team2";
        
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
                    thisOver: [...prev.data.current.thisOver.slice(-5), value]
                }
            }
        }));
    };

    const quickScoreUpdate = (team, runs, isWicket, isExtra = false) => {
        // Get current score or initialize if empty
        const currentScore = matchData.data.teams[team].score || "0/0";
        const [currentRuns, currentWickets] = currentScore.split('/').map(Number);
        
        // Calculate new values, handling NaN cases
        const newRuns = (isNaN(currentRuns) ? 0 : currentRuns) + runs;
        const newWickets = (isNaN(currentWickets) ? 0 : currentWickets) + (isWicket ? 1 : 0);
        
        // Update the score
        handleTeamChange(team, 'score', `${newRuns}/${newWickets}`);
        
        // Add the ball to the current over
        addBall(runs, isExtra);
    };

    const submitData = async () => {
        try {
            await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/v1/sports/cricket`, matchData);
            toast.success("Match data saved!");
        } catch (error) {
            toast.error("Error saving data");
        }
    };

    const sendSocketUpdate = () => {
        if (!isConnected) {
            toast.error("Not connected to server");
            return;
        }
        
        socket.emit("cricket-update", matchData);
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
                                <label className="block mb-1">Batsmen</label>
                                <div className="space-y-2">
                                    {matchData.data.current.batsmen.map((batsman, i) => (
                                        <input
                                            key={i}
                                            type="text"
                                            placeholder={`Batsman ${i+1}`}
                                            value={batsman}
                                            onChange={(e) => {
                                                const newBatsmen = [...matchData.data.current.batsmen];
                                                newBatsmen[i] = e.target.value;
                                                setMatchData(prev => ({
                                                    ...prev,
                                                    data: {
                                                        ...prev.data,
                                                        current: { ...prev.data.current, batsmen: newBatsmen }
                                                    }
                                                }));
                                            }}
                                            className="w-full p-2 border rounded"
                                        />
                                    ))}
                                </div>
                            </div>
                            
                            <div>
                                <label className="block mb-1">Current Bowler</label>
                                <input
                                    type="text"
                                    placeholder="Bowler name"
                                    value={matchData.data.current.bowler}
                                    onChange={(e) => setMatchData(prev => ({
                                        ...prev,
                                        data: {
                                            ...prev.data,
                                            current: { ...prev.data.current, bowler: e.target.value }
                                        }
                                    }))}
                                    className="w-full p-2 border rounded"
                                />
                            </div>
                            
                            <div>
                                <label className="block mb-1">This Over</label>
                                <div className="flex flex-wrap gap-2">
                                    {matchData.data.current.thisOver.map((ball, i) => (
                                        <span key={i} className="px-2 py-1 bg-gray-200 rounded">
                                            {ball}
                                        </span>
                                    ))}
                                </div>
                                <div className="mt-2 grid grid-cols-3 gap-2">
                                    {[0, 1, 2, 3, 4, 6, 'W', 'N', 'Wd'].map(val => (
                                        <button
                                            key={val}
                                            onClick={() => {
                                                // Determine which team is batting
                                                const battingTeam = getBattingTeam();
                                                
                                                if (val === 'W') {
                                                    quickScoreUpdate(battingTeam, 0, true);
                                                } else if (val === 'N' || val === 'Wd') {
                                                    quickScoreUpdate(battingTeam, 1, false, true);
                                                } else {
                                                    quickScoreUpdate(battingTeam, val, false);
                                                }
                                            }}
                                            className="p-2 bg-blue-100 rounded hover:bg-blue-200"
                                        >
                                            {val}
                                        </button>
                                    ))}
                                </div>
                                <div className="mt-2 grid grid-cols-2 gap-2">
                                    <button
                                        onClick={() => {
                                            const battingTeam = getBattingTeam();
                                            quickScoreUpdate(battingTeam, 2, false, true);
                                        }}
                                        className="p-2 bg-yellow-100 rounded hover:bg-yellow-200"
                                    >
                                        Wide +2
                                    </button>
                                    <button
                                        onClick={() => {
                                            const battingTeam = getBattingTeam();
                                            quickScoreUpdate(battingTeam, 4, false, true);
                                        }}
                                        className="p-2 bg-yellow-100 rounded hover:bg-yellow-200"
                                    >
                                        Wide +4
                                    </button>
                                    <button
                                        onClick={() => {
                                            const battingTeam = getBattingTeam();
                                            quickScoreUpdate(battingTeam, 1, false, true);
                                        }}
                                        className="p-2 bg-yellow-100 rounded hover:bg-yellow-200"
                                    >
                                        Leg Bye
                                    </button>
                                    <button
                                        onClick={() => {
                                            const battingTeam = getBattingTeam();
                                            quickScoreUpdate(battingTeam, 4, false, true);
                                        }}
                                        className="p-2 bg-yellow-100 rounded hover:bg-yellow-200"
                                    >
                                        Bye +4
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Advanced Sections */}
                    {showAdvanced && (
                        <>
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
                                            setMatchData(prev => ({
                                                ...prev,
                                                data: {
                                                    ...prev.data,
                                                    commentary: [...prev.data.commentary, {
                                                        text: newComment,
                                                        timestamp: new Date().toISOString()
                                                    }]
                                                }
                                            }));
                                            setNewComment("");
                                        }}
                                        className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                                    >
                                        Add
                                    </button>
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
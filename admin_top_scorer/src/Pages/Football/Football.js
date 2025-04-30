import React, { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import toast from 'react-hot-toast';

const socket = io(process.env.REACT_APP_BACKEND_URL);
const STORAGE_KEY = 'footballMatchData';

// Simplified data structure
const initialTeam = {
  name: '',
  logo: '',
  score: 0,
  penalties: 0,
  players: new Set(),
  striker: '',
  keeper: ''
};

function Football() {
  const [status, setStatus] = useState('');
  const [commentaryInput, setCommentaryInput] = useState('');

  // Load/save data
  const [match, setMatch] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const data = JSON.parse(saved);
        if (data.timestamp && Date.now() - data.timestamp < 86400000) {
          return {
            ...data,
            teamA: {
              ...initialTeam,
              ...data.teamA,
              players: new Set(data.teamA?.players || [])
            },
            teamB: {
              ...initialTeam,
              ...data.teamB,
              players: new Set(data.teamB?.players || [])
            },
            isTimerRunning: false,
            isMatchFinished: false,
            commentaries: data.commentaries || []
          };
        }
      } catch (e) {
        localStorage.removeItem(STORAGE_KEY);
      }
    }
    return {
      teamA: { ...initialTeam },
      teamB: { ...initialTeam },
      timer: 0,
      isTimerRunning: false,
      isMatchFinished: false,
      commentaries: [],
      showPlayers: false
    };
  });

  // Timer logic
  useEffect(() => {
    let interval;
    if (match.isTimerRunning) {
      interval = setInterval(() => {
        setMatch(prev => ({ ...prev, timer: prev.timer + 1 }));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [match.isTimerRunning]);

  // Auto-save with debounce
  useEffect(() => {
    const saveData = {
      ...match,
      timestamp: Date.now()
    };
    const timeout = setTimeout(() => {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(saveData));
    }, 500);
    return () => clearTimeout(timeout);
  }, [match]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleTeamChange = (team, field, value) => {
    setMatch(prev => ({
      ...prev,
      [team]: { ...prev[team], [field]: value }
    }));
  };

  const togglePlayers = () => {
    setMatch(prev => ({
      ...prev,
      showPlayers: !prev.showPlayers,
      teamA: { ...prev.teamA, players: new Set(), striker: '', keeper: '' },
      teamB: { ...prev.teamB, players: new Set(), striker: '', keeper: '' }
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        name: "Football",
        data: {
          teamA: { ...match.teamA, players: [...match.teamA.players] },
          teamB: { ...match.teamB, players: [...match.teamB.players] },
          timer: formatTime(match.timer),
          commentaries: match.commentaries,
          isTimerRunning: match.isTimerRunning,
          isMatchFinished: match.isMatchFinished
        }
      };

      socket.emit('data', payload);
      console.log("Data", payload.data);
      toast.success('Data sent successfully');
      setTimeout(() => setStatus(''), 3000);
    } catch (error) {
      setStatus('Error sending data');
      toast.error('Failed to send data');
    }
  };

  const finishMatch = () => {
    if (window.confirm('Are you sure you want to finish the match?')) {
      setMatch(prev => ({
        ...prev,
        isTimerRunning: false,
        isMatchFinished: true
      }));
      toast.success('Match finished');
    }
  };

  const addCommentary = () => {
    if (!commentaryInput.trim()) return;
    
    const newCommentary = {
      time: formatTime(match.timer),
      text: commentaryInput.trim(),
      timestamp: Date.now()
    };

    setMatch(prev => ({
      ...prev,
      commentaries: [...prev.commentaries, newCommentary]
    }));

    setCommentaryInput('');
    toast.success('Commentary added');
  };

  const removeCommentary = (index) => {
    setMatch(prev => ({
      ...prev,
      commentaries: prev.commentaries.filter((_, i) => i !== index)
    }));
    toast.success('Commentary removed');
  };

  const handleCommentarySubmit = (e) => {
    e.preventDefault();
    addCommentary();
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        <h1 className="text-2xl font-bold text-center">Match Control</h1>
        
        {/* Timer Controls */}
        <div className="flex items-center justify-center gap-4">
          <button
            type="button"
            onClick={() => setMatch(prev => ({ ...prev, isTimerRunning: !prev.isTimerRunning }))}
            className={`px-4 py-2 rounded ${
              match.isMatchFinished 
                ? 'bg-gray-300 text-gray-600 cursor-not-allowed'
                : 'bg-blue-500 text-white hover:bg-blue-600'
            }`}
            disabled={match.isMatchFinished}
          >
            {match.isTimerRunning ? 'Stop' : 'Start'} Timer
          </button>
          <span className="text-xl font-mono">{formatTime(match.timer)}</span>
          <button
            type="button"
            onClick={() => setMatch(prev => ({ ...prev, timer: 0 }))}
            className={`px-4 py-2 rounded ${
              match.isMatchFinished 
                ? 'bg-gray-300 text-gray-600 cursor-not-allowed'
                : 'bg-red-500 text-white hover:bg-red-600'
            }`}
            disabled={match.isMatchFinished}
          >
            Reset Timer
          </button>
          {!match.isMatchFinished && (
            <button
              type="button"
              onClick={finishMatch}
              className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
            >
              Finish Match
            </button>
          )}
        </div>

        {/* Team Configuration */}
        <div className="grid md:grid-cols-2 gap-6">
          {['teamA', 'teamB'].map((team) => (
            <div key={team} className="bg-white p-4 rounded-lg shadow">
              <h2 className="text-lg font-semibold mb-4">{team.replace('team', 'Team ')}</h2>
              
              <input
                type="text"
                value={match[team].name}
                onChange={(e) => handleTeamChange(team, 'name', e.target.value)}
                placeholder="Team name"
                className="w-full mb-3 p-2 border rounded"
              />

              <input
                type="url"
                value={match[team].logo}
                onChange={(e) => handleTeamChange(team, 'logo', e.target.value)}
                placeholder="Logo URL"
                className="w-full mb-3 p-2 border rounded"
              />

              {match.showPlayers && (
                <>
                  <div className="space-y-2">
                    <label className="block">Players</label>
                    <input
                      type="text"
                      placeholder="Add player"
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          handleTeamChange(team, 'players', new Set([...match[team].players, e.target.value]));
                          e.target.value = '';
                        }
                      }}
                      className="w-full p-2 border rounded"
                    />
                    <div className="flex flex-wrap gap-2">
                      {[...match[team].players].map(player => (
                        <span key={player} className="bg-gray-100 px-2 py-1 rounded">
                          {player}
                        </span>
                      ))}
                    </div>
                  </div>

                  <select
                    value={match[team].striker}
                    onChange={(e) => handleTeamChange(team, 'striker', e.target.value)}
                    className="w-full mt-3 p-2 border rounded"
                  >
                    <option value="">Select Striker</option>
                    {[...match[team].players].map(player => (
                      <option key={player} value={player}>{player}</option>
                    ))}
                  </select>

                  <select
                    value={match[team].keeper}
                    onChange={(e) => handleTeamChange(team, 'keeper', e.target.value)}
                    className="w-full mt-3 p-2 border rounded"
                  >
                    <option value="">Select Keeper</option>
                    {[...match[team].players].map(player => (
                      <option key={player} value={player}>{player}</option>
                    ))}
                  </select>
                </>
              )}

              <div className="grid grid-cols-2 gap-4 mt-4">
                <input
                  type="number"
                  value={match[team].score}
                  onChange={(e) => handleTeamChange(team, 'score', e.target.value)}
                  placeholder="Score"
                  className="p-2 border rounded"
                />
                <input
                  type="number"
                  value={match[team].penalties}
                  onChange={(e) => handleTeamChange(team, 'penalties', e.target.value)}
                  placeholder="Penalties"
                  className="p-2 border rounded"
                />
              </div>
            </div>
          ))}
        </div>

        {/* Players Toggle */}
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={match.showPlayers}
            onChange={togglePlayers}
            className="h-4 w-4"
          />
          Enable Player Management
        </label>

        {/* Commentary */}
        <textarea
          value={match.commentary}
          onChange={(e) => setMatch(prev => ({ ...prev, commentary: e.target.value }))}
          placeholder="Live commentary..."
          className="w-full p-3 border rounded h-24"
          maxLength="500"
        />

        {/* Commentary Section */}
        <div className="mt-4">
          <h3 className="text-lg font-semibold mb-2">Live Commentary</h3>
          <form onSubmit={handleCommentarySubmit} className="mb-4">
            <div className="flex gap-2">
              <input
                type="text"
                value={commentaryInput}
                onChange={(e) => setCommentaryInput(e.target.value)}
                placeholder="Add new commentary..."
                className="flex-1 p-2 border rounded"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Add
              </button>
            </div>
          </form>
          
          <div className="space-y-2">
            {match.commentaries.map((commentary, index) => (
              <div
                key={index}
                className="p-3 bg-gray-100 rounded-lg flex justify-between items-center"
              >
                <div>
                  <span className="font-mono text-sm text-gray-500">
                    {commentary.time}
                  </span>
                  <span className="ml-2">{commentary.text}</span>
                </div>
                <button
                  onClick={() => removeCommentary(index)}
                  className="text-red-500 hover:text-red-700"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>

        <button
          type="submit"
          onClick={handleSubmit}
          className="w-full py-2 bg-green-500 text-white rounded hover:bg-green-600"
        >
          Publish Updates
        </button>

        {status && <p className="text-center text-sm text-gray-600">{status}</p>}
      </div>
    </div>
  );
}

export default Football;
import { Kabaddi } from "../Models/Kabaddi.model.js";

// const createKabaddiMatch = async (req, res) => {
//   try {
//     const { teamA, teamB } = req.body;

//     const newMatch = await Kabaddi.create({
//       teamA,
//       teamB,
//     });

//     res.status(201).json(newMatch);
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };

// const updateKabaddiMatch = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const { teamA, teamB, currentHalf, latestUpdate } = req.body;

//     const updatedMatch = await Kabaddi.findByIdAndUpdate(
//       id,
//       {
//         $set: {
//           teamA,
//           teamB,
//           currentHalf,
//           latestUpdate,
//         },
//       },
//       { new: true }
//     );

//     if (!updatedMatch) {
//       return res.status(404).json({ message: "Match not found" });
//     }

//     res.status(200).json(updatedMatch);
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };

// const getKabaddiMatches = async (req, res) => {
//   try {
//     const matches = await Kabaddi.find();
//     res.status(200).json(matches);
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };

// const getKabaddiMatchById = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const match = await Kabaddi.findById(id);

//     if (!match) {
//       return res.status(404).json({ message: "Match not found" });
//     }

//     res.status(200).json(match);
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };

// const deleteKabaddiMatch = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const deletedMatch = await Kabaddi.findByIdAndDelete(id);

//     if (!deletedMatch) {
//       return res.status(404).json({ message: "Match not found" });
//     }

//     res.status(200).json({ message: "Match deleted successfully" });
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };


// Create Kabaddi Match
const createKabaddiMatch = async (req, res) => {
  try {
    const { 
      teamA, 
      teamB, 
      matchTitle, 
      venue, 
      date, 
      matchType = "league",
      matchStatus = "upcoming"
    } = req.body;
    
    // Generate a unique match ID
    const matchId = "KAB-" + Date.now() + "-" + Math.floor(Math.random() * 1000);
    
    // Calculate total points for each team
    const calculateTotalPoints = (team) => {
      const totalPoints = ['set1Points', 'set2Points', 'set3Points'].reduce((acc, set) => {
        const setPoints = team[set] || {};
        return acc + (setPoints.raidPoints || 0) + (setPoints.tacklePoints || 0) + 
               (setPoints.allOuts || 0) + (setPoints.bonusPoints || 0);
      }, 0);
      return totalPoints;
    };

    // Ensure teams have the required structure
    if (!teamA.players || !Array.isArray(teamA.players)) {
      teamA.players = [];
    }
    
    if (!teamB.players || !Array.isArray(teamB.players)) {
      teamB.players = [];
    }
    
    // Calculate total points
    teamA.totalPoints = calculateTotalPoints(teamA);
    teamB.totalPoints = calculateTotalPoints(teamB);
    
    const newMatch = await Kabaddi.create({
      matchId,
      matchTitle,
      matchStatus,
      matchType,
      venue,
      date: date || new Date(),
      teamA,
      teamB,
      currentSet: 1,
      timeRemaining: "20:00",
      latestUpdate: "Match about to begin",
      winner: null,
      currentRaider: null,
      currentDefender: null,
      lastAction: {
        type: "none",
        player: null,
        points: 0,
        timestamp: new Date()
      }
    });

    res.status(201).json(newMatch);
  } catch (err) {
    console.error("Error creating Kabaddi match:", err);
    res.status(500).json({ message: err.message });
  }
};

// Update Kabaddi Match
const updateKabaddiMatch = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    
    // Calculate total points for each team if they are included in the update
    if (updateData.teamA) {
      const calculateTotalPoints = (team) => {
        const totalPoints = ['set1Points', 'set2Points', 'set3Points'].reduce((acc, set) => {
          const setPoints = team[set] || {};
          return acc + (setPoints.raidPoints || 0) + (setPoints.tacklePoints || 0) + 
                 (setPoints.allOuts || 0) + (setPoints.bonusPoints || 0);
        }, 0);
        return totalPoints;
      };
      
      updateData.teamA.totalPoints = calculateTotalPoints(updateData.teamA);
    }
    
    if (updateData.teamB) {
      const calculateTotalPoints = (team) => {
        const totalPoints = ['set1Points', 'set2Points', 'set3Points'].reduce((acc, set) => {
          const setPoints = team[set] || {};
          return acc + (setPoints.raidPoints || 0) + (setPoints.tacklePoints || 0) + 
                 (setPoints.allOuts || 0) + (setPoints.bonusPoints || 0);
        }, 0);
        return totalPoints;
      };
      
      updateData.teamB.totalPoints = calculateTotalPoints(updateData.teamB);
    }

    const updatedMatch = await Kabaddi.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true }
    );

    if (!updatedMatch) {
      return res.status(404).json({ message: "Match not found" });
    }

    res.status(200).json(updatedMatch);
  } catch (err) {
    console.error("Error updating Kabaddi match:", err);
    res.status(500).json({ message: err.message });
  }
};

// Get all Kabaddi Matches
const getKabaddiMatches = async (req, res) => {
  try {
    const { status, matchType } = req.query;
    
    // Build filter based on query parameters
    const filter = {};
    if (status) filter.matchStatus = status;
    if (matchType) filter.matchType = matchType;
    
    const matches = await Kabaddi.find(filter).sort({ date: -1 });
    res.status(200).json(matches);
  } catch (err) {
    console.error("Error fetching Kabaddi matches:", err);
    res.status(500).json({ message: err.message });
  }
};

// Get Kabaddi Match by ID
const getKabaddiMatchById = async (req, res) => {
  try {
    const { id } = req.params;
    const match = await Kabaddi.findById(id);

    if (!match) {
      return res.status(404).json({ message: "Match not found" });
    }

    res.status(200).json(match);
  } catch (err) {
    console.error("Error fetching Kabaddi match by ID:", err);
    res.status(500).json({ message: err.message });
  }
};

// Delete Kabaddi Match
const deleteKabaddiMatch = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedMatch = await Kabaddi.findByIdAndDelete(id);

    if (!deletedMatch) {
      return res.status(404).json({ message: "Match not found" });
    }

    res.status(200).json({ message: "Match deleted successfully" });
  } catch (err) {
    console.error("Error deleting Kabaddi match:", err);
    res.status(500).json({ message: err.message });
  }
};

// Update player stats
const updatePlayerStats = async (req, res) => {
  try {
    const { matchId, teamId, playerId, stats } = req.body;
    
    if (!matchId || !teamId || !playerId || !stats) {
      return res.status(400).json({ message: "Missing required fields" });
    }
    
    const match = await Kabaddi.findById(matchId);
    
    if (!match) {
      return res.status(404).json({ message: "Match not found" });
    }
    
    // Determine which team to update
    const teamField = teamId === 'A' ? 'teamA' : 'teamB';
    const team = match[teamField];
    
    // Find the player in the team's players array
    const playerIndex = team.players.findIndex(p => p.id === playerId);
    
    if (playerIndex === -1) {
      return res.status(404).json({ message: "Player not found in team" });
    }
    
    // Update player stats
    team.players[playerIndex].stats = {
      ...team.players[playerIndex].stats,
      ...stats
    };
    
    // Save the updated match
    await match.save();
    
    res.status(200).json({ message: "Player stats updated successfully", match });
  } catch (err) {
    console.error("Error updating player stats:", err);
    res.status(500).json({ message: err.message });
  }
};

// Update match status
const updateMatchStatus = async (req, res) => {
  try {
    const { matchId, status, winner } = req.body;
    
    if (!matchId || !status) {
      return res.status(400).json({ message: "Missing required fields" });
    }
    
    const updateData = { matchStatus: status };
    
    // If status is completed, winner must be provided
    if (status === 'completed' && !winner) {
      return res.status(400).json({ message: "Winner must be provided when completing a match" });
    }
    
    if (winner) {
      updateData.winner = winner;
    }
    
    const match = await Kabaddi.findByIdAndUpdate(
      matchId,
      { $set: updateData },
      { new: true }
    );
    
    if (!match) {
      return res.status(404).json({ message: "Match not found" });
    }
    
    res.status(200).json({ message: "Match status updated successfully", match });
  } catch (err) {
    console.error("Error updating match status:", err);
    res.status(500).json({ message: err.message });
  }
};

export {
  createKabaddiMatch,
  updateKabaddiMatch,
  getKabaddiMatches,
  getKabaddiMatchById,
  deleteKabaddiMatch,
  updatePlayerStats,
  updateMatchStatus
};




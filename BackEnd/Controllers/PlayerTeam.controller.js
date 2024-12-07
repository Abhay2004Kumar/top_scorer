import { Player } from "../Models/PlayersTeam.model.js";
import { Team } from "../Models/PlayersTeam.model.js";
// Create a new player record


const createPlayer = async (req, res) => {
  try {
    const { playerName, gameType } = req.body;

    const existingPlayer = await Player.findOne({ playerName, gameType });
    if (existingPlayer) {
      return res.status(400).json({ message: "Player with the same gameType already exists." });
    }

    const newPlayer = await Player.create({
      playerName,
      gameType,
    });

    res.status(201).json(newPlayer);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Function to update wins
const updateWinPlayer = async (req, res) => {
    try {
        const { playerName, gameType } = req.body;
        let { wins, losses, matchesPlayed } = req.body;
    
        // Find the player with the given playerName and gameType
        let player = await Player.findOne({ playerName, gameType });
    
        // If the player doesn't exist, create a new player
        if (!player) {
          player = new Player({
            playerName,
            gameType,
            wins: wins || 1, // If wins are not provided, default to 1
            losses: losses || 0, // If losses are not provided, default to 0
            matchesPlayed: matchesPlayed || 1, // If matchesPlayed is not provided, default to 1
          });
        } else {
          // Update existing player's stats
          player.matchesPlayed += 1; // Increment matches played by wins + losses
          player.wins += 1; // Increment wins
        }
    
        // Save the player document to the database
        await player.save();
    
        // Respond with the updated player data
        return res.status(200).json(player);
      } catch (error) {
        console.error(error.message);
        return res.status(500).json({ error: error.message });
      }
  };
  
  // Function to update losses
  const updateLossPlayer = async (req,res) => {
    try {
        const { playerName, gameType } = req.body;
        let { wins, losses, matchesPlayed } = req.body;
    
        // Find the player with the given playerName and gameType
        let player = await Player.findOne({ playerName, gameType });
    
        // If the player doesn't exist, create a new player
        if (!player) {
          player = new Player({
            playerName,
            gameType,
            wins: wins || 0, // If wins are not provided, default to 1
            losses: losses || 1, // If losses are not provided, default to 0
            matchesPlayed: matchesPlayed || 1, // If matchesPlayed is not provided, default to 1
          });
        } else {
          // Update existing player's stats
          player.matchesPlayed += 1; // Increment matches played by wins + losses
          player.losses += 1; // Increment wins
        }
    
        // Save the player document to the database
        await player.save();
    
        // Respond with the updated player data
        return res.status(200).json(player);
      } catch (error) {
        console.error(error.message);
        return res.status(500).json({ error: error.message });
      }
  };
  

// Get all players
const getAllPlayers = async (req, res) => {
  try {
    const players = await Player.find();
    res.status(200).json(players);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update player record with match result
const updatePlayerRecord = async (req, res) => {
    try {
      const { playerName, gameType} = req.body;
      let {wins, losses, matchesPlayed} = req.body
  
      let player = await Player.findOne({ playerName, gameType });
      if (!player) {
        player = new Player({
            playerName,
            gameType
          });
          wins=0
          losses=0
          matchesPlayed=0
      }
  
      player.matchesPlayed += wins + losses;
      player.wins += wins;
      player.losses += losses;
  
      await player.save();
      res.status(200).json(player);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
  

export { createPlayer, getAllPlayers, updatePlayerRecord, updateWinPlayer, updateLossPlayer };


// Create a new team record
const createTeam = async (req, res) => {
  try {
    const { teamName, gameType } = req.body;

    const existingTeam = await Team.findOne({ teamName, gameType });
    if (existingTeam) {
      return res.status(400).json({ message: "Team with the same gameType already exists." });
    }

    const newTeam = await Team.create({
      teamName,
      gameType,
    });

    res.status(201).json(newTeam);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Function to update wins
const updateWinTeam = async (req, res) => {
    try {
        const { teamName, gameType } = req.body;
        let { wins, losses, draws,matchesPlayed } = req.body;
    
        // Find the player with the given playerName and gameType
        let team = await Team.findOne({ teamName, gameType });
    
        // If the player doesn't exist, create a new player
        if (!team) {
          team = new Team({
            teamName,
            gameType,
            wins: wins || 1, // If wins are not provided, default to 1
            losses: losses || 0, // If losses are not provided, default to 0
            draws: draws || 0,
            matchesPlayed: matchesPlayed || 1, // If matchesPlayed is not provided, default to 1
          });
        } else {
          // Update existing player's stats
          team.matchesPlayed += 1; // Increment matches played by wins + losses
          team.wins += 1; // Increment wins
        }
    
        // Save the player document to the database
        await team.save();
    
        // Respond with the updated player data
        return res.status(200).json(team);
      } catch (error) {
        console.error(error.message);
        return res.status(500).json({ error: error.message });
      }
  };
  
  // Function to update losses
  const updateLossTeam = async (req,res) => {
    try {
        const { teamName, gameType } = req.body;
        let { wins, losses, draws,matchesPlayed } = req.body;
    
        // Find the player with the given playerName and gameType
        let team = await Team.findOne({ teamName, gameType });
    
        // If the player doesn't exist, create a new player
        if (!team) {
          team = new Team({
            teamName,
            gameType,
            wins: wins || 0, // If wins are not provided, default to 1
            losses: losses || 1, // If losses are not provided, default to 0
            draws: draws || 0,
            matchesPlayed: matchesPlayed || 1, // If matchesPlayed is not provided, default to 1
          });
        } else {
          // Update existing player's stats
          team.matchesPlayed += 1; // Increment matches played by wins + losses
          team.losses += 1; // Increment wins
        }
    
        // Save the player document to the database
        await team.save();
    
        // Respond with the updated player data
        return res.status(200).json(team);
      } catch (error) {
        console.error(error.message);
        return res.status(500).json({ error: error.message });
      }
  };

  const updateDrawTeam = async (req,res) => {
    try {
        const { teamName, gameType } = req.body;
        let { wins, losses, draws,matchesPlayed } = req.body;
    
        // Find the player with the given playerName and gameType
        let team = await Team.findOne({ teamName, gameType });
    
        // If the player doesn't exist, create a new player
        if (!team) {
          team = new Team({
            teamName,
            gameType,
            wins: wins || 0, // If wins are not provided, default to 1
            losses: losses || 0, // If losses are not provided, default to 0
            draws: draws || 1,
            matchesPlayed: matchesPlayed || 1, // If matchesPlayed is not provided, default to 1
          });
        } else {
          // Update existing player's stats
          team.matchesPlayed += 1; // Increment matches played by wins + losses
          team.draws += 1; // Increment wins
        }
    
        // Save the player document to the database
        await team.save();
    
        // Respond with the updated player data
        return res.status(200).json(team);
      } catch (error) {
        console.error(error.message);
        return res.status(500).json({ error: error.message });
      }
  };
  


// Get all teams
const getAllTeams = async (req, res) => {
  try {
    const teams = await Team.find();
    res.status(200).json(teams);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update team record with match result
const updateTeamRecord = async (req, res) => {
    try {
      const { teamName, gameType} = req.body;
      let {wins, losses, draws, matchesPlayed} = req.body
  
      let team = await Team.findOne({ teamName, gameType });
      if (!team) {
        team = new Team({
            teamName,
            gameType
          });
          wins=0
          losses=0
          matchesPlayed=0
          draws=0
      }
  
      team.matchesPlayed += wins + losses + draws;
      team.wins += wins;
      team.losses += losses;
      team.draws += draws;
  
      await team.save();
      res.status(200).json(team);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };

export { createTeam, getAllTeams, updateTeamRecord, updateDrawTeam, updateLossTeam, updateWinTeam};



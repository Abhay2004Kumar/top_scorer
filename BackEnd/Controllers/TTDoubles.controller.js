import { TennisDouble } from "../Models/TennisDouble.model.js";

// Create a new Tennis Doubles match
const createTennisDoubles = async (req, res) => {
  try {
    const { data } = req.body; // Extracting 'data' from request body
    console.log(data);

    // Create a new tennis doubles match with the provided data
    const newMatch = await TennisDouble.create({
      teamA: {
        name: data.teamA.name,
        player1: data.teamA.player1,
        player2: data.teamA.player2,
      },
      teamB: {
        name: data.teamB.name,
        player1: data.teamB.player1,
        player2: data.teamB.player2,
      },
      tmA_score:data.tmA_score ,
      tmB_score: data.tmB_score,
      latestUpdate: data.latestUpdate,
    });

    // Save the match with the current state
    await newMatch.save();
    res.status(201).json(newMatch); // Return the created match data
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update scores for the sets
const updateTennisDoublesScore = async (req, res) => {
  try {
    const { matchId, team, player, setNumber, score, latestUpdate } = req.body;

    // Validate the score does not exceed 21
    if (score > 21) {
      return res.status(400).json({ message: "Set score cannot exceed 21" });
    }

    // Find the match by matchId
    const match = await TennisDouble.findById(matchId);

    if (!match) {
      return res.status(404).json({ message: "Match not found" });
    }

    // Update the set score for the player
    if (team === "teamA") {
      if (player === "player1") {
        match.teamA[`player1_s${setNumber}score`] = score;
      } else if (player === "player2") {
        match.teamA[`player2_s${setNumber}score`] = score;
      } else {
        return res.status(400).json({ message: "Invalid player for teamA" });
      }
    } else if (team === "teamB") {
      if (player === "player1") {
        match.teamB[`player1_s${setNumber}score`] = score;
      } else if (player === "player2") {
        match.teamB[`player2_s${setNumber}score`] = score;
      } else {
        return res.status(400).json({ message: "Invalid player for teamB" });
      }
    } else {
      return res.status(400).json({ message: "Invalid team" });
    }

    // If 'latestUpdate' is provided, update it
    if (latestUpdate) {
      match.latestUpdate = latestUpdate;
    }

    // Calculate total scores for both teams
    const teamATotal =
      match.teamA.player1.s1score +
      match.teamA.player1.s2score +
      match.teamA.player1.s3score +
      match.teamA.player2.s1score +
      match.teamA.player2.s2score +
      match.teamA.player2.s3score;

    const teamBTotal =
      match.teamB.player1.s1score +
      match.teamB.player1.s2score +
      match.teamB.player1.s3score +
      match.teamB.player2.s1score +
      match.teamB.player2.s2score +
      match.teamB.player2.s3score;

    // Determine winner if match is completed
    if (teamATotal > teamBTotal) {
      match.winner = "teamA";
      match.latestUpdate = "completed";
    } else if (teamBTotal > teamATotal) {
      match.winner = "teamB";
      match.latestUpdate = "completed";
    }

    // Save the updated match
    await match.save();
    res.status(200).json(match);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get all tennis doubles matches
const getTennisDoubles = async (req, res) => {
  try {
    const matches = await TennisDouble.find();
    res.status(200).json(matches);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export { createTennisDoubles, updateTennisDoublesScore, getTennisDoubles };

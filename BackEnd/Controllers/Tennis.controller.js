import { TennisSingle } from "../Models/TennisSingle.model.js";


// Create a new Tennis Single match
const createTennisSingle = async (req, res) => {
    try {
        const { data } = req.body;  // Extracting 'data' from request body
        console.log(data);

        // Create a new tennis match with the provided data
        const newMatch = await TennisSingle.create({
            teamA: {
                name: data.teamA.name,
                player: data.teamA.player,
            },
            teamB: {
                name: data.teamB.name,
                player: data.teamB.player,
            },
            latestUpdate: data.latestUpdate || "match started",  // Default to "match started" if not provided
        });

        // Save the match with the current state
        await newMatch.save();
        res.status(201).json(newMatch);  // Return the created match data
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Update scores for the sets
const updateTennisSingleScore = async (req, res) => {
    try {
        const { matchId, team, score, setNumber, latestUpdate } = req.body;

        // Validate the score does not exceed 21
        if (score > 21) {
            return res.status(400).json({ message: "Set score cannot exceed 21" });
        }

        // Find the match by matchId
        const match = await TennisSingle.findById(matchId);

        if (!match) {
            return res.status(404).json({ message: "Match not found" });
        }

        // If 'latestUpdate' is provided, update it. Otherwise, keep the previous value
        if (latestUpdate) {
            match.latestUpdate = latestUpdate;
        }

        // Update the set score for the team
        if (team === "teamA") {
            match.tmA_score[setNumber - 1] = score;  // Set the score for the current set in teamA's score array
        } else if (team === "teamB") {
            match.tmB_score[setNumber - 1] = score;  // Set the score for the current set in teamB's score array
        } else {
            return res.status(400).json({ message: "Invalid team" });
        }

        // Check if the match is completed (both teams have completed all sets)
        const teamATotal = match.tmA_score.reduce((sum, score) => sum + score, 0);
        const teamBTotal = match.tmB_score.reduce((sum, score) => sum + score, 0);

        if (teamATotal >= 0 && teamBTotal >= 0) {
            if (teamATotal > teamBTotal) {
                match.winner = "teamA";
                match.latestUpdate = "completed";  // Optionally update latestUpdate to "completed"
            } else if (teamBTotal > teamATotal) {
                match.winner = "teamB";
                match.latestUpdate = "completed";  // Optionally update latestUpdate to "completed"
            }
        }

        // Save the updated match
        await match.save();
        res.status(200).json(match);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Get all tennis singles matches
const getTennisSingles = async (req, res) => {
    try {
        const matches = await TennisSingle.find();
        res.status(200).json(matches);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

export {
    createTennisSingle,
    updateTennisSingleScore,
    getTennisSingles,
};

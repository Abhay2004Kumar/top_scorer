import { TennisSingle } from "../Models/TennisSingle.model.js";

const createTennisSingle = async (req, res) => {
    try {
        const { data } = req.body;  // Extracting 'data' from request body
        console.log(data);

        // Create a new tennis match with the provided data
        const newMatch = await TennisSingle.create({
            player1: data.player1,
            player2: data.player2,
        });

        // Calculate the total scores for each player after creating the match
        let player1Total = newMatch.player1.s1score + newMatch.player1.s2score + newMatch.player1.s3score;
        let player2Total = newMatch.player2.s1score + newMatch.player2.s2score + newMatch.player2.s3score;

        // Determine the winner based on total score
        if (player1Total > player2Total) {
            console.log(`${newMatch.player1.name} has won`);
            newMatch.winner = "player1";
        } else if (player2Total > player1Total) {
            console.log(`${newMatch.player2.name} has won`);
            newMatch.winner = "player2";
        }

        // Save the match with the winner
        await newMatch.save();
        res.status(201).json(newMatch);  // Return the created match data
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Update scores for the sets
const updateTennisSingleScore = async (req, res) => {
    try {
        const { matchId, player, setNumber, score } = req.body;

        // Validate the score does not exceed 21
        if (score > 21) {
            return res.status(400).json({ message: "Set score cannot exceed 21" });
        }

        // Find the match by matchId
        const match = await TennisSingle.findById(matchId);

        if (!match) {
            return res.status(404).json({ message: "Match not found" });
        }

        // Update the set score for the player
        if (player === "player1") {
            match.player1[`s${setNumber}score`] = score;
        } else if (player === "player2") {
            match.player2[`s${setNumber}score`] = score;
        } else {
            return res.status(400).json({ message: "Invalid player" });
        }

        // Check if the match is completed (both players have completed all sets)
        const player1Total = match.player1.s1score + match.player1.s2score + match.player1.s3score;
        const player2Total = match.player2.s1score + match.player2.s2score + match.player2.s3score;

        if (player1Total >= 0 && player2Total >= 0) {
            if (player1Total > player2Total) {
                match.winner = "player1";
                match.matchStatus = "completed";
            } else if (player2Total > player1Total) {
                match.winner = "player2";
                match.matchStatus = "completed";
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


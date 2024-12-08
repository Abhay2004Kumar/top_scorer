import { TennisDoubles } from "../Models/TennisDouble.model.js";

const createTennisDoubles = async (req, res) => {
    try {
        const { data } = req.body;  // Extracting 'data' from request body
        console.log(data);

        // Create a new tennis doubles match with the provided data
        const newMatch = await TennisDoubles.create({
            team1: {
                player1: data.team1.player1,
                player2: data.team1.player2,
            },
            team2: {
                player1: data.team2.player1,
                player2: data.team2.player2,
            },
        });

        // Calculate the total scores for each team after creating the match
        let team1Total = newMatch.team1.player1.s1score + newMatch.team1.player1.s2score + newMatch.team1.player1.s3score
                        + newMatch.team1.player2.s1score + newMatch.team1.player2.s2score + newMatch.team1.player2.s3score;

        let team2Total = newMatch.team2.player1.s1score + newMatch.team2.player1.s2score + newMatch.team2.player1.s3score
                        + newMatch.team2.player2.s1score + newMatch.team2.player2.s2score + newMatch.team2.player2.s3score;

        // Determine the winner based on total score
        if (team1Total > team2Total) {
            console.log(`${newMatch.team1.player1.teamname} and ${newMatch.team1.player2.teamname} have won`);
            newMatch.winner = "team1";
        } else if (team2Total > team1Total) {
            console.log(`${newMatch.team2.player1.teamname} and ${newMatch.team2.player2.teamname} have won`);
            newMatch.winner = "team2";
        }

        // Save the match with the winner
        await newMatch.save();
        res.status(201).json(newMatch);  // Return the created match data
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Update scores for the sets
const updateTennisDoublesScore = async (req, res) => {
    try {
        const { matchId, team, player, setNumber, score } = req.body;

        // Validate the score does not exceed 21
        if (score > 21) {
            return res.status(400).json({ message: "Set score cannot exceed 21" });
        }

        // Find the match by matchId
        const match = await TennisDoubles.findById(matchId);

        if (!match) {
            return res.status(404).json({ message: "Match not found" });
        }

        // Update the set score for the player
        if (team === "team1") {
            if (player === "player1") {
                match.team1.player1[`s${setNumber}score`] = score;
            } else if (player === "player2") {
                match.team1.player2[`s${setNumber}score`] = score;
            } else {
                return res.status(400).json({ message: "Invalid player for team1" });
            }
        } else if (team === "team2") {
            if (player === "player1") {
                match.team2.player1[`s${setNumber}score`] = score;
            } else if (player === "player2") {
                match.team2.player2[`s${setNumber}score`] = score;
            } else {
                return res.status(400).json({ message: "Invalid player for team2" });
            }
        } else {
            return res.status(400).json({ message: "Invalid team" });
        }

        // Check if the match is completed (both teams have completed all sets)
        const team1Total = match.team1.player1.s1score + match.team1.player1.s2score + match.team1.player1.s3score
                          + match.team1.player2.s1score + match.team1.player2.s2score + match.team1.player2.s3score;

        const team2Total = match.team2.player1.s1score + match.team2.player1.s2score + match.team2.player1.s3score
                          + match.team2.player2.s1score + match.team2.player2.s2score + match.team2.player2.s3score;

        if (team1Total >= 0 && team2Total >= 0) {
            if (team1Total > team2Total) {
                match.winner = "team1";
                match.matchStatus = "completed";
            } else if (team2Total > team1Total) {
                match.winner = "team2";
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

// Get all tennis doubles matches
const getTennisDoubles = async (req, res) => {
    try {
        const matches = await TennisDoubles.find();
        res.status(200).json(matches);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

export {
    createTennisDoubles,
    updateTennisDoublesScore,
    getTennisDoubles,
};
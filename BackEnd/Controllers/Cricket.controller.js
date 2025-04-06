import { CricketMatch } from "../Models/Cricket.model.js";
import { Player } from "../Models/PlayersTeam.model.js";
import { Team } from "../Models/PlayersTeam.model.js";

// Utility function to calculate SR and RR
const calculateStrikeRate = (runs, balls) => (balls > 0 ? (runs / balls) * 100 : 0);
const calculateRunRate = (totalRuns, overs) => (overs > 0 ? totalRuns / overs : 0);

export const createMatch = async (req, res) => {
  try {
    const match = await CricketMatch.create(req.body);
    res.status(201).json({ success: true, match });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

export const getMatch = async (req, res) => {
  try {
    const match = await CricketMatch.findById(req.params.id)
      .populate("innings.batsmen.player")
      .populate("innings.bowlers.player")
      .populate("innings.battingTeam innings.bowlingTeam")
      .populate("toss.winner")
      .populate("playerOfTheMatch");

    if (!match) return res.status(404).json({ message: "Match not found" });

    res.status(200).json({ success: true, match });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const updateInnings = async (req, res) => {
  try {
    const { matchId, inningIndex, batsmen, bowlers, totalRuns, overs, wicketsLost } = req.body;

    const match = await CricketMatch.findById(matchId);
    if (!match) return res.status(404).json({ message: "Match not found" });

    const updatedBatsmen = batsmen.map(bat => ({
      ...bat,
      strikeRate: calculateStrikeRate(bat.runs, bat.balls)
    }));

    const updatedBowlers = bowlers.map(bowl => ({
      ...bowl,
      economy: calculateRunRate(bowl.runsConceded, bowl.overs)
    }));

    match.innings[inningIndex].batsmen = updatedBatsmen;
    match.innings[inningIndex].bowlers = updatedBowlers;
    match.innings[inningIndex].totalRuns = totalRuns;
    match.innings[inningIndex].overs = overs;
    match.innings[inningIndex].wicketsLost = wicketsLost;
    match.innings[inningIndex].runRate = calculateRunRate(totalRuns, overs);

    await match.save();
    res.status(200).json({ success: true, match });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const finishMatch = async (req, res) => {
  try {
    const { matchId, result, playerOfTheMatchId } = req.body;

    const match = await CricketMatch.findById(matchId);
    if (!match) return res.status(404).json({ message: "Match not found" });

    match.status = "Completed";
    match.result = result;
    match.playerOfTheMatch = playerOfTheMatchId;

    await match.save();
    res.status(200).json({ success: true, message: "Match marked as completed", match });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getLiveMatches = async (req, res) => {
  try {
    const matches = await CricketMatch.find({ status: "Live" })
      .populate("innings.battingTeam innings.bowlingTeam")
      .populate("toss.winner");

    res.status(200).json({ success: true, matches });
  } catch (err) {
    console.log("Error in server: ", err);
    res.status(500).json({ message: err.message });
  }
};

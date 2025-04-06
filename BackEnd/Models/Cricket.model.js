import mongoose from "mongoose";

const batsmanSchema = new mongoose.Schema({
  player: { type: mongoose.Schema.Types.ObjectId, ref: "Player", required: true },
  runs: { type: Number, default: 0 },
  balls: { type: Number, default: 0 },
  fours: { type: Number, default: 0 },
  sixes: { type: Number, default: 0 },
  strikeRate: { type: Number, default: 0 }, // SR = (runs / balls) * 100
  isOut: { type: Boolean, default: false },
  dismissalInfo: { type: String, default: "" },
});

const bowlerSchema = new mongoose.Schema({
  player: { type: mongoose.Schema.Types.ObjectId, ref: "Player", required: true },
  overs: { type: Number, default: 0 }, // Can be like 2.3 overs
  runsConceded: { type: Number, default: 0 },
  wickets: { type: Number, default: 0 },
  economy: { type: Number, default: 0 }, // Eco = runsConceded / overs
});

const inningsSchema = new mongoose.Schema({
  battingTeam: { type: mongoose.Schema.Types.ObjectId, ref: "Team", required: true },
  bowlingTeam: { type: mongoose.Schema.Types.ObjectId, ref: "Team", required: true },
  totalRuns: { type: Number, default: 0 },
  wicketsLost: { type: Number, default: 0 },
  overs: { type: Number, default: 0 },
  runRate: { type: Number, default: 0 }, // RR = totalRuns / overs
  batsmen: [batsmanSchema],
  bowlers: [bowlerSchema],
  fallOfWickets: [String], // Optional: e.g., ["24/1 (Head, 3.1 ov)"]
});

const CricketMatchSchema = new mongoose.Schema(
  {
    matchTitle: String, // e.g. "SRH vs GT"
    matchDate: { type: Date, required: true },
    venue: { type: String, required: true },
    gameType: {
      type: String,
      enum: ["T20", "ODI", "Test"],
      required: true,
    },
    status: {
      type: String,
      enum: ["Scheduled", "Live", "Completed"],
      default: "Scheduled",
    },
    toss: {
      winner: { type: mongoose.Schema.Types.ObjectId, ref: "Team" },
      decision: { type: String, enum: ["bat", "bowl"] },
    },
    innings: [inningsSchema],
    result: { type: String }, // e.g., "GT won by 5 wickets"
    playerOfTheMatch: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Player",
    },
    winProbability: {
      teamA: { type: Number, default: 50 },
      teamB: { type: Number, default: 50 },
    },
  },
  { timestamps: true }
);

export const CricketMatch = mongoose.model("CricketMatch", CricketMatchSchema);

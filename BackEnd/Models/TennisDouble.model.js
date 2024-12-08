import mongoose from "mongoose";

// Player schema
const PlayerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  teamname: {
    type: String,
    required: true,
  },
  teamlogo: {
    type: String,
    required: true,
  },
  s1score: {
    type: Number,
    default: 0,
    min: 0,
  },
  s2score: {
    type: Number,
    default: 0,
    min: 0,
  },
  s3score: {
    type: Number,
    default: 0,
    min: 0,
  },
}, { _id: false });

// Doubles schema
const TennisDoublesSchema = new mongoose.Schema(
  {
    team1: {
      player1: PlayerSchema,
      player2: PlayerSchema,
    },
    team2: {
      player1: PlayerSchema,
      player2: PlayerSchema,
    },
    winner: {
      type: String,
      enum: ["team1", "team2", null], // Tracks the winner, null means no winner yet
      default: null,
    },
    matchStatus: {
      type: String,
      enum: ["ongoing", "completed"],
      default: "ongoing",
    },
  },
  { timestamps: true }
);

// Create and export the model
export const TennisDoubles = mongoose.model("TennisDoubles", TennisDoublesSchema);

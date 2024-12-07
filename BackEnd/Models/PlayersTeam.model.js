// models/Player.model.js
import mongoose from "mongoose";

const PlayerSchema = new mongoose.Schema(
  {
    playerName: {
      type: String,
      required: true,
    },
    gameType: {
      type: String,
      required: true,
    },
    wins: {
      type: Number,
      default: 0,
    },
    losses: {
      type: Number,
      default: 0,
    },
    matchesPlayed: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

export const Player = mongoose.model("Player", PlayerSchema);

// models/Team.model.js
const TeamSchema = new mongoose.Schema(
  {
    teamName: {
      type: String,
      required: true,
    },
    gameType: {
      type: String,
      required: true,
    },
    wins: {
      type: Number,
      default: 0,
    },
    losses: {
      type: Number,
      default: 0,
    },
    draws: {
      type: Number,
      default: 0,
    },
    matchesPlayed: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

export const Team = mongoose.model("Team", TeamSchema);

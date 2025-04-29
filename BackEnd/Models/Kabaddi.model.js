import mongoose from "mongoose";

// Player Schema for Kabaddi
const PlayerSchema = new mongoose.Schema({
  id: { type: Number, required: true },
  name: { type: String, required: true },
  number: { type: String, required: true },
  position: { type: String, enum: ["Raider", "Defender", "All-Rounder"], required: true },
  stats: {
    raidPoints: { type: Number, default: 0 },
    tacklePoints: { type: Number, default: 0 },
    successfulRaids: { type: Number, default: 0 },
    doOrDieRaids: { type: Number, default: 0 },
    superRaids: { type: Number, default: 0 },
    superTackles: { type: Number, default: 0 }
  }
}, { _id: false });

// Set Points Schema
const SetPointsSchema = new mongoose.Schema({
  raidPoints: { type: Number, default: 0 },
  tacklePoints: { type: Number, default: 0 },
  allOuts: { type: Number, default: 0 },
  bonusPoints: { type: Number, default: 0 },
  totalPoints: { type: Number, default: 0 }
}, { _id: false });

// Team Schema for Kabaddi
const TeamSchema = new mongoose.Schema({
  name: { type: String, required: true },
  shortName: { type: String, required: true },
  logo: { type: String, default: "" },
  players: [PlayerSchema],
  set1Points: { type: SetPointsSchema, default: () => ({}) },
  set2Points: { type: SetPointsSchema, default: () => ({}) },
  set3Points: { type: SetPointsSchema, default: () => ({}) },
  totalPoints: { type: Number, default: 0 },
  doOrDieRaids: { type: Number, default: 0 },
  successfulRaids: { type: Number, default: 0 },
  superRaids: { type: Number, default: 0 },
  superTackles: { type: Number, default: 0 },
  reviewPoints: { type: Number, default: 0 },
  timeouts: { type: Number, default: 2 },
  substitutions: { type: Number, default: 5 }
}, { _id: false });

// Last Action Schema
const LastActionSchema = new mongoose.Schema({
  type: { 
    type: String, 
    enum: ["raid", "tackle", "allout", "bonus", "review", "none"], 
    default: "none" 
  },
  player: { type: String, default: null },
  points: { type: Number, default: 0 },
  timestamp: { type: Date, default: Date.now }
}, { _id: false });

// Kabaddi Match Schema
const kabaddiSchema = new mongoose.Schema({
  matchId: { 
    type: String, 
    required: true, 
    unique: true 
  },
  matchTitle: { 
    type: String, 
    required: true 
  },
  matchStatus: { 
    type: String, 
    enum: ["upcoming", "live", "completed"], 
    default: "upcoming" 
  },
  matchType: { 
    type: String, 
    enum: ["league", "knockout", "final"], 
    default: "league" 
  },
  venue: { 
    type: String, 
    required: true 
  },
  date: { 
    type: Date, 
    required: true 
  },
  teamA: { type: TeamSchema, required: true },
  teamB: { type: TeamSchema, required: true },
  currentSet: { 
    type: Number, 
    default: 1,
    min: 1,
    max: 3
  },
  timeRemaining: { 
    type: String, 
    default: "20:00" 
  },
  latestUpdate: { 
    type: String, 
    default: "Match about to begin" 
  },
  winner: { 
    type: String, 
    enum: ["teamA", "teamB", null], 
    default: null 
  },
  currentRaider: { 
    type: String, 
    default: null 
  },
  currentDefender: { 
    type: String, 
    default: null 
  },
  lastAction: { 
    type: LastActionSchema, 
    default: () => ({}) 
  }
}, { timestamps: true });

const Kabaddi = mongoose.model('Kabaddi', kabaddiSchema);

export { Kabaddi };




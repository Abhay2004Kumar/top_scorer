import mongoose from "mongoose";

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

const TennisSingleSchema = new mongoose.Schema(
  {
    player1: PlayerSchema,
    player2: PlayerSchema,
    winner: {
      type: String,
      enum: ["player1", "player2", null],  // Tracks the winner, null means no winner yet
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

export const TennisSingle = mongoose.model("TennisSingle", TennisSingleSchema);

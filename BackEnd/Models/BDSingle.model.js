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
    min:0,
  },
  s2score: {
    type: Number,
    default: 0,
    min:0,
  },
  s3score: {
    type: Number,
    default: 0,
    min:0,
  },
},{_id:false});

const BDSingleSchema = new mongoose.Schema(
  {
    player1:PlayerSchema,
    player2: PlayerSchema,
  },
  { timestamps: true }
);

export const BDSingle = mongoose.model("BDSingle", BDSingleSchema);

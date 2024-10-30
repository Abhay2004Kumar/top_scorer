import mongoose from "mongoose";

// const PlayerSchema = new mongoose.Schema({
//   name: {
//     type: String,
//     required: true,
//   },
//   teamname: {
//     type: String,
//     required: true,
//   },
//   teamlogo: {
//     type: String,
//     required: true,
//   },
//   s1score: {
//     type: Number,
//     default: 0,
//     min:0,
//   },
//   s2score: {
//     type: Number,
//     default: 0, 
//     min:0,
//   },
//   s3score: {
//     type: Number,
//     default: 0,
//     min:0,
//   },
// },{_id:false});

const BDSingleSchema = new mongoose.Schema(
  {
   teamA: {
      name: {
        type:String,
        required:true,
      }, 
      player: {
        type:String,
        required:true,
      },
    },
    teamB: {
      name: {
        type:String,
        required:true,
      }, 
      player: {
        type:String,
        required:true,
      },
    },
    tmA_score: [],
    tmB_score: [],
    currentSet:{
      type:Number,
    },
    latestUpdate:{
      type:String,
      default:"NULL",
    }
  },
  { timestamps: true }
);

export const BDSingle = mongoose.model("BDSingle", BDSingleSchema);

import mongoose from "mongoose";


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

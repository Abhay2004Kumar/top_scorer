import mongoose from "mongoose";


const TennisDoublesSchema = new mongoose.Schema(
  {
    teamA: {
       name: {
         type:String,
         required:true,
       }, 
       player1: {
         type:String,
         required:true,
       },
       player2: {
         type:String,
         required:true,
       },
     },
     teamB: {
       name: {
         type:String, 
         required:true, 
       }, 
       player1: {
         type:String,
         required:true,
       },
       player2: {
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

// Create and export the model
export const TennisDouble = mongoose.model("TennisDoubles", TennisDoublesSchema);

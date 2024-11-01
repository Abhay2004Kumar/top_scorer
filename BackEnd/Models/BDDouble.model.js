import mongoose from "mongoose";

const BDDoubleSchema = new mongoose.Schema(
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

export const BDDouble = mongoose.model("BDDouble", BDDoubleSchema);

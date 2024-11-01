import { BDDouble } from "../Models/BDDouble.model.js";

const createBDDoubles = async(req,res)=>{
    try{
         const {data} = req.body;
         const newMatch = await BDDouble.create({
            teamA:data.teamA,
            teamB:data.teamB,
            tmA_score: data.tmA_score || [],     
            tmB_score: data.tmB_score || [],
            currentSet: data.currentSet || 1,      
            latestUpdate: data.latestUpdate || "NULL"
         })
         res.status(200).json({
            message:newMatch
         })
    }catch(err){
        res.status(500).json({ 
            message:err
        })
    }
}

export {
    createBDDoubles 
}
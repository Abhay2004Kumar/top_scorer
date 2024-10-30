import { BDSingle } from "../Models/BDSingle.model.js";

const createBDSingle = async (req, res) => {
    try {
      
        const { teamA, teamB, tmA_score, tmB_score, currentSet, latestUpdate } = req.body;

      
        const newMatch = await BDSingle.create({
            teamA,
            teamB,
            tmA_score: tmA_score || [],     
            tmB_score: tmB_score || [],
            currentSet: currentSet || 1,      
            latestUpdate: latestUpdate || "NULL"
        });

    
        res.status(201).json( newMatch);
    } catch (err) {
    
        res.status(500).json({
            message: err.message,
        });
    }
};


export {
    createBDSingle
}
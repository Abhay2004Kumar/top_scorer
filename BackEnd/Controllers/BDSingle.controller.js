import { BDSingle } from "../Models/BDSingle.model.js";

const createBDSingle = async (req, res) => {
    try {
      
        const { data } = req.body;
// console.log(data);
      
        const newMatch = await BDSingle.create({
            teamA:data.teamA,
            teamB:data.teamB,
            tmA_score: data.tmA_score || [],     
            tmB_score: data.tmB_score || [],
            currentSet: data.currentSet || 1,      
            latestUpdate: data.latestUpdate || "NULL"
        });

    
        res.status(201).json( newMatch);
    } catch (err) {
    
        res.status(500).json({
            message: err.message,
        });
    }
};

const getBDSingle = async(req,res) => {
    try {
        const data = await BDSingle.find();
         console.log("dddd" , data);
         res.status(200).json(data);

    } catch (error) {
        res.status(500).json(error);
        // console.log(error);
    }
}


export {
    createBDSingle,
    getBDSingle
}
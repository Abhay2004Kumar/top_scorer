import { BDSingle } from "../Models/BDSingle.model.js";
import { updateWinPlayer, updateWinTeam } from "./PlayerTeam.controller.js";

const createBDSingle = async (req, res) => {
    try {
      
        const { data } = req.body;
        console.log(data);
      
        const newMatch = await BDSingle.create({
            teamA:data.teamA,
            teamB:data.teamB,
            tmA_score: data.tmA_score || [],     
            tmB_score: data.tmB_score || [],
            currentSet: data.currentSet || 1,      
            latestUpdate: data.latestUpdate || "NULL"
        });

        let scoreA=0;
        let scoreB=0;
        for (let i = 0 ; i<newMatch.tmA_score.length;i++)
        {
            scoreA+=newMatch.tmA_score[i];}

        for (let i = 0 ; i<newMatch.tmA_score.length;i++)
            {
                scoreB+=newMatch.tmB_score[i];
            }

        if (scoreA>scoreB)
        {

            let {name,player} =newMatch.teamA;
            console.log(`${name} has won`)

        }
        else{
            let {name,player} =newMatch.teamB;
            console.log(`${name} has won`)
        }

    
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
        //  console.log("dddd" , data);
         res.status(200).json(data);

    } catch (error) {
        res.status(500).json(error); // interval server error
        // console.log(error);
    }
}
const getRecentBDSingle = async (req, res) => {
    try {
        const recentMatch = await BDSingle.findOne().sort({ createdAt: -1 });

        if (!recentMatch) {
            return res.status(404).json({ 
                message: "No match found",
                success:false
            });
        }

        res.status(200).json(recentMatch);
    } catch (err) {
        console.error("Error fetching recent BDSingle:", err);
        res.status(500).json({ message: "Server Error" });
    }
};


export {
    createBDSingle,
    getBDSingle,
    getRecentBDSingle
}
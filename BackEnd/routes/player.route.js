import { Router } from "express";
import { createPlayer, createTeam,updateDrawTeam,updateLossPlayer,updateLossTeam,updatePlayerRecord, updateTeamRecord, updateWinPlayer, updateWinTeam } from "../Controllers/PlayerTeam.controller.js";


const PlayerRouter=Router()

PlayerRouter.route("/createPlayer").post(createPlayer)
PlayerRouter.route("/UpdatePlayer").patch(updatePlayerRecord)
PlayerRouter.route("/updateWinPlayer").post(async (req, res) => {
    const { playerName, gameType } = req.body;
  
    try {
      const updatedPlayer = await updateWinPlayer(playerName, gameType);
      res.status(200).json(updatedPlayer);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });
PlayerRouter.route("/updatePlayerLose").post(async (req, res) => {
    const { playerName, gameType } = req.body;
  
    try {
      const updatedPlayer = await updateLossPlayer(playerName, gameType);
      res.status(200).json(updatedPlayer);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });



PlayerRouter.route("/createTeam").post(createTeam)
PlayerRouter.route("/UpdateTeam").patch(updateTeamRecord)
PlayerRouter.route("/UpdateTeamWin").post(async (req, res) => {
    const { teamName, gameType } = req.body;
  
    try {
      const updatedteam = await updateWinTeam(teamName, gameType);
      res.status(200).json(updatedteam);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });
PlayerRouter.route("/UpdateTeamLose").post(async (req, res) => {
    const { teamName, gameType } = req.body;
  
    try {
      const updatedteam = await updateLossTeam(teamName, gameType);
      res.status(200).json(updatedteam);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });
PlayerRouter.route("/UpdateTeamDraw").post(async (req, res) => {
    const { teamName, gameType } = req.body;
  
    try {
      const updatedteam = await updateDrawTeam(teamName, gameType);
      res.status(200).json(updatedteam);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });
export default PlayerRouter
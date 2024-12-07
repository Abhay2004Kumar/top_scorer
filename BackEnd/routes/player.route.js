import { Router } from "express";
import { createPlayer, createTeam, updateDrawTeam, updateLossPlayer, updateLossTeam, updatePlayerRecord, updateTeamRecord, updateWinPlayer, updateWinTeam } from "../Controllers/PlayerTeam.controller.js";


const PlayerRouter=Router()

PlayerRouter.route("/createPlayer").post(createPlayer)
PlayerRouter.route("/UpdatePlayer").patch(updatePlayerRecord)
PlayerRouter.route("/updateWinPlayer").patch(updateWinPlayer)
PlayerRouter.route("/updatePlayerLose").patch(updateLossPlayer)


PlayerRouter.route("/createTeam").post(createTeam)
PlayerRouter.route("/UpdateTeam").patch(updateTeamRecord)
PlayerRouter.route("/UpdateTeamWin").patch(updateWinTeam)
PlayerRouter.route("/UpdateTeamLose").patch(updateLossTeam)
PlayerRouter.route("/UpdateTeamDraw").patch(updateDrawTeam)
export default PlayerRouter
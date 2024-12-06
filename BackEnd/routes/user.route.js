import { Router } from "express";
import { registerUser,loginUser,logOutUser,refreshAccessToken, changeCurrentPass } from "../Controllers/User.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const UserRouter= Router()

UserRouter.route("/registerUser").post(registerUser)

UserRouter.route("/loginUser").post(loginUser)
UserRouter.route("/logoutUser").post(verifyJWT, logOutUser)
UserRouter.route("/refresh-token").post(refreshAccessToken)
UserRouter.route("/change-password").post(verifyJWT, changeCurrentPass)

export default UserRouter

import { Router } from "express";
import { logOutAdmin, loginAdmin, registerAdmin, validateToken } from "../Controllers/Admin.controller.js";
import { verifyAdminJWT } from "../middlewares/authAdmin.middleware.js";

const adminRouter = Router()

adminRouter.route("/registerAdmin").post(registerAdmin)
adminRouter.route("/loginAdmin").post(loginAdmin)
adminRouter.route("/logOutAdmin").post(verifyAdminJWT,logOutAdmin)
adminRouter.route("/validateToken").get(verifyAdminJWT, validateToken)

export default adminRouter
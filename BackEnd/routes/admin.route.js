import { Router } from "express";
import { logOutAdmin, loginAdmin, registerAdmin } from "../Controllers/Admin.controller.js";
import { verifyAdminJWT } from "../middlewares/authAdmin.middleware.js";

const adminRouter = Router()

adminRouter.route("/registerAdmin").post(registerAdmin)
adminRouter.route("/loginAdmin").post(loginAdmin)
adminRouter.route("/logOutAdmin").post(verifyAdminJWT,logOutAdmin)

export default adminRouter
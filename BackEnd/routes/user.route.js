import { Router } from "express";
import { registerUser,loginUser,logOutUser,refreshAccessToken, changeCurrentPass } from "../Controllers/User.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { createBlog, deleteBlog, getAllBlogs, likeBlog, updateBlog } from "../Controllers/Blog.controller.js";
import { addComment } from "../Controllers/Comment.controller.js";
import { googleLogin } from "../Controllers/GoogleLogin.controller.js";
import { verifyAdminJWT } from "../middlewares/authAdmin.middleware.js";

const UserRouter= Router()

UserRouter.route("/registerUser").post(registerUser)

UserRouter.route("/loginUser").post(loginUser)
UserRouter.route("/logoutUser").post(verifyJWT, logOutUser)
UserRouter.route("/refresh-token").post(refreshAccessToken)
UserRouter.route("/change-password").post(verifyJWT, changeCurrentPass)
UserRouter.route("/createBlog").post(verifyAdminJWT,createBlog)
UserRouter.route("/updateBlog").put(verifyAdminJWT,updateBlog)
UserRouter.route("/deleteBlog").delete(verifyAdminJWT,deleteBlog);
UserRouter.route("/likeBlog").put(verifyJWT,likeBlog)
UserRouter.route("/commentBlog").post(verifyJWT,addComment)
UserRouter.route("/getAllblogs").get(getAllBlogs)

UserRouter.route("/google-login").post(googleLogin)

export default UserRouter

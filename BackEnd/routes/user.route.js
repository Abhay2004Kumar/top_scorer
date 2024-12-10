import { Router } from "express";
import { registerUser,loginUser,logOutUser,refreshAccessToken, changeCurrentPass } from "../Controllers/User.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { createBlog, getAllBlogs, likeBlog } from "../Controllers/Blog.controller.js";
import { addComment } from "../Controllers/Comment.controller.js";

const UserRouter= Router()

UserRouter.route("/registerUser").post(registerUser)

UserRouter.route("/loginUser").post(loginUser)
UserRouter.route("/logoutUser").post(verifyJWT, logOutUser)
UserRouter.route("/refresh-token").post(refreshAccessToken)
UserRouter.route("/change-password").post(verifyJWT, changeCurrentPass)

UserRouter.route("/createBlog").post(verifyJWT,createBlog)
UserRouter.route("/:blogId/likeBlog").put(verifyJWT,likeBlog)
UserRouter.route("/:blogId/commentBlog").post(verifyJWT,addComment)
UserRouter.route("/getAllblogs").get(getAllBlogs)

export default UserRouter

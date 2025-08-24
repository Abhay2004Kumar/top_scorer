import { Router } from "express";
import { registerUser, loginUser, logoutUser, refreshAccessToken, changeCurrentPassword, getCurrentUser, updateAccountDetails, getUserChannelProfile, getWatchHistory } from "../Controllers/User.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { createBlog, deleteBlog, getAllBlogs, likeBlog, updateBlog, getBlogById, getBlogStats } from "../Controllers/Blog.controller.js";
import { addComment, getComments, deleteComment } from "../Controllers/Comment.controller.js";
import { googleLogin } from "../Controllers/GoogleLogin.controller.js";
import { verifyAdminJWT } from "../middlewares/authAdmin.middleware.js";

const UserRouter = Router()

UserRouter.route("/registerUser").post(registerUser)

UserRouter.route("/loginUser").post(loginUser)
UserRouter.route("/logoutUser").post(verifyJWT, logoutUser)
UserRouter.route("/refresh-token").post(refreshAccessToken)
UserRouter.route("/change-password").post(verifyJWT, changeCurrentPassword)
UserRouter.route("/current-user").get(verifyJWT, getCurrentUser)
UserRouter.route("/update-account").put(verifyJWT, updateAccountDetails)
UserRouter.route("/channel/:username").get(verifyJWT, getUserChannelProfile)
UserRouter.route("/watch-history").get(verifyJWT, getWatchHistory)

// Blog routes
UserRouter.route("/createBlog").post(verifyAdminJWT, createBlog)
UserRouter.route("/updateBlog").put(verifyAdminJWT, updateBlog)
UserRouter.route("/deleteBlog/:id").delete(verifyAdminJWT, deleteBlog)
UserRouter.route("/likeBlog").put(verifyJWT, likeBlog)
UserRouter.route("/commentBlog").post(verifyJWT, addComment)
UserRouter.route("/comments/:blogId").get(getComments)
UserRouter.route("/comment/:commentId").delete(verifyJWT, deleteComment)
UserRouter.route("/getAllblogs").get(getAllBlogs)
UserRouter.route("/blog/:id").get(getBlogById)
UserRouter.route("/blog-stats").get(getBlogStats)

UserRouter.route("/google-login").post(googleLogin)

export default UserRouter

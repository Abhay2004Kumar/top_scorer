import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";
import { User } from "../Models/user.model.js";

export const verifyJWT = asyncHandler(async (req,res,next) => {
    try {
      console.log(req);
      const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "")|| req.body.accessToken 
      if(!token){
        //   return new ApiError(401, "Unauthorized request")
        return res.status(401).json({ message: "Unauthorized request" });
      }
  
      const decodedTokenInfo = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
      const user = await User.findById(decodedTokenInfo?._id)
      .select("-refreshToken -password")
  
      if(!user){
          //discuss about frontend
        //   throw new ApiError(401, "Invalid access token")
        return res.status(401).json({ message: "Invalid access token" }); 
      }
  
      req.user = user
      next()
    } catch (error) {
    //  throw new ApiError(401, error?.message || "Invalid access token")
    return res.status(401).json({ message: error?.message || "Invalid access token" }); 
    }
     
 
 }) 
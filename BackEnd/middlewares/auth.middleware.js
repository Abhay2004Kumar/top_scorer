import jwt from "jsonwebtoken";
import { User } from "../Models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import redisClient from "../utils/redis.js";

export const verifyJWT = asyncHandler(async (req, res, next) => {
  try {
    const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      throw new ApiError(401, "Unauthorized request");
    }

    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    // Check if session exists in Redis
    const session = await redisClient.getSession(decodedToken._id);
    
    if (!session || !session.activeTokens.includes(token)) {
      throw new ApiError(401, "Invalid or expired session");
    }

    // Update last activity
    session.lastActivity = Date.now();
    await redisClient.setSession(decodedToken._id, session);

    const user = await User.findById(decodedToken._id).select("-password -refreshToken");

    if (!user) {
      throw new ApiError(401, "Invalid Access Token");
    }

    req.user = user;
    next();
  } catch (error) {
    throw new ApiError(401, error?.message || "Invalid access token");
  }
});

export const verifyAdminJWT = asyncHandler(async (req, res, next) => {
  try {
    const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      throw new ApiError(401, "Unauthorized request");
    }

    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    // Check if admin session exists in Redis
    const session = await redisClient.getSession(`admin:${decodedToken._id}`);
    
    if (!session || !session.activeTokens.includes(token)) {
      throw new ApiError(401, "Invalid or expired admin session");
    }

    // Update last activity
    session.lastActivity = Date.now();
    await redisClient.setSession(`admin:${decodedToken._id}`, session);

    const admin = await User.findById(decodedToken._id).select("-password -refreshToken");

    if (!admin || admin.role !== 'admin') {
      throw new ApiError(401, "Invalid Admin Access Token");
    }

    req.admin = admin;
    next();
  } catch (error) {
    throw new ApiError(401, error?.message || "Invalid admin access token");
  }
});

// Enhanced session management
export const createUserSession = async (userId, accessToken, refreshToken) => {
  const sessionData = {
    userId,
    accessToken,
    refreshToken,
    activeTokens: [accessToken, refreshToken],
    lastActivity: Date.now(),
    createdAt: Date.now()
  };

  await redisClient.setSession(userId, sessionData, 3600); // 1 hour TTL
  return sessionData;
};

export const createAdminSession = async (adminId, accessToken, refreshToken) => {
  const sessionData = {
    adminId,
    accessToken,
    refreshToken,
    activeTokens: [accessToken, refreshToken],
    lastActivity: Date.now(),
    createdAt: Date.now()
  };

  await redisClient.setSession(`admin:${adminId}`, sessionData, 3600); // 1 hour TTL
  return sessionData;
};

export const invalidateSession = async (userId, isAdmin = false) => {
  const key = isAdmin ? `admin:${userId}` : userId;
  await redisClient.deleteSession(key);
};

export const refreshUserSession = async (userId, isAdmin = false) => {
  const key = isAdmin ? `admin:${userId}` : userId;
  const session = await redisClient.getSession(key);
  
  if (session) {
    session.lastActivity = Date.now();
    await redisClient.setSession(key, session, 3600);
  }
  
  return session;
}; 
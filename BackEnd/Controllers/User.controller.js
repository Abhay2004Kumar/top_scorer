import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../Models/user.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken";
import redisClient from "../utils/redis.js";
import rabbitMQClient from "../utils/rabbitmq.js";
import { createUserSession, invalidateSession } from "../middlewares/auth.middleware.js";
import mongoose from "mongoose";

export const generateAccessAndRefreshTokens = async (userId) => {
  try {
    const user = await User.findById(userId);
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    // Save refresh token in MongoDB for future login
    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    // Create Redis session
    await createUserSession(userId, accessToken, refreshToken);

    // Increment user statistics
    await redisClient.incrementStat('users', 'totalLogins');
    await redisClient.incrementStat('users', 'activeSessions');

    return { accessToken, refreshToken };   
  } catch (error) {
    throw new ApiError(
      500,
      "Something went wrong while generating refresh and access token"
    );
  }
};

const registerUser = async (req, res) => {
  try {
    // Destructure fields from the request body
    const { username, email, fullname, password } = req.body;

    // Validate required fields
    if (!username || !email || !fullname || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    // Check if the username or email already exists
    const existingUser = await User.findOne({
      $or: [{ username }, { email }],
    });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "Username or email already exists",
      });
    }

    // Create a new user instance
    const newUser = new User({
      username,
      email,
      fullname,
      password, // Password will be hashed by the pre-save middleware
    });

    // Save the user to the database
    const savedUser = await newUser.save();

    // Remove password from the response
    const userResponse = {
      _id: savedUser._id,
      username: savedUser.username,
      email: savedUser.email,
      fullname: savedUser.fullname,
    };

    // Increment user registration statistics
    await redisClient.incrementStat('users', 'totalRegistrations');
    await redisClient.incrementStat('users', 'activeUsers');

    // Send welcome notification via RabbitMQ
    if (rabbitMQClient.isConnected) {
      await rabbitMQClient.sendNotification({
        type: 'user_registration',
        userId: savedUser._id,
        message: `Welcome ${fullname}! Your account has been created successfully.`,
        priority: 'low'
      });
    }

    return res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: userResponse,
    });
  } catch (error) {
    console.error("Registration error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error during registration",
    });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, username, password } = req.body;

    // Check if user exists
    const user = await User.findOne({
      $or: [{ email }, { username }],
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User does not exist",
      });
    }

    // Check if password is correct
    const isPasswordValid = await user.isPasswordCorrect(password);

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    // Generate access and refresh tokens
    const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(user._id);

    // Get user data without password
    const loggedInUser = await User.findById(user._id).select("-password -refreshToken");

    // Set cookies
    const options = {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
    };

    return res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", refreshToken, options)
      .json({
        success: true,
        message: "User logged in successfully",
        data: {
          user: loggedInUser,
          accessToken,
          refreshToken,
        },
      });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error during login",
    });
  }
};

const logoutUser = async (req, res) => {
  try {
    const userId = req.user._id;

    // Invalidate Redis session
    await invalidateSession(userId);

    // Clear refresh token in database
    await User.findByIdAndUpdate(
      userId,
      {
        $unset: {
          refreshToken: 1,
        },
      },
      {
        new: true,
      }
    );

    // Decrement active sessions
    await redisClient.incrementStat('users', 'activeSessions', -1);

    const options = {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
    };

    return res
      .status(200)
      .clearCookie("accessToken", options)
      .clearCookie("refreshToken", options)
      .json({
        success: true,
        message: "User logged out successfully",
      });
  } catch (error) {
    console.error("Logout error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error during logout",
    });
  }
};

const refreshAccessToken = async (req, res) => {
  try {
    const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken;

    if (!incomingRefreshToken) {
      throw new ApiError(401, "Unauthorized request");
    }

    const decodedToken = jwt.verify(incomingRefreshToken, process.env.REFRESH_TOKEN_SECRET);

    const user = await User.findById(decodedToken?._id);

    if (!user) {
      throw new ApiError(401, "Invalid refresh token");
    }

    if (incomingRefreshToken !== user?.refreshToken) {
      throw new ApiError(401, "Refresh token is expired or used");
    }

    const options = {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
    };

    const { accessToken, newRefreshToken } = await generateAccessAndRefreshTokens(user._id);

    return res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", newRefreshToken, options)
      .json({
        success: true,
        message: "Access token refreshed",
        data: {
          accessToken,
          refreshToken: newRefreshToken,
        },
      });
  } catch (error) {
    throw new ApiError(401, error?.message || "Invalid refresh token");
  }
};

const changeCurrentPassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;

    const user = await User.findById(req.user?._id);
    const isPasswordCorrect = await user.isPasswordCorrect(oldPassword);

    if (!isPasswordCorrect) {
      throw new ApiError(400, "Invalid old password");
    }

    user.password = newPassword;
    await user.save({ validateBeforeSave: false });

    // Invalidate all sessions for security
    await invalidateSession(user._id);

    // Send password change notification
    if (rabbitMQClient.isConnected) {
      await rabbitMQClient.sendNotification({
        type: 'password_change',
        userId: user._id,
        message: 'Your password has been changed successfully.',
        priority: 'high'
      });
    }

    return res.status(200).json({
      success: true,
      message: "Password changed successfully",
    });
  } catch (error) {
    throw new ApiError(400, error?.message || "Error changing password");
  }
};

const getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.user?._id).select("-password -refreshToken");

    // Update user activity in Redis
    await redisClient.incrementStat('users', 'profileViews');

    return res.status(200).json({
      success: true,
      message: "User fetched successfully",
      data: user,
    });
  } catch (error) {
    throw new ApiError(400, error?.message || "Error fetching user");
  }
};

const updateAccountDetails = async (req, res) => {
  try {
    const { fullname, email } = req.body;

    if (!fullname || !email) {
      throw new ApiError(400, "All fields are required");
    }

    const user = await User.findByIdAndUpdate(
      req.user?._id,
      {
        $set: {
          fullname,
          email,
        },
      },
      { new: true }
    ).select("-password -refreshToken");

    // Send profile update notification
    if (rabbitMQClient.isConnected) {
      await rabbitMQClient.sendNotification({
        type: 'profile_update',
        userId: user._id,
        message: 'Your profile has been updated successfully.',
        priority: 'low'
      });
    }

    return res.status(200).json({
      success: true,
      message: "Account details updated successfully",
      data: user,
    });
  } catch (error) {
    throw new ApiError(400, error?.message || "Error updating account details");
  }
};

const getUserChannelProfile = async (req, res) => {
  try {
    const { username } = req.params;

    if (!username?.trim()) {
      throw new ApiError(400, "Username is missing");
    }

    const channel = await User.aggregate([
      {
        $match: {
          username: username?.toLowerCase(),
        },
      },
      {
        $lookup: {
          from: "subscriptions",
          localField: "_id",
          foreignField: "channel",
          as: "subscribers",
        },
      },
      {
        $lookup: {
          from: "subscriptions",
          localField: "_id",
          foreignField: "subscriber",
          as: "subscribedTo",
        },
      },
      {
        $addFields: {
          subscribersCount: {
            $size: "$subscribers",
          },
          channelsSubscribedToCount: {
            $size: "$subscribedTo",
          },
          isSubscribed: {
            $cond: {
              if: { $in: [req.user?._id, "$subscribers.subscriber"] },
              then: true,
              else: false,
            },
          },
        },
      },
      {
        $project: {
          fullname: 1,
          username: 1,
          subscribersCount: 1,
          channelsSubscribedToCount: 1,
          isSubscribed: 1,
          avatar: 1,
          coverImage: 1,
          email: 1,
        },
      },
    ]);

    if (!channel?.length) {
      throw new ApiError(404, "Channel does not exist");
    }

    return res.status(200).json({
      success: true,
      message: "User channel fetched successfully",
      data: channel[0],
    });
  } catch (error) {
    throw new ApiError(400, error?.message || "Error fetching user channel");
  }
};

const getWatchHistory = async (req, res) => {
  try {
    const user = await User.aggregate([
      {
        $match: {
          _id: new mongoose.Types.ObjectId(req.user._id),
        },
      },
      {
        $lookup: {
          from: "videos",
          localField: "watchHistory",
          foreignField: "_id",
          as: "watchHistory",
          pipeline: [
            {
              $lookup: {
                from: "users",
                localField: "owner",
                foreignField: "_id",
                as: "owner",
                pipeline: [
                  {
                    $project: {
                      fullname: 1,
                      username: 1,
                      avatar: 1,
                    },
                  },
                ],
              },
            },
            {
              $addFields: {
                owner: {
                  $first: "$owner",
                },
              },
            },
          ],
        },
      },
    ]);

    return res.status(200).json({
      success: true,
      message: "Watch history fetched successfully",
      data: user[0].watchHistory,
    });
  } catch (error) {
    throw new ApiError(400, error?.message || "Error fetching watch history");
  }
};

export {
  registerUser,
  loginUser,
  logoutUser,
  refreshAccessToken,
  changeCurrentPassword,
  getCurrentUser,
  updateAccountDetails,
  getUserChannelProfile,
  getWatchHistory,
};

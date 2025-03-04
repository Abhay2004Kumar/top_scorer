import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../Models/user.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken";

export const generateAccessAndRefreshTokens = async (userId) => {
  try {
    const user = await User.findById(userId);
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    //save refresh token in MongoDB for future login
    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(
      500,
      "Something went wrong while generating refresha and access token"
    );
  }
};

// const registerUser = asyncHandler( async (req,res) => {
//     //get user details from frontend
//      const {fullname, email, username, password}= req.body
//     //validation
//     if(
//      [fullname, email, username, password].some((field) => field?.trim() === "")
//     ){
//      throw new ApiError(400, "All fields are required")
//     }

//     //check if user already exists: username, email
//     const existedUser = await User.findOne({
//      $or: [{username},{email}]
//     })
// //  console.log(existedUser);
//     if(existedUser){
//      throw new ApiError(409,"User already exists.")
//     }

//      // create user object -  create entry in DB
//      const user = await User.create({
//          fullname,
//          email,
//          password,
//          username: username.toLowerCase()
//      })

//      // remove password and refresh token field from response
//      const createdUser = await User.findById(user._id).select(
//          "-password -refreshToken"
//      )

//      //check for user creation

//      if(!createdUser){
//          throw new ApiError(500, "Something went wrong during registering the user")
//      }

//      //return response
//  return res.status(201).json(
//      new ApiResponse(200, createdUser, "User registered successfully")
//  )

//  })
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
    await newUser.save();

    // Respond with success and tokens
    res.status(201).json({
      success: true,
      message: "User registered successfully",
    });
  } catch (error) {
    console.error("Error registering user:", error);
    res.status(500).json({
      success: false,
      message: "An error occurred while registering the user",
    });
  }
};

const loginUser = asyncHandler(async (req, res) => {
  // req body -> data
  //username or email
  // const {email,username,password} = req.body
  // if(!(username || email)){
  //     throw new ApiError(400, "Username or email is required")
  // }

  const { login, password } = req.body; // single input field for email/username

  if (!login || !password) {
    throw new ApiError(400, "Login (username/email) and password are required");
  }

  // Check if the input is an email or username
  const isEmail = login.includes("@") && login.includes(".");

  //find the user
  const user = await User.findOne(
    isEmail ? { email: login } : { username: login }
  );

  if (!user) {
    throw new ApiError(404, "User does not exist!");
  }
  // validate password
  const isPasswordvalid = await user.isPasswordCorrect(password);
  if (!isPasswordvalid) {
    throw new ApiError(401, "Password is incorrect!");
  }

  //access and refresh token
  const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(
    user._id
  );

  const loggedInUser = await User.findById(user._id).select(
    "-refreshToken -password"
  );

  //send cookie
  const options = {
    // by using this options we can allows tokens to be
    httpOnly: true, // only modifiable from server not from client side
    secure: true,
    sameSite: "Lax",
  };

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(
        200,
        {
          user: loggedInUser,
          accessToken,
          refreshToken,
        },
        "User logged in successfully"
      )
    );
});

const logOutUser = asyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(
    req.user._id,
    {
      $unset: {
        refreshToken: 1, // this removes field from documennt
      },
    },
    {
      new: true,
    }
  );
  //for cookies
  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "User logged Out"));
});

const refreshAccessToken = asyncHandler(async (req, res) => {
  const incomingRefreshToken =
    req.cookies.refreshToken || req.body.refreshToken;
  if (!incomingRefreshToken) {
    throw new ApiError(401, "Unauthorized Request!");
  }

  try {
    const decodedToken = jwt.verify(
      incomingRefreshToken,
      process.env.REFRESH_TOKEN_SECRET
    );

    const user = await User.findById(decodedToken?._id);
    if (!user) {
      throw new ApiError(401, "Invalid Refresh Token");
    }

    if (incomingRefreshToken !== user?.refreshToken) {
      throw new ApiError(401, "Refresh token is expired!");
    }
    const options = {
      httpOnly: true,
      secure: true,
    };

    const { accessToken, newRefreshToken } =
      await generateAccessAndRefreshTokens(user._id);

    return res
      .status(200)
      .cookie("accessToken", accessToken)
      .cookie("refreshToken", newRefreshToken)
      .json(
        new ApiResponse(
          200,
          { accessToken, newRefreshToken },
          "Access Token refreshed successfully"
        )
      );
  } catch (error) {
    throw new ApiError(401, error?.message || "Invalid Refresh Token");
  }
});

const changeCurrentPass = asyncHandler(async (req, res) => {
  const { oldPassword, newPassword } = req.body;

  const user = await User.findById(req.user?._id);

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  const isPasswordCorrect = await user.isPasswordCorrect(oldPassword);

  if (!isPasswordCorrect) {
    throw new ApiError(400, "Invalid old password");
  }

  user.password = newPassword;
  await user.save({ validateBeforeSave: false });

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "password changed successfully"));
});

export {
  registerUser,
  loginUser,
  logOutUser,
  refreshAccessToken,
  changeCurrentPass,
};

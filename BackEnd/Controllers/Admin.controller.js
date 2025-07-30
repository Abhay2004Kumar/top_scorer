import { Admin } from "../Models/admin.model.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken"

const generateAccessAndRefreshTokens = async(userId) => {
    try {
        const user = await Admin.findById(userId)
        const accessToken = user.generateAccessToken()
        const refreshToken = user.generateRefreshToken()

        //save refresh token in MongoDB for future login
        user.refreshToken = refreshToken
        await user.save({validateBeforeSave: false})

        return {accessToken, refreshToken}

    } catch (error) {
        throw new ApiError(500, "Something went wrong while generating refresha and access token")
    }
}

const registerAdmin = async (req, res) => {
    try {
        // Destructure fields from the request body
        const { username, password } = req.body;

        // Validate required fields
        if (!username || !password) {
            return res.status(400).json({
                success: false,
                message: "All fields are required",
            });
        }

        // Check if the username or email already exists
        const existingUser = await Admin.findOne({username});

        if (existingUser) {
            return res.status(409).json({
                success: false,
                message: "Username or email already exists",
            });
        }

        // Create a new user instance
        const newUser = new Admin({
            username,
            password // Password will be hashed by the pre-save middleware
        });

        // Save the user to the database
        await newUser.save();


        // Respond with success and tokens
        res.status(201).json({
            success: true,
            message: "User registered successfully"
        });
    } catch (error) {
        console.error("Error registering user:", error);
        res.status(500).json({
            success: false,
            message: "An error occurred while registering the user",
        });
    }
};

const loginAdmin = asyncHandler(async (req,res) => {
    // req body -> data
    //username or email
    const {username,password} = req.body 
    if(!username){
        throw new ApiError(400, "Username is required")
    }

    //find the user
    const user = await Admin.findOne({username})

    if(!user){
        throw new ApiError(404, "Admin does not exist!")
    }
    // validate password
    const isPasswordvalid = await user.isPasswordCorrect(password)
    if(!isPasswordvalid) {
        throw new ApiError(401, "Password is incorrect!")
    }

    //access and refresh token
    const {accessToken,refreshToken} = await generateAccessAndRefreshTokens(user._id)

    const loggedInUser = await Admin.findById(user._id).
    select("-refreshToken -password")

    //send cookie
    const options = {
        httpOnly: true,
        secure: true
        
    } //cookies are only modifiable through server

    return res.status(200)
    .cookie("accessToken",accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
        new ApiResponse(200,
            {
                user: loggedInUser, accessToken,
                refreshToken
            },
            "User logged in successfully"
            )
    )


})

const logOutAdmin = asyncHandler(async (req,res) => {
    await Admin.findByIdAndUpdate(
        req.user._id,
        {
            $unset: {
                refreshToken: 1 // this removes field from documennt
            }
        },
        {
            new: true
        }
    )
    //for cookies
    const options = {
    httpOnly: true,
    secure: true
        }

        return res
        .status(200)
        .clearCookie("accessToken", options)
        .clearCookie("refreshToken",options)
        .json(new ApiResponse(200, {}, "Admin logged Out"))
})

const validateToken = asyncHandler(async (req, res) => {
    const user = req.user; // from verifyAdminJWT middleware
    res.status(200).json(new ApiResponse(200, { user }, "Token is valid"));
});

export{
    logOutAdmin,loginAdmin,registerAdmin,validateToken
}
import mongoose, {Schema} from "mongoose"
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"

const adminSchema = new Schema({
    username: {
        type: String,  
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        index: true
    },
    password: {
        type: String,
        required: [true,'Password is required']
    },
    refreshToken: {
        type: String
    }
}, {timestamps:true})


//encrypt the password just before saving it using mongoose middleware pre hook
adminSchema.pre("save", async function(next) {
    if(this.isModified("password")){
        this.password = await bcrypt.hash(this.password, 10)
    next()
    }
    return next()

})


//custom method
adminSchema.methods.isPasswordCorrect = async function(password) {
    if (!password || !this.password) {
        console.log("password provided:", password);
        console.log("stored hash:", this.password);
        throw new Error("Password or hash is missing");
    }
return await bcrypt.compare(password, this.password)
} 

adminSchema.methods.generateAccessToken = function(){
    return jwt.sign(
        {
            _id: this._id,
            username: this.username
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}

adminSchema.methods.generateRefreshToken = function(){
    return jwt.sign(
        {
            _id: this._id
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY
        }
    )
}


export const Admin = mongoose.model("Admin",adminSchema)
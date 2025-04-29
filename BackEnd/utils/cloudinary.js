import cloudinary from 'cloudinary'
import dotenv from 'dotenv'

dotenv.config(); 

const cloudinaryConnect = async()=>{
    try{
        const cloudinaryStatus = cloudinary.config({
            cloud_name:process.env.CLOUD_NAME,
            api_key:process.env.API_KEY,
            api_secret:process.env.API_SECRET,
        })
        console.log("cloudinary connection successfull.")
    }catch(err){
        console.log(err)
    }
}

export {cloudinaryConnect}
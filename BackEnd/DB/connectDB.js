import mongoose from 'mongoose'
import dotenv from 'dotenv'

dotenv.config();

const connectDB = async()=>{
    try{ 
        const response  = await mongoose.connect(process.env.MONGODB_URI)
        console.log(response.connection.host)
 
    }
    catch(err){
        console.log(err)
    }
}
export default connectDB;
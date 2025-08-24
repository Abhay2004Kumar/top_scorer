import mongoose from 'mongoose'
import dotenv from 'dotenv'

dotenv.config();

const connectDB = async () => {
    try { 
        const response = await mongoose.connect(process.env.MONGODB_URI)
        console.log('✅ MongoDB connected successfully:', response.connection.host)
        return true;
    }
    catch (err) {
        console.error('❌ MongoDB connection failed:', err.message)
        return false;
    }
}

export default connectDB;
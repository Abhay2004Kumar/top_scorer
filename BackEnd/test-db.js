import dotenv from 'dotenv';
import mongoose from 'mongoose';

dotenv.config();

console.log('🔍 Checking environment variables...');
console.log('MONGODB_URI exists:', !!process.env.MONGODB_URI);
console.log('MONGODB_URI length:', process.env.MONGODB_URI ? process.env.MONGODB_URI.length : 0);
console.log('MONGODB_URI preview:', process.env.MONGODB_URI ? process.env.MONGODB_URI.substring(0, 50) + '...' : 'NOT SET');

const testConnection = async () => {
    try {
        console.log('🔗 Attempting to connect to MongoDB...');
        const response = await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ MongoDB connected successfully:', response.connection.host);
        console.log('Database name:', response.connection.name);
        console.log('Connection state:', response.connection.readyState);
        return true;
    } catch (err) {
        console.error('❌ MongoDB connection failed:', err.message);
        return false;
    }
};

testConnection().then((success) => {
    if (success) {
        console.log('🎉 Database connection test successful!');
    } else {
        console.log('💥 Database connection test failed!');
    }
    process.exit(success ? 0 : 1);
});

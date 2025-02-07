// import mongoose from 'mongoose';
// import dotenv from 'dotenv';
// dotenv.config();

// const MONGO_URI = process.env.MONGO_URI!;

// export const connectDB = async () => {
//     try {
//         await mongoose.connect(MONGO_URI);
//         console.log('MongoDB connected');
//     } catch (error) {
//         console.error('Database connection error:', error);
//         process.exit(1);
//     }
// };


import mongoose from 'mongoose';
import dotenv from 'dotenv';
import logger from '../utils/logger';
dotenv.config();

const MONGO_URI = process.env.MONGO_URI!;

export const connectDB = async () => {
    try {
        await mongoose.connect(MONGO_URI);
        logger.info('MongoDB connected');
    } catch (error) {
        logger.error(`Database connection error: ${error}`);
        process.exit(1);
    }
};

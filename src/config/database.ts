// import mongoose from 'mongoose';
// import dotenv from 'dotenv';
// import Redis from 'ioredis';
// import logger from '../utils/logger';

// // const MONGO_URI = process.env.MONGO_URI!;

// // export const connectDB = async () => {
// //     try {
// //         await mongoose.connect(MONGO_URI);
// //         console.log('MongoDB connected');
// //     } catch (error) {
// //         console.error('Database connection error:', error);
// //         process.exit(1);
// //     }
// // };



// dotenv.config();

// const MONGO_URI = process.env.MONGO_URI!;
// const REDIS_URL = process.env.REDIS_URL || 'redis://127.0.0.1:6379';

// // Initialize Redis
// export const redisClient = new Redis(REDIS_URL);

// redisClient.on('connect', () => logger.info('Redis connected'));
// redisClient.on('error', (err) => logger.error(`Redis error: ${err}`));

// export const connectDB = async () => {
//     try {
//         await mongoose.connect(MONGO_URI);
//         logger.info('MongoDB connected');
//     } catch (error) {
//         logger.error(`Database connection error: ${error}`);
//         process.exit(1);
//     }
// };


import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Redis from 'ioredis';
import logger from '../utils/logger';

// Load environment variables
dotenv.config();

// Define constants for MongoDB and Redis URLs
const MONGO_URI = process.env.MONGO_URI || ''; // Ensure MONGO_URI is set
const REDIS_URL = process.env.REDIS_URL || 'redis://127.0.0.1:6379';

// Initialize Redis client
export const redisClient = new Redis(REDIS_URL);

// Redis event listeners
redisClient.on('connect', () => logger.info('Redis connected successfully'));
redisClient.on('error', (err) => logger.error(`Redis connection error: ${err}`));

// Function to connect to MongoDB
export const connectDB = async (): Promise<void> => {
    if (!MONGO_URI) {
        logger.error('MongoDB URI is not defined in environment variables');
        process.exit(1);
    }

    try {
        await mongoose.connect(MONGO_URI/*, { useNewUrlParser: true, useUnifiedTopology: true }*/);
        logger.info('MongoDB connected successfully');
    } catch (error) {
        if (error instanceof Error) {
            logger.error(`Database connection error: ${error.message}`);
        } else {
            logger.error('Database connection error');
        }
        process.exit(1);
    }
};

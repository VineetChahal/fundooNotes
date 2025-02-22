import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Redis from 'ioredis';
import logger from '../utils/logger';

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



dotenv.config();

const MONGO_URI = process.env.MONGO_URI!;
const REDIS_URL = process.env.REDIS_URL || 'redis://127.0.0.1:6379';

// Initialize Redis
export const redisClient = new Redis(REDIS_URL);

redisClient.on('connect', () => logger.info('Redis connected'));
redisClient.on('error', (err) => logger.error(`Redis error: ${err}`));

export const connectDB = async () => {
    try {
        await mongoose.connect(MONGO_URI);
        logger.info('MongoDB connected');
    } catch (error) {
        logger.error(`Database connection error: ${error}`);
        process.exit(1);
    }
};

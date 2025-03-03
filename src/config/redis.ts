// import { createClient } from 'redis';
// import  logger  from '../utils/logger';

// const redisClient = createClient({
//     socket: {
//         host: process.env.REDIS_HOST || 'localhost',
//         port: Number(process.env.REDIS_PORT) || 6379,
//     },
// });

// redisClient.on('error', (err) => {
//     logger.error('Redis Client Error', { error: err.message });
// });

// (async () => {
//     try {
//         await redisClient.connect();
//         logger.info('Connected to Redis successfully');
//     } catch (err) {
//         logger.error('Error connecting to Redis', { error: err });
//     }
// })();

// export { redisClient };


import { createClient } from 'redis';
import logger from '../utils/logger';

// Create Redis client with configuration from environment variables
const redisClient = createClient({
    socket: {
        host: process.env.REDIS_HOST || 'localhost',
        port: Number(process.env.REDIS_PORT) || 6379,
    },
});

// Error handling for Redis client
redisClient.on('error', (err) => {
    logger.error('Redis Client Error:', { error: err.message });
});

// Function to connect to Redis
const connectRedis = async () => {
    try {
        await redisClient.connect();
        logger.info('Connected to Redis successfully');
    } catch (err) {
        logger.error('Error connecting to Redis:', { error: (err as Error).message });
        process.exit(1); // Exit the process if unable to connect
    }
};

// Immediately invoke the connection function
connectRedis();

export { redisClient };

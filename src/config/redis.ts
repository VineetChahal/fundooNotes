import { createClient } from 'redis';
import  logger  from '../utils/logger';

const redisClient = createClient({
    socket: {
        host: process.env.REDIS_HOST || 'localhost',
        port: Number(process.env.REDIS_PORT) || 6379,
    },
});

redisClient.on('error', (err) => {
    logger.error('Redis Client Error', { error: err.message });
});

(async () => {
    try {
        await redisClient.connect();
        logger.info('Connected to Redis successfully');
    } catch (err) {
        logger.error('Error connecting to Redis', { error: err });
    }
})();

export { redisClient };

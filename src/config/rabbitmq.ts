// import amqp from "amqplib";

// const RABBITMQ_URL = "amqp://localhost";
// export const QUEUE_NAME_FORGOT = "EmailQueue";
// export const QUEUE_NAME_REGISTER = "RegisterQueue";


// export const createRabbitMQConnection = async () => {
//     try {
//         const connection = await amqp.connect(RABBITMQ_URL);
//         const channel = await connection.createChannel();

//         // Ensure queue exists before using
//         await channel.assertQueue(QUEUE_NAME_FORGOT, { durable: true });
//         await channel.assertQueue(QUEUE_NAME_REGISTER, { durable: true });


//         console.log(" RabbitMQ Connected & Queue Ready");
//         return { connection, channel };
//     } catch (error) {
//         console.error(" RabbitMQ Connection Error:", error);
//         throw error;
//     }
// };

import amqp from 'amqplib';
import dotenv from 'dotenv';
import logger from '../utils/logger';

// Load environment variables
dotenv.config();

// Define constants for RabbitMQ connection and queue names
const RABBITMQ_URL = process.env.RABBITMQ_URL || 'amqp://localhost';
export const QUEUE_NAME_FORGOT = 'EmailQueue';
export const QUEUE_NAME_REGISTER = 'RegisterQueue';

// Function to create a RabbitMQ connection
export const createRabbitMQConnection = async () => {
    try {
        const connection = await amqp.connect(RABBITMQ_URL);
        const channel = await connection.createChannel();

        // Ensure queues exist before using them
        await channel.assertQueue(QUEUE_NAME_FORGOT, { durable: true });
        await channel.assertQueue(QUEUE_NAME_REGISTER, { durable: true });

        logger.info('RabbitMQ connected and queues are ready');
        return { connection, channel };
    } catch (error) {
        if (error instanceof Error) {
            logger.error(`RabbitMQ connection error: ${error.message}`);
        } else {
            logger.error('RabbitMQ connection error: Unknown error');
        }
        throw new Error('Failed to connect to RabbitMQ');
    }
};

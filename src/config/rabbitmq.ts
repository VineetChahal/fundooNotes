// import amqplib from "amqplib";
// import dotenv from "dotenv";

// dotenv.config();

// const RABBITMQ_URL = process.env.RABBITMQ_URL || "amqp://localhost";
// const QUEUE_NAME = process.env.QUEUE_NAME || "notesQueue";

// export const connectRabbitMQ = async () => {
//   try {
//     const connection = await amqplib.connect(RABBITMQ_URL);
//     const channel = await connection.createChannel();
//     await channel.assertQueue(QUEUE_NAME, { durable: true });
//     console.log("🐰 Connected to RabbitMQ");
//     return { connection, channel };
//   } catch (error) {
//     console.error("RabbitMQ Connection Error:", error);
//     throw error;
//   }
// };

// export { QUEUE_NAME };

import amqp from "amqplib";

const RABBITMQ_URL = "amqp://localhost";
export const QUEUE_NAME = "noteQueue";

export const createRabbitMQConnection = async () => {
    try {
        const connection = await amqp.connect(RABBITMQ_URL);
        const channel = await connection.createChannel();

        // Ensure queue exists before using
        await channel.assertQueue(QUEUE_NAME, { durable: true });

        console.log(" RabbitMQ Connected & Queue Ready");
        return { connection, channel };
    } catch (error) {
        console.error(" RabbitMQ Connection Error:", error);
        throw error;
    }
};

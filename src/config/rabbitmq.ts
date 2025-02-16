import amqp from "amqplib";

const RABBITMQ_URL = "amqp://localhost";
export const QUEUE_NAME_FORGOT = "EmailQueue";
export const QUEUE_NAME_REGISTER = "RegisterQueue";


export const createRabbitMQConnection = async () => {
    try {
        const connection = await amqp.connect(RABBITMQ_URL);
        const channel = await connection.createChannel();

        // Ensure queue exists before using
        await channel.assertQueue(QUEUE_NAME_FORGOT, { durable: true });
        await channel.assertQueue(QUEUE_NAME_REGISTER, { durable: true });


        console.log(" RabbitMQ Connected & Queue Ready");
        return { connection, channel };
    } catch (error) {
        console.error(" RabbitMQ Connection Error:", error);
        throw error;
    }
};

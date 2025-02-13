import { createRabbitMQConnection, QUEUE_NAME } from "../config/rabbitmq";

export const sendMessageToQueue = async (message: object) => {
    const { channel } = await createRabbitMQConnection();

    channel.sendToQueue(QUEUE_NAME, Buffer.from(JSON.stringify(message)), {
        persistent: true,
    });

    console.log("📤 Sent message to queue:", message);
};

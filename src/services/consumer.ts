import { createRabbitMQConnection } from "../config/rabbitmq";
import { ConsumeMessage } from "amqplib";
import logger from "../utils/logger";

export const startConsumer = async () => {
    try {
        const { channel } = await createRabbitMQConnection();
        await channel.assertQueue("noteQueue", { durable: true });
        
        channel.consume("noteQueue", async (message: ConsumeMessage | null) => {
            if (!message) return;
            
            try {
                const content = JSON.parse(message.content.toString());
                logger.info(" Received message from queue", { content });
                
                // operations like creating deleting and updating notes (logic here)
                
                channel.ack(message); // to make sure msg is only ack once 
            } catch (error) {
                logger.error(" Error processing message", { error });
                channel.nack(message, false, false); // Rejecting same message, do not requeue
            }
        }, { noAck: false });
        
        logger.info("🔄 Consumer started, waiting for messages...");
    } catch (error) {
        logger.error(" Consumer failed to start", { error });
    }
};
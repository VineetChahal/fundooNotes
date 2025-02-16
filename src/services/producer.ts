import amqp from 'amqplib';
import logger from '../utils/logger';

const QUEUE_NAME = 'EmailQueue';

export async function queueEmail(email: string, verificationCode: string) {
  try {
    const connection = await amqp.connect('amqp://localhost');
    const channel = await connection.createChannel();

    await channel.assertQueue(QUEUE_NAME, { durable: true });

    const message = JSON.stringify({ email, verificationCode });
    console.log(`message being sent to ${QUEUE_NAME} is ${message}`);
    
    channel.sendToQueue(QUEUE_NAME, Buffer.from(message), { persistent: true });

    logger.info(`📤 Message sent to queue: ${message}`);

    await channel.close();
    await connection.close();
  } catch (error) {
    logger.error(`❌ Error publishing message to queue: ${error}`);
  }
}
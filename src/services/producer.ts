import logger from '../utils/logger';
import { QUEUE_NAME_FORGOT, QUEUE_NAME_REGISTER, createRabbitMQConnection } from '../config/rabbitmq';

export async function queueEmail(email: string, data: { username?: string; verificationCode?: string }, type: 'forgot' | 'register') {
    try {
        const { channel } = await createRabbitMQConnection(); // Only get the channel, no need to close connection here

        const queueName = type === 'forgot' ? QUEUE_NAME_FORGOT : QUEUE_NAME_REGISTER;

        const message = type === 'forgot' 
            ? JSON.stringify({ 
                type: 'password_reset',
                email,
                subject: "Password Reset Verification Code",
                text: `Your verification code is: ${data.verificationCode}`,
                verificationCode: data.verificationCode
              }) 
            : JSON.stringify({
                type: 'welcome',
                email,
                subject: "Welcome to Our Platform",
                text: `Welcome, ${data.username}! Thank you for registering.`
              });

        console.log(`Message being sent to ${queueName}: ${message}`);
        channel.sendToQueue(queueName, Buffer.from(message), { persistent: true });

        logger.info(`📤 Message sent to queue: ${message}`);
    } catch (error) {
        logger.error(`❌ Error publishing message to queue: ${error}`);
    }
}

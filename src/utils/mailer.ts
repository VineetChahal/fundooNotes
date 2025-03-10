import nodemailer from "nodemailer";
import dotenv from "dotenv";
import logger from "./logger";
import { createRabbitMQConnection, QUEUE_NAME_FORGOT, QUEUE_NAME_REGISTER } from "../config/rabbitmq";

dotenv.config();

// Transporter for sending emails
const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure: false, // Use `true` for port 465
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    },
    logger: true,
    debug: true,
});

// Verify transporter connection
transporter.verify((error) => {
    if (error) {
        logger.error("SMTP Connection Error:", error);
    } else {
        logger.info("SMTP Server Ready");
    }
});


// Functions to enqueue email for RabbitMQ processing => queueForgotEmail, queueWelcomeEmail
//-------------------------------------------------------forgot password email--------------------------------------------------
export const queueForgotEmail = async (email: string, code: string): Promise<void> => {
    const { channel } = await createRabbitMQConnection();
    
    const message = JSON.stringify({ 
        type: 'password_reset',
        email, 
        subject: "Password Reset Verification Code", 
        text: `Your verification code is: ${code}`, 
        code 
    });
    
    channel.sendToQueue(QUEUE_NAME_FORGOT, Buffer.from(message), { persistent: true });
    
    logger.info(`📤 Forgot email Queued for ${email}`);
};


//-------------------------------------------------------------REGISTER EMAIL----------------------------------------------------
export const queueWelcomeEmail = async (email: string, username: string) => {
    // try {
    //   const connection = await amqp.connect('amqp://localhost');
    //   const channel = await connection.createChannel();
      const {channel} = await createRabbitMQConnection();
  
    //   await channel.assertQueue(QUEUE_NAME_REGISTER, { durable: true });
  
      const message = JSON.stringify({
        type: 'welcome',
        email,
        subject: "Welcome to Our Platform",
        text: `Welcome, ${username}! Thank you for registering.`,
      });
  
      channel.sendToQueue(QUEUE_NAME_REGISTER, Buffer.from(message), { persistent: true });
  
      logger.info(`📤 Welcome email queued for: ${email}`);
    //   await channel.close();
    //   await connection.close();
    // } catch (error) {
    //   logger.error(`❌ Error queuing welcome email: ${error}`);
    //   throw error;
    // }
  };
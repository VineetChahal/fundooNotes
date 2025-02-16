// import { createRabbitMQConnection, QUEUE_NAME } from "../config/rabbitmq";
// import { ConsumeMessage } from "amqplib";
// import nodemailer from "nodemailer";
// import dotenv from "dotenv";
// import logger from "../utils/logger";

// dotenv.config();

// // Setup transporter
// const transporter = nodemailer.createTransport({
//     host: process.env.SMTP_HOST,
//     port: Number(process.env.SMTP_PORT),
//     secure: false,
//     auth: {
//         user: process.env.SMTP_USER,
//         pass: process.env.SMTP_PASS,
//     },
// });

// // Consumer to process email queue
// export const startConsumer = async () => {
//     try {
//         const { channel } = await createRabbitMQConnection();
//         await channel.assertQueue(QUEUE_NAME, { durable: true });

//         channel.consume(QUEUE_NAME, async (message: ConsumeMessage | null) => {  
//             if (!message) return;

//             const { email, subject, text } = JSON.parse(message.content.toString());

//             try {
//                 await transporter.sendMail({ from: process.env.SMTP_USER, to: email, subject, text });
//                 logger.info(`📧 Email sent to ${email}`);
//                 channel.ack(message);
//             } catch (error) {
//                 logger.error("Error sending email:", error);
//                 channel.nack(message, false, false);
//             }
//         }, { noAck: false });

//         logger.info("🔄 Email Consumer started...");
//     } catch (error) {
//         logger.error("Email Consumer failed to start:", error);
//     }
// };
//-----------------------------------------------------------------------------------
// has been set up as a seperate project (as demanded by PT)
//-----------------------------------------------------------------------------------
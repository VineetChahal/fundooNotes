import nodemailer from "nodemailer";
import dotenv from "dotenv";
import logger from "./logger";
// import httpStatus from "http-status";
import { createRabbitMQConnection, QUEUE_NAME } from "../config/rabbitmq";


//--------------------------------------------------------------------------

// // Verify transporter connection
// transporter.verify((error) => {
//     if (error) {
//         console.error('SMTP Connection Error:', error);
//     } else {
//         console.log('SMTP Server Ready');
//     }
// });

// // Function to send a verification code
// export const sendVerificationCode = async (email: string, code: string): Promise<void> => {
//     const mailOptions = {
//         from: `"Your App" <${process.env.SMTP_USER}>`,
//         to: email,
//         subject: 'Password Reset Verification Code',
//         text: `Your verification code is: ${code}`,
//     };

//     try {
//         const info = await transporter.sendMail(mailOptions);
//         console.log('Email sent successfully:', info);
//     } catch (error: unknown) {
//         console.error('Error sending email:', error);
//         throw new Error('Failed to send verification code');
//     }
// };

//-------------------------------------------------------------------------


// dotenv.config();

// // Transporter for sending emails
// const transporter = nodemailer.createTransport({
//     host: process.env.SMTP_HOST,
//     port: Number(process.env.SMTP_PORT),
//     secure: false, // Use `true` for port 465
//     auth: {
//         user: process.env.SMTP_USER,
//         pass: process.env.SMTP_PASS,
//     },
//     logger: true,
//     debug: true,
// });

// // Verify transporter connection
// transporter.verify((error) => {
//     if (error) {
//         logger.error('SMTP Connection Error:', error);
//     } else {
//         logger.info('SMTP Server Ready');
//     }
// });

// // Function to send a verification code
// export const sendVerificationCode = async (email: string, code: string): Promise<void> => {
//     const mailOptions = {
//         from: `"Your App" <${process.env.SMTP_USER}>`,
//         to: email,
//         subject: 'Password Reset Verification Code',
//         text: `Your verification code is: ${code}`,
//     };

//     try {
//         const info = await transporter.sendMail(mailOptions);
//         logger.info(`Email sent successfully to ${email}: ${info.messageId}`);
//     } catch (error) {
//         logger.error('Error sending email:', error);
//         throw { status: httpStatus.INTERNAL_SERVER_ERROR, message: 'Failed to send verification code' };
//     }
// };

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

// Function to enqueue email for RabbitMQ processing
export const queueEmail = async (email: string, code: string): Promise<void> => {
    const { channel } = await createRabbitMQConnection();
    
    const message = { email, subject: "Password Reset Verification Code", text: `Your verification code is: ${code}` };
    
    channel.sendToQueue(QUEUE_NAME, Buffer.from(JSON.stringify(message)), { persistent: true });
    
    logger.info(`📤 Queued email for ${email}`);
};

import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

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
transporter.verify((error, success) => {
    if (error) {
        console.error('SMTP Connection Error:', error);
    } else {
        console.log('SMTP Server Ready');
    }
});

// Function to send a verification code
export const sendVerificationCode = async (email: string, code: string): Promise<void> => {
    const mailOptions = {
        from: `"Your App" <${process.env.SMTP_USER}>`,
        to: email,
        subject: 'Password Reset Verification Code',
        text: `Your verification code is: ${code}`,
    };

    try {
        const info = await transporter.sendMail(mailOptions);
        console.log('Email sent successfully:', info);
    } catch (error: any) {
        console.error('Error sending email:', error);
        throw new Error('Failed to send verification code');
    }
};


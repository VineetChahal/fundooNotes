import nodemailer from 'nodemailer';

// const transporter = nodemailer.createTransport({
//   host: 'smtp.gmail.com',
//   port: 587,
//   secure: false,
//   auth: {
//     user: 'esmeray0v0@gmail.com',
//     pass: 'yghq zabs dcty imjm',
//   },
//   logger: true,
//   debug: true,
// });

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: false,
  requireTLS: true,  // Ensure TLS
  connectionTimeout: 10000, // Increase timeout
  auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
  },
  tls: {
      rejectUnauthorized: false, // Disable strict SSL check
  },
  logger: true,
  debug: true,
});


async function sendTestEmail() {
  try {
    await transporter.verify();
    console.log('✅ SMTP connection successful');
  } catch (error) {
    console.error('❌ SMTP connection failed:', error);
  }
}

sendTestEmail();

// import winston from "winston";

// const logger = winston.createLogger({
//   level: "info", // Default log level
//   format: winston.format.combine(
//     winston.format.timestamp(),
//     winston.format.json() // Logs in JSON format
//   ),
//   transports: [
//     new winston.transports.Console(), // Logs to console
//     new winston.transports.File({ filename: "logs/error.log", level: "error" }), // Logs errors to a file
//     new winston.transports.File({ filename: "logs/combined.log" }) // Logs everything
//   ],
// });

// export default logger;


import winston from 'winston';
import fs from 'fs';
import path from 'path';

// Create logs directory if it doesn't exist
const logsDir = path.join(__dirname, '../../logs');
if (!fs.existsSync(logsDir)) {
    fs.mkdirSync(logsDir);
}

// Configure log level from environment variable or default to 'info'
const logLevel = process.env.LOG_LEVEL || 'info';

// Create a Winston logger instance
const logger = winston.createLogger({
    level: logLevel,
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json() // Logs in JSON format
    ),
    transports: [
        new winston.transports.Console(), // Logs to console
        new winston.transports.File({ filename: path.join(logsDir, 'error.log'), level: 'error' }), // Logs errors to a file
        new winston.transports.File({ filename: path.join(logsDir, 'combined.log') }) // Logs everything
    ],
});

// Log an initialization message
logger.info('Logger initialized successfully');

export default logger;

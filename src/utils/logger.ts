import winston from "winston";

const logger = winston.createLogger({
  level: "info", // Default log level
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json() // Logs in JSON format
  ),
  transports: [
    new winston.transports.Console(), // Logs to console
    new winston.transports.File({ filename: "logs/error.log", level: "error" }), // Logs errors to a file
    new winston.transports.File({ filename: "logs/combined.log" }) // Logs everything
  ],
});

export default logger;

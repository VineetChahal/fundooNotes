// import { Request, Response, NextFunction } from 'express';
// import { verifyToken } from '../utils/jwt';
// // import jwt from 'jsonwebtoken';

// export const authenticate = (req: Request, res: Response, next: NextFunction): void => {
//     const token = req.header('Authorization')?.split(' ')[1];
//     // console.log("token ---------------------------," + token);
    
//     if (!token) {
//         res.status(401).json({ message: 'Access denied' });
//         return;
//     }
//     try {

//          const tokenvalue = verifyToken(token); // jwt.verify(token, process.env.JWT_SECRET as string) as {id:string};
//         console.log(`decoded msg----------------------------------,`,tokenvalue );
//         req.body.userId = tokenvalue.id;
//         next();
//     } catch {
//         res.status(400).json({ message: 'Invalid token' });
//     }
// };

// import { Request, Response, NextFunction } from 'express';
// import { verifyToken } from '../utils/jwt';
// import { StatusCodes } from 'http-status-codes';
// import { createLogger, format, transports } from 'winston';

// // Logger setup
// const logger = createLogger({
//     level: 'info',
//     format: format.combine(
//         format.timestamp(),
//         format.printf(({ timestamp, level, message }) => `${timestamp} [${level.toUpperCase()}]: ${message}`)
//     ),
//     transports: [
//         new transports.Console(),
//         new transports.File({ filename: 'logs/auth.log' })
//     ]
// });

// export const authenticate = (req: Request, res: Response, next: NextFunction): void => {
//     const token = req.header('Authorization')?.split(' ')[1];

//     if (!token) {
//         logger.warn('Access denied: No token provided');
//         res.status(StatusCodes.UNAUTHORIZED).json({ message: 'Access denied' });
//         return;
//     }

//     try {
//         const tokenValue = verifyToken(token);
//         logger.info(`Token verified successfully for user ID: ${tokenValue.id}`);
//         req.body.userId = tokenValue.id;
//         next();
//     } catch (error) {
//         logger.error(`Invalid token: ${error}`);
//         res.status(StatusCodes.BAD_REQUEST).json({ message: 'Invalid token' });
//     }
// };


import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../utils/jwt';
import { StatusCodes } from 'http-status-codes';
import logger from '../utils/logger'; // Import centralized logger

export const authenticate = (req: Request, res: Response, next: NextFunction): void => {
    const token = req.header('Authorization')?.split(' ')[1];

    if (!token) {
        logger.warn(`Access denied: No token provided - IP: ${req.ip}, Route: ${req.originalUrl}`);
        res.status(StatusCodes.UNAUTHORIZED).json({ message: 'Access denied' });
        return;
    }

    try {
        const tokenValue = verifyToken(token);
        logger.info(`Token verified successfully - User ID: ${tokenValue.id}, Route: ${req.originalUrl}`);
        req.body.userId = tokenValue.id;
        next();
    } catch (error) {
        const errorMessage = (error as Error).message;
        logger.error(`Invalid token - IP: ${req.ip}, Route: ${req.originalUrl}, Error: ${errorMessage}`);
        res.status(StatusCodes.BAD_REQUEST).json({ message: 'Invalid token' });
    }
};

import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../utils/jwt';
import { StatusCodes } from 'http-status-codes';
import { body, validationResult } from 'express-validator';
import logger from '../utils/logger';
import Redis from 'ioredis';


const redis = new Redis();

export const authenticate = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const token = req.header('Authorization')?.split(' ')[1];

    if (!token) {
        logger.warn(`Access denied: No token provided`);
        res.status(StatusCodes.UNAUTHORIZED).json({ message: 'Access denied' });
        return;
    }

    try {
        // Check if the token is blacklisted (logged out)
        const isBlacklisted = await redis.get(`blacklist:${token}`);
        if (isBlacklisted) {
            logger.warn(`Access denied: Token is blacklisted - IP: ${req.ip}, Route: ${req.originalUrl}`);
            res.status(StatusCodes.UNAUTHORIZED).json({ message: 'Token is blacklisted' });
            return;
        }

        const cachedToken = await redis.get(`auth:${token}`);
        if (cachedToken) {
            req.body.userId = JSON.parse(cachedToken).id;
            logger.info(`Token verified from cache - User ID: ${req.body.userId}, Route: ${req.originalUrl}`);
            next();
            return;
        }

        const tokenValue = verifyToken(token);
        await redis.setex(`auth:${token}`, 3600, JSON.stringify(tokenValue)); // Cache token for 1 hour

        logger.info(`Token verified successfully - User ID: ${tokenValue.id}, Route: ${req.originalUrl}`);
        req.body.userId = tokenValue.id;
        next();
    } catch (error) {
        const errorMessage = (error as Error).message;
        logger.error(`Invalid token - IP: ${req.ip}, Route: ${req.originalUrl}, Error: ${errorMessage}`);
        res.status(StatusCodes.BAD_REQUEST).json({ message: 'Invalid token' });
    }
};


//-------------------------------------------------------------LOGOUT-VALIDATION----------------------------------------------------

export const logoutValidation = [
    // Ensure the token is present in the Authorization header
    body('token').notEmpty().withMessage('Token is required').bail(),
    (req: Request, res: Response, next: NextFunction) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      next();
    }
  ];
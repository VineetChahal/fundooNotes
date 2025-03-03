import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import logger from './logger';
import httpStatus from 'http-status';

dotenv.config();

// Load JWT secrets from environment variables
const JWT_SECRET = process.env.JWT_SECRET!;
const JWT_SECRET_REFRESH = process.env.JWT_SECRET_REFRESH!;

// Define the payload interface
interface TokenPayload {
    id: string; // Add other fields as necessary
}

//--------------------------------------------------------GENERATE-TOKEN-------------------------------------------------------

export const generateToken = (payload: TokenPayload) => {
    try {
        const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '15m' });
        
        if (!JWT_SECRET_REFRESH) {
            throw new Error('JWT_SECRET_REFRESH is not defined');
        }
        
        const refreshToken = jwt.sign(payload, JWT_SECRET_REFRESH, { expiresIn: '7d' });
        logger.info('Token generated successfully');
        return { token, refreshToken };
    } catch (error) {
        logger.error('Error generating token:', { error: error instanceof Error ? error.message : error });
        throw { status: httpStatus.INTERNAL_SERVER_ERROR, message: 'Error generating token' };
    }
};

//--------------------------------------------------------VERIFY-TOKEN---------------------------------------------------------

export const verifyToken = (token: string): TokenPayload => {
    try {
        const decoded = jwt.verify(token, JWT_SECRET) as TokenPayload;
        logger.info('Token verified successfully');
        return decoded;
    } catch (error) {
        logger.error('Invalid token:', { error: error instanceof Error ? error.message : error });
        throw { status: httpStatus.UNAUTHORIZED, message: 'Invalid token' };
    }
};

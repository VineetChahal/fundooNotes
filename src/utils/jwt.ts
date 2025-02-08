import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import logger from './logger';
import httpStatus from 'http-status';


//--------------------------------------------------------------------

// export const generateToken = (payload: object) => {
//     return jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' });
// };

// export const verifyToken = (token: string) => {
//     return jwt.verify(token, JWT_SECRET as string) as {id:string};
// };

//--------------------------------------------------------------------


dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET!;

export const generateToken = (payload: object) => {
    try {
        const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' });
        logger.info('Token generated successfully');
        return token;
    } catch (error) {
        logger.error('Error generating token:', error);
        throw { status: httpStatus.INTERNAL_SERVER_ERROR, message: 'Error generating token' };
    }
};

export const verifyToken = (token: string) => {
    try {
        const decoded = jwt.verify(token, JWT_SECRET) as { id: string };
        logger.info('Token verified successfully');
        return decoded;
    } catch (error) {
        logger.error('Invalid token:', error);
        throw { status: httpStatus.UNAUTHORIZED, message: 'Invalid token' };
    }
};

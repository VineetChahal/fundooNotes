import { User } from '../models/user.model';
import bcrypt from 'bcryptjs';
import { generateToken, verifyToken } from '../utils/jwt';
import { IUser } from '../interfaces/user.interface';
import logger from '../utils/logger';
import httpStatus from 'http-status';
import { queueForgotEmail , queueWelcomeEmail} from '../utils/mailer';
import { StatusCodes } from 'http-status-codes';
import { redisClient } from '../config/redis'

//-------------------------------------------------------FIND-USER-BY-EMAIL------------------------------------------------------

export async function findUserByEmail(email: string): Promise<IUser | null> {
    try {
        const cacheKey = `user:${email}`;
        const cachedUser = await redisClient.get(cacheKey);
        
        if (cachedUser) {
            logger.info('Serving user from cache', { email });
            return JSON.parse(cachedUser);
        }

        const user = await User.findOne({ email });
        if (user) {
            await redisClient.setEx(cacheKey, 3600, JSON.stringify(user)); // Cache for 1 hour
        }
        return user;
    } catch (error) {
        logger.error('Error finding user by email', { email, error });
        throw new Error('Error finding user by email');
    }
}


//-----------------------------------------------------------REGISTER-USER---------------------------------------------------------

export const registerUser = async (userData: IUser) => {
    try {
        const existingUser = await User.findOne({
            $or: [
                { email: userData.email },
                { username: userData.username }
            ]
        });

        if (existingUser) {
            if (existingUser.email === userData.email) {
                logger.warn('Email is already registered');
                throw { status: httpStatus.CONFLICT, message: 'Email is already registered' };
            }
        }

        userData.password = await bcrypt.hash(userData.password, 10);
        const user = await User.create(userData);
        logger.info(`User registered successfully with ID ${user._id}`);

        // Queue welcome email
        await queueWelcomeEmail(user.email, user.username);

        return user;
    } catch (error) {
        logger.error('Error registering user:', error);
        throw { status: httpStatus.INTERNAL_SERVER_ERROR, message: 'Error registering user' };
    }
};


//-----------------------------------------------------------LOGIN-USER---------------------------------------------------------

export const loginUser = async (userData: { email: string; password: string }) => {
    try {
        const user = await User.findOne({ email: userData.email }); 
        if (!user || !(await bcrypt.compare(userData.password, user.password))) {
            logger.warn('Invalid login credentials');
            throw { status: httpStatus.UNAUTHORIZED, message: 'Invalid credentials' };
        }
        
        const token = generateToken({ id: user._id, email: user.email });
        await redisClient.set(`auth:${user._id}`, token, { EX: 3600 }); // Expires in 1 hour
        logger.info(`User logged in successfully with ID ${user._id}`);
        return { token, user: { id: user._id, email: user.email, username: user.username } };
    } catch (error) {
        logger.error('Error logging in user:', error);
        throw { status: httpStatus.INTERNAL_SERVER_ERROR, message: 'Error logging in' };
    }
};


//----------------------------------------------------------LOGOUT-USER------------------------------------------------------------

export const logoutUser = async (token: string): Promise<{ message: string; status: number }> => {
    try {
        const { id: userId } = verifyToken(token);
        // console.log(`User ID extracted: ${userId}`);

        // Fetch the token from Redis using the key "auth:{userId}"
        const redisToken = await redisClient.get(`auth:${userId}`);
        // console.log(`Redis Token Found: ${redisToken}`);

        if (!redisToken) {
            logger.warn('No active session found for the user');
            return { message: 'No active session found', status: StatusCodes.BAD_REQUEST };
        }

        // Instead of deleting, blacklist the token for its remaining TTL
        const ttl = await redisClient.ttl(`auth:${userId}`);
        await redisClient.setEx(`blacklist:${token}`, ttl, 'blacklisted');


        // Delete the token from Redis (logging out the user)
        await redisClient.del(`auth:${userId}`);

        logger.info('User logged out successfully');
        return { message: 'Logout successful', status: StatusCodes.OK };
    } catch (error) {
        logger.error('Error during logout', { error });
        return { message: 'Error logging out', status: StatusCodes.INTERNAL_SERVER_ERROR };
    }
};

//-------------------------------------------------------FORGOT-PASSWORD------------------------------------------------------

export const forgotPassword = async (email: string) => {
    logger.info('Password reset request received', { email });

    const user = await User.findOne({ email });
    if (!user) {
        logger.warn('User not found for password reset', { email });
        throw new Error('User not found');
    }

    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
    user.resetPasswordToken = verificationCode;
    user.resetPasswordExpires = new Date(Date.now() + 10 * 60 * 1000);
    await user.save();

    // await sendVerificationCode(email, `Your verification code is: ${verificationCode}`);
    await queueForgotEmail(email, verificationCode);
    logger.info('verificationCode for email is ', { verificationCode });
    logger.info('Verification code sent for password reset', { email });
};


//----------------------------------------------------------RESET-PASSWORD---------------------------------------------------------

export const resetPassword = async (email: string, verificationCode: string, newPassword: string) => {
    logger.info('Password reset request received', { email, verificationCode });

    const user = await User.findOne({
        email,
        resetPasswordToken: verificationCode,
        resetPasswordExpires: { $gt: new Date() },
    });

    if (!user) {
        logger.warn('Invalid or expired verification code', { email, verificationCode });
        throw new Error('Invalid or expired verification code');
    }

    user.password = await bcrypt.hash(newPassword, 10);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    logger.info('Password reset successful', { email });
};

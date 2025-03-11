import { User } from '../models/user.model';
import bcrypt from 'bcryptjs';
import { generateToken, verifyToken } from '../utils/jwt';
import { IUser } from '../interfaces/user.interface';
import logger from '../utils/logger';
import httpStatus from 'http-status';
import { queueForgotEmail, queueWelcomeEmail } from '../utils/mailer';
import { StatusCodes } from 'http-status-codes';
import { redisClient } from '../config/redis'

//-------------------------------------------------------FIND USER BY EMAIL------------------------------------------------------

/**
 * Finds a user by email, utilizing Redis caching
 * @param email - The email address to search for
 * @returns The user document if found, null otherwise
 * @throws {Error} If there's an error during the search process
 */
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
            logger.info('User cached successfully', { email });
        }
        return user;
    } catch (error) {
        logger.error('Error finding user by email', { email, error });
        throw new Error('Error finding user by email');
    }
}


//-----------------------------------------------------------REGISTER USER---------------------------------------------------------

/**
 * Registers a new user with the provided data
 * @param userData - The user data including email, username, and password
 * @returns The created user document
 * @throws {Object} Error with status and message if email exists or registration fails
 */
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
                logger.warn('Email is already registered', { email: userData.email });
                throw { status: httpStatus.CONFLICT, message: 'Email is already registered' };
            }
        }

        userData.password = await bcrypt.hash(userData.password, 10);
        const user = await User.create(userData);
        logger.info(`User registered successfully with ID ${user._id}`);

        // Queue welcome email
        await queueWelcomeEmail(user.email, user.username);
        logger.info('Welcome email queued', { email: user.email });

        return user;
    } catch (error) {
        logger.error('Error registering user:', error);
        throw { status: httpStatus.INTERNAL_SERVER_ERROR, message: 'Error registering user' };
    }
};


//-----------------------------------------------------------LOGIN USER---------------------------------------------------------

/**
 * Authenticates a user and generates access tokens
 * @param userData - Object containing email and password
 * @returns Object with access token, refresh token, and user info
 * @throws {Object} Error with status and message if credentials are invalid or login fails
 */
export const loginUser = async (userData: { email: string; password: string }) => {
    try {
        const user = await User.findOne({ email: userData.email }); 
        if (!user) {
            logger.warn('User not found', { email: userData.email });
            throw { status: httpStatus.UNAUTHORIZED, message: 'Invalid credentials' };
        }

        const isMatch = await bcrypt.compare(userData.password, user.password);
        if (!isMatch) {
            logger.warn('Password mismatch', { email: userData.email });
            throw { status: httpStatus.UNAUTHORIZED, message: 'Invalid credentials' };
        }
        // console.log("Entered Password:", userData.password);
        // console.log("Stored Hashed Password:", user.password);
        // console.log("Password Match:", isMatch);

        // if (!user || !(await bcrypt.compare(userData.password, user.password))) {   
        //     logger.warn('Invalid login credentials');
        //     throw { status: httpStatus.UNAUTHORIZED, message: 'Invalid credentials' };
        // }
        
        // const token = generateToken({ id: user._id, email: user.email });
        const { token, refreshToken } = generateToken({id: user._id.toString()});
        await redisClient.set(`auth:${user._id}`, token, { EX: 900 }); // Expires in 15 minutes
        await redisClient.set(`refresh:${user._id}`, refreshToken, { EX: 604800 }); // Expires in 7 days
        logger.info(`User logged in successfully with ID ${user._id}`);
        return { token, refreshToken, user: { id: user._id, email: user.email, username: user.username } };
    } catch (error) {
        logger.error('Error logging in user:', error);
        throw { status: httpStatus.INTERNAL_SERVER_ERROR, message: 'Error logging in' };
    }
};



//----------------------------------------------------------LOGOUT USER------------------------------------------------------------

/**
 * Logs out a user by invalidating their token
 * @param token - The authentication token to invalidate
 * @returns Object with message and status code
 * @throws No explicit throw, returns error status instead
 */
export const logoutUser = async (token: string): Promise<{ message: string; status: number }> => {
    try {
        const { id: userId } = verifyToken(token);
        // console.log(`User ID extracted: ${userId}`);

        // Fetch the token from Redis using the key "auth:{userId}"
        const redisToken = await redisClient.get(`auth:${userId}`);
        // console.log(`Redis Token Found: ${redisToken}`);

        if (!redisToken) {
            logger.warn('No active session found for user', { userId });
            return { message: 'No active session found', status: StatusCodes.BAD_REQUEST };
        }

        // Instead of deleting, blacklist the token for its remaining TTL
        const ttl = await redisClient.ttl(`auth:${userId}`);
        await redisClient.setEx(`blacklist:${token}`, ttl, 'blacklisted');

        // Delete the token from Redis (logging out the user)
        await redisClient.del(`auth:${userId}`);
        await redisClient.del(`refresh:${userId}`);

        logger.info('User logged out successfully', { userId });
        return { message: 'Logout successful', status: StatusCodes.OK };
    } catch (error) {
        logger.error('Error during logout', { error });
        return { message: 'Error logging out', status: StatusCodes.INTERNAL_SERVER_ERROR };
    }
};

//-------------------------------------------------------FORGOT PASSWORD------------------------------------------------------

/**
 * Initiates password reset process by sending a verification code
 * @param email - The email address to send reset code to
 * @returns void
 * @throws {Error} If user is not found or process fails
 */
export const forgotPassword = async (email: string) => {
    try {
        logger.info('Password reset request received', { email });

        const user = await User.findOne({ email });
        if (!user) {
            logger.warn('User not found for password reset', { email });
            throw new Error('User not found');
        }

        const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
        user.resetPasswordToken = verificationCode;
        user.resetPasswordExpires = new Date(Date.now() + 10 * 60 * 1000); // Expires in 10 minutes
        await user.save();

        // await sendVerificationCode(email, `Your verification code is: ${verificationCode}`);
        await queueForgotEmail(email, verificationCode);
        logger.info('Verification code sent for password reset', { email, verificationCode });
    } catch (error) {
        logger.error('Error in forgot password process', { email, error });
        throw { status: httpStatus.INTERNAL_SERVER_ERROR, message: 'Error processing password reset' };
    }
};

//----------------------------------------------------------RESET PASSWORD---------------------------------------------------------

/**
 * Resets a user's password using a verification code
 * @param email - The user's email address
 * @param verificationCode - The code sent to the user
 * @param newPassword - The new password to set
 * @returns void
 * @throws {Error} If verification code is invalid or expired
 */
export const resetPassword = async (email: string, verificationCode: string, newPassword: string) => {
    try {
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
    } catch (error) {
        logger.error('Error resetting password', { email, error });
        throw { status: httpStatus.INTERNAL_SERVER_ERROR, message: 'Error resetting password' };
    }
};
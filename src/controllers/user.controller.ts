import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import { findUserByEmail, registerUser, loginUser, logoutUser, resetPassword, forgotPassword} from '../services/user.services';
import { StatusCodes } from 'http-status-codes';
import logger from '../utils/logger';
import { redisClient } from '../config/redis'


export default class UserController {


    //----------------------------------------------------------------REGISTER-----------------------------------------------------

    public register = async (req: Request, res: Response): Promise<void> => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            logger.warn('Validation errors during registration', { errors: errors.array() });
            res.status(StatusCodes.BAD_REQUEST).json({ errors: errors.array() });
            return;
        }
    
        try {
            const existingUser = await findUserByEmail(req.body.email);
            if (existingUser) {
                logger.warn('User registration failed: Email already exists', { email: req.body.email });
                res.status(StatusCodes.CONFLICT).json({ message: 'User already exists' });
                return;
            }
    
            const user = await registerUser(req.body);
            await redisClient.setEx(`user:${user.email}`, 3600, JSON.stringify(user));
            logger.info('User registered successfully', { userId: user.id });
            res.status(StatusCodes.CREATED).json({ message: 'User registered successfully', user });
        } catch (error: unknown) {
            const errorMessage = (error as Error).message || 'Unknown error';
            logger.error('Unexpected error during registration', { error: errorMessage });
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Internal server error' });
        }
    };


    //----------------------------------------------------------------LOGIN-USER-----------------------------------------------------

    public login = async (req: Request, res: Response): Promise<void> => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            logger.warn('Validation errors during login', { errors: errors.array() });
            res.status(StatusCodes.BAD_REQUEST).json({ errors: errors.array() });
            return;
        }
        try {
            const token = await loginUser(req.body);
            logger.info('User logged in successfully', { email: req.body.email });
            res.status(StatusCodes.OK).json({ message: 'Login successful', token });
        } catch (error) {
            logger.error('Error during login', { error });
            res.status(StatusCodes.UNAUTHORIZED).json({ message: 'Invalid credentials' });
        }
    };


    //----------------------------------------------------------------LOGOUT-USER-----------------------------------------------------

    public logout = async (req: Request, res: Response): Promise<void> => {
        try {
            // Ensure the user is authenticated by checking the token in the header
            const token = req.headers.authorization?.split(' ')[1];
            console.log('Token extracted:', token);  // Log the token to see if it is being passed

            if (!token) {
                res.status(StatusCodes.BAD_REQUEST).json({ message: 'Token required for logout' });
                return;
            }
    
            // Call the logout service and pass the token
            const { message, status } = await logoutUser(token);
    
            res.status(status).json({ message });
        } catch (error) {
            logger.error('Error during logout', { error });
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Error logging out' });
        }
    };

      
    
    //-------------------------------------------------------------FORGOT-PASSWORD--------------------------------------------------

    public forgotPassword = async (req: Request, res: Response): Promise<void> => {
        const { email } = req.body;
    
        try {
            await forgotPassword(email);
            await redisClient.setEx(`reset:${email}`, 300, 'pending'); // Store reset request for 5 minutes
            res.status(StatusCodes.OK).json({ message: 'Verification code sent to your email' });
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
            logger.error('Forgot password error', { email, error: errorMessage });
            res.status(errorMessage.includes('User not found') ? StatusCodes.NOT_FOUND : StatusCodes.INTERNAL_SERVER_ERROR)
                .json({ message: errorMessage || 'Internal server error' });
        }
    };
 

    //------------------------------------------------------------RESET-PASSWORD--------------------------------------------------

    public resetPassword = async (req: Request, res: Response): Promise<void> => {
        const { email, verificationCode, newPassword } = req.body;
    
        try {
            const resetStatus = await redisClient.get(`reset:${email}`);
            if (!resetStatus) {
                res.status(StatusCodes.BAD_REQUEST).json({ message: 'Invalid or expired verification code' });
                return;
            }
    
            await resetPassword(email, verificationCode, newPassword);
            await redisClient.del(`reset:${email}`); // Clear reset status
            res.status(StatusCodes.OK).json({ message: 'Password reset successful' });
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
            logger.error('Error in password reset', { email, error: errorMessage });
            res.status(errorMessage.includes('Invalid or expired verification code') ? StatusCodes.BAD_REQUEST : StatusCodes.INTERNAL_SERVER_ERROR)
                .json({ message: errorMessage || 'Internal server error' });
        }
    };
}

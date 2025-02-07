// import { Request, Response } from 'express';
// import { validationResult } from 'express-validator';
// import { registerUser, loginUser } from '../services/user.services';
// import { sendVerificationCode } from '../utils/mailer';
// import bcrypt from 'bcryptjs';
// import { User } from '../models/user.model';

// export default class UserController {

//     public register = async (req: Request, res: Response): Promise<void> => {
//         // Check for validation errors
//         const errors = validationResult(req);
//         if (!errors.isEmpty()) {
//             res.status(400).json({ errors: errors.array() });
//             return;
//         }

//         try {
//             const user = await registerUser(req.body);
//             res.status(201).json({ message: 'User registered successfully', user });
//         } catch (error: unknown) {
//             if (error instanceof Error) {
//                 res.status(500).json({ message: error.message });
//             } else {
//                 res.status(500).json({ message: 'An unknown error occurred' });
//             }
//         }
//     };

//     public login = async (req: Request, res: Response): Promise<void> => {
//         // Check for validation errors
//         const errors = validationResult(req);
//         if (!errors.isEmpty()) {
//             res.status(400).json({ errors: errors.array() });
//             return;
//         }

//         try {
//             const token = await loginUser(req.body);
//             res.json({ message: 'Login successful', token });
//         } catch (error: unknown) {
//             const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
//             res.status(500).json({ message: errorMessage });
//         }
//     };

//     public forgotPassword = async (req: Request, res: Response): Promise<void> => {
//         const { email } = req.body;
    
//         try {
//             // Check if the user exists
//             const user = await User.findOne({ email });
    
//             if (!user) {
//                 res.status(404).json({ message: 'User not found' });
//                 return;
//             }
    
//             console.log('User found:', user);
    
//             // Generate a 6-digit verification code
//             const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
    
//             // Save the verification code and expiration time in the user document
//             user.resetPasswordToken = verificationCode;
//             user.resetPasswordExpires = new Date(Date.now() + 10 * 60 * 1000); // Expires in 10 minutes
//             await user.save();
    
//             // Send the verification code via email
//             await sendVerificationCode(email, `Your verification code is: ${verificationCode}`);
    
//             res.status(200).json({ message: 'Verification code sent to your email' });
//         } catch (error: unknown) {
//             console.error('Forgot password error:', error);
//             res.status(500).json({ message: 'Internal server error' });
//         }
//     };
    

//     public resetPassword = async (req: Request, res: Response): Promise<void> => {
//         const { email, verificationCode, newPassword } = req.body;

//         try {
//             // Find the user by email and check the verification code
//             const user = await User.findOne({
//                 email,
//                 resetPasswordToken: verificationCode,
//                 resetPasswordExpires: { $gt: new Date() }, // Check if the token is not expired
//             });

//             if (!user) {
//                 res.status(400).json({ message: 'Invalid or expired verification code' });
//                 return;
//             }

//             // Hash the new password
//             const hashedPassword = await bcrypt.hash(newPassword, 10);

//             // Update the user's password and clear the reset token
//             user.password = hashedPassword;
//             user.resetPasswordToken = undefined;
//             user.resetPasswordExpires = undefined;
//             await user.save();

//             res.status(200).json({ message: 'Password reset successful' });
//         } catch (error: unknown) {
//             if (error instanceof Error) {
//                 res.status(500).json({ message: error.message });
//             } else {
//                 res.status(500).json({ message: 'An unknown error occurred' });
//             }
//         }
//     };
// }

import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import { registerUser, loginUser } from '../services/user.services';
import { sendVerificationCode } from '../utils/mailer';
import bcrypt from 'bcryptjs';
import { User } from '../models/user.model';
import { StatusCodes } from 'http-status-codes';
import logger from '../utils/logger';

export default class UserController {
    public register = async (req: Request, res: Response): Promise<void> => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            logger.warn('Validation errors during registration', { errors: errors.array() });
            res.status(StatusCodes.BAD_REQUEST).json({ errors: errors.array() });
            return;
        }
        try {
            const user = await registerUser(req.body);
            logger.info('User registered successfully', { userId: user.id });
            res.status(StatusCodes.CREATED).json({ message: 'User registered successfully', user });
        } catch (error) {
            logger.error('Error in user registration', { error });
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Internal server error' });
        }
    };

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
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Internal server error' });
        }
    };

    public forgotPassword = async (req: Request, res: Response): Promise<void> => {
        const { email } = req.body;
        try {
            const user = await User.findOne({ email });
            if (!user) {
                logger.warn('User not found for password reset', { email });
                res.status(StatusCodes.NOT_FOUND).json({ message: 'User not found' });
                return;
            }
            const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
            user.resetPasswordToken = verificationCode;
            user.resetPasswordExpires = new Date(Date.now() + 10 * 60 * 1000);
            await user.save();
            await sendVerificationCode(email, `Your verification code is: ${verificationCode}`);
            logger.info('Verification code sent for password reset', { email });
            res.status(StatusCodes.OK).json({ message: 'Verification code sent to your email' });
        } catch (error) {
            logger.error('Forgot password error', { error });
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Internal server error' });
        }
    };

    public resetPassword = async (req: Request, res: Response): Promise<void> => {
        const { email, verificationCode, newPassword } = req.body;
        try {
            const user = await User.findOne({
                email,
                resetPasswordToken: verificationCode,
                resetPasswordExpires: { $gt: new Date() },
            });
            if (!user) {
                logger.warn('Invalid or expired verification code', { email, verificationCode });
                res.status(StatusCodes.BAD_REQUEST).json({ message: 'Invalid or expired verification code' });
                return;
            }
            user.password = await bcrypt.hash(newPassword, 10);
            user.resetPasswordToken = undefined;
            user.resetPasswordExpires = undefined;
            await user.save();
            logger.info('Password reset successful', { email });
            res.status(StatusCodes.OK).json({ message: 'Password reset successful' });
        } catch (error) {
            logger.error('Error in password reset', { error });
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Internal server error' });
        }
    };
}

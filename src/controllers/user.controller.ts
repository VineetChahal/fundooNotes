import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import { registerUser, loginUser, resetPassword, forgotPassword} from '../services/user.services';
import { StatusCodes } from 'http-status-codes';
import logger from '../utils/logger';
import { IUser } from '../interfaces/user.interface';
import { User } from '../models/user.model';


//------------------------------------------------------------------------------
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

//------------------------------------------------------------------------------------------


async function findUserByEmail(email: string): Promise<IUser | null> {
    try {
        const user = await User.findOne({ email });
        return user;
    } catch (error) {
        logger.error('Error finding user by email', { email, error });
        throw new Error('Error finding user by email');
    }
}

export default class UserController {
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
            logger.info('User registered successfully', { userId: user.id });
            res.status(StatusCodes.CREATED).json({ message: 'User registered successfully', user });
        } catch (error: unknown) {
            const errorMessage = (error as Error).message || 'Unknown error';
            logger.error('Unexpected error during registration', { error: errorMessage });
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
            res.status(StatusCodes.UNAUTHORIZED).json({ message: 'Invalid credentials' });
        }
    };

    public forgotPassword = async (req: Request, res: Response): Promise<void> => {
        const { email } = req.body;
    
        try {
            await forgotPassword(email);
            res.status(StatusCodes.OK).json({ message: 'Verification code sent to your email' });
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
            logger.error('Forgot password error', { email, error: errorMessage });
            res.status(errorMessage.includes('User not found') ? StatusCodes.NOT_FOUND : StatusCodes.INTERNAL_SERVER_ERROR)
                .json({ message: errorMessage || 'Internal server error' });
        }
    };
 
    public resetPassword = async (req: Request, res: Response): Promise<void> => {
        const { email, verificationCode, newPassword } = req.body;
    
        try {
            await resetPassword(email, verificationCode, newPassword);
            res.status(StatusCodes.OK).json({ message: 'Password reset successful' });
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
            logger.error('Error in password reset', { email, error: errorMessage });
            res.status(errorMessage.includes('Invalid or expired verification code') ? StatusCodes.BAD_REQUEST : StatusCodes.INTERNAL_SERVER_ERROR)
                .json({ message: errorMessage || 'Internal server error' });
        }
    };
}

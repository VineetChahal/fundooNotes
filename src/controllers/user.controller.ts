import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import { registerUser, loginUser } from '../services/user.services';
import { sendVerificationCode } from '../utils/mailer';
import bcrypt from 'bcryptjs';
import { User } from '../models/user.model';

export default class UserController {

    public register = async (req: Request, res: Response): Promise<void> => {
        // Check for validation errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.status(400).json({ errors: errors.array() });
            return;
        }

        try {
            const user = await registerUser(req.body);
            res.status(201).json({ message: 'User registered successfully', user });
        } catch (error: any) {
            res.status(500).json({ message: error.message });
        }
    };

    public login = async (req: Request, res: Response): Promise<void> => {
        // Check for validation errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.status(400).json({ errors: errors.array() });
            return;
        }

        try {
            const token = await loginUser(req.body);
            res.json({ message: 'Login successful', token });
        } catch (error: any) {
            res.status(401).json({ message: error.message });
        }
    };

    public forgotPassword = async (req: Request, res: Response): Promise<void> => {
        const { email } = req.body;
    
        try {
            // Check if the user exists
            const user = await User.findOne({ email });
    
            if (!user) {
                res.status(404).json({ message: 'User not found' });
                return;
            }
    
            console.log('User found:', user);
    
            // Generate a 6-digit verification code
            const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
    
            // Save the verification code and expiration time in the user document
            user.resetPasswordToken = verificationCode;
            user.resetPasswordExpires = new Date(Date.now() + 10 * 60 * 1000); // Expires in 10 minutes
            await user.save();
    
            // Send the verification code via email
            await sendVerificationCode(email, `Your verification code is: ${verificationCode}`);
    
            res.status(200).json({ message: 'Verification code sent to your email' });
        } catch (error: any) {
            console.error('Forgot password error:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    };
    

    public resetPassword = async (req: Request, res: Response): Promise<void> => {
        const { email, verificationCode, newPassword } = req.body;

        try {
            // Find the user by email and check the verification code
            const user = await User.findOne({
                email,
                resetPasswordToken: verificationCode,
                resetPasswordExpires: { $gt: new Date() }, // Check if the token is not expired
            });

            if (!user) {
                res.status(400).json({ message: 'Invalid or expired verification code' });
                return;
            }

            // Hash the new password
            const hashedPassword = await bcrypt.hash(newPassword, 10);

            // Update the user's password and clear the reset token
            user.password = hashedPassword;
            user.resetPasswordToken = undefined;
            user.resetPasswordExpires = undefined;
            await user.save();

            res.status(200).json({ message: 'Password reset successful' });
        } catch (error: any) {
            res.status(500).json({ message: error.message });
        }
    };
}
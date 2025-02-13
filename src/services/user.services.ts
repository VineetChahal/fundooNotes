import { User } from '../models/user.model';
import bcrypt from 'bcryptjs';
import { generateToken } from '../utils/jwt';
import { IUser } from '../interfaces/user.interface';
import logger from '../utils/logger';
import httpStatus from 'http-status';
// import { sendVerificationCode } from '../utils/mailer';
import { queueEmail } from '../utils/mailer';



//-------------------------------------------------------------------------------


// export const registerUser = async (userData: IUser) => {
//     // Check if user already exists with the same email or username
//     const existingUser = await User.findOne({
//         $or: [
//             { email: userData.email },
//             { username: userData.username }
//         ]
//     });

//     if (existingUser) {
//         // Check if the email is already taken
//         if (existingUser.email === userData.email) {
//             throw new Error('Email is already registered');
//         }
//     }

//     userData.password = await bcrypt.hash(userData.password, 10);
//     return await User.create(userData);
// };

// export const loginUser = async (userData: { email: string; password: string }) => {
//     const user = await User.findOne({ email: userData.email }); 
//     if (!user || !(await bcrypt.compare(userData.password, user.password))) {
//         throw new Error('Invalid credentials');
//     }
//     const token = generateToken({ id: user._id, email: user.email });
//     return { token, user: { id: user._id, email: user.email, username: user.username } };
// };

//------------------------------------------------------------------------------------------


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
        return user;
    } catch (error) {
        logger.error('Error registering user:', error);
        throw { status: httpStatus.INTERNAL_SERVER_ERROR, message: 'Error registering user' };
    }
};

export const loginUser = async (userData: { email: string; password: string }) => {
    try {
        const user = await User.findOne({ email: userData.email }); 
        if (!user || !(await bcrypt.compare(userData.password, user.password))) {
            logger.warn('Invalid login credentials');
            throw { status: httpStatus.UNAUTHORIZED, message: 'Invalid credentials' };
        }
        
        const token = generateToken({ id: user._id, email: user.email });
        logger.info(`User logged in successfully with ID ${user._id}`);
        return { token, user: { id: user._id, email: user.email, username: user.username } };
    } catch (error) {
        logger.error('Error logging in user:', error);
        throw { status: httpStatus.INTERNAL_SERVER_ERROR, message: 'Error logging in' };
    }
};

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
    await queueEmail(email, verificationCode);
    logger.info('Verification code sent for password reset', { email });
};

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

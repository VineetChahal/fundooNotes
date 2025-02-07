// import { User } from '../models/user.model';
// import bcrypt from 'bcryptjs';
// import { generateToken } from '../utils/jwt';

// import { IUser } from '../interfaces/user.interface';

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

import { User } from '../models/user.model';
import bcrypt from 'bcryptjs';
import { generateToken } from '../utils/jwt';
import { IUser } from '../interfaces/user.interface';
import logger from '../utils/logger';
import httpStatus from 'http-status';

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

import { User } from '../models/user.model';
import bcrypt from 'bcryptjs';
import { generateToken } from '../utils/jwt';

export const registerUser = async (userData: any) => {
    // Check if user already exists with the same email or username
    const existingUser = await User.findOne({
        $or: [
            { email: userData.email },
            { username: userData.username }
        ]
    });

    if (existingUser) {
        // Check if the email is already taken
        if (existingUser.email === userData.email) {
            throw new Error('Email is already registered');
        }
    }

    userData.password = await bcrypt.hash(userData.password, 10);
    return await User.create(userData);
};

export const loginUser = async (userData: any) => {
    const user = await User.findOne({ email: userData.email }); 
    if (!user || !(await bcrypt.compare(userData.password, user.password))) {
        throw new Error('Invalid credentials');
    }
    const token = generateToken({ id: user._id, email: user.email });
    return { token, user: { id: user._id, email: user.email, username: user.username } };
};
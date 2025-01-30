import { User } from '../models/user.model';
import bcrypt from 'bcryptjs';
import { generateToken } from '../utils/jwt';

export const registerUser = async (userData: any) => {
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
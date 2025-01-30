import { Request, Response } from 'express';
import { registerUser, loginUser } from '../services/user.services';

export const register = async (req: Request, res: Response): Promise<void> => {
    try {
        const user = await registerUser(req.body);
        res.status(201).json({ message: 'User registered successfully', user });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

export const login = async (req: Request, res: Response): Promise<void> => {
    try {
        const token = await loginUser(req.body);
        res.json({ message: 'Login successful', token });
    } catch (error: any) {
        res.status(401).json({ message: error.message });
    }
};

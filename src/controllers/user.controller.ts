import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import { registerUser, loginUser } from '../services/user.services';

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
}
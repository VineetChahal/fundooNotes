// import jwt from 'jsonwebtoken';
// import dotenv from 'dotenv';
// dotenv.config();

// const JWT_SECRET = process.env.JWT_SECRET!;

// export const generateToken = (payload: object) => {
//     return jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' });
// };

// export const verifyToken = (token: string) => {
//     return jwt.verify(token, JWT_SECRET);
// };

import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET!;

export const generateToken = (payload: object) => {
    return jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' });
};
import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../utils/jwt';
// import jwt from 'jsonwebtoken';

export const authenticate = (req: Request, res: Response, next: NextFunction): void => {
    const token = req.header('Authorization')?.split(' ')[1];
    // console.log("token ---------------------------," + token);
    
    if (!token) {
        res.status(401).json({ message: 'Access denied' });
        return;
    }
    try {

         const tokenvalue = verifyToken(token); // jwt.verify(token, process.env.JWT_SECRET as string) as {id:string};
        console.log(`decoded msg----------------------------------,`,tokenvalue );
        req.body.userId = tokenvalue.id;
        next();
    } catch (error) {
        res.status(400).json({ message: 'Invalid token' });
    }
};
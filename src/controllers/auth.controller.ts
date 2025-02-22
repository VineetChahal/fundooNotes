import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import logger from '../utils/logger';
import { handleRefreshToken } from '../services/auth.service';


//----------------------------------------------------------------REFRESH-TOKEN-----------------------------------------------------

export const refreshToken = async (req: Request, res: Response): Promise<void> => {
    const { refreshToken } = req.body;
    if (!refreshToken) {
        res.status(401).json({ message: 'Refresh token required' });
        return;
    }

    try {
        const tokens = await handleRefreshToken(refreshToken);
        res.json(tokens);
    } catch (error) {
        logger.error('Error With Access Token', { error });
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Error logging out' });
    }
};
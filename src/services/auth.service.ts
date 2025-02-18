import { redisClient } from '../config/redis';
import jwt from 'jsonwebtoken';
import { generateToken } from '../utils/jwt';

//----------------------------------------------------------Handle-refresh-token------------------------------------------------------------

export const handleRefreshToken = async (refreshToken: string) => {
    const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET!) as { id: string };
    const storedToken = await redisClient.get(`refresh:${decoded.id}`);

    if (!storedToken || storedToken !== refreshToken) throw { status: 403, message: 'Invalid refresh token' };

    const { token, refreshToken: newRefreshToken } = generateToken({ id: decoded.id });

    await redisClient.set(`auth:${decoded.id}`, token, { EX: 900 });
    await redisClient.set(`refresh:${decoded.id}`, newRefreshToken, { EX: 604800 });

    return { token, refreshToken: newRefreshToken };
};
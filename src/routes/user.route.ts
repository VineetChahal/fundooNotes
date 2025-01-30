import express from 'express';
import { register, login } from '../controllers/user.controller';
import { authenticate } from '../middlewares/auth.middleware';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/protected', authenticate, (req, res) => {
    res.json({ message: 'This is a protected route' });
});

export default router;

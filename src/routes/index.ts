import express, { IRouter } from 'express';
import UserRoutes from './user.route';

const router = express.Router();

const routes = (): IRouter => {
    router.get('/', (req, res) => {
        res.json('Welcome');
    });
    router.use('/users', new UserRoutes().getRoutes());

    return router;
};

export default routes;
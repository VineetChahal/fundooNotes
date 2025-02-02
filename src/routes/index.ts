import express, { IRouter } from 'express';
import UserRoutes from './user.route'; // import user routes
import NoteRoutes from './note.route'; // Import note routes

const router = express.Router();

const routes = (): IRouter => {
    router.get('/', (req, res) => {
        res.json('Welcome');
    });
    router.use('/users', new UserRoutes().getRoutes()); // Add user routes
    router.use('/notes', new NoteRoutes().getRoutes()); // Add note routes

    return router;
};

export default routes;
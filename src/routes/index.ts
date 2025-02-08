import express, { IRouter } from 'express';
import UserRoutes from './user.route';
import NoteRoutes from './note.route';
import logger from '../utils/logger';


//---------------------------------------------------------------------------

// const routes = (): IRouter => {
//     router.get('/', (req, res) => {
//         res.json('Welcome');
//     });
//     router.use('/users', new UserRoutes().getRoutes()); // Add user routes
//     router.use('/notes', new NoteRoutes().getRoutes()); // Add note routes

//     return router;
// };

//-----------------------------------------------------------------------------


const router = express.Router();

const routes = (): IRouter => {
    router.get('/', (req, res) => {
        logger.info(`Root route accessed from ${req.ip}`);
        res.json({ message: 'Welcome to Fundoo Notes API' });
    });

    router.use('/users', (req, res, next) => {
        logger.info(`User route accessed: ${req.method} ${req.originalUrl} from ${req.ip}`);
        next();
    }, new UserRoutes().getRoutes());

    router.use('/notes', (req, res, next) => {
        logger.info(`Note route accessed: ${req.method} ${req.originalUrl} from ${req.ip}`);
        next();
    }, new NoteRoutes().getRoutes());

    return router;
};

export default routes;

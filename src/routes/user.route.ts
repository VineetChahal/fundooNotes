import express, { IRouter } from 'express';
import UserController from '../controllers/user.controller'; // Import controllers
import { registerValidation, loginValidation } from '../validators/user.validator'; // Import validators
import logger from '../utils/logger';

//-----------------------------------------------------------------------------------

//     private routes = () => {
//         this.router.post('/register', registerValidation, this.UserController.register);
//         this.router.post('/login', loginValidation, this.UserController.login);
//         this.router.post('/forgot-password', this.UserController.forgotPassword);
//         this.router.post('/reset-password', this.UserController.resetPassword);
//     };

//--------------------------------------------------------------------------------


class UserRoutes {
    private UserController = new UserController();
    private router = express.Router();

    constructor() {
        this.routes();
    }

    private routes = () => {
        this.router.post('/register', registerValidation, (req: express.Request, res: express.Response, next: express.NextFunction) => {
            logger.info('POST /users/register - Registering a user');
            next();
        }, this.UserController.register);

        this.router.post('/login', loginValidation, (req: express.Request, res: express.Response, next: express.NextFunction) => {
            logger.info('POST /users/login - Logging in a user');
            next();
        }, this.UserController.login);

        this.router.post('/logout', (req: express.Request, res: express.Response, next: express.NextFunction) => {
              logger.info('POST /users/logout - Logging out a user');
              next();
        }, this.UserController.logout);

        this.router.post('/forgotPassword', (req, res, next) => {
            logger.info('POST /users/forgotPassword - Forgot password request');
            next();
        }, this.UserController.forgotPassword);

        this.router.post('/resetPassword', (req, res, next) => {
            logger.info('POST /users/resetPassword - Resetting password');
            next();
        }, this.UserController.resetPassword);
    };

    public getRoutes = (): IRouter => {
        return this.router;
    };
}

export default UserRoutes;

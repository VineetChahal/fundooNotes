import express, { IRouter } from 'express';
import UserController from '../controllers/user.controller'; // Import controllers
import { registerValidation, loginValidation } from '../validators/user.validator'; // Import validators

class UserRoutes {
    private UserController = new UserController();
    private router = express.Router();

    constructor() {
        this.routes();
    }

    private routes = () => {
        this.router.post('/register', registerValidation, this.UserController.register);
        this.router.post('/login', loginValidation, this.UserController.login);
        this.router.post('/forgot-password', this.UserController.forgotPassword);
        this.router.post('/reset-password', this.UserController.resetPassword);
    };

    public getRoutes = (): IRouter => {
        return this.router;
    };
}

export default UserRoutes;
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
        // Add validation middleware and controller to routes
        this.router.post('/register', registerValidation, this.UserController.register);
        this.router.post('/login', loginValidation, this.UserController.login);
    };

    public getRoutes = (): IRouter => {
        return this.router;
    };
}

export default UserRoutes;
import { body } from 'express-validator';

export const registerValidation = [
    body('firstName') // Change from "First Name" to "firstName"
        .isString()
        .notEmpty()
        .withMessage('First Name is required')
        .matches(/^[A-Za-z]+$/)
        .withMessage('First Name must contain only alphabetic characters (no numbers or special characters)'),
    
    body('lastName') // Change from "Last Name" to "lastName"
        .isString()
        .notEmpty()
        .withMessage('Last Name is required')
        .matches(/^[A-Za-z]+$/)
        .withMessage('Last Name must contain only alphabetic characters (no numbers or special characters)'),

    body('username')
        .isString()
        .trim()
        .notEmpty()
        .withMessage('Username is required'),
        // .matches(/^[A-Za-z]+$/)
        // .withMessage('Username must contain only alphabetic characters (no numbers or special characters)'),
    
    body('email')
        .isEmail()
        .withMessage('Valid email is required'),
    
    body('password')
        .isLength({ min: 6 })
        .withMessage('Password must be at least 6 characters')
        .matches(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/)
        .withMessage('Password must contain at least one letter, one number, and one special character'),
];


export const loginValidation = [
    body('email')
        .isEmail()
        .withMessage('Valid email is required'),
    
    body('password')
        .notEmpty()
        .withMessage('Password is required'),
];
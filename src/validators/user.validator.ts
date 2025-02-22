// import { body } from 'express-validator';

// export const registerValidation = [
//     body('firstName') // Change from "First Name" to "firstName"
//         .isString()
//         .notEmpty()
//         .withMessage('First Name is required')
//         .matches(/^[A-Za-z]+$/)
//         .withMessage('First Name must contain only alphabetic characters (no numbers or special characters)'),
    
//     body('lastName') // Change from "Last Name" to "lastName"
//         .isString()
//         .notEmpty()
//         .withMessage('Last Name is required')
//         .matches(/^[A-Za-z]+$/)
//         .withMessage('Last Name must contain only alphabetic characters (no numbers or special characters)'),

//     body('username')
//         .isString()
//         .trim()
//         .notEmpty()
//         .withMessage('Username is required'),
//         // .matches(/^[A-Za-z]+$/)
//         // .withMessage('Username must contain only alphabetic characters (no numbers or special characters)'),
    
//     body('email')
//         .isEmail()
//         .withMessage('Valid email is required'),
    
//     body('password')
//         .isLength({ min: 6 })
//         .withMessage('Password must be at least 6 characters')
//         .matches(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/)
//         .withMessage('Password must contain at least one letter, one number, and one special character'),
// ];


// export const loginValidation = [
//     body('email')
//         .isEmail()
//         .withMessage('Valid email is required'),
    
//     body('password')
//         .notEmpty()
//         .withMessage('Password is required'),
// ];


import { body } from 'express-validator';
import logger from '../utils/logger';


//-----------------------------------------------------------REGISTER-VALIDATION--------------------------------------------------

export const registerValidation = [
    body('firstName')
        .isString()
        .notEmpty()
        .withMessage('First Name is required')
        .matches(/^[A-Za-z]+$/)
        .withMessage('First Name must contain only alphabetic characters (no numbers or special characters)')
        .custom((value) => {
            logger.info(`Validating firstName: ${value}`);
            return true;
        }),
    
    body('lastName')
        .isString()
        .notEmpty()
        .withMessage('Last Name is required')
        .matches(/^[A-Za-z]+$/)
        .withMessage('Last Name must contain only alphabetic characters (no numbers or special characters)')
        .custom((value) => {
            logger.info(`Validating lastName: ${value}`);
            return true;
        }),

    body('username')
        .isString()
        .trim()
        .notEmpty()
        .withMessage('Username is required')
        .custom((value) => {
            logger.info(`Validating username: ${value}`);
            return true;
        }),
    
    body('email')
        .isEmail()
        .withMessage('Valid email is required')
        .custom((value) => {
            logger.info(`Validating email: ${value}`);
            return true;
        }),
    
    body('password')
        .isLength({ min: 6 })
        .withMessage('Password must be at least 6 characters')
        .matches(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/)
        .withMessage('Password must contain at least one letter, one number, and one special character')
        .custom(() => {
            logger.info('Validating password');
            return true;
        }),
];


//-------------------------------------------------------------LOGIN-VALIDATION----------------------------------------------------

export const loginValidation = [
    body('email')
        .isEmail()
        .withMessage('Valid email is required')
        .custom((value) => {
            logger.info(`Validating login email: ${value}`);
            return true;
        }),
    
    body('password')
        .notEmpty()
        .withMessage('Password is required')
        .custom(() => {
            logger.info('Validating login password');
            return true;
        }),
];

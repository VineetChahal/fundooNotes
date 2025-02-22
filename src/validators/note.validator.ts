// import { body } from 'express-validator';

// export const createNoteValidation = [
//     body('title').isString().notEmpty().withMessage('Title is required'),
//     body('description').isString().notEmpty().withMessage('Description is required'),
//     body('color').optional().isString().withMessage('Color must be a string')
// ];

// export const updateNoteValidation = [
//     body('title').optional().isString().withMessage('Title must be a string'),
//     body('description').optional().isString().withMessage('Description must be a string'),
//     body('color').optional().isString().withMessage('Color must be a string')
// ];

import { body } from 'express-validator';
import logger from '../utils/logger';


//--------------------------------------------------------CREATE-NOTE-VALIDATION-----------------------------------------------

export const createNoteValidation = [
    body('title')
        .isString()
        .notEmpty()
        .withMessage('Title is required')
        .custom((value) => {
            logger.info(`Validating title: ${value}`);
            return true;
        }),
    body('description')
        .isString()
        .notEmpty()
        .withMessage('Description is required')
        .custom((value) => {
            logger.info(`Validating description: ${value}`);
            return true;
        }),
    body('color')
        .optional()
        .isString()
        .withMessage('Color must be a string')
        .custom((value) => {
            logger.info(`Validating color: ${value}`);
            return true;
        }),
];


//--------------------------------------------------------UPDATE-NOTE-VALIDATION-----------------------------------------------

export const updateNoteValidation = [
    body('title')
        .optional()
        .isString()
        .withMessage('Title must be a string')
        .custom((value) => {
            logger.info(`Validating updated title: ${value}`);
            return true;
        }),
    body('description')
        .optional()
        .isString()
        .withMessage('Description must be a string')
        .custom((value) => {
            logger.info(`Validating updated description: ${value}`);
            return true;
        }),
    body('color')
        .optional()
        .isString()
        .withMessage('Color must be a string')
        .custom((value) => {
            logger.info(`Validating updated color: ${value}`);
            return true;
        }),
];

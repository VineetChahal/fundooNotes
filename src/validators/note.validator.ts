import { body } from 'express-validator';

export const createNoteValidation = [
    body('title').isString().notEmpty().withMessage('Title is required'),
    body('description').isString().notEmpty().withMessage('Description is required'),
    body('color').optional().isString().withMessage('Color must be a string')
];

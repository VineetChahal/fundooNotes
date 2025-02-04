import { body } from 'express-validator';

export const createNoteValidation = [
    body('title').isString().notEmpty().withMessage('Title is required'),
    body('description').isString().notEmpty().withMessage('Description is required'),
    body('color').optional().isString().withMessage('Color must be a string')
];

export const updateNoteValidation = [
    body('title').optional().isString().withMessage('Title must be a string'),
    body('description').optional().isString().withMessage('Description must be a string'),
    body('color').optional().isString().withMessage('Color must be a string')
];
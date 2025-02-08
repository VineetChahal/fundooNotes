import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import logger from '../utils/logger';
import { createNote, getNoteById, getNotesByUserId, updateNoteById, deleteNoteById } from '../services/note.services';


//-----------------------------------------------------------------------------------------

// export default class NoteController {
//     public create = async (req: Request, res: Response): Promise<void> => {
//         try {
//             const note = await createNote(req.body);
//             res.status(201).json({ message: 'Note created successfully', note });
//         } catch (error: unknown) {
//             const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
//             res.status(500).json({ message: errorMessage });
//         }
//     };

//     public getById = async (req: Request, res: Response): Promise<void> => {
//         try {
//             const note = await getNoteById(req.params.id);
//             if (!note) {
//                 res.status(404).json({ message: 'Note not found' });
//                 return;
//             }
//             res.status(200).json({ note });
//         } catch (error: unknown) {
//             const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
//             res.status(500).json({ message: errorMessage });
//         }
//     };

//     public getAll = async (req: Request, res: Response): Promise<void> => {
//         try {
//             const userId = req.body.userId; // Get userId from JWT token
//             console.log('userId ==============>>>>>>>>>>>>', userId);
//             const notes = await getNotesByUserId(userId); // Fetch notes based on userId
//             res.status(200).json({ notes });
//         } catch (error: unknown) {
//             const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
//             res.status(500).json({ message: errorMessage });
//         }
//     };

//     public updateById = async (req: Request, res: Response): Promise<void> => {
//         try {
//             const note = await updateNoteById(req.params.id, req.body);
//             if (!note) {
//                 res.status(404).json({ message: 'Note not found' });
//                 return;
//             }
//             res.status(200).json({ message: 'Note updated successfully', note });
//         } catch (error: unknown) {
//             const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
//             res.status(500).json({ message: errorMessage });
//         }
//     };

//     public deleteById = async (req: Request, res: Response): Promise<void> => {
//         try {
//             const note = await deleteNoteById(req.params.id);
//             if (!note) {
//                 res.status(404).json({ message: 'Note not found' });
//                 return;
//             }
//             res.status(200).json({ message: 'Note deleted successfully' });
//         } catch (error: unknown) {
//             const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
//             res.status(500).json({ message: errorMessage });
//         }
//     };

// }

//----------------------------------------------------------------------------------


export default class NoteController {
    public create = async (req: Request, res: Response): Promise<void> => {
        try {
            const note = await createNote(req.body);
            logger.info('Note created successfully', { note });
            res.status(StatusCodes.CREATED).json({ message: 'Note created successfully', note });
        } catch (error: unknown) {
            const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
            logger.error('Error creating note', { error: errorMessage });
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: errorMessage });
        }
    };

    public getById = async (req: Request, res: Response): Promise<void> => {
        try {
            const note = await getNoteById(req.params.id);
            if (!note) {
                logger.warn('Note not found', { noteId: req.params.id });
                res.status(StatusCodes.NOT_FOUND).json({ message: 'Note not found' });
                return;
            }
            res.status(StatusCodes.OK).json({ note });
        } catch (error: unknown) {
            const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
            logger.error('Error fetching note', { error: errorMessage });
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: errorMessage });
        }
    };

    public getAll = async (req: Request, res: Response): Promise<void> => {
        try {
            const userId = req.body.userId;
            logger.info('Fetching notes for user', { userId });
            const notes = await getNotesByUserId(userId);
            res.status(StatusCodes.OK).json({ notes });
        } catch (error: unknown) {
            const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
            logger.error('Error fetching notes', { error: errorMessage });
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: errorMessage });
        }
    };

    public updateById = async (req: Request, res: Response): Promise<void> => {
        try {
            const note = await updateNoteById(req.params.id, req.body);
            if (!note) {
                logger.warn('Note not found for update', { noteId: req.params.id });
                res.status(StatusCodes.NOT_FOUND).json({ message: 'Note not found' });
                return;
            }
            logger.info('Note updated successfully', { note });
            res.status(StatusCodes.OK).json({ message: 'Note updated successfully', note });
        } catch (error: unknown) {
            const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
            logger.error('Error updating note', { error: errorMessage });
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: errorMessage });
        }
    };

    public deleteById = async (req: Request, res: Response): Promise<void> => {
        try {
            const note = await deleteNoteById(req.params.id);
            if (!note) {
                logger.warn('Note not found for deletion', { noteId: req.params.id });
                res.status(StatusCodes.NOT_FOUND).json({ message: 'Note not found' });
                return;
            }
            logger.info('Note deleted successfully', { noteId: req.params.id });
            res.status(StatusCodes.OK).json({ message: 'Note deleted successfully' });
        } catch (error: unknown) {
            const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
            logger.error('Error deleting note', { error: errorMessage });
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: errorMessage });
        }
    };
}

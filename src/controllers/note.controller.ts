import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import logger from '../utils/logger';
import { Note } from '../models/note.model';
import { redisClient } from '../config/redis';
import {createNote, getNoteById, getNotesByUserId, updateNoteById, deleteNoteById, moveToTrash, addLabelToNote, removeLabelFromNote} from '../services/note.services';


export default class NoteController {
    //--------------------------------------------------------CREATE-------------------------------------------------

    public create = async (req: Request, res: Response): Promise<void> => {
        try {
            const note = await createNote(req.body);
            logger.info('Note created successfully', { note });
    
            // Sending message to RabbitMQ
            // await sendMessageToQueue({ action: "CREATE_NOTE", note });
    
            // Redis cache key for user's notes
            const cacheKey = `notes:${req.body.userId}`;
    
            // Fetch all notes from the database when a new note is created
            const allNotes = await getNotesByUserId(req.body.userId);
    
            // Update the Redis list with all notes
            await redisClient.del(cacheKey);
            for (const n of allNotes) {
                await redisClient.rPush(cacheKey, JSON.stringify(n));
            }
    
            await redisClient.set(`note:${note._id}`, JSON.stringify(note));
    
            res.status(StatusCodes.CREATED).json({ message: 'Note created successfully', note });
        } catch (error: unknown) {
            const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
            logger.error('Error creating note', { error: errorMessage });
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: errorMessage });
        }
    };    


    //--------------------------------------------------------GET-BY-ID-------------------------------------------------

    public getById = async (req: Request, res: Response): Promise<void> => {
        try {
            const cacheKey = `note:${req.params.id}`;
            const cachedNote = await redisClient.get(cacheKey);

            if (cachedNote) {
                logger.info('Serving from cache', { noteId: req.params.id });
                res.status(StatusCodes.OK).json({ note: JSON.parse(cachedNote) });
                return;
            }

            const note = await getNoteById(req.params.id);
            if (!note) {
                logger.warn('Note not found', { noteId: req.params.id });
                res.status(StatusCodes.NOT_FOUND).json({ message: 'Note not found' });
                return;
            }

            // Cache the note for 1 hour
            await redisClient.setEx(cacheKey, 3600, JSON.stringify(note));

            res.status(StatusCodes.OK).json({ note });
        } catch (error: unknown) {
            const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
            logger.error('Error fetching note', { error: errorMessage });
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: errorMessage });
        }
    };


    //--------------------------------------------------------GET-ALL-------------------------------------------------

    public getAll = async (req: Request, res: Response): Promise<void> => {
        try {
            const userId = req.body.userId;
            const cacheKey = `notes:${userId}`;

            const cachedNotes = await redisClient.get(cacheKey);
            if (cachedNotes) {
                logger.info('Serving notes from cache', { userId });
                res.status(StatusCodes.OK).json({ notes: JSON.parse(cachedNotes) });
                return;
            }

            logger.info('Fetching notes for user', { userId });
            const notes = await getNotesByUserId(userId);

            // Cache the notes for 1 hour
            await redisClient.setEx(cacheKey, 3600, JSON.stringify(notes));

            res.status(StatusCodes.OK).json({ notes });
        } catch (error: unknown) {
            const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
            logger.error('Error fetching notes', { error: errorMessage });
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: errorMessage });
        }
    };


    //--------------------------------------------------------UPDATE-BY-ID-------------------------------------------------

    public updateById = async (req: Request, res: Response): Promise<void> => {
        try {
            const note = await updateNoteById(req.params.id, req.body);
            if (!note) {
                logger.warn('Note not found for update', { noteId: req.params.id });
                res.status(StatusCodes.NOT_FOUND).json({ message: 'Note not found' });
                return;
            }

            // Fetch cached notes list
            const cacheKey = `notes:${req.body.userId}`;
            const cachedNotes = await redisClient.lRange(cacheKey, 0, -1);

            if (cachedNotes.length > 0) {
                for (let i = 0; i < cachedNotes.length; i++) {
                    const cachedNote = JSON.parse(cachedNotes[i]);
                    if (cachedNote._id === req.params.id) {
                        // Update only the changed note in the cache
                        await redisClient.lSet(cacheKey, i, JSON.stringify(note));
                        break;
                    }
                }
            }

            // Update individual note cache
            await redisClient.set(`note:${req.params.id}`, JSON.stringify(note));

            logger.info('Note updated successfully', { note });
            res.status(StatusCodes.OK).json({ message: 'Note updated successfully', note });
        } catch (error: unknown) {
            const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
            logger.error('Error updating note', { error: errorMessage });
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: errorMessage });
        }
    };


    //--------------------------------------------------------DELETE-BY-ID-------------------------------------------------

    public deleteById = async (req: Request, res: Response): Promise<void> => {
        try {
            const noteId = req.params.id;
            const userId = req.body.userId;
    
            const note = await deleteNoteById(noteId, userId);
            if (!note) {
                logger.warn('Note not found for deletion', { noteId });
                res.status(StatusCodes.NOT_FOUND).json({ success: false, message: 'Note not found' });
                return;
            }
    
            // Fetch cached notes list
            const cacheKey = `notes:${userId}`;
            // const cachedNotes = await redisClient.lRange(cacheKey, 0, -1);

            // if (cachedNotes.length > 0) {
            //     const updatedNotes = cachedNotes.filter(n => JSON.parse(n)._id !== noteId);
            //     await redisClient.del(cacheKey);
            //     for (const n of updatedNotes) {
            //         await redisClient.rPush(cacheKey, n);
            //     }
            // }

             // Removing the deleted note directly from Redis List
            await redisClient.lRem(cacheKey, 1, JSON.stringify(note));

            // Invalidate individual note cache
            await redisClient.del(`note:${noteId}`);
    
            logger.info('Note deleted successfully', { noteId });
            res.status(StatusCodes.OK).json({ 
                success: true, 
                message: 'Note deleted successfully', 
                deletedNote: note 
            });
        } catch (error: unknown) {
            const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
            logger.error('Error deleting note', { error: errorMessage });
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ success: false, message: errorMessage });
        }
    };


    //--------------------------------------------------------MOVE-TO-TRASH-------------------------------------------------

    public moveToTrash = async (req: Request, res: Response): Promise<void> => {
        try {
            const note = await moveToTrash(req.params.id);
            if (!note) {
                res.status(StatusCodes.NOT_FOUND).json({ message: 'Note not found' });
                return;
            }
    
            // Fetch cached notes list
            const cacheKey = `notes:${req.body.userId}`;
            const cachedNotes = await redisClient.lRange(cacheKey, 0, -1);

            if (cachedNotes.length > 0) {
                for (let i = 0; i < cachedNotes.length; i++) {
                    const cachedNote = JSON.parse(cachedNotes[i]);
                    if (cachedNote._id === req.params.id) {
                        // Update only the changed note in the cache
                        cachedNote.isTrashed = true;
                        await redisClient.lSet(cacheKey, i, JSON.stringify(cachedNote));
                        break;
                    }
                }
            }
    
            // Invalidate individual note cache
            await redisClient.del(`note:${req.params.id}`);
    
            logger.info('Note moved to trash', { noteId: req.params.id });
            res.status(StatusCodes.OK).json({ message: 'Note moved to trash', note });
        } catch (error: unknown) {
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                message: error instanceof Error ? error.message : 'An unknown error occurred',
            });
        }
    };


    //--------------------------------------------------------TOGGLE-ARCHIVE-------------------------------------------------

    public toggleArchive = async (req: Request, res: Response): Promise<void> => {
        try {
            const { isArchive } = req.body;
            if (typeof isArchive !== 'boolean') {
                res.status(StatusCodes.BAD_REQUEST).json({ message: 'Invalid value for isArchive' });
                return;
            }
    
            const note = await Note.findByIdAndUpdate(req.params.id, { isArchive }, { new: true });
            if (!note) {
                res.status(StatusCodes.NOT_FOUND).json({ message: 'Note not found' });
                return;
            }
    
            // Fetch cached notes list
            const cacheKey = `notes:${req.body.userId}`;
            const cachedNotes = await redisClient.lRange(cacheKey, 0, -1);

            if (cachedNotes.length > 0) {
                for (let i = 0; i < cachedNotes.length; i++) {
                    const cachedNote = JSON.parse(cachedNotes[i]);
                    if (cachedNote._id === req.params.id) {
                        // Update only the changed note in the cache
                        cachedNote.isArchive = isArchive;
                        await redisClient.lSet(cacheKey, i, JSON.stringify(cachedNote));
                        break;
                    }
                }
            }
    
            // Invalidate individual note cache
            await redisClient.del(`note:${req.params.id}`);
    
            res.status(StatusCodes.OK).json({ message: `Note ${isArchive ? 'archived' : 'unarchived'}`, note });
        } catch (error: unknown) {
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                message: error instanceof Error ? error.message : 'An unknown error occurred',
            });
        }
    };

    public attachLabel = async (req: Request, res: Response) => {
        try {
            const { noteId, labelId } = req.body;
            const updatedNote = await addLabelToNote(noteId, labelId);
            res.status(200).json(updatedNote);
        } catch (error) {
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                message: error instanceof Error ? error.message : 'An unknown error occurred',
            })       
        }
    };


    public detachLabel = async (req: Request, res: Response) => {
        try {
            const { noteId, labelId } = req.body;
            const updatedNote = await removeLabelFromNote(noteId, labelId);
            res.status(200).json(updatedNote);
        } catch (error) {
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                message: error instanceof Error ? error.message : 'An unknown error occurred',
            })        
        }
    };
    
}

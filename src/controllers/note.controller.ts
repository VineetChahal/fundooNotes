import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import logger from '../utils/logger';
import { INote } from "../interfaces/note.interface";
import { Note } from '../models/note.model';
import { redisClient } from '../config/redis';
import {createNote, getNoteById, getNotesByUserId, updateNoteById, deleteNoteById, /*moveToTrash,*/ addLabelToNote, removeLabelFromNote,} from '../services/note.services';


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
            console.log("Request Body: ", req.body);
            
            const userId = req.body.userId 
            const cacheKey = `notes:${userId}`;

            // Check if notes exist in Redis as a list
            const type = await redisClient.type(cacheKey);
            console.log(`Key ${cacheKey} type: ${type}`);

            let notes: INote[] = [];

            if (type === "list") {
                // Fetch notes from Redis list
                const redisNotes = await redisClient.lRange(cacheKey, 0, -1);
                console.log(`Redis cache hit for ${cacheKey}: ${redisNotes.length > 0 ? 'Yes' : 'No'}`);
                if (redisNotes.length > 0) {
                    logger.info('Serving notes from Redis list cache', { userId });
                    notes = redisNotes.map((note: string) => JSON.parse(note) as INote);
                    res.status(StatusCodes.OK).json({ notes });
                    return;
                }
            } else if (type !== "none") {
                // If the key exists but isn’t a list, reset it
                await redisClient.del(cacheKey);
                await redisClient.lPush(cacheKey, JSON.stringify([])); // Initialize as empty list
                logger.info(`Reset ${cacheKey} to an empty list`);
            }

            // If no notes in Redis or Redis key doesn’t exist, fetch from MongoDB
            logger.info('Fetching notes for user from MongoDB', { userId });
            notes = await getNotesByUserId(userId);

            // Cache the notes in Redis as a list (JSON strings)
            if (notes.length > 0) {
                await redisClient.del(cacheKey); // Clear any existing key
                await Promise.all(notes.map((note: INote) => redisClient.lPush(cacheKey, JSON.stringify(note))));
                logger.info(`Cached notes for ${cacheKey} in Redis list`, { userId });
            } else {
                await redisClient.lPush(cacheKey, JSON.stringify([])); // Cache empty list
                logger.info(`Cached empty list for ${cacheKey}`, { userId });
            }

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
            const noteId = req.params.id;
            const { isTrash } = req.body; // Optional body parameter
    
            // Find the note to get its current state
            const note = await Note.findById(noteId);
            if (!note) {
                res.status(StatusCodes.NOT_FOUND).json({ message: 'Note not found' });
                return;
            }
    
            // Toggle isTrash if no body provided, otherwise use provided value
            const newIsTrash = isTrash !== undefined ? isTrash : !note.isTrash;
            const updatedNote = await Note.findByIdAndUpdate(
                noteId,
                { isTrash: newIsTrash },
                { new: true }
            );
    
            // Update Redis cache
            const cacheKey = `notes:${req.body.userId}`;
            // const cacheKey = `notes:${updatedNote.userId}`;
            const cachedNotes = await redisClient.lRange(cacheKey, 0, -1);
    
            if (cachedNotes.length > 0) {
                for (let i = 0; i < cachedNotes.length; i++) {
                    const cachedNote = JSON.parse(cachedNotes[i]);
                    if (cachedNote._id === noteId) {
                        cachedNote.isTrash = newIsTrash; // Use isTrash to match schema
                        await redisClient.lSet(cacheKey, i, JSON.stringify(cachedNote));
                        break;
                    }
                }
            }
    
            // Invalidate individual note cache
            await redisClient.del(`note:${noteId}`);
    
            logger.info(`Note ${newIsTrash ? 'moved to trash' : 'restored from trash'}`, { noteId });
            res.status(StatusCodes.OK).json({ 
                message: `Note ${newIsTrash ? 'moved to trash' : 'restored from trash'}`, 
                note: updatedNote 
            });
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

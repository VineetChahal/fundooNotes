
import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import logger from '../utils/logger';
import { Note } from '../models/note.model';
import Redis from 'ioredis';
import {
    createNote,
    getNoteById,
    getNotesByUserId,
    updateNoteById,
    deleteNoteById,
    moveToTrash,
} from '../services/note.services';
import { sendMessageToQueue } from "../services/producer";

// //-----------------------------------------------------------------------------------------

// // export default class NoteController {
// //     public create = async (req: Request, res: Response): Promise<void> => {
// //         try {
// //             const note = await createNote(req.body);
// //             res.status(201).json({ message: 'Note created successfully', note });
// //         } catch (error: unknown) {
// //             const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
// //             res.status(500).json({ message: errorMessage });
// //         }
// //     };

// //     public getById = async (req: Request, res: Response): Promise<void> => {
// //         try {
// //             const note = await getNoteById(req.params.id);
// //             if (!note) {
// //                 res.status(404).json({ message: 'Note not found' });
// //                 return;
// //             }
// //             res.status(200).json({ note });
// //         } catch (error: unknown) {
// //             const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
// //             res.status(500).json({ message: errorMessage });
// //         }
// //     };

// //     public getAll = async (req: Request, res: Response): Promise<void> => {
// //         try {
// //             const userId = req.body.userId; // Get userId from JWT token
// //             console.log('userId ==============>>>>>>>>>>>>', userId);
// //             const notes = await getNotesByUserId(userId); // Fetch notes based on userId
// //             res.status(200).json({ notes });
// //         } catch (error: unknown) {
// //             const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
// //             res.status(500).json({ message: errorMessage });
// //         }
// //     };

// //     public updateById = async (req: Request, res: Response): Promise<void> => {
// //         try {
// //             const note = await updateNoteById(req.params.id, req.body);
// //             if (!note) {
// //                 res.status(404).json({ message: 'Note not found' });
// //                 return;
// //             }
// //             res.status(200).json({ message: 'Note updated successfully', note });
// //         } catch (error: unknown) {
// //             const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
// //             res.status(500).json({ message: errorMessage });
// //         }
// //     };

// //     public deleteById = async (req: Request, res: Response): Promise<void> => {
// //         try {
// //             const note = await deleteNoteById(req.params.id);
// //             if (!note) {
// //                 res.status(404).json({ message: 'Note not found' });
// //                 return;
// //             }
// //             res.status(200).json({ message: 'Note deleted successfully' });
// //         } catch (error: unknown) {
// //             const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
// //             res.status(500).json({ message: errorMessage });
// //         }
// //     };

// // }

// //----------------------------------------------------------------------------------


// export default class NoteController {
//     public create = async (req: Request, res: Response): Promise<void> => {
//         try {
//             const note = await createNote(req.body);
//             logger.info('Note created successfully', { note });
//             res.status(StatusCodes.CREATED).json({ message: 'Note created successfully', note });
//         } catch (error: unknown) {
//             const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
//             logger.error('Error creating note', { error: errorMessage });
//             res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: errorMessage });
//         }
//     };

//     public getById = async (req: Request, res: Response): Promise<void> => {
//         try {
//             const note = await getNoteById(req.params.id);
//             if (!note) {
//                 logger.warn('Note not found', { noteId: req.params.id });
//                 res.status(StatusCodes.NOT_FOUND).json({ message: 'Note not found' });
//                 return;
//             }
//             res.status(StatusCodes.OK).json({ note });
//         } catch (error: unknown) {
//             const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
//             logger.error('Error fetching note', { error: errorMessage });
//             res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: errorMessage });
//         }
//     };

//     public getAll = async (req: Request, res: Response): Promise<void> => {
//         try {
//             const userId = req.body.userId;
//             logger.info('Fetching notes for user', { userId });
//             const notes = await getNotesByUserId(userId);
//             res.status(StatusCodes.OK).json({ notes });
//         } catch (error: unknown) {
//             const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
//             logger.error('Error fetching notes', { error: errorMessage });
//             res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: errorMessage });
//         }
//     };

//     public updateById = async (req: Request, res: Response): Promise<void> => {
//         try {
//             const note = await updateNoteById(req.params.id, req.body);
//             if (!note) {
//                 logger.warn('Note not found for update', { noteId: req.params.id });
//                 res.status(StatusCodes.NOT_FOUND).json({ message: 'Note not found' });
//                 return;
//             }
//             logger.info('Note updated successfully', { note });
//             res.status(StatusCodes.OK).json({ message: 'Note updated successfully', note });
//         } catch (error: unknown) {
//             const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
//             logger.error('Error updating note', { error: errorMessage });
//             res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: errorMessage });
//         }
//     };

//     public deleteById = async (req: Request, res: Response): Promise<void> => {
//         try {
//             const note = await deleteNoteById(req.params.id);
//             if (!note) {
//                 logger.warn('Note not found for deletion', { noteId: req.params.id });
//                 res.status(StatusCodes.NOT_FOUND).json({ message: 'Note not found' });
//                 return;
//             }
//             logger.info('Note deleted successfully', { noteId: req.params.id });
//             res.status(StatusCodes.OK).json({ message: 'Note deleted successfully' });
//         } catch (error: unknown) {
//             const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
//             logger.error('Error deleting note', { error: errorMessage });
//             res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: errorMessage });
//         }
//     };

//      public moveToTrash = async (req: Request, res: Response): Promise<void> => {
//          try {
//              const note = await moveToTrash(req.params.id);
//              if (!note) {
//                  res.status(StatusCodes.NOT_FOUND).json({ message: "Note not found" });
//                  return;
//              }
//              res.status(StatusCodes.OK).json({ message: "Note moved to trash", note });
//          } catch (error: unknown) {
//              res
//                  .status(StatusCodes.INTERNAL_SERVER_ERROR)
//                  .json({ message: error instanceof Error ? error.message : 'An unknown error occurred' });
//          }
//      };

//      public toggleArchive = async (req: Request, res: Response): Promise<void> => {
//          try {
//              const { isArchive } = req.body; // Ensure you send { "isArchive": true } in the request
//              if (typeof isArchive !== "boolean") {
//                  res.status(StatusCodes.BAD_REQUEST).json({ message: "Invalid value for isArchive" });
//                  return;
//              }
      
//              const note = await Note.findByIdAndUpdate(req.params.id, { isArchive }, { new: true });
//              if (!note) {
//                  res.status(StatusCodes.NOT_FOUND).json({ message: "Note not found" });
//                  return;
//              }
  
//              res.status(StatusCodes.OK).json({ message: `Note ${isArchive ? 'archived' : 'unarchived'}`, note });
//          } catch (error: unknown) {
//              res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ 
//              message: error instanceof Error ? error.message : 'An unknown error occurred' 
//              });
//          }
//      };
  
// }

// Initialize Redis client
const redisClient = new Redis(process.env.REDIS_URL || 'redis://127.0.0.1:6379');

export default class NoteController {
    // public create = async (req: Request, res: Response): Promise<void> => {
    //     try {
    //         const note = await createNote(req.body);
    //         logger.info('Note created successfully', { note });

    //         // Invalidate cache
    //         await redisClient.del(`notes:${req.body.userId}`);

    //         res.status(StatusCodes.CREATED).json({ message: 'Note created successfully', note });
    //     } catch (error: unknown) {
    //         const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    //         logger.error('Error creating note', { error: errorMessage });
    //         res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: errorMessage });
    //     }
    // };

    public create = async (req: Request, res: Response): Promise<void> => {
        try {
            const note = await createNote(req.body);
            logger.info('Note created successfully', { note });
    
            await sendMessageToQueue({ action: "CREATE_NOTE", note });
    
            // Invalidate cache
            const userId = req.body.userId;
            await redisClient.del(`notes:${userId}`);

            // fetching and updating
            const updatedNotes = await getNotesByUserId(userId);
            await redisClient.setex(`notes:${userId}`, 3600, JSON.stringify(updatedNotes));
    
            res.status(StatusCodes.CREATED).json({ 
                success: true, 
                message: 'Note created successfully', 
                note, 
                updatedNotes 
            });
        } catch (error: unknown) {
            const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
            logger.error('Error creating note', { error: errorMessage });
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ success: false, message: errorMessage });
        }
    };
    

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
            await redisClient.setex(cacheKey, 3600, JSON.stringify(note));

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
            await redisClient.setex(cacheKey, 3600, JSON.stringify(notes));

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

            // Invalidate cache
            await redisClient.del(`note:${req.params.id}`);
            await redisClient.del(`notes:${req.body.userId}`);

            logger.info('Note updated successfully', { note });
            res.status(StatusCodes.OK).json({ message: 'Note updated successfully', note });
        } catch (error: unknown) {
            const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
            logger.error('Error updating note', { error: errorMessage });
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: errorMessage });
        }
    };

    // public deleteById = async (req: Request, res: Response): Promise<void> => {
    //     try {
    //         const note = await deleteNoteById(req.params.id);
    //         if (!note) {
    //             logger.warn('Note not found for deletion', { noteId: req.params.id });
    //             res.status(StatusCodes.NOT_FOUND).json({ message: 'Note not found' });
    //             return;
    //         }

    //         // Invalidate cache
    //         await redisClient.del(`note:${req.params.id}`);
    //         await redisClient.del(`notes:${req.body.userId}`);

    //         logger.info('Note deleted successfully', { noteId: req.params.id });
    //         res.status(StatusCodes.OK).json({ message: 'Note deleted successfully' });
    //     } catch (error: unknown) {
    //         const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    //         logger.error('Error deleting note', { error: errorMessage });
    //         res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: errorMessage });
    //     }
    // };

    public deleteById = async (req: Request, res: Response): Promise<void> => {
        try {
            const noteId = req.params.id;
            const userId = req.body.userId;
    
            const note = await deleteNoteById(noteId);
            if (!note) {
                logger.warn('Note not found for deletion', { noteId });
                res.status(StatusCodes.NOT_FOUND).json({ success: false, message: 'Note not found' });
                return;
            }
    
            // Invalidate cache
            await redisClient.del(`note:${noteId}`);
            await redisClient.del(`notes:${userId}`);
    
            // Fetch and update cache
            const updatedNotes = await getNotesByUserId(userId);
            await redisClient.setex(`notes:${userId}`, 3600, JSON.stringify(updatedNotes));
    
            logger.info('Note deleted successfully', { noteId });
            res.status(StatusCodes.OK).json({ 
                success: true, 
                message: 'Note deleted successfully', 
                deletedNote: note, 
                updatedNotes 
            });
        } catch (error: unknown) {
            const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
            logger.error('Error deleting note', { error: errorMessage });
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ success: false, message: errorMessage });
        }
    };
    

    public moveToTrash = async (req: Request, res: Response): Promise<void> => {
        try {
            const note = await moveToTrash(req.params.id);
            if (!note) {
                res.status(StatusCodes.NOT_FOUND).json({ message: 'Note not found' });
                return;
            }

            // Invalidate cache
            await redisClient.del(`note:${req.params.id}`);
            await redisClient.del(`notes:${req.body.userId}`);

            res.status(StatusCodes.OK).json({ message: 'Note moved to trash', note });
        } catch (error: unknown) {
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                message: error instanceof Error ? error.message : 'An unknown error occurred',
            });
        }
    };

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

            // Invalidate cache
            await redisClient.del(`note:${req.params.id}`);
            await redisClient.del(`notes:${req.body.userId}`);

            res.status(StatusCodes.OK).json({ message: `Note ${isArchive ? 'archived' : 'unarchived'}`, note });
        } catch (error: unknown) {
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                message: error instanceof Error ? error.message : 'An unknown error occurred',
            });
        }
    };
}

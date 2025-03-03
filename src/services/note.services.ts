// import mongoose from 'mongoose';
// import { Note } from '../models/note.model';
// import { INote } from '../interfaces/note.interface';
// import { Label } from "../models/label.model";
// import logger from '../utils/logger';
// import httpStatus from 'http-status';


// //-------------------------------------------------------Create note----------------------------------------------------

// export const createNote = async (noteData: INote) => {
//     try {
//         const note = await Note.create(noteData);
//         logger.info('Note created successfully');
//         return note;
//     } catch (error) {
//         logger.error('Error creating note:', error);
//         throw { status: httpStatus.INTERNAL_SERVER_ERROR, message: 'Error creating note' };
//     }
// };


// //-------------------------------------------------------GET-NOTE-BY-NOTE-ID-------------------------------------------------

// export const getNoteById = async (noteId: string) => {
//     try {
//         const note = await Note.findById(noteId);
//         if (!note) {
//             logger.warn(`Note with ID ${noteId} not found`);
//             throw { status: httpStatus.NOT_FOUND, message: 'Note not found' };
//         }
//         logger.info(`Fetched note with ID ${noteId}`);
//         return note;
//     } catch (error) {
//         logger.error('Error fetching note:', error);
//         throw { status: httpStatus.INTERNAL_SERVER_ERROR, message: 'Error fetching note' };
//     }
// };


// //-------------------------------------------------------GET-NOTES-BY-USER-ID-------------------------------------------------

// export const getNotesByUserId = async (userId: string) => {
//     try {
//         const notes = await Note.find({ userId: new mongoose.Types.ObjectId(userId) });
//         logger.info(`Fetched notes for user ID ${userId}`);
//         return notes;
//     } catch (error) {
//         logger.error('Error fetching notes:', error);
//         throw { status: httpStatus.INTERNAL_SERVER_ERROR, message: 'Error fetching notes' };
//     }
// };


// //-------------------------------------------------------UPDATE-NOTE-BY-ID-------------------------------------------------

// export const updateNoteById = async (noteId: string, updateData: Partial<INote>) => {
//     try {
//         const note = await Note.findByIdAndUpdate(noteId, updateData, { new: true });
//         if (!note) {
//             logger.warn(`Note with ID ${noteId} not found for update`);
//             throw { status: httpStatus.NOT_FOUND, message: 'Note not found' };
//         }
//         logger.info(`Updated note with ID ${noteId}`);
//         return note;
//     } catch (error) {
//         logger.error('Error updating note:', error);
//         throw { status: httpStatus.INTERNAL_SERVER_ERROR, message: 'Error updating note' };
//     }
// };

// //-------------------------------------------------------DELETE-NOTE-BY-ID-------------------------------------------------

// export const deleteNoteById = async (noteId: string, userId: string) => {
//     try {
//         const note = await Note.findOne({ _id: noteId, userId: new mongoose.Types.ObjectId(userId) });
//         if (!note) {
//             throw { status: httpStatus.FORBIDDEN, message: "You are not authorized to delete this note" };
//         }
//         await Note.findByIdAndDelete(noteId);
//         logger.info(`Deleted note with ID ${noteId}`);
//         return note;
//     } catch (error) {
//         logger.error('Error deleting note:', error);
//         throw { status: httpStatus.INTERNAL_SERVER_ERROR, message: 'Error deleting note' };
//     }
// };


// //-------------------------------------------------------MOVE-TO-TRASH-------------------------------------------------
 
// export const moveToTrash = async (noteId: string) => {
//     return await Note.findByIdAndUpdate(noteId, { isTrash: true }, { new: true });
// };
  

// //-------------------------------------------------------ARCHIVE-NOTE-------------------------------------------------

// export const archiveNote = async (noteId: string) => {
//     return await Note.findByIdAndUpdate(noteId, { isArchive: true }, { new: true });
// };
  

// //-------------------------------------------------------UNARCHIVE-NOTE-------------------------------------------------

// export const unarchiveNote = async (noteId: string) => {
//     return await Note.findByIdAndUpdate(noteId, { isArchive: false }, { new: true });
// };


// //-------------------------------------------------------ADD-LABEL-TO-A-NOTE------------------------------------------

// export const addLabelToNote = async (noteId: string, labelId: string) => {
//     const note = await Note.findById(noteId);
//     const label = await Label.findById(labelId);
//     if (!note || !label) throw new Error("Note or Label not found");
  
//     // Add label to note
//     if (!note.labels.includes(new mongoose.Types.ObjectId(labelId))) {
//       note.labels.push(new mongoose.Types.ObjectId(labelId));
//       await note.save();
//     }
  
//     // Add note to label
//     if (!label.notes.includes(new mongoose.Types.ObjectId(noteId))) {
//       label.notes.push(new mongoose.Types.ObjectId(noteId));
//       await label.save();
//     }
  
//     return note;
//   }


// //---------------------------------------------------REMOVE-LABEL-TO-A-NOTE---------------------------------------------

// export const removeLabelFromNote = async (noteId: string, labelId: string) => {
//     const note = await Note.findById(noteId);
//     const label = await Label.findById(labelId);
//     if (!note || !label) throw new Error("Note or Label not found");
  
//     // Remove label from note
//     note.labels = note.labels.filter(id => id.toString() !== labelId);
//     await note.save();
  
//     // Remove note from label
//     label.notes = label.notes.filter(id => id.toString() !== noteId);
//     await label.save();
  
//     return note;
//   };



import mongoose from 'mongoose';
import { Note } from '../models/note.model';
import { INote } from '../interfaces/note.interface';
import { Label } from "../models/label.model";
import logger from '../utils/logger';
import httpStatus from 'http-status';

// Generic function to handle service operations
const handleService = async <T>(
    operation: () => Promise<T>,
    successMessage: string,
    errorMessage: string
): Promise<T> => {
    try {
        const result = await operation();
        logger.info(successMessage);
        return result;
    } catch (error: unknown) {
        logger.error(`${errorMessage}:`, { error: error instanceof Error ? error.message : error });

        if (error && typeof error === 'object' && 'status' in error) {
            throw error; // Re-throw HTTP-specific errors
        }

        throw { status: httpStatus.INTERNAL_SERVER_ERROR, message: errorMessage };
    }
};

//-------------------------------------------------------Create note----------------------------------------------------
export const createNote = async (noteData: INote): Promise<INote> => {
    return handleService(
        () => Note.create(noteData),
        'Note created successfully',
        'Error creating note'
    );
};

//-------------------------------------------------------GET-NOTE-BY-NOTE-ID-------------------------------------------------
export const getNoteById = async (noteId: string): Promise<INote | null> => {
    return handleService(
        async () => {
            const note = await Note.findById(noteId);
            if (!note) {
                logger.warn(`Note with ID ${noteId} not found`);
                throw { status: httpStatus.NOT_FOUND, message: 'Note not found' };
            }
            return note;
        },
        `Fetched note with ID ${noteId}`,
        'Error fetching note'
    );
};

//-------------------------------------------------------GET-NOTES-BY-USER-ID-------------------------------------------------
export const getNotesByUserId = async (userId: string): Promise<INote[]> => {
    return handleService(
        () => Note.find({ userId: new mongoose.Types.ObjectId(userId) }),
        `Fetched notes for user ID ${userId}`,
        'Error fetching notes'
    );
};

//-------------------------------------------------------UPDATE-NOTE-BY-ID-------------------------------------------------
export const updateNoteById = async (noteId: string, updateData: Partial<INote>): Promise<INote | null> => {
    return handleService(
        async () => {
            const note = await Note.findByIdAndUpdate(noteId, updateData, { new: true });
            if (!note) {
                logger.warn(`Note with ID ${noteId} not found for update`);
                throw { status: httpStatus.NOT_FOUND, message: 'Note not found' };
            }
            return note;
        },
        `Updated note with ID ${noteId}`,
        'Error updating note'
    );
};

//-------------------------------------------------------DELETE-NOTE-BY-ID-------------------------------------------------
export const deleteNoteById = async (noteId: string, userId: string): Promise<INote | null> => {
    return handleService(
        async () => {
            const note = await Note.findOne({ _id: noteId, userId: new mongoose.Types.ObjectId(userId) });
            if (!note) {
                throw { status: httpStatus.FORBIDDEN, message: "You are not authorized to delete this note" };
            }
            await Note.findByIdAndDelete(noteId);
            return note;
        },
        `Deleted note with ID ${noteId}`,
        'Error deleting note'
    );
};

//-------------------------------------------------------MOVE-TO-TRASH-------------------------------------------------
export const moveToTrash = async (noteId: string): Promise<INote | null> => {
    return handleService(
        () => Note.findByIdAndUpdate(noteId, { isTrash: true }, { new: true }),
        `Moved note with ID ${noteId} to trash`,
        'Error moving note to trash'
    );
};

//-------------------------------------------------------ARCHIVE-NOTE-------------------------------------------------
export const archiveNote = async (noteId: string): Promise<INote | null> => {
    return handleService(
        () => Note.findByIdAndUpdate(noteId, { isArchive: true }, { new: true }),
        `Archived note with ID ${noteId}`,
        'Error archiving note'
    );
};

//-------------------------------------------------------UNARCHIVE-NOTE-------------------------------------------------
export const unarchiveNote = async (noteId: string): Promise<INote | null> => {
    return handleService(
        () => Note.findByIdAndUpdate(noteId, { isArchive: false }, { new: true }),
        `Unarchived note with ID ${noteId}`,
        'Error unarchiving note'
    );
};

//-------------------------------------------------------ADD-LABEL-TO-A-NOTE------------------------------------------
export const addLabelToNote = async (noteId: string, labelId: string): Promise<INote | null> => {
    return handleService(
        async () => {
            const note = await Note.findById(noteId);
            const label = await Label.findById(labelId);

            if (!note || !label) {
                throw new Error("Note or Label not found");
            }

            // Add label to note
            if (note.labels && !note.labels.includes(new mongoose.Types.ObjectId(labelId))) {
                note.labels.push(new mongoose.Types.ObjectId(labelId));
                await note.save();
            }

            // Add note to label
            if (label.notes && !label.notes.includes(new mongoose.Types.ObjectId(noteId))) {
                label.notes.push(new mongoose.Types.ObjectId(noteId));
                await label.save();
            }

            return note;
        },
        `Added label ${labelId} to note ${noteId}`,
        'Error adding label to note'
    );
};

//---------------------------------------------------REMOVE-LABEL-TO-A-NOTE---------------------------------------------
export const removeLabelFromNote = async (noteId: string, labelId: string): Promise<INote | null> => {
    return handleService(
        async () => {
            const note = await Note.findById(noteId);
            const label = await Label.findById(labelId);

            if (!note || !label) {
                throw new Error("Note or Label not found");
            }

            // Remove label from note
            if (note.labels) {
                note.labels = note.labels.filter(id => id.toString() !== labelId);
                await note.save();
            }

            // Remove note from label
            if (label.notes) {
                label.notes = label.notes.filter(id => id.toString() !== noteId);
                await label.save();
            }

            return note;
        },
        `Removed label ${labelId} from note ${noteId}`,
        'Error removing label from note'
    );
};

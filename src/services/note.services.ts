import mongoose from 'mongoose';
import { Note } from '../models/note.model';
import { INote } from '../interfaces/note.interface';
import logger from '../utils/logger';
import httpStatus from 'http-status';


//--------------------------------------------------------------------------------

// // create note
// import { INote } from '../interfaces/note.interface';
// export const createNote = async (noteData: INote) => {
//     return await Note.create(noteData);
// };

// // get note
// export const getNoteById = async (noteId: string) => {
//     return await Note.findById(noteId);
// };

// //get all notes
// export const getNotesByUserId = async (userId: string) => {
//     return await Note.find({ userId: new mongoose.Types.ObjectId(userId) });
// };

// // update a node
// export const updateNoteById = async (noteId: string, updateData: Partial<INote>) => {
//     return await Note.findByIdAndUpdate(noteId, updateData, { new: true });
// };

// // delete note
// export const deleteNoteById = async (noteId: string) => {
//     return await Note.findByIdAndDelete(noteId);
// };

//----------------------------------------------------------------------


// Create note
export const createNote = async (noteData: INote) => {
    try {
        const note = await Note.create(noteData);
        logger.info('Note created successfully');
        return note;
    } catch (error) {
        logger.error('Error creating note:', error);
        throw { status: httpStatus.INTERNAL_SERVER_ERROR, message: 'Error creating note' };
    }
};

// Get note by ID
export const getNoteById = async (noteId: string) => {
    try {
        const note = await Note.findById(noteId);
        if (!note) {
            logger.warn(`Note with ID ${noteId} not found`);
            throw { status: httpStatus.NOT_FOUND, message: 'Note not found' };
        }
        logger.info(`Fetched note with ID ${noteId}`);
        return note;
    } catch (error) {
        logger.error('Error fetching note:', error);
        throw { status: httpStatus.INTERNAL_SERVER_ERROR, message: 'Error fetching note' };
    }
};

// Get all notes by user ID
export const getNotesByUserId = async (userId: string) => {
    try {
        const notes = await Note.find({ userId: new mongoose.Types.ObjectId(userId) });
        logger.info(`Fetched notes for user ID ${userId}`);
        return notes;
    } catch (error) {
        logger.error('Error fetching notes:', error);
        throw { status: httpStatus.INTERNAL_SERVER_ERROR, message: 'Error fetching notes' };
    }
};

// Update a note by ID
export const updateNoteById = async (noteId: string, updateData: Partial<INote>) => {
    try {
        const note = await Note.findByIdAndUpdate(noteId, updateData, { new: true });
        if (!note) {
            logger.warn(`Note with ID ${noteId} not found for update`);
            throw { status: httpStatus.NOT_FOUND, message: 'Note not found' };
        }
        logger.info(`Updated note with ID ${noteId}`);
        return note;
    } catch (error) {
        logger.error('Error updating note:', error);
        throw { status: httpStatus.INTERNAL_SERVER_ERROR, message: 'Error updating note' };
    }
};

// Delete a note by ID
export const deleteNoteById = async (noteId: string) => {
    try {
        const note = await Note.findByIdAndDelete(noteId);
        if (!note) {
            logger.warn(`Note with ID ${noteId} not found for deletion`);
            throw { status: httpStatus.NOT_FOUND, message: 'Note not found' };
        }
        logger.info(`Deleted note with ID ${noteId}`);
        return note;
    } catch (error) {
        logger.error('Error deleting note:', error);
        throw { status: httpStatus.INTERNAL_SERVER_ERROR, message: 'Error deleting note' };
    }
};

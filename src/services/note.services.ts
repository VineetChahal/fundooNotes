import mongoose from 'mongoose';
import { Note } from '../models/note.model';
import { INote } from '../interfaces/note.interface';
import { Label } from "../models/label.model";
import logger from '../utils/logger';
import httpStatus from 'http-status';

//-------------------------------------------------------CREATE NOTE----------------------------------------------------

/**
 * Creates a new note with the provided data
 * @param noteData - The data for the new note
 * @returns The created note document
 * @throws {Object} Error with status and message if creation fails
 */
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

//-------------------------------------------------------GET NOTE BY ID-------------------------------------------------

/**
 * Retrieves a note by its ID
 * @param noteId - The ID of the note to fetch
 * @returns The note document if found
 * @throws {Object} Error with status and message if note not found or fetch fails
 */
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

//-------------------------------------------------------GET NOTES BY USER ID-------------------------------------------------

/**
 * Retrieves all notes for a specific user
 * @param userId - The ID of the user whose notes to fetch
 * @returns Array of note documents
 * @throws {Object} Error with status and message if fetch fails
 */
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

//-------------------------------------------------------UPDATE NOTE BY ID-------------------------------------------------

/**
 * Updates a note with the provided data
 * @param noteId - The ID of the note to update
 * @param updateData - Partial note data to update
 * @returns The updated note document
 * @throws {Object} Error with status and message if note not found or update fails
 */
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

//-------------------------------------------------------DELETE NOTE BY ID-------------------------------------------------

/**
 * Deletes a note if the user is authorized
 * @param noteId - The ID of the note to delete
 * @param userId - The ID of the user requesting deletion
 * @returns The deleted note document
 * @throws {Object} Error with status and message if unauthorized or deletion fails
 */
export const deleteNoteById = async (noteId: string, userId: string) => {
    try {
        const note = await Note.findOne({ _id: noteId, userId: new mongoose.Types.ObjectId(userId) });
        if (!note) {
            throw { status: httpStatus.FORBIDDEN, message: "You are not authorized to delete this note" };
        }
        await Note.findByIdAndDelete(noteId);
        logger.info(`Deleted note with ID ${noteId}`);
        return note;
    } catch (error) {
        logger.error('Error deleting note:', error);
        throw { status: httpStatus.INTERNAL_SERVER_ERROR, message: 'Error deleting note' };
    }
};

//-------------------------------------------------------MOVE TO TRASH-------------------------------------------------

/**
 * Moves a note to trash by setting isTrash to true
 * @param noteId - The ID of the note to move to trash
 * @returns The updated note document
 * @throws {Object} Error with status and message if update fails
 */
export const moveToTrash = async (noteId: string) => {
    try {
        const note = await Note.findByIdAndUpdate(noteId, { isTrash: true }, { new: true });
        logger.info(`Moved note with ID ${noteId} to trash`);
        return note;
    } catch (error) {
        logger.error('Error moving note to trash:', error);
        throw { status: httpStatus.INTERNAL_SERVER_ERROR, message: 'Error moving note to trash' };
    }
};

//-------------------------------------------------------ARCHIVE NOTE-------------------------------------------------

/**
 * Archives a note by setting isArchive to true
 * @param noteId - The ID of the note to archive
 * @returns The updated note document
 * @throws {Object} Error with status and message if update fails
 */
export const archiveNote = async (noteId: string) => {
    try {
        const note = await Note.findByIdAndUpdate(noteId, { isArchive: true }, { new: true });
        logger.info(`Archived note with ID ${noteId}`);
        return note;
    } catch (error) {
        logger.error('Error archiving note:', error);
        throw { status: httpStatus.INTERNAL_SERVER_ERROR, message: 'Error archiving note' };
    }
};

//-------------------------------------------------------UNARCHIVE NOTE-------------------------------------------------

/**
 * Unarchives a note by setting isArchive to false
 * @param noteId - The ID of the note to unarchive
 * @returns The updated note document
 * @throws {Object} Error with status and message if update fails
 */
export const unarchiveNote = async (noteId: string) => {
    try {
        const note = await Note.findByIdAndUpdate(noteId, { isArchive: false }, { new: true });
        logger.info(`Unarchived note with ID ${noteId}`);
        return note;
    } catch (error) {
        logger.error('Error unarchiving note:', error);
        throw { status: httpStatus.INTERNAL_SERVER_ERROR, message: 'Error unarchiving note' };
    }
};

//-------------------------------------------------------ADD LABEL TO NOTE------------------------------------------

/**
 * Adds a label to a note and updates the label's note references
 * @param noteId - The ID of the note to add label to
 * @param labelId - The ID of the label to add
 * @returns The updated note document
 * @throws {Error} If note or label is not found
 */
export const addLabelToNote = async (noteId: string, labelId: string) => {
    try {
        const note = await Note.findById(noteId);
        const label = await Label.findById(labelId);
        if (!note || !label) throw new Error("Note or Label not found");

        const labelObjectId = new mongoose.Types.ObjectId(labelId);
        const noteObjectId = new mongoose.Types.ObjectId(noteId);

        // Add label to note if not already present
        if (!note.labels.includes(labelObjectId)) {
            note.labels.push(labelObjectId);
            await note.save();
        }

        // Add note to label if not already present
        if (!label.notes.includes(noteObjectId)) {
            label.notes.push(noteObjectId);
            await label.save();
        }

        logger.info(`Added label ${labelId} to note ${noteId}`);
        return note;
    } catch (error) {
        logger.error('Error adding label to note:', error);
        throw { status: httpStatus.INTERNAL_SERVER_ERROR, message: 'Error adding label to note' };
    }
};

//---------------------------------------------------REMOVE LABEL FROM NOTE---------------------------------------------

/**
 * Removes a label from a note and updates the label's note references
 * @param noteId - The ID of the note to remove label from
 * @param labelId - The ID of the label to remove
 * @returns The updated note document
 * @throws {Error} If note or label is not found
 */
export const removeLabelFromNote = async (noteId: string, labelId: string) => {
    try {
        const note = await Note.findById(noteId);
        const label = await Label.findById(labelId);
        if (!note || !label) throw new Error("Note or Label not found");

        // Remove label from note
        note.labels = note.labels.filter(id => id.toString() !== labelId);
        await note.save();

        // Remove note from label
        label.notes = label.notes.filter(id => id.toString() !== noteId);
        await label.save();

        logger.info(`Removed label ${labelId} from note ${noteId}`);
        return note;
    } catch (error) {
        logger.error('Error removing label from note:', error);
        throw { status: httpStatus.INTERNAL_SERVER_ERROR, message: 'Error removing label from note' };
    }
};

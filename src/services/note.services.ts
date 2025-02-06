import mongoose from 'mongoose';
import { Note } from '../models/note.model';

// create note
export const createNote = async (noteData: any) => {
    return await Note.create(noteData);
};

// get note
export const getNoteById = async (noteId: string) => {
    return await Note.findById(noteId);
};

//get all notes
export const getNotesByUserId = async (userId: string) => {
    return await Note.find({ userId: new mongoose.Types.ObjectId(userId) });
};

// update a node
export const updateNoteById = async (noteId: string, updateData: any) => {
    return await Note.findByIdAndUpdate(noteId, updateData, { new: true });
};

// delete note
export const deleteNoteById = async (noteId: string) => {
    return await Note.findByIdAndDelete(noteId);
};
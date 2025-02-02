import { Note } from '../models/note.model';

// create note
export const createNote = async (noteData: any) => {
    return await Note.create(noteData);
};

// get note
export const getNoteById = async (noteId: string) => {
    return await Note.findById(noteId);
};

// delete note
export const deleteNoteById = async (noteId: string) => {
    return await Note.findByIdAndDelete(noteId);
};
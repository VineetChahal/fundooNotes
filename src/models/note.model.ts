import { Schema, model, Document } from 'mongoose';
import { INote } from '../interfaces/note.interface';

const noteSchema = new Schema<INote>({
    title: { type: String, required: true },
    description: { type: String, required: true },
    color: { type: String, default: '#FFFFFF' }, // Default color is white
    userId: { type: String, required: true } // Reference to the user who created the note
}, { timestamps: true });

export const Note = model<INote>('Note', noteSchema);
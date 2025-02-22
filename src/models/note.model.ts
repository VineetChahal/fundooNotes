import mongoose from 'mongoose';
import { INote } from '../interfaces/note.interface';
import logger from '../utils/logger';


//-------------------------------------------------------------------

// const noteSchema = new mongoose.Schema<INote>({
//     title: { type: String, required: true },
//     description: { type: String, required: true },
//     color: { type: String, default: '#FFFFFF' },
//     // userId: {type: String, required: true}, // user id to create a link between note and user
//     userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true } // user id to create a link between note and user
// });

//--------------------------------------------------------------------


// Define Note Schema
const noteSchema = new mongoose.Schema<INote>({
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    color: { type: String, default: '#FFFFFF', trim: true },
    isTrash: {type: Boolean, default: false},
    isArchive: {type: Boolean, default: false},
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    labels: [{ type: mongoose.Schema.Types.ObjectId, ref: "Label" }], // Many-to-Many
    // drop coolection ->> istrash, isarchive, default true
}, { timestamps: true });

// Log model creation
try {
    logger.info('Note model initialized successfully');
} catch (error) {
    logger.error('Error initializing Note model:', error);
}

export const Note = mongoose.model<INote>('Note', noteSchema);

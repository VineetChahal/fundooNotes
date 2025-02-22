import mongoose from 'mongoose';
import { IUser } from '../interfaces/user.interface';
import logger from '../utils/logger';


//-----------------------------------------------------------------------

// const userSchema = new mongoose.Schema<IUser>({
//     firstName: { type: String, required: true },
//     lastName: { type: String, required: true },
//     username: {type: String, required: true },
//     email: { type: String, required: true, unique: true },
//     password: { type: String, required: true },
//     note:{type: mongoose.Schema.Types.ObjectId, ref: 'Note'},
//     resetPasswordToken: { type: String },
//     resetPasswordExpires: { type: Date },
// });

//--------------------------------------------------------------------------


// Define User Schema
const userSchema = new mongoose.Schema<IUser>({
    firstName: { type: String, required: true, trim: true },
    lastName: { type: String, required: true, trim: true },
    username: { type: String, required: true, trim: true, unique: true },
    email: { type: String, required: true, unique: true, trim: true },
    password: { type: String, required: true },
    note: { type: mongoose.Schema.Types.ObjectId, ref: 'Note' },
    resetPasswordToken: { type: String },
    resetPasswordExpires: { type: Date },
}, { timestamps: true });

// Log model creation
try {
    logger.info('User model initialized successfully');
} catch (error) {
    logger.error('Error initializing User model:', error);
}

export const User = mongoose.model<IUser>('User', userSchema);

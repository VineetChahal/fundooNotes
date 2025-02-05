import mongoose from 'mongoose';
import { IUser } from '../interfaces/user.interface';

const userSchema = new mongoose.Schema<IUser>({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    username: {type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    note:{type: mongoose.Schema.Types.ObjectId, ref: 'Note'}
});

export const User = mongoose.model<IUser>('User', userSchema);
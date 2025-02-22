import { ObjectId } from "mongoose";
import mongoose, { Document } from "mongoose";

export interface INote extends Document {
    title: string;
    description: string;
    color: string;
    // userId: string;
    userId: ObjectId; // To associate the note with a user
    labels: mongoose.Types.ObjectId[]; // Many-to-Many
    isTrash: boolean;
    isArchive: boolean;

}

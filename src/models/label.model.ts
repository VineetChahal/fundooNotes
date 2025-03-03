// import mongoose, { Schema, Document } from "mongoose";

// export interface ILabel extends Document {
//   name: string;
//   notes: mongoose.Types.ObjectId[]; // Many-to-Many
// }

// const LabelSchema = new Schema<ILabel>({
//   name: { type: String, required: true, unique: true },
//   notes: [{ type: Schema.Types.ObjectId, ref: "Note" }] // Many-to-Many
// });

// export const Label = mongoose.model<ILabel>("Label", LabelSchema);


import mongoose, { Schema, Document } from 'mongoose';

// Define the interface for Label
export interface ILabel extends Document {
    name: string;
    notes: mongoose.Types.ObjectId[]; // Many-to-Many relationship with Note
}

// Create a schema for Label
const LabelSchema = new Schema<ILabel>(
    {
        name: { type: String, required: true, unique: true },
        notes: [{ type: Schema.Types.ObjectId, ref: 'Note' }] // Many-to-Many relationship
    },
    {
        timestamps: true, // Automatically manage createdAt and updatedAt fields
    }
);

// Create and export the Label model
export const Label = mongoose.model<ILabel>('Label', LabelSchema);

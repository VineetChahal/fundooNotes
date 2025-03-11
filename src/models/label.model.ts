import mongoose, { Schema, Document } from 'mongoose';

// interface for Label
export interface ILabel extends Document {
    name: string;
    notes: mongoose.Types.ObjectId[]; // Many-to-Many relationship with Note
}

// schema for Label
const LabelSchema = new Schema<ILabel>(
    {
        name: { type: String, required: true, unique: true },
        notes: [{ type: Schema.Types.ObjectId, ref: 'Note' }] // Many-to-Many relationship
    },
    {
        timestamps: true,
    }
);

// Create and export the Label model
export const Label = mongoose.model<ILabel>('Label', LabelSchema);

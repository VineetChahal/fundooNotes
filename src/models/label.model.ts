import mongoose, { Schema, Document } from "mongoose";

export interface ILabel extends Document {
  name: string;
  notes: mongoose.Types.ObjectId[]; // Many-to-Many
}

const LabelSchema = new Schema<ILabel>({
  name: { type: String, required: true, unique: true },
  notes: [{ type: Schema.Types.ObjectId, ref: "Note" }] // Many-to-Many
});

export const Label = mongoose.model<ILabel>("Label", LabelSchema);

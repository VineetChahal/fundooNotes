export interface INote extends Document {
    title: string;
    description: string;
    color: string;
    userId: string; // To associate the note with a user
}
import { Request, Response } from 'express';
import {createNote, getNoteById, updateNoteById, deleteNoteById,} from '../services/note.services';

export default class NoteController {
    public create = async (req: Request, res: Response): Promise<void> => {
        try {
            const note = await createNote(req.body);
            res.status(201).json({ message: 'Note created successfully', note });
        } catch (error: any) {
            res.status(500).json({ message: error.message });
        }
    };

    public getById = async (req: Request, res: Response): Promise<void> => {
        try {
            const note = await getNoteById(req.params.id);
            if (!note) {
                res.status(404).json({ message: 'Note not found' });
                return;
            }
            res.status(200).json({ note });
        } catch (error: any) {
            res.status(500).json({ message: error.message });
        }
    };

    public updateById = async (req: Request, res: Response): Promise<void> => {
        try {
            const note = await updateNoteById(req.params.id, req.body);
            if (!note) {
                res.status(404).json({ message: 'Note not found' });
                return;
            }
            res.status(200).json({ message: 'Note updated successfully', note });
        } catch (error: any) {
            res.status(500).json({ message: error.message });
        }
    };

    public deleteById = async (req: Request, res: Response): Promise<void> => {
        try {
            const note = await deleteNoteById(req.params.id);
            if (!note) {
                res.status(404).json({ message: 'Note not found' });
                return;
            }
            res.status(200).json({ message: 'Note deleted successfully' });
        } catch (error: any) {
            res.status(500).json({ message: error.message });
        }
    };

}
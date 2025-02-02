import express, { IRouter } from 'express';
import NoteController from '../controllers/note.controller';
import { createNoteValidation } from '../validators/note.validator';

class NoteRoutes {
    private NoteController = new NoteController();
    private router = express.Router();

    constructor() {
        this.routes();
    }

    private routes = () => {
        // Create a new note
        this.router.post('/notes', createNoteValidation, this.NoteController.create);

        // Get a note by ID
        this.router.get('/notes/:id', this.NoteController.getById);

        // Delete a note by ID
        this.router.delete('/notes/:id', this.NoteController.deleteById);
    };

    public getRoutes = (): IRouter => {
        return this.router;
    };
}

export default NoteRoutes;
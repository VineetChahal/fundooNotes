import express, { IRouter } from 'express';
import NoteController from '../controllers/note.controller';
import { createNoteValidation, updateNoteValidation } from '../validators/note.validator';
import { authenticate } from '../middlewares/auth.middleware';

class NoteRoutes {
    private NoteController = new NoteController();
    private router = express.Router();

    constructor() {
        this.routes();
    }

    private routes = () => {
        this.router.post('/', createNoteValidation, authenticate, this.NoteController.create);
        this.router.get('/', authenticate, this.NoteController.getAll);
        this.router.get('/:id', authenticate, this.NoteController.getById);
        this.router.put('/:id', updateNoteValidation, authenticate, this.NoteController.updateById);
        this.router.delete('/:id', authenticate, this.NoteController.deleteById);
    };

    public getRoutes = (): IRouter => {
        return this.router;
    };
}

export default NoteRoutes;
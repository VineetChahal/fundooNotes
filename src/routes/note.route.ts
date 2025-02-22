import express, { IRouter } from 'express';
import NoteController from '../controllers/note.controller';
import { createNoteValidation, updateNoteValidation } from '../validators/note.validator';
import { authenticate } from '../middlewares/auth.middleware';
import logger from '../utils/logger';


//---------------------------------------------------------------------------------

//     private routes = () => {
//         this.router.post('/', createNoteValidation, authenticate, this.NoteController.create);
//         this.router.get('/', authenticate, this.NoteController.getAll);
//         this.router.get('/:id', authenticate, this.NoteController.getById);
//         this.router.put('/:id', updateNoteValidation, authenticate, this.NoteController.updateById);
//         this.router.delete('/:id', authenticate, this.NoteController.deleteById);
//     };

//-------------------------------------------------------------------------


class NoteRoutes {
    private NoteController = new NoteController();
    private router = express.Router();

    constructor() {
        this.routes();
    }

    private routes = () => {
        this.router.post('/', createNoteValidation, authenticate, (req: express.Request, res: express.Response, next: express.NextFunction) => {
            logger.info('POST /notes - Creating a note');
            next();
        }, this.NoteController.create);

        this.router.get('/', authenticate, (req, res, next) => {
            logger.info('GET /notes - Fetching all notes');
            next();
        }, this.NoteController.getAll);

        this.router.get('/:id', authenticate, (req, res, next) => {
            logger.info(`GET /notes/${req.params.id} - Fetching a note by ID`);
            next();
        }, this.NoteController.getById);

        this.router.put('/:id', updateNoteValidation, authenticate, (req: express.Request, res: express.Response, next: express.NextFunction) => {
            logger.info(`PUT /notes/${req.params.id} - Updating a note`);
            next();
        }, this.NoteController.updateById);

        this.router.delete('/:id', authenticate, (req, res, next) => {
            logger.info(`DELETE /notes/${req.params.id} - Deleting a note`);
            next();
        }, this.NoteController.deleteById);

        this.router.patch('/:id/isTrash', authenticate, (req: express.Request, res: express.Response, next: express.NextFunction) => {
            logger.info(`PATCH /notes/${req.params.id} - Trashing a note`);
            next();
        }, this.NoteController.moveToTrash);
        this.router.patch('/:id/isArchive', authenticate, (req: express.Request, res: express.Response, next: express.NextFunction) => {
            logger.info(`PATCH /notes.${req.params.id} - Archiving a note`);
            next();
        },this.NoteController.toggleArchive);


        this.router.post("/label/add", this.NoteController.attachLabel);
        this.router.post("/label/remove", this.NoteController.detachLabel);
    };

    public getRoutes = (): IRouter => {
        return this.router;
    };
}

export default NoteRoutes;

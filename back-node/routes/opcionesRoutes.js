import express from "express";
import opcionesController from "../controllers/opcionesController.js";
class OpcionesRoutes {
    constructor() {
        this.router = express.Router();
        this.config();
    }
    config() {
        this.router.get('/', opcionesController.getOpciones);
        this.router.get('/:id', opcionesController.getOpcionById);
        this.router.post('/', opcionesController.create);
        this.router.put('/:id', opcionesController.update);
        this.router.delete('/:id', opcionesController.delete);
        this.router.get('/menu', opcionesController.getOpcionesMenu);
        this.router.post('/menu/', opcionesController.createOpcionBot);
        this.router.put('/menu/:id', opcionesController.updateOpcionBot);
        this.router.delete('/menu/:id', opcionesController.deleteOpcionBot);
    }
}
const opcionesRoutes = new OpcionesRoutes();
export default opcionesRoutes.router;

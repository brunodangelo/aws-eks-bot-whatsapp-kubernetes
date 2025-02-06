import express from "express";
import alertasController from "../controllers/alertasController.js";
class AlertasRoutes {
    constructor() {
        this.router = express.Router();
        this.config();
    }
    config() {
        this.router.get('/', alertasController.getAlertas);
        this.router.post('/', alertasController.create);
        this.router.put('/:id', alertasController.update);
        this.router.delete('/:id', alertasController.delete);
        this.router.delete('/', alertasController.deleteAll);
    }
}
const alertasRoutes = new AlertasRoutes();
export default alertasRoutes.router;

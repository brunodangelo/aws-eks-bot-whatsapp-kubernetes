import pool from "../database.js";
class OpcionesController {
    async getOpcionById(req, res) {
        const id = parseInt(req.params.id);
        const opciones = await pool.query('SELECT opciones.*, opciones_bot.nombre as nombre FROM opciones INNER JOIN opciones_bot ON (opciones.opcion_bot_id=opciones_bot.opcion_bot_id AND opciones.opcion_id=$1) ORDER BY opcion_id;',[id]);
        res.json(opciones.rows);
    }
    async getOpciones(req, res) {
        const opciones = await pool.query('SELECT opciones.*, opciones_bot.nombre as nombre FROM opciones INNER JOIN opciones_bot ON (opciones.opcion_bot_id=opciones_bot.opcion_bot_id) ORDER BY opcion_id;');
        res.json(opciones.rows);
    }
    async getOpcionesMenu(req, res) {
        const opciones = await pool.query('SELECT * FROM opciones_bot');
        res.json(opciones.rows);
    }
    //Opciones
    async create(req, res) {
        const { opcion_bot_id,descripcion } = req.body;
        const result = await pool.query('INSERT INTO opciones (opcion_bot_id,descripcion) VALUES ($1,$2)', [opcion_bot_id,descripcion]);
        res.json({ message: 'Registro agregado con éxito' });
    }
    async update(req, res) {
        const opcion_id = parseInt(req.params.id);
        const { opcion_bot_id,descripcion } = req.body;
        const response = await pool.query('UPDATE opciones SET opcion_bot_id=$1, descripcion = $2 WHERE opcion_id = $3', [opcion_bot_id,descripcion,opcion_id]);
        res.json('Registro actualizado');
    }
    async delete(req, res) {
        const id = parseInt(req.params.id);
        await pool.query('DELETE FROM opciones where opcion_id = $1', [id]);
        res.json({ message: 'Registro eliminado' });
    }

    //Opciones Bot
    async createOpcionBot(req, res) {
        const { nombre } = req.body;
        const result = await pool.query('INSERT INTO opciones_bot (nombre) VALUES ($1)', [nombre]);
        res.json({ message: 'Registro agregado con éxito' });
    }
    async updateOpcionBot(req, res) {
        const opcion_bot_id = parseInt(req.params.id);
        const { nombre } = req.body;
        const response = await pool.query('UPDATE opciones_bot SET nombre = $1 WHERE opcion_bot_id = $2', [nombre,opcion_bot_id]);
        res.json('Registro actualizado');
    }
    async deleteOpcionBot(req, res) {
        const id = parseInt(req.params.id);
        await pool.query('DELETE FROM opciones_bot where opcion_bot_id = $1', [id]);
        res.json({ message: 'Registro eliminado' });
    }
}
const opcionesController = new OpcionesController();
export default opcionesController;

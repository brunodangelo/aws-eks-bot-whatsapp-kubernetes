
import pool from "../database.js";

import http from 'http';

function quitarAlerta(numero){
    const data = JSON.stringify({ intent: 'remove',number:numero });

    const options = {
    hostname: 'localhost',
    port: 3000,
    path: '/v1/blacklist',
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Content-Length': data.length,
    },
    };

    const req = http.request(options, (res) => {
    let responseData = '';

    res.on('data', (chunk) => {
        responseData += chunk;
    });

    res.on('end', () => {
        console.log('Response:', responseData);
    });
    });

    req.on('error', (error) => {
    console.error('Error:', error);
    });

    req.write(data);
    req.end();
}

class AlertasController {
    async getAlertas(req, res) {
        const alertas = await pool.query('SELECT * FROM alertas');
        res.json(alertas.rows);
    }
    async create(req, res) {
        const { destino, tipo, hora } = req.body;
        const result = await pool.query('INSERT INTO alertas (destino,tipo,hora ) VALUES ($1, $2, $3)', [destino,tipo,hora]);
        res.json({ message: 'Registro agregado con éxito' });
    }
    async update(req, res) {
        const alerta_id = parseInt(req.params.id);
        const { destino, tipo, hora } = req.body;
        const response = await pool.query('UPDATE alertas SET destino = $1, tipo = $2, hora = $3 WHERE alerta_id = $4', [destino, tipo, hora, alerta_id]);
        res.json('Registro actualizado');
    }
    async delete(req, res) {
        const id = parseInt(req.params.id);
        const alerta = await pool.query('SELECT * FROM alertas WHERE alerta_id = $1',[id]);
        quitarAlerta(alerta.rows[0].destino);
        await pool.query('DELETE FROM alertas where alerta_id = $1', [id]);
        res.json({ message: 'Registro eliminado' });
    }
    async deleteAll(req, res) {
        await pool.query('DELETE FROM alertas');
        res.json({ message: 'Registros eliminado' });
    }
}
const alertasController = new AlertasController();
/*exports.default = alertasController;*/
export default alertasController;

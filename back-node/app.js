import "dotenv/config";
import pool from "./database.js";
import express from "express";
import cors from "cors";
import http from "http";

import alertasRoutes from "./routes/alertasRoutes.js";
import opcionesRoutes from "./routes/opcionesRoutes.js";

import { verifyToken } from "./middlewares/verify.js";

import jwt from "jsonwebtoken";

const app=express();
const port= process.env.PORT || 8000;

app.use(cors());

app.use(express.urlencoded({ extended: false }))
     
app.use(express.json())

app.use('/api/signin', async (req, res) => {//Inicio de sesión dentro del Dashboard de Gestion
  const { email, password } = req.body;

  const user = await pool.query('SELECT * from usuarios WHERE email=$1;',[email]);
  if (user.rows.length==0) return res.status(401).send('El email no existe');
  if (user.rows[0].password !== password) return res.status(401).send('Contrase�a incorrecta');

  const token = jwt.sign({_id: user.rows[0]._id}, 'secretkey');

  return res.status(200).json({token});
});


app.use('/api/alertas', verifyToken, alertasRoutes);//Protegemos las rutas con un middleware

app.use('/api/opciones', verifyToken, opcionesRoutes);

//app.use(express.static('/'));

app.use('/api/qr', express.static('botnode-container'));//Exponemos el código QR generado por WhatsApp


app.listen(port, ()=>{
    console.log('Express server started at Port ', port)
})

function resetBot(){// A traves de una petición POST solicitamos a "bot-node" el reinicio
  const data = JSON.stringify({ type: 'reset-bot',});

  const options = {
    hostname: 'botnode-container',
    port: 3000,
    path: '/reset',
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Content-Length': data.length,
    }
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

app.get('/api/reset'/*, verifyToken*/, async (req, res) => {
  resetBot();
  res.send('reiniciando');
})
import { createBot, createProvider, createFlow, addKeyword, utils, EVENTS } from '@builderbot/bot'
import { MemoryDB as Database } from '@builderbot/bot'
import { BaileysProvider as Provider } from '@builderbot/provider-baileys'
import pool from "./database.js";

const PORT = process.env.PORT || 3000;

const saludoinicial = await pool.query('SELECT * from opciones_bot ORDER BY opcion_bot_id;');

let saludoInicial=[]; //Saludo inicial y las opciones
let numerosConAlertas=[];

for(let salIn of saludoinicial.rows){
  if(salIn.opcion_bot_id==0){
    saludoInicial.unshift(salIn.nombre);
  }
  else{
    saludoInicial.push(salIn.nombre);
  }
}

const opciones = await pool.query('SELECT * from opciones ORDER BY opcion_id');

let opcion1=[],opcion2=[],opcion3=[],opcion4=[],opcion5=[],opcion6=[],opcion7=[];
for(let opcion of opciones.rows){
  if(opcion.opcion_bot_id==1){
    opcion1.push(opcion.descripcion);
  }
  else if(opcion.opcion_bot_id==2){
    opcion2.push(opcion.descripcion);
  }
  else if(opcion.opcion_bot_id==3){
    opcion3.push(opcion.descripcion);
  }
  else if(opcion.opcion_bot_id==4){
    opcion4.push(opcion.descripcion);
  }
  else if(opcion.opcion_bot_id==5){
    opcion5.push(opcion.descripcion);
  }
  else if(opcion.opcion_bot_id==6){
    opcion6.push(opcion.descripcion);
  }
  else if(opcion.opcion_bot_id==7){
    opcion7.push(opcion.descripcion);
  }
}

const bienvenidaFlow = addKeyword(["hola", "hi","Hola","Hola VCD","menu","menú","buenos","buen","no hay internet","no hay","no tengo","que pasa"])
    .addAnswer(saludoInicial);


const flow1 = addKeyword(["1","Planes"])
  .addAnswer(
    `A continuación te muestro nuestros planes: 👇🏻`)
  .addAnswer(opcion1)
  .addAnswer([
    `Para ver el menú de opciones escribí *Hola VCD*`
  ]);

const flow2 = addKeyword(["2","TV Digital"])
  .addAnswer(opcion2[0])
  .addAnswer(opcion2[1]);

const flow3 = addKeyword(["3","Medios de Pago","Donde pagar","Donde se paga la factura","factura"])
  .addAnswer(opcion3[0])
  .addAnswer(opcion3[1]);

const flow5 = addKeyword(["5","Consultar Cobertura"])
  .addAnswer(opcion5[0],null,async (ctx,{blacklist}) => {
      blacklist.add(ctx.from);
      numerosConAlertas.push(ctx.from);
      await pool.query('INSERT INTO alertas (destino,tipo,hora,subtipo) VALUES ($1, $2, $3, $4)', [ctx.from,'Consultar Cobertura',new Date(),'Servicio']);
  });

const flow6 = addKeyword(["6","Solicitud de servicio"])
  .addAnswer(opcion6[0]);

const flow7 = addKeyword(["7","Informar Pago"])
  .addAnswer(opcion7[0])
  .addAnswer(opcion7[1],null,async (ctx,{blacklist}) => {
      blacklist.add(ctx.from);
      numerosConAlertas.push(ctx.from);
      await pool.query('INSERT INTO alertas (destino,tipo,hora,subtipo) VALUES ($1, $2, $3, $4)', [ctx.from,'Informar Pago',new Date(),'Comprobante']);
  });

const flowGracias = addKeyword(["Gracias"])
  .addAnswer([
    `Es un placer ayudarte, que tengas un buen día. Para volver a ver las opciones del Menú, escribí *Hola VCD*`,
  ]);

const flowEmpty = addKeyword([EVENTS.VOICE_NOTE,EVENTS.LOCATION,EVENTS.DOCUMENT,EVENTS.MEDIA])
  .addAnswer("*Perdón, no entiendo audios ni documentos. Por favor responde con texto.*");

const FlowProblemaSolucionado = addKeyword(['Si','si','Solucionado'])
    .addAnswer(opcion4[4]);

const flowProblemaTecnico = addKeyword(["4","Problema tecnico","Problemas con el servicio"], { sensitive: true })
  .addAnswer(opcion4[0],null,null,[addKeyword(['A','cable'])
      .addAnswer(opcion4[1],null,null,[FlowProblemaSolucionado,addKeyword(['No','no','No se soluciono'])
        .addAnswer(opcion4[5],null,async (ctx,{blacklist}) => {
          blacklist.add(ctx.from);
          numerosConAlertas.push(ctx.from);
          await pool.query('INSERT INTO alertas (destino,tipo,hora,subtipo) VALUES ($1, $2, $3, $4)', [ctx.from,'Problemas con el servicio',new Date(),'Cable']);
        })]),addKeyword(['B','Internet'])
      .addAnswer(opcion4[2],null,null,[FlowProblemaSolucionado,addKeyword(['No','no','No se soluciono'])
        .addAnswer(opcion4[5],null,async (ctx,{blacklist}) => {
          blacklist.add(ctx.from);
          numerosConAlertas.push(ctx.from);
          await pool.query('INSERT INTO alertas (destino,tipo,hora,subtipo) VALUES ($1, $2, $3, $4)', [ctx.from,'Problemas con el servicio',new Date(),'Internet']);
        })]),addKeyword(['C','Fibra óptica'])
      .addAnswer(opcion4[3],null,null,[FlowProblemaSolucionado,addKeyword(['No','no','No se soluciono'])
        .addAnswer(opcion4[5],null,async (ctx,{blacklist}) => {
          blacklist.add(ctx.from);
          numerosConAlertas.push(ctx.from);
          await pool.query('INSERT INTO alertas (destino,tipo,hora,subtipo) VALUES ($1, $2, $3, $4)', [ctx.from,'Problemas con el servicio',new Date(),'Fibra']);
        })])]
  );

const main = async () => {
    //Al iniciar el bot tomo los numero que tienen una alerta;
    const alertas = await pool.query('SELECT * from alertas');
    for(let a of alertas.rows){
        numerosConAlertas.push(a.destino);
    }
    //
    const adapterFlow = createFlow([bienvenidaFlow, flow1, flow2, flow3, flow5, flow6, flow7, flowEmpty, flowGracias, FlowProblemaSolucionado, flowProblemaTecnico])
    
    const adapterProvider = createProvider(Provider)
    const adapterDB = new Database()

    const { handleCtx, httpServer } = await createBot({
        flow: adapterFlow,
        provider: adapterProvider,
        database: adapterDB
    },
    {
      blackList: numerosConAlertas,//Los que esten en la Blacklist no se les responde, a menos que se elimine la alerta para ese numero
    })

    adapterProvider.server.post(
        '/v1/messages',
        handleCtx(async (bot, req, res) => {
            const { number, message, urlMedia } = req.body
            await bot.sendMessage(number, message, { media: urlMedia ?? null })
            return res.end('sended')
        })
    )

    adapterProvider.server.post(
        '/v1/register',
        handleCtx(async (bot, req, res) => {
            const { number, name } = req.body
            await bot.dispatch('REGISTER_FLOW', { from: number, name })
            return res.end('trigger')
        })
    )

    adapterProvider.server.post(
        '/v1/samples',
        handleCtx(async (bot, req, res) => {
            const { number, name } = req.body
            await bot.dispatch('SAMPLES', { from: number, name })
            return res.end('trigger')
        })
    )

    adapterProvider.server.post(
        '/v1/blacklist',
        handleCtx(async (bot, req, res) => {
            const { number, intent } = req.body
            if (intent === 'remove') bot.blacklist.remove(number)
            if (intent === 'add') bot.blacklist.add(number)
            //let check =  bot.blacklist.checkIf(ctx.from)
            res.writeHead(200, { 'Content-Type': 'application/json' })
            return res.end(JSON.stringify({ status: 'ok', number, intent }))
        })
    )

    adapterProvider.server.post(
        '/reset',
        handleCtx(async (bot, req, res) => {
            process.exit();
            res.writeHead(200, { 'Content-Type': 'application/json' })
            return res.end(JSON.stringify({ status: 'ok' }))
        })
    )

    httpServer(+PORT)
}

main()

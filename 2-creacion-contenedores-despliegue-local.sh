#! /bin/bash

############################################################
#Podés utilizar este script para desplegar localmente la app
############################################################

echo "|||| ELIMINANDO CONTENEDORES PREVIOS ||||"
docker rm -f back-node-container bot-front-container bot-node-container || true
echo

echo "|||| CREANDO RED ||||"

docker network create bot-network || true
echo "Red creada con exito!"

echo "|||| CREANDO CONTENEDORES ||||"

#back-node || en la variable de entorno "PSQL_URI" debes reemplazar con los valores de tu DB remota
echo "iniciando contenedor de back-node..."
docker run -dp 8000:8000 \
  --name back-node-container \
  -e PSQL_URI="postgresql://user:password@hostname/database" \
  -e PORT="8000" \
  back-node

docker network connect bot-network back-node-container
echo "back-node-container creado correctamente y conectado a la red!"
echo

#bot-node || en la variable de entorno "PSQL_URI" debes reemplazar con los valores de tu DB remota
echo "iniciando contenedor de bot-node..."
docker run -dp 3000:3000 \
  --name bot-node-container \
  --restart always \
  -e PSQL_URI="postgresql://user:password@hostname/database" \
  -e PORT="3000" \
  bot-node

docker network connect bot-network bot-node-container
echo "bot-node-container creado correctamente y conectado a la red!"
echo

#bot-front
echo "iniciando contenedor de bot-front..."
docker run -dp 80:80 \
  --name bot-front-container \
  -e API_BACK="http://back-node-container:8000/api" \
  -e API_BOT="http://bot-node-container:3000" \
  bot-front

docker network connect bot-network bot-front-container
echo "bot-front-container creado correctamente y conectado a la red!"
echo

#Verificacion y checkeo final

echo "|||| LISTA DE CONTENEDORES DESPLEGADOS: ||||"
docker ps

echo "Proceso finalizado con exito!"
echo
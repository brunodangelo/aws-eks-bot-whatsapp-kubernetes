#! /bin/bash

echo "|||| CREACION DE LAS IMAGENES ||||"

#back-node
cd back-node || { echo "ERROR. No existe la carpeta back-node"; exit 1; }
docker build -t back-node .
cd ..

#bot-front
cd bot-front || { echo "ERROR. No existe la carpeta bot-front"; exit 1; }
docker build -t bot-front .
cd ..

#bot-node
cd bot-node || { echo "ERROR. No existe la carpeta bot-node"; exit 1; }
docker build -t bot-node .
cd ..

echo "|||| IMAGENES CREADAS CON EXITO! ||||"
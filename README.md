# Chatbot de WhatsApp desplegado en AWS EKS con Kubernetes
Contiene un frontend en Angular para interactuar con el usuario y poder ver/editar las Opciones del menú y Alertas que se registran en la base de datos (PostgreSQL). Para el Backend se utiliza nodejs. Rutas protegidas con jwt. Despliegue local con Docker y en producción en EKS.

Explicación paso a paso: https://todotelco.com/proyecto-aws-desplegar-bot-de-whatsapp-con-kubernetes-y-eks/

### Descripción de cada carpeta
  - *back-node*: Backend desarrollado en nodejs, con el framework express
  - *bot-node*: Proceso del chatbot de WhatsApp desarrollado en nodejs, con la libreria open-source [BuilderBot](https://www.builderbot.app/en)
  - *front-prod*: Frontend de autogestión desarrolado en Angular (se utiliza como base la plantilla free "nice-admin-angular-lite")
  - *k8s*: manifiestos .yaml para el despliegue utilizando kubernetes
  - *scripts bash*: archivos para automatizar la creacion de las imagenes y los contenedores para el despliegue local con Docker

![aws kubernetes drawio](https://github.com/user-attachments/assets/dfeddef0-4327-440e-9e55-c7555a3e7501)
*NOTAS: Para replicar este proyecto se debe tener en un servidor remoto una base de datos en PostgreSQL, conectandose a ella desde la variable de entorno PSQL_URI presente en cada deployment.yaml. Tambien se puede desplegar en un pod dentro del cluster y realizar las conexiones correspondientes al código actual.*

# Pasos para despliegue

### Paso 1 (pruebas en local con Docker):
  - Ejecutar script en Bash llamado "1-creacion-imagenes.sh" para crear las imagenes de Docker a partir del codigo de cada modulo
  - Ejecutar script en Bash llamado "2-creacion-contenedores-despliegue-local.sh" para crear los contenedores y la red que los agrupa

### Paso 2 (subir imagenes a ECR en AWS):
  - Dentro del servicio de AWS ECR crear nuevo repositorio y subir las imagenes:
![{73B18172-17CC-4663-922D-776B31339D60}](https://github.com/user-attachments/assets/24465a1d-68bf-45f8-b00a-5c636bda3651)

### Paso 3 (Pruebas en un cluster minikube local OPCIONAL):
  - Ejecutar el siguiente comando en la consola local (crea un secret para obtener las imagenes desde ECR):
    ```
     kubectl create secret docker-registry ecr-secret \
     --docker-server=<id_cuenta>.dkr.ecr.us-east-1.amazonaws.com \
     --docker-username=AWS \
     --docker-password=$(aws ecr get-login-password --region us-east-1) \
     --namespace default
    ```
  - Reemplazar en "image", dentro de cada deployment.yaml localizados en la carpeta "k8s", el valor por la URI de la imagen en ECR.
  - Ejecutar los siguientes comandos para la creacion de los deployments y los servicios (posicionarse en k8s):

      ```
      minikube start
    
      kubectl apply -f back-node/deployment-back-node.yaml
      kubectl apply -f back-node/service-back-node.yaml
      
      kubectl apply -f bot-node/deployment-bot-node.yaml
      kubectl apply -f bot-node/service-bot-node.yaml
      
      kubectl apply -f bot-front/deployment-bot-front.yaml
      kubectl apply -f bot-front/service-bot-front.yaml
      ```

  - Asegurarse que todo este correctamente:
    ![{F72CE2DB-E43F-4002-AFA3-1A237D94BAD7}](https://github.com/user-attachments/assets/604e16a9-0cda-4217-9fb8-146ab9329bb7)

  - Si se realiza desde una maquina virtual se puede realizar un port-forward para acceder al front en angular desde su servicio, con el siguiente comando:
    ```
    kubectl port-forward --address 0.0.0.0 service/front-prod 4200:4200
    ```

  - Para eliminar todo:
    ``` 
    minikube stop

    minikube delete
    ```

### Paso 4 (Despliegue en EKS):
  - Asegurarse de instalar aws-cli junto con su configuracion de credenciales
  - Utilizar eksctl para despligue a traves de la terminal. Instalar desde aqui: https://eksctl.io/installation/
  - (1) Crear el cluster
    ```
    eksctl create cluster --name bot-cluster --region us-east-1 --without-nodegroup
    ```
  - (2) Crear el node-group
    ```
    eksctl create nodegroup --cluster bot-cluster --nodes-min 1 --nodes-max 5 --nodes 2 --name autoscaling-nodegroup --node-type t3.medium --region us-east-1
    ```
    *NODOS CREADOS EN EKS:*
    ![{348C875E-AD91-4FFE-A05F-7C29BA3FA207}](https://github.com/user-attachments/assets/d6bc96ba-138b-4758-b6d0-1f67a5209bd7)

  - (3) Cambiar al entorno de AWS para crear los pods y servicios
    ```
    aws eks update-kubeconfig --region us-east-1 --name bot-cluster
    ```
  - (4) Creacion de los pods y servicios de kubernetes dentro de los recursos creados en EKS (ubicarse en la carpeta k8s) PARA BACK-NODE Y BOT-NODE
    ```
    kubectl apply -f back-node/deployment-back-node.yaml
    kubectl apply -f back-node/service-back-node.yaml
      
    kubectl apply -f bot-node/deployment-bot-node.yaml
    kubectl apply -f bot-node/service-bot-node.yaml
    ```
  - (5) Reemplzar dentro de deployment-bot-front.yaml las variables de entorno API_BACK y API_BOT por los dns de los loads balancers creados en AWS en el paso anterior
    ![{99A58BD8-54F2-4E93-B953-80E82B3DC6EC}](https://github.com/user-attachments/assets/87c04cb9-04df-441f-a803-224e8f3c3546)

  - (6) Crear los pods y servicios de kubernetes dentro de EKS para BOT-FRONT
    ```
    kubectl apply -f bot-front/deployment-bot-front.yaml
    kubectl apply -f bot-front/service-bot-front.yaml
    ```
    *PODS CREADOS EN EKS:*
    ![{778E0852-3DEE-4F9A-A215-5605C92A23EC}](https://github.com/user-attachments/assets/61ae1d53-3db7-414a-ab30-dcd1ccb77167)

  - (7) Acceder, a traves del dns del Load Balancer asociado a bot-front, al frontend en Angular
    ![{0D480E57-9343-496C-B5E7-7B809C815091}](https://github.com/user-attachments/assets/eeeccbd5-be09-4218-ae45-a065ebdf284e)

    # App desplegada en EKS, resultado final:
    ![{DA6E8D43-9334-435B-8992-4C5DD15A85B4}](https://github.com/user-attachments/assets/944f6a08-128d-4585-b1a9-d5f5edd3a25a)
    ![{1139DAE6-34A8-4C10-9D81-2CAEE392BF5A}](https://github.com/user-attachments/assets/7e2969f4-2a45-4f34-8bf9-0d630f2b2fdd)
    ![{C1890996-EC89-49E6-B855-48617669F879}](https://github.com/user-attachments/assets/505b524f-3215-4789-ab98-8cf2551360a7)


    

# Imagen base ligera de Node
FROM node:18-alpine

# Carpeta de trabajo dentro del contenedor
WORKDIR /usr/src/app

# Copiamos solo los archivos de dependencias primero
COPY package*.json ./

# Instalamos dependencias (sin dev, para producción)
RUN npm install --omit=dev

# Copiamos el resto del código
COPY . .

# Variable de entorno de producción (opcional pero buena práctica)
ENV NODE_ENV=production

# El servidor de la app corre en el puerto 3000
EXPOSE 3000

# Comando de inicio (usa el script "start" del package.json)
CMD ["npm", "start"]

FROM node:18-bullseye

WORKDIR /usr/src/app

# Copiamos primero los manifests para aprovechar cache
COPY package.json package-lock.json ./

# Instala dependencias dentro del contenedor (compila módulos nativos correctamente)
RUN npm ci --omit=dev

# Copiamos el resto del proyecto (node_modules NO se copia gracias a .dockerignore)
COPY . .

EXPOSE 3000
CMD ["node","./bin/www"]

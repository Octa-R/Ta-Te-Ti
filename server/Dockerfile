# Etapa de construcción
FROM node:18.16.1-alpine AS builder

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

# # Etapa de producción
# FROM node:18.16.1-alpine

# WORKDIR /app

# # Copia solo los archivos necesarios de la etapa de construcción
# COPY --from=builder /app/dist ./dist

# Exponer el puerto si es necesario
EXPOSE 3000

# Comando de inicio de la aplicación
CMD ["node", "./dist/main"]


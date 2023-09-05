FROM node:18

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run migration:create

RUN npm run migration:up

RUN npm run build

EXPOSE 3000

CMD ["npm", "run", "start:prod"]

#BUILD
FROM node:18.16.1 as build

WORKDIR /app

COPY package*.json .

RUN npm ci

COPY . .

RUN npm run build

#NGINX SERVER
FROM nginx:alpine3.18

COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]

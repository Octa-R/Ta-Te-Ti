# tateti

como correr la app localmente

utilizando docker podemos correr las bases de datos necesarias

```bash
docker run \
--name pg-game-db \
-e POSTGRES_PASSWORD=password \
-e POSTGRES_USER=usduario \
-e POSTGRES_DB=game \
-d -p 5432:5432 postgres

docker run --name redis-game-db -p 6379:6379 redis:7.2
```

dentro de la carpeta server

`npm install`

`npm run start:dev`

dentro de la carpeta client

`npm install`

`npm run dev`

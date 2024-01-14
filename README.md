# Ta-Te-Ti

versión online para dos jugadores del juego tateti o tic-tac-toe

[deploy 🚀🚀🚀](https://ta-te-ti-six-pi.vercel.app/)

## Requisitos para correrlo localmente

- Docker
- Nodejs

## Correr app localmente

### Configurar bases de datos

iniciar contenedor postgres

```bash
docker run \
--name pg-game-db \
-e POSTGRES_PASSWORD=password \
-e POSTGRES_USER=usuario \
-e POSTGRES_DB=game \
-d -p 5432:5432 postgres
```

iniciar contenedor redis

```bash
docker run --name redis-game-db -p 6379:6379 redis:7.2
```

### configurar app

```bash
git clone https://github.com/Octa-R/Ta-Te-Ti.git
```

```bash
cd Ta-Te-Ti
```

```bash
cd server
```

configurar archivo .env

```bash
echo "DATABASE_PORT=5432
DATABASE_HOST=localhost
DATABASE_USERNAME=usuario
DATABASE_PASSWORD=password
DATABASE_NAME=game
REDIS_PORT=6379
REDIS_HOST=localhost
APP_PORT=3000" > .env.development
```

```bash
npm install
```

```bash
npm run start:dev
```

```bash
cd ..
```

```bash
cd client
```

crear archivo .env

```bash
echo "VITE_BASE_URL=http://localhost:3000/tateti/
VITE_SOCKET_IO_URL=http://localhost:3000/game/" > .env.development.local
```

```bash
npm install
```

```bash
npm run dev
```

## Usando docker-compose

```bash
cd Ta-Te-Ti
```

crear archivos .env necesarios

```bash
echo "POSTGRES_USER=usuario
POSTGRES_PASSWORD=password
POSTGRES_DB=game" > .env.pg
```

```bash
echo "DATABASE_PORT=5432
DATABASE_HOST=postgres
DATABASE_USERNAME=usuario
DATABASE_PASSWORD=password
DATABASE_NAME=game
REDIS_PORT=6379
REDIS_HOST=redis
APP_PORT=3000" > .env.server
```

```bash
echo "VITE_BASE_URL=http://localhost:3000/tateti/
VITE_SOCKET_IO_URL=http://localhost:3000/game/" > .env.client
```

```bash
docker-compose up -d
```

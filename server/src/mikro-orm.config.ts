import { Options } from '@mikro-orm/postgresql';
import { TsMorphMetadataProvider } from '@mikro-orm/reflection';

const config: Options = {
  entities: ['./dist/**/*.entity.js'],
  entitiesTs: ['./src/**/*.entity.ts'],
  type: 'postgresql',
  host: process.env.DATABASE_HOST,
  dbName: process.env['DATABASE_NAME'],
  port: +process.env['DATABASE_PORT'],
  user: process.env['DATABASE_USERNAME'],
  password: process.env['DATABASE_PASSWORD'],
  allowGlobalContext: true,
  metadataProvider: TsMorphMetadataProvider,
  debug: process.env['NODE_ENV'] === 'production' ? false : true,
  migrations: {
    path: 'dist/migrations',
    pathTs: 'src/migrations',
  },
};

export default config;
